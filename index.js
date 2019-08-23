'use strict';

const express = require('express');
const app = express();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const routerv1 = require('./src/v1/routes')

const mongoUrl = 'mongodb://localhost:27017'
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded())
app.use('/api/v1', routerv1)

mongoose.connect(mongoUrl + "/dbej2").then(res => {
    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
}).catch(err => {
    console.log(err);
})

