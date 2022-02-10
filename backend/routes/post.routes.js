const express = require("express");

const postCtrl = require("./../controllers/post.controller.js");
const multer = require("./../middleware/multer");

const Post = require("../models/post");
const requireSignin = require("../middleware/requireSignin.js");

const router = express.Router();

router.post(
  "",
  requireSignin,
  multer,
  postCtrl.create
);

router.put(
  "/:id",
  requireSignin,
  multer,
  postCtrl.edit
);

router.get("", postCtrl.list);

router.get("/:id", postCtrl.read);

router.delete("/:id", requireSignin, postCtrl.remove);

module.exports = router;
