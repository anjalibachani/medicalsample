const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get("/viewshipments", (req, res) => {
    
    var query = db.query(
      "select s.*,u.email_id,us.status_name, (select location_name from locations where location_id = s.from_location_id) as from_location_name, (select location_name from locations where location_id = s.to_location_id) as to_location_name, u.email_id,us.status_name from shipments s join medsample_db.users as u on s.user_id= u.user_id join statuses as us on s.reached=us.status_id",
      (error, results, fields) => {
        if (error) throw error;
        // console.log(results);
         let tempData = results;
         tempData.map((item, index) => {
           item.shipment_date = new Date(item.shipment_date).toISOString().substring(0, 10);
         });
        return res.status(200).json(tempData);
      }
    );
    // console.log(query.sql);

});
router.post("/markshipments", (req, res) => {
  // console.log("DB", db);
  // console.log("REQUEST: ", req.body.rows);
  let rowsData = req.body.rows;
  for (let index = 0; index < rowsData.length; index++) {
    let item = rowsData[index];
    // console.log("item",rowsData[index]);
    let update_stmt = `UPDATE shipments SET reached = 1 WHERE shipment_id = ?`;
    let update_query = db.query(update_stmt,[item[0]],(error, results, fields) => {
      if (error) throw error;
      console.log("shipments Row updated :", results.changedRows);
    });
    // console.log(update_query.sql);
    let aliquot_update_query = db.query("UPDATE aliquots SET location_id = ?,`status_id` = 1 WHERE shipment_id = ?",[item[1],item[0]], (err, res) => {
      if (err) throw err;
      console.log("aliquotsRow updated :", res.changedRows);
    });
    // console.log(aliquot_update_query.sql);
  }


});

module.exports = router;

