const { verify } = require('crypto');
const jwt = require('jsonwebtoken')
const db = require('./routes/dbconnect');
JWT_SECRET = "asdf";
module.exports = (req,res,next)=>{
    console.log(req)
    const token = req.get("authorization").slice(7);
    console.log(token)
    if(token){
        // token = token.slice(7)
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            console.log("error",err);
            console.log("decoded ",decoded)
            if(err){
                return res.status(401).json({message:"UnAuthorized"});
            }else{
                next()
            }
        });
    }else{
        return res.status(401).json({message:"UnAuthorized"})
    }
}