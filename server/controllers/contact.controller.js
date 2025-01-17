import { Contact } from "../models/contact.model.js";
import mongoose from "mongoose";

const contactData = async (req, res, next) => {
    try {
        const { email, message } = req.body;

        // Basic validation
        if (!email || !message) {
            return res.status(400).json({ message: "All Fields Required" });
        }

        // Check for valid email format
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
        console.error("Error occurred:", error);

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: "Validation Error", details: error.errors });
        }

        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};

export { contactData };
