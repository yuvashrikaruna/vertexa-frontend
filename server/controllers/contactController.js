const Contact = require("../models/contact");
const nodemailer = require("nodemailer");

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    
    const contact = new Contact({ name, email, message });
    await contact.save();

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message - Vertexa",
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({ message: "Message sent successfully 🚀" });

  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitContact };
