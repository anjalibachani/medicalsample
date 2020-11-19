const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");


router.get("/checkIDandEval", async (req, res) => {
  var query = await db.query(
    "SELECT distinct `sample_id` FROM `samples` WHERE `sample_id`=? AND `eval`=? AND type is NULL",
    [req.query.sample_id, req.query.eval],
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results.length);
      return res.status(200).json({ rows: results.length });
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
      // console.log(options);
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
      // console.log(results);
      let options = [];
      for (let element of results) {
        options.push({ value: element.eval, label: element.eval });
      }
      // console.log(options);
      return res.status(200).json({ options: options });
    }
  );
  console.log(query.sql);
});


router.post("/add", (req, res) => {
  let result = req.body;
  // let updateQueryObj = result[0].data;
  // console.log("updateQueryObj", updateQueryObj);
  // let whereObj = {}
  // whereObj.sample_id = updateQueryObj.sample_id;
  // whereObj.eval = updateQueryObj.eval;
  // updateQueryObj.date = new Date(updateQueryObj.date);
  // delete updateQueryObj.sample_id;
  // delete updateQueryObj.eval;
  // console.log("updateQueryObj", updateQueryObj);
  // var update_stmt = "UPDATE samples set ? WHERE `sample_id` = ? AND `eval` = ?";
  // console.log(update_stmt);
  // var query = db.query(update_stmt, [updateQueryObj, whereObj.sample_id,whereObj.eval], (error, results, fields) => {
  //   if (error) throw error;
  //   console.log(results.changedRows);
  // });


  for (let index = 0; index < result.length; index++) {
    let element = result[index].data;
    let select_stmt = "SELECT * FROM samples WHERE sample_id=? AND eval=? AND type is null";
    var select_query = db.query(select_stmt,[element.sample_id, element.eval],(error, select_results) => {
        if (error) throw error;
        // element.sample_id = select_results[0].sample_id;
        // element.eval = select_results[0].sample_id;
      // console.log(select_results.length);
        element.pb = select_results[0].pb;
        element.hb = select_results[0].hb;
        element.density = select_results[0].density;
        element.date = new Date(element.date);
        let insert_stmt = "INSERT INTO samples SET ?";
        var insert_query =  db.query(insert_stmt,element,(error, results, fields) => {
          if (error) {
            throw error;
          }
              console.log(results.insertId);
            }
        );
      console.log(insert_query.sql);
      }
    );
    console.log(select_query.sql);
   if (element.aliquots) {
      console.log("aliquot field exists : ", element.aliquots);
      var aliquot = {
        sample_id: element.sample_id,
        location_id: 4,
        status_id: 1,
      };
      for (let index = 0; index < element.aliquots; index++) {
        var insert_query =  db.query("INSERT INTO `aliquots` SET ?", aliquot,(error, insert_results, fields) => {
            if (error) throw error;
            console.log(insert_results.insertId);
          }
        );
        console.log(insert_query.sql);
      }
   }
  }
});

module.exports = router;

