const { response, json } = require("express");
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
      "SELECT distinct `location_name` FROM `locations` order by location_name",
      (error, results, fields) => {
        if (error) throw error;
        let options = [];
        for (let element of results) {
          options.push({
            value: element.location_name,
            label: element.location_name,
          });
        }
        // console.log(options);
        return res.status(200).json({ options: options });
      }
    );
    console.log(query.sql);
});


router.post("/create", async (req, res) => {
  console.log(req.body);
  let aliArray = req.body.tempArray;
  let countArray = req.body.countArray;
  let locationNames = req.body.locationNames;
  let shipment = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (key !== "tempArray" && key !== "countArray" && key!=="locationNames") {
      shipment[key] = value;
      if (key === "shipment_date") {
        shipment[key] = new Date(value);
      }
    }
  }
  var transaction_history = {
    user_id: shipment.user_id,
    timestamp: new Date(),
    desciption: " shipment created sucessfully from " + locationNames.from_location_name+ " to "+ locationNames.to_location_name,
  };
  console.log("shipment", shipment);
  console.log("locationNames", locationNames);
  await db.query(
    "INSERT INTO `shipments` SET ?",shipment,(error, results) => {
      if (error) throw error;
      var query = db.query("INSERT INTO `transaction_history` SET ?", transaction_history, (err, res) => {
        if (err) throw err;
        console.log(res.insertId);
      });
      return res.status(202).json({ results });
    }
  );
});

router.post("/addshipmentId",  (req, res) => {
  console.log(req.body);
  let aliquots_samples_key = req.body.aliquots_samples_key;
  let countArray = req.body.countArray;
  let user_id = req.body.user_id;
  aliquots_samples_key.forEach((element, index) => {
    var transaction_history = {
      user_id: user_id,
      timestamp: new Date(),
      desciption:" shipment id and status updated for aliquot having aliquots_samples_key " + element,
    };
     var query =  db.query("UPDATE `aliquots` SET `shipment_id` = ?,`status_id` = 2 where aliquots_samples_key=? limit ?",[req.body.shipment_id,element,countArray[index]],(error, results, fields) => {
       if (error) throw error;
      var query = db.query("INSERT INTO `transaction_history` SET ?", transaction_history, (err, res) => {
        if (err) throw err;
        console.log(res.insertId);
      });
      console.log(results.affectedRows);
    }
  );
  console.log(query.sql);
  });
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

router.get("/filterOpts/", async (req, res) => {
  if (req.query.fromLocation===undefined) {
      var query = await db.query("select S.sample_id, S.eval, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' AND A.status_id!=2 GROUP BY S.sample_id, S.eval,S.type,L.location_name;", (error, results, fields) => {
        if (error) throw error;
        console.log(results)
    return res.status(200).json(results);
  });
  } else {
    let fromLocation = JSON.parse(req.query.fromLocation);
    var query = await db.query(`select S.sample_id, S.eval, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' AND A.status_id!=2 AND L.location_name = ? GROUP BY S.sample_id, S.eval,S.type,L.location_name`, [fromLocation.value], (error, results, fields) => {
      if (error) throw error;
      console.log(results);
    return res.status(200).json(results);
  });
  }
  console.log(query.sql);
});

router.get("/aliquots/:sample_id", async (req, res) => {
    var query = await db.query(
      "SELECT distinct `aliquot_id` FROM `aliquots` WHERE `sample_id`=?",
      [req.params.sample_id],
      (error, results, fields) => {
        if (error) throw error;
        let options = [];
        for (let element of results) {
          options.push({ value: element.aliquot_id, label: element.aliquot_id });
        }
        return res.status(200).json({ options: options });
      }
    );
    console.log(query.sql);
  });

function dbQueryFunc3() {
    return new Promise(function (resolve, reject) {
        let query1 = db.query(
          `SELECT S.*, L.location_name,L.location_id, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' AND A.status_id!=2 GROUP BY S.sample_id, S.eval,S.type,L.location_name;`,
          (error, result) => {
            if (error) {
              reject(error);
            }
             let tempData = result;
             tempData.map((item, index) => {
               item.date = new Date(item.date).toISOString().substring(0, 10);
             });
            resolve(tempData);
          }
        );
    })
}


module.exports = router;

