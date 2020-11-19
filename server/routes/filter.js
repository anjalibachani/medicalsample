const db = require('../db/dbconnect');
// const config = require('../config/config.json')
const config = process.env.MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

async function filter(req,res){
    const email_id = req.body.email_id ;
    const password = req.body.password;
    console.log(req)
    console.log(req.get("Authorization"))
    console.log("body in filter samples",req.body)
    
    //db.query('SELECT * from samples', async function(error, results, fields){
    db.query(`SELECT S.*, L.location_name from samples S INNER JOIN aliquots A ON S.samples_key=A.aliquots_samples_key INNER JOIN locations L ON L.location_id = A.location_id where S.type!='';`, async function(error, results, fields){
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
module.exports = filter;