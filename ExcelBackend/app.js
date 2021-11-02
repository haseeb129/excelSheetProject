const express = require ("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require ('cors');
mongoose.connect('mongodb://localhost:27017/excelProjectDB',{useNewUrlParser:true});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/files',express.static('files'));
console.log("ok2")

const rolesRoute = require('./api/routes/roles')
const authRoute = require('./api/routes/auth')
const excelRoute = require('./api/routes/excelRecords')
const employesRoute = require('./api/routes/employes')



app.use('/roles',rolesRoute)
app.use('/auth',authRoute)
app.use('/excelFile',excelRoute)
app.use('/employes',employesRoute)


app.use("/hello",(req,res,next) => {
    console.log("ok")
    res.status(200).json({
        message : "hello world"
    })
})

module.exports = app;
