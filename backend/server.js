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

    const style = req.body.style || 'ghibli';
    const brightness = parseInt(req.body.brightness) || 0;
    const contrast = parseInt(req.body.contrast) || 0;
    const saturation = parseInt(req.body.saturation) || 0;
    const sharpness = parseInt(req.body.sharpness) || 0;
    const vignette = parseInt(req.body.vignette) || 0;

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "photo_upscaler_uploads"
    });

    // Build dynamic transformation array based on style & sliders
    let transformations = [];

    // Style Mapping
    if (style === 'ghibli') {
      transformations.push({ effect: "cartoonify" }, { effect: "saturation:25" }, { effect: "art:athena" });
    } else if (style === 'pixar') {
      transformations.push({ effect: "cartoonify:30" }, { effect: "saturation:40" }, { effect: "brightness:10" });
    } else if (style === 'anime') {
      transformations.push({ effect: "cartoonify" }, { effect: "art:incognito" });
    } else {
      transformations.push({ effect: "improve" });
    }

    // Apply User Sliders if active
    if (brightness !== 0) transformations.push({ effect: `brightness:${brightness}` });
    if (contrast !== 0) transformations.push({ effect: `contrast:${contrast}` });
    if (saturation !== 0) transformations.push({ effect: `saturation:${saturation}` });
    if (sharpness !== 0) transformations.push({ effect: `sharpen:${sharpness}` });
    if (vignette > 0) transformations.push({ effect: `vignette:${vignette}` });

    transformations.push({ quality: "auto:best" }, { fetch_format: "auto" });

    const enhancedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: transformations
    });

    await fs.unlink(req.file.path);
    res.json({ success: true, resultUrl: enhancedUrl });

  } catch (error) {
    console.error(error);
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    res.status(500).json({ success: false, error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));