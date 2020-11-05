const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db/dbconnect");

router.get('/select', async function (request, response) {
    try {



        // let query = db.query('SELECT * FROM aliquots', (error, result) => {
        //     if (error) throw error;

        //     response.send(result);
        // });

        //let sample_id = 613
        // let query1 = db.query('SELECT aliquot_id FROM aliquots where sample_id=?', sample_id, (error, result) => {
        //     if (error) throw error;

        //     response.send(result);
        // });
        // console.log(query1.sql);
        //let query1Result = await dbQueryFunc1(sample_id)


        //let aliquots = 5
        // let query2 = db.query('SELECT sample_id,eval,Type,aliquots FROM samples where aliquots=?', aliquots, (error, result) => {
        //     if (error) throw error;

        //     response.send(result);
        // });
       // let query2Result = await dbQueryFunc2(aliquots)

        // console.log(query2.sql);

        // let query3 = db.query('select s.sample_id,s.eval,s.type,s.aliquots,s.date,a.aliquot_id from samples s join aliquots a on s.sample_id=a.sample_id', (error, result) => {
        //     if (error) throw error;

        //     response.send(result);
        // });
        // console.log(query3.sql)
        let query3Result = await dbQueryFunc3()

        response.send(query3Result)
        let query2Result = await dbQueryFunc2()

        response.send(query2Result)
    } catch (err) {
        console.error(err)
    }


});

function dbQueryFunc1(sample_id) {
    return new Promise(function (resolve, reject) {
        let query1 = db.query('SELECT aliquot_id FROM aliquots where sample_id=?', sample_id, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        });
        console.log(query1.sql);
    })
}

function dbQueryFunc2(aliquots) {
    return new Promise(function (resolve, reject) {
        let query2 = db.query('SELECT * FROM shipments where aliquots=?', aliquots, (error, result) => {
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

