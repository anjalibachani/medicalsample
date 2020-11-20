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
router.get("/adduser", async (req, res) => {
    res.json("adduser");
});
router.get("/deleteuser", async (req, res) => { 
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
router.get("/deletelocation", async (req, res) => {
  res.json("deletelocation");
});
router.get("/viewlogs", async (req, res) => {
        await db.query("SELECT * FROM `transaction_history`", (error, results, fields) => {
        if (error) throw error;
        return res.status(200).json({ results: results });
      });
});

module.exports = router;
