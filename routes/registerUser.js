const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { randomBytes } = require("node:crypto");
const validateAPI = require("../common/validateAPI");
const mongoClient = require("mongodb").MongoClient;
const sendEmail = require("../common/mail");

const appUrl = process.env.APP_URL;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(userdetail) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ email: userdetail.email }).toArray();
    if (cursor.length == 0) {
      smtpConnection(userdetail.email);
      const newCursor = await collection.insertOne(userdetail);
      return "Email is valid";
    } else {
      return "Email already exist";
    }
  } finally {
    await client.close();
  }
}

// Making unique hash codes
const uniqueId = randomBytes(128).toString("hex");

async function smtpConnection(toMailId) {
  // send mail
  try {
    const message = await sendEmail(toMailId, 'CityFans - Confirm E-mail Address', `Welcome<br/>Thanks for signing up with CityFans!<br/>You must follow this link to activate your account:<br/><a href='${appUrl}/accountVerify?id=${uniqueId}'>${appUrl}/accountVerify?id=${uniqueId}<a/>` );

    console.log("Message sent: ", message);
  } catch (error) {
    console.error(error);
  }
}

router.post("/", function (req, res, next) {
  var accountDetails = {};
  var responseMsg = {};
  bcrypt.hash(req.body.confirmPassword, saltRounds, function (err, hash) {
    accountDetails.email = req.body.mail;
    accountDetails.password = hash;
    accountDetails.hash = uniqueId;
    accountDetails.isVerified = false;
    dbConnection(accountDetails)
      .then((response) => {
        if (response == "Email is valid") {
          var userEmail = {};
          userEmail.email = req.body.mail;
          res.render("verify", { userEmail });
        } else if (response == "Email already exist") {
          responseMsg.msg = response;
          res.render("signUp", { responseMsg });
        }
      })
      .catch((err) => {
        res.send(`Something went wrong:${err.message}`);
      });
  });
});

module.exports = router;
