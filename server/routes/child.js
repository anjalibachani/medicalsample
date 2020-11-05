const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.post("/add", async (req, res) => {
    var child = {
      sample_id: 11331,
      eval: 1,
      date: "2001-08-18",
      pb: 11,
      hb: 22,
      density: 0.2942,
      user_id: 1110
  };
  console.log(req.body.date);
  console.log(new Date(req.body.date));
  req.body.date = new Date(req.body.date);
    var query = await db.query("INSERT INTO `samples` SET ?", req.body, (error,results,fields)=>{
      if (error) throw error;
      console.log(results.insertId);
      return res.status(202).json({ results });
    });
  
    console.log(query.sql);
    // var aliquot = {
    //   sample_id: sample.sample_id,
    //   location_id: 4,
    //   status_id: 1,
    //   freezer_id: 1,
    // };
    // for (let index = 0; index < sample.aliquots; index++) {
    //   var query = db.query("INSERT INTO `aliquots` SET ?", aliquot, (error,results,fields)=>{
    //   if (error) throw error;
    //   console.log(results.insertId);
    // });
    // console.log(query.sql);
    // }
    });

module.exports = router;

