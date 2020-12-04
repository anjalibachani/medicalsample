const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");
const validatetoken = require("./validatetoken");

router.get("/checkIDandEval", validatetoken, async (req, res) => {
  var query = await db.query(
    "SELECT distinct `sample_id` FROM `samples` WHERE `sample_id`=? AND `eval`=? AND type is NULL",
    [req.query.sample_id, req.query.eval],
    (error, results, fields) => {
      if (error) throw error;
      return res.status(200).json({ rows: results.length });
    }
  );
  console.log(query.sql);
});

router.get("/getSampleIDs", validatetoken, async (req, res) => {
  var query = await db.query(
    "SELECT distinct `sample_id` FROM `samples`",
    (error, results, fields) => {
      if (error) throw error;
      let options = [];
      for (let element of results) {
        options.push({ value: element.sample_id, label: element.sample_id });
      }
      return res.status(200).json({ options: options });
    }
  );
  console.log(query.sql);
});

router.get("/getSampleEvals/:sample_id", validatetoken, async (req, res) => {
  var query = await db.query(
    "SELECT distinct `eval` FROM `samples` WHERE `sample_id`=?",
    [req.params.sample_id],
    (error, results, fields) => {
      if (error) throw error;
      let options = [];
      for (let element of results) {
        options.push({ value: element.eval, label: element.eval });
      }
      return res.status(200).json({ options: options });
    }
  );
  console.log(query.sql);
});

router.get("/getSampleTypes/", validatetoken, async (req, res) => {
  var query = await db.query(
    "SELECT * FROM `samples` WHERE `sample_id`=? and `eval`=? AND type IS NOT NULL order by type",
    [req.query.sample_id, req.query.eval],
    (error, results, fields) => {
      if (error) throw error;
      return res.status(200).json({ results: results });
    }
  );
  console.log(query.sql);
});

router.post("/add", validatetoken, (req, res) => {
  let result = req.body;
  for (let index = 0; index < result.length; index++) {
    let element = result[index].data;
    // console.log("result[index].user_id", result[index].user_id);
    let select_stmt =
      "SELECT * FROM samples WHERE sample_id=? AND eval=? order by type";
    var select_query = db.query(
      select_stmt,
      [element.sample_id, element.eval],
      (error, select_results) => {
        if (error) throw error;
        element.pb = select_results[0].pb;
        element.hb = select_results[0].hb;
        element.density = select_results[0].density;
        element.date = new Date(element.date);
        const found = select_results.some((el) => el.type === element.type);
        if (found) {
          let update_stmt =
            "UPDATE samples SET ? where sample_id=? AND eval=? AND type=?";
          var update_query = db.query(
            update_stmt,
            [element, element.sample_id, element.eval, element.type],
            (error, results, fields) => {
              if (error) {
                throw error;
              }
              var transaction_history = {
                user_id: result[index].user_id,
                timestamp: new Date(),
                desciption:
                  " updated samples having ID " +
                  element.sample_id +
                  " eval " +
                  element.eval +
                  " type " +
                  element.type,
              };
              var query = db.query(
                "INSERT INTO `transaction_history` SET ?",
                transaction_history,
                (err, res) => {
                  if (err) throw err;
                  console.log(res.insertId);
                }
              );
              console.log("Row updated :", results.changedRows);
            }
          );
        } else {
          let insert_stmt = "INSERT INTO samples SET ?";
          var insert_query = db.query(
            insert_stmt,
            element,
            (error, results, fields) => {
              if (error) {
                throw error;
              }
              var transaction_history = {
                user_id: result[index].user_id,
                timestamp: new Date(),
                desciption:
                  " created samples having ID " +
                  element.sample_id +
                  " eval " +
                  element.eval +
                  " type " +
                  element.type,
              };
              var query = db.query(
                "INSERT INTO `transaction_history` SET ?",
                transaction_history,
                (err, res) => {
                  if (err) throw err;
                  console.log(res.insertId);
                }
              );
              var maxItr =
                element.aliquots === undefined ? 1 : element.aliquots;
              var aliquot = {
                sample_id: element.sample_id,
                aliquots_samples_key: results.insertId,
                location_id: 4,
                status_id: 1,
              };
              for (let i = 0; i < maxItr; i++) {
                db.query(
                  "INSERT INTO `aliquots` SET ?",
                  aliquot,
                  (error, aliquot_insert_results, fields) => {
                    var transaction_history = {
                      user_id: result[index].user_id,
                      timestamp: new Date(),
                      desciption:
                        " created aliquots at location id " +
                        aliquot.location_id +
                        " with aliquots_samples_key " +
                        aliquot.aliquots_samples_key,
                    };
                    if (error) throw error;
                    var query = db.query(
                      "INSERT INTO `transaction_history` SET ?",
                      transaction_history,
                      (err, res) => {
                        if (err) throw err;
                        console.log(res.insertId);
                      }
                    );
                    console.log("Inserted: ", aliquot_insert_results.insertId);
                  }
                );
              }
            }
          );
        }
      }
    );
    console.log(select_query.sql);
  }
});

module.exports = router;
