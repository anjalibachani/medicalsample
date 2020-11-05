const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get("/viewshipments", (req, res) => {
    
    var query = db.query("SELECT * FROM `shipments` ", (error,results,fields)=>{
      if (error) throw error;
      console.log(results);
      return res.status(200).json(results);
    });
    console.log(query.sql);

});
module.exports = router;

