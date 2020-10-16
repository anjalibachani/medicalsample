const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const login = require('./routes/login');
const googlelogin = require('./routes/googlelogin');
const db = require('./db/dbconnect')
const config = require('../config/config.json');

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors({origin:true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

port = config.port;

app.listen(port,()=>{
    console.log(`server started on ${port}`);
})
app.post("/api/login",login);
app.post("/api/googlelogin", googlelogin);
app.get('/test',(req,res)=>{res.send({result:"test success"})});