
const crypto = require('crypto');
const db = require('../db/dbconnect');

const getsha1 = function(input){
    return crypto.createHash('sha1').update((input)).digest('hex')
}

async function login(req,res){
    const email_id = req.body.email_id ;
    const password = req.body.password;
    console.log(email_id);
    console.log(password);

    
    db.query('SELECT * from medical_sample_db.users WHERE email_id = ?',[email_id], async function(error, results, fields){
        if(error){
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }
        else{
            if(results.length>0){
                console.log(results)
                console.log(password)
                //const comparison = await bcrypt.compare(password, results[0].password)
                const comparison = (results[0].password === getsha1(password))
                console.log(`comparison ${comparison}`)
                console.log(getsha1(password),password,results[0].password)
                if(comparison){
                    res.send({
                        "code":200,
                        "success":"login successful"
                    })
                }
                else{
                    res.send({
                        "code":204,
                        "success":"email and password did not match"
                    })
                }
            }
            else{
                res.send({
                    "code":206,
                    "success":"email does not exist"
                });
            }
        }
    });
}
module.exports = login;