import express from 'express';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'


import { connectDB } from './db/connectDB.js';


import authRoutes from './routes/auth.routes.js';

configDotenv();

const PORT = process.env.PORT || 5000;

const app = express();


app.use(express.json());
app.use(cookieParser()); //allow us to access the cookie 
// In index.js
app.use(cors({
  origin: 'http://localhost:5173', // Confirm this is set to 5173
  credentials: true
}));

app.use("/api/auth", authRoutes) 


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
}); 