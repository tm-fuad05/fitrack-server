import cloudinary from "../../config/cloudinary.js";

async function uploadToCloudinary(file, folderPath) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `fitrack/${folderPath}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(file?.buffer);
  });
}

async function addUserImageInCloudinary(file) {
  return await uploadToCloudinary(file, "users");
}
async function addTrainerImageInCloudinary(file) {
  return await uploadToCloudinary(file, "trainers");
}

export const UploadService = {
  addTrainerImageInCloudinary,
  addUserImageInCloudinary,
};
