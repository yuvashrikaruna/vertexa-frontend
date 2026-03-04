const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    credits: {
      type: Number,
      default: 10
    },

    creditsResetDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);