const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const hostname = "localhost";
const port = 80;

const uri = "mongodb://127.0.0.1:27017/";
const client = new mongoClient(uri);

async function dbConnection(hashCode) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ hash: hashCode }).toArray();
    if (cursor.length == 1) {
      await collection.updateOne({ hash: hashCode }, { $unset: { hash: 1 } });
      return cursor[0].email;
    } else {
      return false;
    }
  } finally {
    await client.close();
  }
}

router.get("/", function (req, res, next) {
  var message = {};
  dbConnection(req.query.id).then((response) => {
    let data;
    if (response) {
      data = JSON.stringify({ mail: response });
      res.redirect(`http://${hostname}:${port}/reset?data=${data}`);
    } else {
      message.heading = "Error";
      message.msg =
        "An error occurred while verifying your email. Please consider to apply for another password reset link.";
      data = JSON.stringify({ message });
      res.redirect(`http://${hostname}:${port}/reset?data=${data}`);
    }
  });
});

module.exports = router;