const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get("/viewuser", async (req, res) => {
  await db.query("SELECT * FROM `users`", (error, results, fields) => {
    if (error) throw error;
    //   console.log(results);
    return res.status(200).json({ results: results });
  });
});
router.post("/adduser", async (req, res) => {
  let user = req.body;
  console.log("user", user);
  var transaction_history = {
    user_id: user.user_id,
    timestamp: new Date(),
    desciption: "user added sucessfully having email " + user.email_id,
  };
  delete user.user_id;
  await db.query("INSERT INTO `users` SET ?", user, (error, results) => {
    if (error) throw error;
    var query = db.query(
      "INSERT INTO `transaction_history` SET ?",
      transaction_history,
      (err, res) => {
        if (err) throw err;
        console.log(res.insertId);
      }
    );
    return res.status(200).json({ results: results });
  });
});
router.get("/checkemail", async (req, res) => {
  var query = await db.query(
    "SELECT distinct `email_id` FROM `users` WHERE `email_id`=?",
    [req.query.email_id],
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results.length);
      return res.status(200).json({ rows: results.length });
    }
  );
  console.log(query.sql);
});

router.delete("/deleteuser", (req, res) => {
  let rowsData = req.body;
  console.log("rowsData:", rowsData);
  // deleteLocationIDAliquots(rowsData);
  // deleteLocationIDLocation(rowsData);
  // deleteUserIDUser(rowsData);
  res.json("deleteuser");
});

router.get("/viewlocation", async (req, res) => {
  await db.query("SELECT * FROM `locations`", (error, results, fields) => {
    if (error) throw error;
    return res.status(200).json({ results: results });
  });
});
router.post("/addlocation", async (req, res) => {
  console.log(req.body);
  let location = req.body;
  var transaction_history = {
    user_id: location.user_id,
    timestamp: new Date(),
    desciption: location.location_name + " location added sucessfully",
  };
  await db.query(
    "INSERT INTO `locations` SET ?",
    location,
    (error, results, fields) => {
      if (error) throw error;
      var query = db.query(
        "INSERT INTO `transaction_history` SET ?",
        transaction_history,
        (err, res) => {
          if (err) throw err;
          console.log(res.insertId);
        }
      );
      return res.status(200).json({ results: results });
    }
  );
});
router.get("/checklocation", async (req, res) => {
  var query = await db.query(
    "SELECT distinct `location_name` FROM `locations` WHERE `location_name`=?",
    [req.query.location_name],
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results.length);
      return res.status(200).json({ rows: results.length });
    }
  );
  console.log(query.sql);
});
router.delete("/deletelocation", async (req, res) => {
  res.json("deletelocation");
});
router.get("/viewlogs", async (req, res) => {
  await db.query(
    "SELECT * FROM medsample_db.transaction_history t inner join users u where t.user_id=u.user_id;",
    (error, results, fields) => {
      if (error) throw error;
      return res.status(200).json({ results: results });
    }
  );
});

deleteLocationIDAliquots = (userIds) => {
  let deleteQuery =
    "delete FROM aliquots a where a.location_id in (select l.location_id from locations l where l.user_id in (?))";
  db.query(deleteQuery, [userIds], (error, results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
};

deleteLocationIDLocation = (userIds) => {
  let deleteQuery = "delete from locations l where l.user_id in (?)";
  db.query(deleteQuery, [userIds], (error, results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
};

deleteUserIDUser = (userIds) => {
  let deleteQuery = "delete from user u where u.user_id in (?) ";
  db.query(deleteQuery, [userIds], (error, results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
};

module.exports = router;
