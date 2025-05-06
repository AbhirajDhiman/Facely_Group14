import bcrypt from "bcryptjs";
import crypto from "crypto";
import uploadToCloudinary from "../cloudinary/uploadToCloudinary.js"
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendForgotPasswordEmail, sendResetSuccessfully, sendVerificationEmail, sendWelcomeEmail } from "../mail/email.js";
import { Group } from "../models/group.model.js";

const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }
      console.log(req.file);
  
      const userExist = await User.findOne({ email });
      console.log(userExist);
      if (userExist) throw new Error("User already exists");
  
      if (!req.file) throw new Error("Profile picture required");

      const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const embeddingRes = await axios.post(
            'http://127.0.0.1:8000/make-embedding', 
            formData, 
            { headers: formData.getHeaders() }
            );
            if (!embeddingRes) {
                throw new Error("Face recognition failed");
              }

            const profilePicUrl = await uploadToCloudinary(req.file.path);
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
      const user = new User({
        name,
        email,
        password: hashedPassword,
        faceEmbedding: embeddingRes.data.embedding,
        profilePic: profilePicUrl,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
  
      await user.save();
      generateTokenAndSetCookie(res, user._id);
      await sendVerificationEmail(user.email, verificationToken);
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, message: error.message });
    }
  };
const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            throw new Error('Invalid or expired verification code');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        user.save();

        sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const signin = async (req, res) => {
    console.log("first")
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        generateTokenAndSetCookie(res, user._id);



        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Signin successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const signout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: 'Signout successfully' });
}


const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send Email
        await sendForgotPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Update Password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

    await sendResetSuccessfully(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Access denied' });
        }
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Access denied' });
    }
}

// 

const resendVerificationEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); //verification token
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();
        await sendVerificationEmail(user.email, verificationToken);
        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully',
        })
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getMyGroups = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('createdGroups')
            .populate('joinedGroups');
            
        res.status(200).json({
            success: true,
            createdGroups: user.createdGroups,
            joinedGroups: user.joinedGroups
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export { signup, signin, signout, verifyEmail, forgotPassword, resetPassword, checkAuth, resendVerificationEmail, getMyGroups };