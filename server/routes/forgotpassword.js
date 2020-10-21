const crypto = require('crypto');
//import { DefaultTransporter } from 'google-auth-library';
const {DefaultTransporter} = require('google-auth-library');
const transporter = require('./sendmail')
const db = require('../db/dbconnect');
const jwt = require('jsonwebtoken');
const JWT_RESET_KEY = "resetpass";
function forgotpassword(req,res){
    const email_id = req.body.email_id ;
    console.log(email_id);   
    db.query('SELECT * from users WHERE email_id = ?',[email_id], async function(error, results, fields){
        if(error){
            return res.status(400).json({message:"error occued"})
        }
        else{
            if(results.length>0){
                if(req.body.email_id === results[0].email_id){
                    const user_id = results[0].user_id;
                    console.log("forgotpasswd for user id ",user_id);
                    results[0].password = undefined
                    const token = jwt.sign({user_id:results[0].user_id}, JWT_RESET_KEY,{expiresIn:"1h"})
                    console.log({token:token, message:"reset token generated"})
                    //return res.status(200).json({token:token, user_id:results[0].user_id,  message:"login successful"})
                    // crypto.randomBytes(32,(err, buffer)=>{
                    //     if(err){
                    //         console.log(err)
                    //     }
                    //     const token = buffer.toString("hex");
                    //     console.log(buffer);
                        
                    // })
                    db.query('UPDATE users set resetlink = ?, timeout = ? WHERE user_id = ?',[token,Date.now()+1200000,user_id], async function(error, results,fields){
                        if(!error){
                            transporter.sendMail({
                                from: 'merle22@ethereal.email', // sender address
                                to: `charan.elluru@gmail.com,${email_id}`, // list of receivers
                                subject: "Hello ✔", // Subject line
                                text: "Hello world?", // plain text body
                                html: "<b>Hello world?</b>", // html body
                            });
                            if(error){
                                console.log(error);
                            }
                            res.json({message:"check your mail"})
                        }
                    });
                }


            }
        }
    });
}

//     crypto.randomBytes(32,(err, buffer)=>{
//         if(err){
//             console.log(err)
//         }
//         const token = buffer.toString("hex");
//         console.log(buffer);
//         const email = emailid;
//         DefaultTransporter.sendMail({

//         })
//         res.json({message:"check your mail"})
//     })
// }

module.exports = forgotpassword;