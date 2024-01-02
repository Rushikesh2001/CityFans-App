const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  req.session.isLoggedIn = false;
  res.redirect("/login");
});

module.exports = router;