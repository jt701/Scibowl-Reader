const mongoose = require("mongoose");


const MONGOURI = "mongodb://127.0.0.1:27017/scibowl";
const InitiateMongoDBServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB!");
  } catch (e) {
    console.log(e);
    throw new Error("Failed to connect to the database.");
  }
};

module.exports = InitiateMongoDBServer;