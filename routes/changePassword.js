const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoClient = require("mongodb").MongoClient;

const hostname = "localhost";
const port = 80;

const uri = "mongodb://127.0.0.1:27017/";
const client = new mongoClient(uri);

async function dbConnection(mail, pass) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");
    const cursor = await collection.updateOne(
      { email: mail },
      { $set: { password: pass } }
    );
    console.log(cursor);
  } finally {
    await client.close();
  }
}

router.post("/", function (req, res) {
  bcrypt.hash(req.body.pwd, saltRounds, async function (err, hash) {
    await dbConnection(req.body.mail, hash);
    res.send({ msg: "Success" });
  });
});

module.exports = router;
