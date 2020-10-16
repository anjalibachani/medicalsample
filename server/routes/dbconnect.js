const mysql = require('mysql');
const db= mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'medical_sample_db'
});

db.connect((err)=>{
    if(err){
        throw(err);
    }
    console.log("Mysql connected...");
})

module.exports = db;