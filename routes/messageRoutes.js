import express from "express";
import { Message } from "../models/Message.js";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/messages
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email and message are required.",
      });
    }

    // Save message to MongoDB
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send email using Resend (HTTPS — works on Railway!)
    await resend.emails.send({
      from: "Somnath Portfolio <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "No subject provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>📩 Sent automatically from your Portfolio Contact Form</p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Message stored and email sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("Error saving or sending message:", err);
    return res.status(500).json({
      error: "Server error. Message could not be sent.",
    });
  }
});

export default router;
