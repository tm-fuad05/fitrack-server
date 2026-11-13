import { UploadService } from "./upload.service.js";

async function addUserImage(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file found",
    });
  }
  const result = await UploadService.addUserImageInCloudinary(req.file);

  return res.status(200).json({
    success: true,
    data: result.secure_url,
  });
}

async function addTrainerImage(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file found",
    });
  }
  console.log(req.file);
  const result = await UploadService.addTrainerImageInCloudinary(req?.file);

  return res.status(201).json({
    success: true,
    data: result?.secure_url,
  });
}

export const UploadController = {
  addTrainerImage,
  addUserImage,
};
