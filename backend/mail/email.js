import { transport, sender } from "./email.config.js";
import {
  RESET_PASSWORD_EMAIL,
  RESET_PASSWORD_SUCCESSFULLY_EMAIL,  
  VERIFICATION_EMAIL,
  WELCOME_EMAIL,
} from "./emailTemplate.js";

export const sendVerificationEmail = async (email, token) => {
  try {
    const info = await transport.sendMail({
      from: sender,
      to: email,
      subject: "Account Verification",
      html: VERIFICATION_EMAIL(token),
    });
    console.log("Verification email sent to %s: %s", email, info.messageId);
    return info;
  } catch (error) {
    console.error("Verification email error:", error.message);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transport.sendMail({
      from: sender,
      to: email,
      subject: "Welcome to our platform",
      html: WELCOME_EMAIL(name),
    });
    console.log("Welcome email sent to %s: %s", email, info.messageId);
    return info;
  } catch (error) {
    console.error("Welcome email error:", error.message);
    throw new Error("Failed to send welcome email");
  }
};

export const sendForgotPasswordEmail = async (email, link) => {
  try {
    const info = await transport.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Request",
      html: RESET_PASSWORD_EMAIL(link),
    });
    console.log("Password reset email sent to %s: %s", email, info.messageId);
    return info;
  } catch (error) {
    console.error("Password reset email error:", error.message);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessfully = async (email, name) => {
  try {
    const info = await transport.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successful",
      html: RESET_PASSWORD_SUCCESSFULLY_EMAIL(name),
    });
    console.log("Password success email sent to %s: %s", email, info.messageId);
    return info;
  } catch (error) {
    console.error("Password success email error:", error.message);
    throw new Error("Failed to send password success notification");
  }
};