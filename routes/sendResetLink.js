const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const { randomBytes } = require("node:crypto");
const sendEmail = require("../common/mail");

const appUrl = process.env.APP_URL;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail, uid) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ email: mail }).toArray();
    if (cursor.length != 0) {
      smtpConnection(mail);
      const newCursor = await collection.updateOne(
        { email: mail },
        { $set: { hash: uid } }
      );
      return true;
    }
    return false;
  } finally {
    await client.close();
  }
}

// Making unique hash codes
const uniqueId = randomBytes(128).toString("hex");

async function smtpConnection(toMailId) {
  // send mail
  try {
    const message = await sendEmail(toMailId, 'CityFans - Reset Password', `Welcome<br/>CityFans!<br/>You must follow this link to reset your password:<br/><a href='${appUrl}/reset/password?id=${uniqueId}'>${appUrl}/reset/password?id=${uniqueId}<a/>` );
    
    console.log("Message sent: ", message);
  } catch (error) {
    console.error(error);
  }
}

router.post("/", function (req, res) {
  var message = {};
  if (req.body.mail) {
    dbConnection(req.body.mail, uniqueId)
      .then((response) => {
        if (response) {
          message.msg = "success";
          res.send(JSON.stringify(message));
        } else {
          message.msg = "error";
          res.send(JSON.stringify(message));
        }
      })
      .catch((err) => {
        res.send(`Something went wrong:${err.message}`);
      });
  } else {
    res.send({ msg: "error" });
  }
});

module.exports = router;
