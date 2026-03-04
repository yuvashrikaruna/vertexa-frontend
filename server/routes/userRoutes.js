const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const User = require("../models/user");

router.post("/register", registerUser);

router.post("/credits", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
  

    res.json({ credits: user.credits });

  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;