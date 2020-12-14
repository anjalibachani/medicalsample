const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");
const validatetoken = require("./validatetoken");

router.get("/viewshipments", validatetoken, (req, res) => {
  var query = db.query(
    "select s.*,u.email_id,us.status_name, (select location_name from locations where location_id = s.from_location_id) as from_location_name, (select location_name from locations where location_id = s.to_location_id) as to_location_name, u.email_id,us.status_name from shipments s join medsample_db.users as u on s.user_id= u.user_id join statuses as us on s.reached=us.status_id",
    (error, results, fields) => {
      if (error) throw error;
      let tempData = results;
      tempData.map((item, index) => {
        item.shipment_date = new Date(item.shipment_date)
          .toISOString()
          .substring(0, 10);
      });
      return res.status(200).json(tempData);
    }
  );
});

router.get("/shipmentdetails", validatetoken, (req, res) => {
  // console.log(req.query);
  var query = db.query(
    "select S.* ,A.*,COUNT(*) as aliquot_count from samples S join aliquots A on S.samples_key=A.aliquots_samples_key where A.shipment_id=? group by A.aliquots_samples_key,A.shipment_id;",
    [req.query.shipment_id],
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results);
      return res.status(200).json(results);
    }
  );
});

router.post("/markshipments", validatetoken, (req, res) => {
  let rowsData = req.body.rows;
  for (let index = 0; index < rowsData.length; index++) {
    let item = rowsData[index];
    // console.log("item", item);
    let update_stmt = `UPDATE shipments SET reached = 1 WHERE shipment_id = ?`;
    let update_query = db.query(
      update_stmt,
      [item[0]],
      (error, results, fields) => {
        if (error) throw error;
        var transaction_history = {
          user_id: item[2],
          timestamp: new Date(),
          desciption: "Shipment received at location " + item[3],
        };
        db.query(
          "INSERT INTO `transaction_history` SET ?",
          transaction_history,
          (err, res) => {
            if (err) throw err;
            // console.log(res.insertId);
          }
        );
      }
    );
    let aliquot_update_query = db.query(
      "UPDATE aliquots SET location_id = ?,`status_id` = 1 WHERE shipment_id = ?",
      [item[1], item[0]],
      (err, res) => {
        if (err) throw err;
        var transaction_history = {
          user_id: item[2],
          timestamp: new Date(),
          desciption:
            "location and status updated for aliquots having shipment_id " +
            item[0],
        };
        db.query(
          "INSERT INTO `transaction_history` SET ?",
          transaction_history,
          (er, out) => {
            if (er) throw er;
            // console.log(out.insertId);
          }
        );
      }
    );
  }
});

module.exports = router;
