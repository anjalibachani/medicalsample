const mysql = require('mysql');
const config = require('../config/config.json');

const db = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  // dateStrings:true
});

db.connect((err)=>{
    if(err){
        throw(err);
    }
    console.log("Mysql connected...");
})

module.exports = db;