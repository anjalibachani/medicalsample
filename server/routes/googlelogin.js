const { response } = require('express');
const {OAuth2Client} = require('google-auth-library');
const db = require('../db/dbconnect')
const config = require('../config/config.json');
const jwt = require('jsonwebtoken')

const clientId = config.clientId;
const client = new OAuth2Client(clientId);


const JWT_SECRET = "asdf"

async function googlelogin(req,res){
    console.log("google login called");
    const {tokenId} = req.body;

    client.verifyIdToken({idToken: tokenId, audience: clientId}).then(response=>{
        const {email_verified, name, email} = response.payload;
        console.log(email_verified, name,email);
        console.log(response);
        if(email_verified){
            console.log("email verified and querying DB")
            db.query('SELECT * from medical_sample_db.users WHERE email_id = ?',[email], async function(error, results, fields){
                if(error){
                    return res.status(500).json({message:"server error"})
                }else if (results.length>0){
                    if(results[0].email_id === email){
                        results[0].password = undefined
                        const token = jwt.sign({result:results[0]}, JWT_SECRET,{expiresIn:"1h"})
                        console.log({token:token, message:"login successful"})
                        return res.status(200).json({token:token, user_id:results[0].user_id, message:"login successful"})
                    }
                    else{
                        console.log("email id not registered")
                        return res.status(204).json({message:"this email is not registered"})
                    }
                }
                else{
                    console.log("email id doesnt exist");
                    return res.status(204).json({message:"this email is not registered"})
                }
            })
            
        
        }else{
            return res.status(500).json({message:"server error"})
        }
    })

}
module.exports = googlelogin;