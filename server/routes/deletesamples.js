const db = require('../db/dbconnect');
const config = require('../config/config.json')


async function deletesamples(req,res){
    //const email_id = req.body.email_id ;
    //const password = req.body.password;
    console.log("delete called" , req.body)
    console.log("delete called" , req.body.user_id)
    var sample_ids = req.body.rows.map(item => (item[0]))
    console.log("filtered sample_keys",sample_ids)
    var transaction_history = {
        user_id: req.body.user_id,
        timestamp: new Date(),
        desciption: "Deleted samples with sample ID's " + sample_ids,
      };
    

    await db.query(`DELETE from location_history as L where L.aliquot_id in (select A.aliquot_id from aliquots as A where (A.aliquots_samples_key,A.location_id) in (?))`,[req.body.rows], async function(error1, resp1, fields){
        console.log(error1)
        if(error1){
            return res.status(400).json({message:"couldnt delete the samples"})
        }
    })

    await db.query(`DELETE from aliquots where (aliquots_samples_key,location_id) IN (?)`,[req.body.rows], async function(err, resp, fields){
        console.log(err)
        if (err){
            return res.status(400).json({message:"couldnt delete the samples"})
        }else{
            let myquery = await db.query('DELETE from samples where samples_key IN (?)',[sample_ids], async function(error, results, fields){
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

            db.query('INSERT INTO transaction_history SET ?',transaction_history, (error, results, fields)=>{
                if(error){
                    throw error
                }else{
                    console.log(results.insertId);
                }
            })
        }
    })
    
    
}
module.exports = deletesamples;