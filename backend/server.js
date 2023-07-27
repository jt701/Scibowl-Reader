const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose"); 
const InitiateMongoDBServer = require("./config/db");

InitiateMongoDBServer();
const db = mongoose.connection;

const router = express.Router();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', function (req, res) {
    res.json({message : "API working"});
})
app.use("/", router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
