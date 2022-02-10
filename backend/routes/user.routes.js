const express = require("express");

const userCtrl = require('./../controllers/user.controller.js')

const router = express.Router();

router.route("/signup").post(userCtrl.signup)

router.route("/signin").post(userCtrl.signin)



module.exports = router