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
const upload = multer({ dest: 'uploads/' });

app.post('/api/enhance', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Read the scale option sent from the frontend ('2x' or '4x')
    const scale = req.body.scale || '2x';
    const multiplier = scale === '4x' ? 4.0 : 2.0;

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "photo_upscaler_uploads"
    });

    // Generate enhanced URL with 2x/4x scaling and tuned sharpening 
    // to preserve hair texture, natural skin tones, and eye details.
    const enhancedUrl = cloudinary.url(uploadResult.public_id, {
      width: multiplier,
      crop: "scale",
      effect: "improve/sharpen:30",
      quality: "auto:best",
      fetch_format: "auto"
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
app.listen(PORT, () => console.log(`Backend running on port ${PORT} (Free Mode)`));