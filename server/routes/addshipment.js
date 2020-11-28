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
  let aliArray = req.body.tempArray;
  let countArray = req.body.countArray;
  let shipment = {};
   for (const [key, value] of Object.entries(req.body)) {
     if (key !== "tempArray" && key !== "countArray") {
       shipment[key] = value;
       if (key === "shipment_date") {
         shipment[key] = new Date(value);
       }
     }
   }
    await db.query("INSERT INTO `shipments` SET ?", shipment, (error,results)=>{
      if (error) throw error;
      console.log(results.insertId);
      // aliArray.forEach((element, index) => {
      //  var delete_query = db.query(
      //     "delete from medsample_db.aliquots where sample_id=? and location_id=? and aliquots_samples_key=? limit ?;",
      //     [element[0], element[1], element[2], countArray[index][0]],
      //     (err, delete_results) => {
      //       if (err) throw err;
      //       console.log(delete_results.affectedRows);
      //     }
      //   );
      //   console.log(delete_query.sql);
      // });
      
      return res.status(202).json({ results });
    });
    // return res.status(202).json({ results });
});

router.post("/addshipmentId",  (req, res) => {
  console.log(req.body);
  let aliquots_samples_key = req.body.aliquots_samples_key;
  let countArray = req.body.countArray;
  console.log("aliquots_samples_key", aliquots_samples_key);
  console.log("countArray",countArray);
  aliquots_samples_key.forEach( (element,index) => {
     var query =  db.query("UPDATE `aliquots` SET `shipment_id` = ?,`status_id` = 2 where aliquots_samples_key=? limit ?",[req.body.shipment_id,element,countArray[index]],(error, results, fields) => {
      if (error) throw error;
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
        // console.log(query1.sql);
    })
}


module.exports = router;

