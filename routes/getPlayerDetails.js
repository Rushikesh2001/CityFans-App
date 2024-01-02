const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const uri = "mongodb://127.0.0.1:27017/";
const client = new mongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("playerDetails");

    const cursor = collection.find({});
    const players = await cursor.toArray();

    return players;
  } finally {
    await client.close();
  }
}

router.get("/", function (req, res, next) {
  dbConnect().then((response) => {
    res.send(response);
  });
});

module.exports = router;
