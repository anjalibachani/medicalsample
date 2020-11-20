const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get("/viewshipments", (req, res) => {
    
    var query = db.query(
      "SELECT S.*,L.*,u.email_id,us.status_name FROM medsample_db.shipments as S JOIN medsample_db.locations as L ON S.from_location_id = L.location_id join medsample_db.users as u on S.user_id= u.user_id join statuses as us on S.reached=us.status_id",
      (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        return res.status(200).json(results);
      }
    );
    console.log(query.sql);

});
router.post("/markshipments", (req, res) => {
  // console.log("DB", db);
  console.log("REQUEST: ", req.body.rows);
  let rowsData = req.body.rows;
  for (let index = 0; index < rowsData.length; index++) {
    let item = rowsData[index];
    console.log("item",rowsData[index]);
    let update_stmt = `UPDATE shipments SET reached = 1 WHERE shipment_id = ?`;
    let update_query = db.query(update_stmt,[item[0]],(error, results, fields) => {
      if (error) throw error;
      console.log("shipments Row updated :", results.changedRows);
    });
    console.log(update_query.sql);
    let aliquot_update_query = db.query("UPDATE aliquots SET location_id = ? WHERE shipment_id = ?",[item[1],item[0]], (err, res) => {
      if (err) throw err;
      console.log("aliquotsRow updated :", res.changedRows);
    });
    console.log(aliquot_update_query.sql);
  }
  

});

module.exports = router;

