const db = require('../db/dbconnect');
const config = require('../config/config.json')


async function deletesamples(req,res){
    //const email_id = req.body.email_id ;
    //const password = req.body.password;
    console.log("delete called" , req.body)
    console.log("delete called" , req.body.user_id)
    

    db.query(`DELETE from location_history as L where L.aliquot_id in (select A.aliquot_id from aliquots as A where aliquots_samples_key in (?))`,[req.body.rows], async function(error1, resp1, fields){
        console.log(error1)
        if(error1){
            return res.status(400).json({message:"couldnt delete the samples"})
        }
    })

    db.query(`DELETE from aliquots where aliquots_samples_key IN (?)`,[req.body.rows], async function(err, resp, fields){
        console.log(err)
        if (err){
            return res.status(400).json({message:"couldnt delete the samples"})
        }else{
            let myquery = db.query('DELETE from samples where samples_key IN (?)',[req.body.rows], async function(error, results, fields){
                //console.log(fields, "query", myquery)
                if(error){
                    console.log("error ", error)
                    return res.status(400).json({message:"No Samples Present"})
                }
                else{
                    console.log("delete successful")
                    res.status(200).json(results)
                    
                }
            });
        }
    })
    
    
}
module.exports = deletesamples;