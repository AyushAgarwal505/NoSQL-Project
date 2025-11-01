import multer from 'multer';
import mongoose from 'mongoose';

// Configure multer to store files in memory before upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to handle image uploads
export const uploadImage = async (req, res) => {
  try {
    // Validate file
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      return res.status(400).json({ error: 'Only PNG or JPEG files are allowed' });
    }

    // Create a GridFS bucket (requires an active mongoose connection)
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'photos',
    });

    // Create a readable stream and upload the file
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    uploadStream.on('finish', () => {
      return res.status(200).json({
        message: 'File uploaded successfully',
        fileId: uploadStream.id,
        filename: uploadStream.filename,
      });
    });

    uploadStream.on('error', (err) => {
      console.error('Upload Error:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    });
  } catch (err) {
    console.error('Upload Exception:', err);
    return res.status(500).json({ error: err.message });
  }
};

export default upload;
