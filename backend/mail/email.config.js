import Nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transport = Nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Only for testing, remove in production
  }
});

export const sender = {
  address: process.env.GMAIL_USER, // Your Gmail address
  name: "Jaskaran Singh", // Your sender name
};