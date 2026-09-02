import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
        error: "",
        data: null,
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Your message has been sent successfully",
      error: "",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to send your message",
      error: "Internal server error",
      data: null,
    });
  }
};
