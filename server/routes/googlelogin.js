const { response } = require('express');
const {OAuth2Client} = require('google-auth-library');
const db = require('../db/dbconnect')
// const config = require('../config/config.json');
const config = process.env.MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const jwt = require('jsonwebtoken')

const clientId = config.clientId;
const client = new OAuth2Client(clientId);


async function googlelogin(req,res){
    const {tokenId} = req.body;

    client.verifyIdToken({idToken: tokenId, audience: clientId}).then(response=>{
        const {email_verified, name, email} = response.payload;

        if(email_verified){
            db.query('SELECT * from users WHERE email_id = ?',[email], async function(error, results, fields){
                if(error){
                    return res.status(500).json({message:"server error"})
                }else if (results.length>0){
                    if(results[0].email_id === email){
                        results[0].password = undefined
                        const token = jwt.sign({result:results[0]}, config.JWT_SECRET,{expiresIn:"2h"})
                        return res.status(200).json({token:token, user_id:results[0].user_id, admin:results[0].admin, message:"login successful"})
                    }
                    else{
                        return res.status(204).json({message:"this email is not registered"})
                    }
                }
                else{
                    return res.status(204).json({message:"this email is not registered"})
                }
            })
            
        
        }else{
            return res.status(500).json({message:"server error"})
        }
    })

}
module.exports = googlelogin;