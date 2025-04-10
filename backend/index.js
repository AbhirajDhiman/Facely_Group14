// const express =require ("express");
import express from 'express';
import { connectDB } from './DB/connectdb';
const app = express();
app.get("/",(req,res)=>{
    res.send("Hello Wo rld");
});
app.listen(3000, ()=> {
    connectDB();
    console.log("Server is running on port 3000");
});
