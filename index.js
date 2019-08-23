'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
// Constants

const routerv1 = require('./src/v1/routes')

const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded())
app.use('/api/v1', routerv1)
console.log(process.env);

mongoose.connect(process.env.MONGODB_URI + "/dbej2").then(res => {
    app.listen(process.env.PORT || 5000);
    console.log(res);
}).catch(err => {
    console.log(err);
})

