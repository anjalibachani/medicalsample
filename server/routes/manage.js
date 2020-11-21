const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get("/viewuser", async (req, res) => {
      await db.query("SELECT * FROM `users`",(error, results, fields) => {
          if (error) throw error;
        //   console.log(results);
          return res.status(200).json({ results: results });
        }
      );
});
router.post("/adduser", async (req, res) => {
  console.log(req.body);
        await db.query("INSERT INTO `users` SET ?", req.body, (error, results, fields) => {
        if (error) throw error;
        return res.status(200).json({ results: results });
      });
});
router.delete("/deleteuser",  (req, res) => {
  let rowsData =  req.body;
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
router.get("/addlocation", async (req, res) => {
  res.json("addlocation");
});
router.delete("/deletelocation", async (req, res) => {
  res.json("deletelocation");
});
router.get("/viewlogs", async (req, res) => {
        await db.query("SELECT * FROM `transaction_history`", (error, results, fields) => {
        if (error) throw error;
        return res.status(200).json({ results: results });
      });
});


deleteLocationIDAliquots = (userIds) => {
  let deleteQuery = "delete FROM aliquots a where a.location_id in (select l.location_id from locations l where l.user_id in (?))"
  db.query(deleteQuery, [userIds], (error,results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
}

deleteLocationIDLocation = (userIds) => {
  let deleteQuery = "delete from locations l where l.user_id in (?)";
  db.query(deleteQuery, [userIds], (error, results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
}

deleteUserIDUser = (userIds) => {
  let deleteQuery = "delete from user u where u.user_id in (?) ";
  db.query(deleteQuery, [userIds], (error, results) => {
    if (error) throw error;
    console.log(" deleted :", results.affectedRows);
  });
}

module.exports = router;
