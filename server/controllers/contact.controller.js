import { Contact } from "../models/contact.model.js";
import mongoose from "mongoose";

const contactData = async (req, res, next) => {
    try {
        const { email, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ message: "All Fields Required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const contact = await Contact.create({
            email,
            message,
        });

        return res.status(201).json({ message: "Message Sent Successfully" });
    } catch (error) {
        next(error);
    }
};

export { contactData };
