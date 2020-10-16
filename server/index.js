const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const login = require('./routes/login');
const googlelogin = require('./routes/googlelogin');
const db = require('./routes/dbconnect')

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors({origin:true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// const db= mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : 'root',
//     database : 'medical_sample_db'
// });

// db.connect((err)=>{
//     if(err){
//         throw(err);
//     }
//     console.log("Mysql connected...");
// })

app.get('/',(req,res)=>{
    res.send("node index");
});
//create db
app.get('/createdb',(req,res)=>{
    let sql = 'CREATE DATABASE medical_sample_db';
    db.query(sql,(err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send("database created ....")
    })
});


// app.use('/api',router);

port = 5000
app.listen(port,()=>{
    console.log(`server started on ${port}`);
})
app.post("/api/login",login);
app.post("/api/googlelogin", googlelogin);
app.get('/test',(req,res)=>{res.send({result:"test success"})});