import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/enhance', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const preset = req.body.preset || 'crisp';
    const brightness = parseInt(req.body.brightness, 10) || 0;
    const contrast = parseInt(req.body.contrast, 10) || 0;
    const saturation = parseInt(req.body.saturation, 10) || 0;
    const sharpness = parseInt(req.body.sharpness, 10) || 0;
    const vignette = parseInt(req.body.vignette, 10) || 0;

    let transformationString = "f_auto,q_auto";

    if (preset === 'cinematic') {
      transformationString += ",e_improve,e_saturation:15,e_contrast:10";
    } else if (preset === 'noir') {
      transformationString += ",e_grayscale,e_contrast:30";
    } else if (preset === 'golden') {
      transformationString += ",e_improve,e_brightness:10";
    } else {
      transformationString += ",e_improve,e_sharpen:20";
    }

    if (brightness !== 0) transformationString += `,e_brightness:${brightness}`;
    if (contrast !== 0) transformationString += `,e_contrast:${contrast}`;
    if (saturation !== 0) transformationString += `,e_saturation:${saturation}`;
    if (sharpness !== 0) transformationString += `,e_sharpness:${sharpness}`;
    if (vignette > 0) transformationString += `,e_vignette:${vignette}`;

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "photo_upscaler_uploads"
    });

    // Safely insert valid transformation syntax into the secure Cloudinary URL
    const urlParts = uploadResult.secure_url.split('/upload/');
    const enhancedUrl = `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;

    await fs.unlink(req.file.path);
    res.json({ success: true, resultUrl: enhancedUrl });

  } catch (error) {
    console.error("Enhancement error:", error);
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    res.status(500).json({ success: false, error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));