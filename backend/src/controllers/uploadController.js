import { uploadLogoToCloudinary } from "../utils/cloudinary.js";
import { saveLogoLocally } from "../utils/localUpload.js";

export const uploadLogo = async (req, res, next) => {
  try {
    let uploaded;
    try {
      uploaded = await uploadLogoToCloudinary({
        dataUri: req.body.imageData,
        filename: req.body.filename,
      });
    } catch (err) {
      console.warn("Cloudinary upload failed or was bypassed. Storing logo locally:", err.message);
      uploaded = await saveLogoLocally({
        dataUri: req.body.imageData,
        filename: req.body.filename,
        req,
      });
    }

    res.status(201).json({ success: true, data: uploaded });
  } catch (err) {
    next(err);
  }
};
