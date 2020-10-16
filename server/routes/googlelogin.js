const { response } = require('express');
const {OAuth2Client} = require('google-auth-library');
const db = require('./dbconnect')
const clientId = "759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com";
const client = new OAuth2Client("759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com");

async function googlelogin(req,res){
    console.log("google login called");
    const {tokenId} = req.body;

    client.verifyIdToken({idToken: tokenId, audience: "759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com"}).then(response=>{
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