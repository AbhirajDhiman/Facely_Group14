import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUser_%2528computing%2529&psig=AOvVaw3ZPv403QBSL9CVpeA5RMWw&ust=1745563923575000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiP0r-K8IwDFQAAAAAdAAAAABAE"
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},{timestamps: true});

// Create Model
export const User = mongoose.model('User', userSchema);
