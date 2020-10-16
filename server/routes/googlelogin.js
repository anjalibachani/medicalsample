const { response } = require('express');
const {OAuth2Client} = require('google-auth-library');
const db = require('../db/dbconnect')
const config = require('../config/config.json');

const clientId = config.clientId;
const client = new OAuth2Client(clientId);

async function googlelogin(req,res){
    console.log("google login called");
    const {tokenId} = req.body;

    client.verifyIdToken({idToken: tokenId, audience: clientId}).then(response=>{
        const {email_verified, name, email} = response.payload;
        console.log(email_verified, name,email);
        console.log(response);
        if(email_verified){
            res.send({
                "code": 200,
                "success": "Login successful"
            })
        
        }else{
            res.send({
                "code":500,
                "failed":"error occured"
            })
        }
    })

        }
module.exports = googlelogin;