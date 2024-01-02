const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const uri = "mongodb://127.0.0.1:27017/";
const client = new mongoClient(uri);

async function dbConnection(quizObj, mail) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ email: mail }).toArray();
    if (cursor[0].quiz) {
      await collection.updateOne({ email: mail }, [
        { $set: { quiz: { $concatArrays: ["$quiz", [quizObj]] } } },
      ]);
      return true;
    } else {
      await collection.updateOne(
        { email: mail },
        { $set: { quiz: [quizObj] } }
      );
      return false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

router.post("/", function (req, res) {
  const userQuizDetail = {
    name: req.body.name,
    score: req.body.score,
    date: req.body.date,
  };
  dbConnection(userQuizDetail, req.body.mail).then((response) => {
    res.send(response);
  });
});

module.exports = router;
