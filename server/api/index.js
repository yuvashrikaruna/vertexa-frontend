const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("MongoDB Error:", err);
  });



const User = require("../models/user");  




const userRoutes = require("../routes/userRoutes");
const contactRoutes = require("../routes/contactRoutes");

app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);




app.post("/api/ask-ai", async (req, res) => {
  try {
    const { email, question } = req.body;

    if (!email || !question) {
      return res.status(400).json({ message: "Email and question required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits <= 0) {
      return res.status(400).json({ message: "Out of credits" });
    }

    
    const answer = `AI Response for: ${question}`;

    
    user.credits -= 1;
    await user.save();

    res.json({
      answer,
      creditsLeft: user.credits
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  const prices = {
    starter: 2900,
    pro: 9900,
  };

  if (!prices[plan]) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.toUpperCase()} Plan`,
            },
            unit_amount: prices[plan],
          },
          quantity: 1,
        },
      ],
      success_url: "https://vertexa-backend-3.onrender.com/success",
      cancel_url: "https://vertexa-backend-3.onrender.com/pricing",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
});




app.get("/", (req, res) => {
  res.send("Vertexa Backend is Running");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));