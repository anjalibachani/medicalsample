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
  // console.log(req.params.sample_id);
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

router.get("/getSampleTypes/", async (req, res) => {
  // console.log(req.query.sample_id);
  // console.log(req.query.eval);
  var query = await db.query("SELECT * FROM `samples` WHERE `sample_id`=? and `eval`=? AND type IS NOT NULL order by type",
    [req.query.sample_id, req.query.eval],
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results);
      // console.log(options);
      return res.status(200).json({ results: results });
    }
  );
  console.log(query.sql);
});

router.post("/add", (req, res) => {
  let result = req.body;
  let j = 0;
  for (let index = 0; index < result.length; index++) {
    let element = result[index].data;
    // console.log("element:", element);
    let select_stmt = "SELECT * FROM samples WHERE sample_id=? AND eval=? order by type";
    var select_query = db.query(select_stmt, [element.sample_id, element.eval], (error, select_results) => {
      if (error) throw error;
      element.pb = select_results[0].pb;
      element.hb = select_results[0].hb;
      element.density = select_results[0].density;
      element.date = new Date(element.date);
      const found = select_results.some((el) => el.type === element.type);
      console.log("found: ", found);
      if (found) {
        // update query
        // console.log("existing element", element);
        let update_stmt = "UPDATE samples SET ? where sample_id=? AND eval=? AND type=?";
        var update_query = db.query(update_stmt, [element, element.sample_id, element.eval, element.type], (error, results, fields) => {
          if (error) {
            throw error;
          }
          console.log("Row updated :", results.changedRows);
        }
        );
        // let ali_stmt ="select * from aliquots where aliquots_samples_key =?"
        // db.query(ali_stmt, [element.samples_key], (error, res) => {
        //    if (error) {
        //      throw error;
        //   }
        //   const aliquots_found = res.some((el) => el.aliquots_samples_key === element.samples_key);
        //   if (aliquots_found) {
        //     //update query
        //   } else {
        //     //insert query
        //   }
        // });
 
      }
      else {
        // insert query
        // console.log("new element", element);
        let insert_stmt = "INSERT INTO samples SET ?";
        var insert_query = db.query(
          insert_stmt,
          element,
          (error, results, fields) => {
            if (error) {
              throw error;
            }
            console.log("Row inserted :", results.insertId);
          }
        );
        var maxItr = element.aliquots === undefined ? 1 : element.aliquots;
        console.log("aliquot field exists : ", maxItr);
        var aliquot = {
          sample_id: element.sample_id,
          location_id: 4,
          status_id: 1,
        };
        for (let i = 0; i < maxItr; i++) {
          db.query("INSERT INTO `aliquots` SET ?", aliquot, (error, aliquot_insert_results, fields) => {
            if (error) throw error;
            console.log("Inserted: ",aliquot_insert_results.insertId);
          }
        );
      }
        //       console.log(aliquot_insert_query.sql);
        // console.log(insert_query.sql);
      }

      // console.log("select_results[j]: ", select_results[j], typeof select_results[j]);
      // if ( j<select_results.length && select_results[j].type !== element.type) {
      //   console.log("new element", element);
      //   let insert_stmt = "INSERT INTO samples SET ?";
      //   var insert_query = db.query(insert_stmt, element, (error, results, fields) => {
      //     if (error) {
      //       throw error;
      //     }
      //     console.log("Row inserted :", results.insertId);
      //   }
      //   );
      //   console.log(insert_query.sql);
      //   var maxItr = element.aliquots === undefined ? 1 : element.aliquots;
      //     console.log("aliquot field exists : ", maxItr);
      //     var aliquot = {
      //       sample_id: element.sample_id,
      //       location_id: 4,
      //       status_id: 1,
      //     };
      //     for (let i = 0; i < maxItr; i++) {
      //       var aliquot_insert_query = db.query("INSERT INTO `aliquots` SET ?", aliquot, (error, aliquot_insert_results, fields) => {
      //         if (error) throw error;
      //         console.log(aliquot_insert_results.insertId);
      //       }
      //       );
      //       console.log(aliquot_insert_query.sql);
      //     }
      // } else {
      //   console.log("existing element", element);
      //   let update_stmt = "UPDATE samples SET ? where sample_id=? AND eval=? AND type=?";
      //   var update_query = db.query(update_stmt, [element, element.sample_id, element.eval, element.type], (error, results, fields) => {
      //     if (error) {
      //       throw error;
      //     }
      //     console.log("Row updated :", results.changedRows);
      //   }
      //   );
      //   console.log(update_query.sql);
        // var maxItr = element.aliquots === undefined ? 1 : element.aliquots;
        // console.log("aliquot field exists : ", maxItr);
        // var aliquot = { sample_id: element.sample_id, location_id: 4, status_id: 1, };
        // for (let i = 0; i < maxItr; i++) {
        //   var aliquot_insert_query = db.query("INSERT INTO `aliquots` SET ?", aliquot, (error, aliquot_insert_results, fields) => {
        //     if (error) throw error;
        //       console.log("inserted aliquots",aliquot_insert_results.insertId);
        //     }
        //   );
        //   console.log(aliquot_insert_query.sql);
        // }
      // }
    }
    );
    console.log(select_query.sql);
    j++;
  }
});

module.exports = router;

