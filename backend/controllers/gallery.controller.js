import uploadToCloudinary from "../cloudinary/uploadToCloudinary.js";
import { User } from "../models/user.model.js";


const uploadPicture = async (req, res) => {
    try {
        console.log("aaya")
        const userExist = await User.findById(req.userId);
        if (!userExist) {
            throw new Error("User does not exist");
        }
        const file = req.file;
        let pictureUrl  = "";
        if(file){
            console.log("aaya 2")
            pictureUrl = await uploadToCloudinary(file.path);
            console.log("aaya 3")
        }else{
            throw new Error("file not found");
        }
        console.log(pictureUrl);
        const picture = {
            url:pictureUrl,
            sizeInMB: req.file.size / (1024 * 1024),
            createdAt: new Date(),
        };
        userExist.gallery.push(picture);
        console.log(userExist);
        await userExist.save();
    
        res.status(201).json({
            success: true,
            message: "Picture uploaded successfully",
        });
    } catch (error) {
        res.status(400).json({suuccess: false, message: error.message})
    }
}

export {uploadPicture};

