import express from 'express';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path'

import { connectDB } from './db/connectDB.js';


import authRoutes from './routes/auth.routes.js';

configDotenv();

const PORT = process.env.PORT || 5000;

const app = express();






app.use(express.json());
app.use(cookieParser()); //allow us to access the cookie 
// In index.js

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}
app.use(cors({
  origin: 'http://localhost:5173', // Confirm this is set to 5173
  credentials: true
}));

app.use("/api/auth", authRoutes) 





app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
}); 