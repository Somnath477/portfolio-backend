import express from "express";
import nodemailer from "nodemailer";
import { Message } from "../models/Message.js";

const router = express.Router();

// POST /api/messages
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }

    // Save message to MongoDB
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    // --------------------------
    // SEND EMAIL TO YOUR GMAIL
    // --------------------------

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: `"Portfolio Message" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: subject || "New Portfolio Message",
      text: `
New message from your portfolio:

Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      data: newMessage,
      email: "sent",
    });

  } catch (err) {
    console.error("Error saving or sending message:", err);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
