import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:8000'; // change if deployed

// ✅ Handles image upload (after multer middleware)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Access the active GridFSBucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'photos',
    });

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ msg: 'Only PNG and JPEG images are allowed' });
    }

    // Create upload stream and write file buffer to GridFS
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    // Handle successful upload
    uploadStream.on('finish', () => {
      const imageUrl = `${BASE_URL}/file/${filename}`;
      res.status(200).json({ imageUrl, filename });
    });

    // Handle upload errors
    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ msg: 'Error uploading file' });
    });
  } catch (error) {
    console.error('Upload exception:', error);
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Handles image retrieval by filename
export const getImage = async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'photos',
    });

    const { filename } = req.params;
    const fileDoc = await mongoose.connection.db
      .collection('photos.files')
      .findOne({ filename });

    if (!fileDoc) {
      return res.status(404).json({ msg: 'File not found' });
    }

    res.set('Content-Type', fileDoc.contentType || 'image/jpeg');
    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ msg: error.message });
  }
};
