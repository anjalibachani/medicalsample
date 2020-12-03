const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.post("/add", async (req, res) => {
  console.log(req.body);
  var transaction_history = {
    user_id: req.body.user_id,
    timestamp: new Date(),
    desciption: "child added by user having user_id " + req.body.user_id,
  };
  console.log(transaction_history);
  req.body.date = new Date(req.body.date);
  var query = await db.query(
    "INSERT INTO `samples` SET ?",
    req.body,
    (error, results, fields) => {
      if (error) throw error;
      console.log(results.insertId);
      return res.status(202).json({ results });
    }
  );
  console.log(query.sql);

  var query = db.query(
    "INSERT INTO `transaction_history` SET ?",
    transaction_history,
    (error, results, fields) => {
      if (error) throw error;
      console.log(results.insertId);
      // return res.status(202).json({ results });
    }
  );
  console.log(query.sql);
});

router.get("/all", async (req, res) => {
  await db.query(
    "SELECT * FROM medsample_db.samples GROUP BY sample_id,eval;",
    (error, results, fields) => {
      if (error) throw error;
      //   console.log(results);
      return res.status(200).json({ results: results });
    }
  );
});

module.exports = router;
