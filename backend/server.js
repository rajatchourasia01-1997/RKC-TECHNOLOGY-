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

    // Enabled resource_type: "auto" to process RAW, HEIC, PSD, AI, EPS, SVG, TIFF, BMP, etc.
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "photo_upscaler_uploads",
      resource_type: "auto"
    });

    let transformation = [{ quality: "auto", fetch_format: "auto" }];

    if (preset === 'cinematic') {
      transformation.push({ effect: "improve" }, { effect: "saturation:15" }, { effect: "contrast:10" });
    } else if (preset === 'noir') {
      transformation.push({ effect: "grayscale" }, { effect: "contrast:30" });
    } else if (preset === 'golden') {
      transformation.push({ effect: "improve" }, { effect: "brightness:10" });
    } else {
      transformation.push({ effect: "improve" }, { effect: "sharpen:20" });
    }

    if (brightness !== 0) transformation.push({ effect: `brightness:${brightness}` });
    if (contrast !== 0) transformation.push({ effect: `contrast:${contrast}` });
    if (saturation !== 0) transformation.push({ effect: `saturation:${saturation}` });
    if (sharpness !== 0) transformation.push({ effect: `sharpen:${sharpness}` });
    if (vignette > 0) transformation.push({ effect: `vignette:${vignette}` });

    const enhancedUrl = cloudinary.url(uploadResult.public_id, {
      secure: true,
      transformation: transformation
    });

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