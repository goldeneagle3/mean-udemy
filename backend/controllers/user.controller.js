const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

const signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    res.status(201).json({
      message: "User created!",
      result: newUser,
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let isExist = await User.findOne({ email });
    if (!isExist) return res.status(400).json({ error: "Wrong credentials!" });
    let checkPass = await bcrypt.compare(password, isExist.password);
    if (!checkPass)
      return res.status(400).json({ error: "Wrong credentials!" });
    const token = jwt.sign(
      { email: isExist.email, userId: isExist._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

module.exports = {
  signup,
  signin,
};
