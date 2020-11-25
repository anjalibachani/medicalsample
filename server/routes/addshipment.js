const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get('/select', async function (request, response) {
    try {
        let query3Result = await dbQueryFunc3()

        response.send(query3Result)
    } catch (err) {
        console.error(err)
    }


});

router.get("/fetchlocation", async (req, res) => {
    var query = await db.query(
        "SELECT distinct `location_name` FROM `locations`",
        (error, results, fields) => {
            if (error) throw error;
            let options = [];
            for (let element of results) {
                options.push({ value: element.location_name, label: element.location_name });
            }
            console.log(options);
            return res.status(200).json({ options: options });
        }
    );
    console.log(query.sql);
});


router.post("/create", async (req, res) => {
  console.log(req.body);
  req.body.shipment_date = new Date(req.body.shipment_date);
    var query = await db.query("INSERT INTO `shipments` SET ?", req.body, (error,results,fields)=>{
      if (error) throw error;
      console.log(results.insertId);
      return res.status(202).json({ results });
    });
    console.log(query.sql);
});

router.post("/addshipmentId", async (req, res) => {
  console.log(req.body);
  var query = await db.query("UPDATE `aliquots` SET `shipment_id` = ?,`status_id` = 2 where aliquots_samples_key IN (?)",[req.body.shipment_id,req.body.aliquots_samples_key],(error, results, fields) => {
      if (error) throw error;
      console.log(results.affectedRows);
    }
  );
  console.log(query.sql);
});




router.get("/locationIdbyName", async (req, res) => {
    console.log(req.query.location);
  var query = await db.query("SELECT `location_id` FROM `locations` where `location_name`= ?",[req.query.location],
    (error, results, fields) => {
        if (error) throw error;
        console.log(results);
      return res.status(200).json({ results: results[0].location_id });
    }
  );
  console.log(query.sql);
});

router.get("/aliquots/:sample_id", async (req, res) => {
    // console.log(req.params.sample_id);
    var query = await db.query(
      "SELECT distinct `aliquot_id` FROM `aliquots` WHERE `sample_id`=?",
      [req.params.sample_id],
      (error, results, fields) => {
        if (error) throw error;
        // console.log(results);
        let options = [];
        for (let element of results) {
          options.push({ value: element.aliquot_id, label: element.aliquot_id });
        }
        // console.log(options);
        return res.status(200).json({ options: options });
      }
    );
    console.log(query.sql);
  });

function dbQueryFunc3() {
    return new Promise(function (resolve, reject) {
        let query1 = db.query(
          `SELECT S.*, L.location_name,L.location_id, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' GROUP BY S.sample_id, S.eval,S.type,L.location_name;`,
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        );
        console.log(query1.sql);
    })
}


module.exports = router;

