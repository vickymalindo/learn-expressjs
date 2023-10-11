import multer from 'multer';

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Only image file', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const imageWithoutExt = file.originalname.split('.')[0];
    cb(null, `${uniqueSuffix}-${imageWithoutExt}.webp`);
  },
});

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
});
