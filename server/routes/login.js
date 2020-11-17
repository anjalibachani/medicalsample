const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const db = require('../db/dbconnect');
// const config = require('../config/config.json')
const config = process.env.MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const getsha1 = function(input){
    return crypto.createHash('sha1').update((input)).digest('hex')
}
async function login(req,res){
    const email_id = req.body.email_id ;
    const password = req.body.password;

    
    db.query('SELECT * from users WHERE email_id = ?',[email_id], async function(error, results, fields){
        if(error){
            return res.status(400).json({message:"error occued"})
        }
        else{
            if(results.length>0){
                //const comparison = await bcrypt.compare(password, results[0].password)
                const comparison = (results[0].password === getsha1(password))
                // console.log(results[0].user_id);
                // console.log(results[0].email_id);
                // console.log(`comparison ${comparison}`)
                // console.log(getsha1(password),password,results[0].password)
                if(comparison){
                    results[0].password = undefined
                    const token = jwt.sign({result:results[0]}, config.JWT_SECRET,{expiresIn:"1h"})
                    return res.status(200).json({token:token, user_id:results[0].user_id, admin:results[0].admin, message:"login successful"})
                }
                else{
                    return res.status(202).json({message:"Invalid email or password"})
                }
            }
            else{
                return res.status(206).json({message:"Invalid email or password"});
            }
        }
    });
}
module.exports = login;