import express from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../lib/prisma';

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload File
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { companyId, type, name, description, category } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;

        // Save to DB if companyId is provided
        if (companyId) {
            const asset = await prisma.asset.create({
                data: {
                    companyId,
                    url: fileUrl,
                    type: type || 'image',
                    name: name || req.file.originalname,
                    description,
                    category
                }
            });
            res.json(asset);
        } else {
            // Just return the URL if no company context (e.g. temp upload)
            res.json({ url: fileUrl });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Delete Asset
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.asset.delete({ where: { id } });
        // Note: In a real app, we should also delete the file from disk
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete asset' });
    }
});

export default router;
