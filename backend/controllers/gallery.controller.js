import uploadToCloudinary from "../cloudinary/uploadToCloudinary.js";
import { Picture } from "../models/picture.model.js";
import { User } from "../models/user.model.js";
import { getVisionModel } from "../services/gemini.js";
import fs from "fs";



const model = getVisionModel();


const uploadPicture = async (req, res) => {
    try {
        const userExist = await User.findById(req.userId);
        if (!userExist) {
            throw new Error("User does not exist");
        }
        const file = req.file;

        const imageData = fs.readFileSync(file.path).toString("base64");

        const result = await model.generateContent([
            { text: "Give a brief 20 to 30 word description of what is shown or said in this image." },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageData,
                },
            },
        ]);
        const response = await result.response;
        const description = response.text();

        let pictureUrl = "";
        if (file) {
            pictureUrl = await uploadToCloudinary(file.path);
        } else {
            throw new Error("file not found");
        }
        const picture = new Picture({
            url: pictureUrl,
            sizeInMB: file.size / (1024 * 1024),
            uploadedBy: req.userId,
            description
        })
        await picture.save();

        // const picture = {
        //     url: pictureUrl,
        //     sizeInMB: req.file.size / (1024 * 1024),
        //     createdAt: new Date(),
        //     description
        // };
        userExist.gallery.push(picture);
        await userExist.save();

        res.status(201).json({
            success: true,
            message: "Picture uploaded successfully",
        });
    } catch (error) {
        res.status(400).json({ suuccess: false, message: error.message })
    }
}

const getMyGallery = async (req, res) => {
    const userExist = await User.findById(req.userId).populate({
        path: 'gallery',
        select: 'url description createdAt sizeInMB'
    });
    if (!userExist) {
        throw new Error("User does not exist");
    }
    const gallery = userExist.gallery.map(picture => ({
        url: picture.url,
        description: picture.description,
        date: picture.createdAt.toDateString(),
        sizeInMB: picture.sizeInMB
    }));

    res.status(200).json({
        success: true,
        gallery
    });
}

const filterPhotos = async (req, res) => {
    const { photos, query } = req.body;

    try {
        const result = await model.generateContent([
            {
                text: `You are a filtering assistant. Given a JSON array of photo objects and a search query, return a filtered array of only the photos that match the query. 
Each photo object looks like this: ${JSON.stringify(photos[0])}. 
Photos: ${JSON.stringify(photos)}, Query: "${query}". 
Respond ONLY with a raw JSON array of matching photo objects. Do not include any markdown formatting, code blocks, or extra text.`
            }
        ]);

        const response = await result.response;
        const rawText = await response.text();
        
        // Remove any markdown code block formatting if present
        const cleanText = rawText.replace(/```json\n?|\n?```/g, '').trim();

        let filteredPhotos;
        try {
            filteredPhotos = JSON.parse(cleanText);
            if (!Array.isArray(filteredPhotos)) {
                throw new Error("Response is not an array");
            }
        } catch (err) {
            console.error("Invalid JSON or format:", rawText);
            return res.status(400).json({
                success: false,
                message: "Invalid response format from model"
            });
        }

        res.status(200).json({
            success: true,
            filteredPhotos
        });
    } catch (error) {
        console.error("Error filtering photos:", error);
        res.status(400).json({
            success: false,
            message: "Failed to filter photos"
        });
    }
};


export { uploadPicture, getMyGallery, filterPhotos };

