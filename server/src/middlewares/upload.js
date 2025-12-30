import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
}); // or diskStorage later
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

export default upload;
