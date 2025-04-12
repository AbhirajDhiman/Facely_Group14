import Nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transport = Nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

export const sender = {
  address: process.env.GMAIL_USER, 
  name: "Jaskaran Singh", 
};