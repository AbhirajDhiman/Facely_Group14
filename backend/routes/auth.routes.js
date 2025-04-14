import { Router } from "express";
const router = Router();
import { signup, signin, signout, verifyEmail, forgotPassword, resetPassword, checkAuth, resendVerificationEmail } from '../controllers/auth.controller.js'
import { verifyToken } from "../middlewares/verifyToken.js";


router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);  

router.post('/verify-email', verifyEmail);  

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/resend-verification-email', resendVerificationEmail);



export default router;