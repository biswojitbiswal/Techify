// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs/promises";

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadFileOnCloudinary = async (localFilePath) => {
//     try {
//       if (!localFilePath) {
//         return { success: false, message: "No file path provided" };
//       }
//       const response = await cloudinary.uploader.upload(localFilePath, {
//           resource_type: "auto",
//       });
//       fs.unlink(localFilePath);
//       return { success: true, data: response };
//     } catch (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       try {
//         await fs.unlink(localFilePath);
//       } catch (deleteError) {
//         console.error("Error deleting local file:", deleteError);
//       }
//       return { success: false, message: error.message };
//     }
// }

// export {uploadFileOnCloudinary}



import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            return null;
        }
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // file has been uploaded succesfully
        // console.log("file is uploaded successfully", response);
        // after upload unlink the file from server
        fs.unlinkSync(localFilePath) 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadFileOnCloudinary}