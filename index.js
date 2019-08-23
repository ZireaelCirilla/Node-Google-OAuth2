'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const routerv1 = require('./src/v1/routes')

const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded())
app.use('/api/v1', routerv1)

mongoose.connect(process.env.MONGODB_URI + "/dbej2").then(res => {
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
}).catch(err => {
    console.log(err);
})

