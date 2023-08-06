const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose"); 
const InitiateMongoDBServer = require("./config/db");

//setup
InitiateMongoDBServer();
const db = mongoose.connection;

const router = express.Router();
const port = process.env.PORT || 3030;

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
router.get('/', (req, res) => {
    res.json({message : "API working"});
})
app.use("/", router);

const questionRouter = require('./routes/questions.js')
app.use('/question', questionRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
