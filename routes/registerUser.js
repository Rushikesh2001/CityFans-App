const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const { randomBytes } = require("node:crypto");
const mongoClient = require("mongodb").MongoClient;

const ipAddress = "192.168.1.8";
const port = 80;

const uri = "mongodb://127.0.0.1:27017/";
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

//Defining smtp configuration settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "rushikeshpalekar91@gmail.com",
    pass: "rfgpvpitthobdoit",
  },
});

// Making unique hash codes
const uniqueId = randomBytes(128).toString("hex");

async function smtpConnection(toMailId) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: "rushikeshpalekar91@gmail.com", // sender address
      to: `${toMailId}`, // list of receivers
      subject: "CityFans - Confirm E-mail Address", // Subject line
      html: `Welcome<br/>Thanks for signing up with CityFans!<br/>You must follow this link to activate your account:<br/><a href='http://${ipAddress}:${port}/accountVerify?id=${uniqueId}'>http://${ipAddress}:${port}/accountVerify?id=${uniqueId}<a/>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
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
    dbConnection(accountDetails).then((response) => {
      if (response == "Email is valid") {
        var userEmail = {};
        userEmail.email = req.body.mail;
        res.render("verify", { userEmail });
      } else if (response == "Email already exist") {
        responseMsg.msg = response;
        res.render("signUp", { responseMsg });
      }
    });
  });
});

module.exports = router;
