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

router.post("/locationIdbyName", async (req, res) => {
    console.log(req.body);
    var obj = {};
  var query = await db.query("SELECT `location_id` FROM `locations` where `location_name` IN (?) ",[req.body],
    (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        if (results.length === 1) {
           obj["from_location_id"] = results[0].location_id;
        //    delete results[0].location_id;
           obj["to_location_id"] = results[0].location_id;
       } else {
            obj["from_location_id"] = results[0].location_id;
            //    delete results[0].location_id;
            obj["to_location_id"] = results[1].location_id; 
       }

      return res.status(200).json({ results: obj });
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

// function dbQueryFunc2() {
//     return new Promise(function (resolve, reject) {
//         let query2 = db.query('select distinct location_name from locations', (error, result) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(result)
//         });
//         console.log(query2.sql);
//     })
// }

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

