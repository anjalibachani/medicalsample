const express = require('express');
const path = require("path");
const bodyparser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const login = require('./routes/login');
const googlelogin = require('./routes/googlelogin');
const db = require('./db/dbconnect')
const config = require('./config/config.json');
const samples = require('./routes/samples');
const forgotpassword = require('./routes/forgotpassword');
const resetpassword = require('./routes/resetpassword');
const addshipment = require('./routes/addshipment');
const child = require('./routes/child');
const filter = require('./routes/filter')
const app = express();
// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors({origin:true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/samples', samples);
app.use("/child", child);
app.use('/addshipment',addshipment);
port = config.port;

app.listen(port,()=>{
    console.log(`server started on ${port}`);
})
app.post("/api/login",login);
app.post("/api/googlelogin", googlelogin);
app.post("/api/forgot-password",forgotpassword)
app.post("/api/reset-password/:id",resetpassword)
app.get("/api/filter",filter)
app.get('/test', (req, res) => { res.send({ result: "test success" }) });
