const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");


router.get("/checkIDandEval", async (req, res) => {
  var query = await db.query(
    "SELECT `sample_id` FROM `samples` WHERE `sample_id`=? AND `eval`=?",[req.query.sample_id, req.query.eval],
    (error, results, fields) => {
      if (error) throw error;
      console.log(results.length);
      return res.status(200).json({ rows:results.length });
    }
  );
  console.log(query.sql);
});

router.get("/getSampleIDs", async (req, res) => {
  var query = await db.query(
    "SELECT distinct `sample_id` FROM `samples`",
    (error, results, fields) => {
      if (error) throw error;
      let options = [];
      for (let element of results) {
        options.push({ value: element.sample_id, label: element.sample_id });
      }
      console.log(options);
      return res.status(200).json({ options: options });
    }
  );
  console.log(query.sql);
});

router.get("/getSampleEvals/:sample_id", async (req, res) => {
  console.log(req.params.sample_id);
  var query = await db.query(
    "SELECT distinct `eval` FROM `samples` WHERE `sample_id`=?",
    [req.params.sample_id],
    (error, results, fields) => {
      if (error) throw error;
      console.log(results);
      let options = [];
      for (let element of results) {
        options.push({ value: element.eval, label: element.eval });
      }
      console.log(options);
      return res.status(200).json({ options: options });
    }
  );
  console.log(query.sql);
});


router.post("/add", (req, res) => {
    var sample = {
      sample_id: 456,
      eval: 1,
      aliquots: 4,
      initial_storage_conditions: "test",
      other_treatments: "test",
      foil_wrapped: 1,
      unrestricted_consent: 1,
      notes: "test",
      sub_study: 1,
      sub_study_name: "dolorem",
      date: "2001-08-18",
      user_id: 1110,
      hb: null,
      pb: null,
      density: 0.2942,
      type: "illo",
      bht: 1,
      edta: 1,
      heparin: 0,
      mpa: 1,
      fasted: null
    };
    var query = db.query("INSERT INTO `samples` SET ?", sample, (error,results,fields)=>{
      if (error) throw error;
      console.log(results.insertId);
    });
    console.log(query.sql);
    var aliquot = {
      sample_id: sample.sample_id,
      location_id: 4,
      status_id: 1,
      freezer_id: 1,
    };
    for (let index = 0; index < sample.aliquots; index++) {
      var query = db.query("INSERT INTO `aliquots` SET ?", aliquot, (error,results,fields)=>{
      if (error) throw error;
      console.log(results.insertId);
    });
    console.log(query.sql);
    }
    });

module.exports = router;

