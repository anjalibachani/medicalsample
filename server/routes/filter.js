const db = require('../db/dbconnect');
const jwt = require('jsonwebtoken')
// const config = require('../config/config.json')
const config = process.env.MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

async function filter(req,res){
    const email_id = req.body.email_id ;
    const password = req.body.password;
    
    //SELECT S.*, L.location_name, COUNT(*) as aliquots_count  from medsample_db.samples S  INNER JOIN medsample_db.aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN medsample_db.locations L ON L.location_id = A.location_id where S.type!='' GROUP BY S.sample_id, S.eval,S.type,L.location_name
    //db.query('SELECT * from samples', async function(error, results, fields){
    db.query(`SELECT S.*, L.location_name,L.location_id, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' GROUP BY S.sample_id, S.eval,S.type,L.location_name;`, async function(error, results, fields){
        if(error){
            return res.status(400).json({message:"No Samples Present"})
        }
        else{
            if(results.length>0){
                res.status(200).json(results)
            }
        }
    });
}

function getUniqueIds(req,res){
    db.query(`SELECT S.sample_id, S.eval, COUNT(*) as aliquot_count from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='' GROUP BY S.sample_id, S.eval,S.type,L.location_name;`, async function(error, results, fields){
        if(error){
            return res.status(400).json({message:"No Samples Present"})
        }
        else{
            if(results.length>0){
                res.status(200).json(results)
            }
        }
    });
}

function resettoken(req,res){
    db.query(`select * from users where user_id=?`,[req.body.user_id], async function(error, results, fields){
        if(error){
            return res.status(400).json({message:"No Samples Present"})
        }
        else{
            if(results.length>0){
                    results[0].password = undefined
                    const token = jwt.sign({result:results[0]}, config.JWT_SECRET,{expiresIn:"2h"})
                    return res.status(200).json({token:token, user_id:results[0].user_id, admin:results[0].admin, message:"login successful"})
            }
        }
        }
    );
}
module.exports = {filter,getUniqueIds,resettoken};