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
        console.log(pictureUrl);
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
        console.log(userExist);
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

export { uploadPicture, getMyGallery };

