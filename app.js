require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();


//middlewares

//parse the request body into readable data
app.use(bodyParser.urlencoded({ extended: false }));
//specify the public folder to be of static access
app.use('/public', express.static('public'));

//set up the port 

const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to Database!");
        app.listen(PORT);
    })
    .catch((err) => console.log(err));