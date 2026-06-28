import { uploadLogoToCloudinary } from "../utils/cloudinary.js";

export const uploadLogo = async (req, res, next) => {
  try {
    const uploaded = await uploadLogoToCloudinary({
      dataUri: req.body.imageData,
      filename: req.body.filename,
    });

    res.status(201).json({ success: true, data: uploaded });
  } catch (err) {
    next(err);
  }
};
