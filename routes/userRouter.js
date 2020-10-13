const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../model/userModel");

router.post("/register", async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    //validation
    if (!name || !userName || !email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg:
          "An account with this email already exists, please try another one.",
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: passwordHash,
      userName: userName,
    });

    const savedUser = await newUser.save();
    res.json({ msg: "Created new user", savedUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      msg: `${user.userName} has logged in!`,
      token: token,
      user: {
        id: user._id,
        userName: user.userName
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json({
      msg: `The user - ${deletedUser.userName} - has been deleted from the database.`,
      deletedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tokenIsValid', async(req,res) => {
  try{
      const token = req.header("x-auth-token");
      if(!token){
          return res.json(false);
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if(!verified){
          return res.json(false);
      }

      const user = await User.findById(verified.id);
      if(!user){
          return res.json(false);
      }

      return res.json(true);
  }
  catch(err){
      res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req,res)=> {
  console.log(req.user)
  const user = await User.findById(req.user);
  res.json({
      userName: user.userName,
      id: user._id
  })
});

module.exports = router;
