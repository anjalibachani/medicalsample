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

router.get('/fetchlocation', async function (request, response) {
    try {
        let query2Result = await dbQueryFunc2()

        response.send(query2Result)
    } catch (err) {
        console.error(err)
    }


});

// function dbQueryFunc1(sample_id) {
//     return new Promise(function (resolve, reject) {
//         let query1 = db.query('SELECT aliquot_id FROM aliquots where sample_id=?', sample_id, (error, result) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(result)
//         });
//         console.log(query1.sql);
//     })
// }

function dbQueryFunc2() {
    return new Promise(function (resolve, reject) {
        let query2 = db.query('select distinct location_name from locations', (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        });
        console.log(query2.sql);
    })
}

function dbQueryFunc3() {
    return new Promise(function (resolve, reject) {
        let query1 = db.query('select s.sample_id,s.eval,s.type,s.aliquots,s.date from samples s join aliquots a on s.sample_id=a.sample_id', (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        });
        console.log(query1.sql);
    })
}
module.exports = router;

