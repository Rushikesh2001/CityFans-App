const express = require("express");
const router = express.Router();
const { randomBytes } = require("node:crypto");
const mongoClient = require("mongodb").MongoClient;
const sendEmail = require("../common/mail");

const appUrl = process.env.APP_URL;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail, uid) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.updateOne(
      { email: mail },
      { $set: { hash: uid } }
    );
    smtpConnection(mail);
  } finally {
    await client.close();
  }
}

// Making unique hash codes
const uniqueId = randomBytes(128).toString("hex");

async function smtpConnection(toMailId) {
  // send mail.
  try {
    const message = await sendEmail(toMailId, 'CityFans - Confirm E-mail Address', `Welcome<br/>Thanks for signing up with CityFans!<br/>You must follow this link to activate your account:<br/><a href='${appUrl}/accountVerify?id=${uniqueId}'>${appUrl}/accountVerify?id=${uniqueId}<a/>` );
    
    console.log("Message sent: ", message);
  } catch (error) {
    console.log(error);
  }
}

router.post("/", function (req, res, next) {
  if (req.body.mail) {
    dbConnection(req.body.mail, uniqueId).then(() => {
      res.send({ msg: "Success" });
    });
  } else {
    res.send({ msg: "Failure" });
  }
});

module.exports = router;
