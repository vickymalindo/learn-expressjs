import multer from 'multer';
import sharp from 'sharp';

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Only image file', false);
  }
};

const storage = multer.diskStorage({
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

export const resizeImage = (req, res, next) => {
  const { path, filename } = req.file;
  sharp(path)
    .resize(300, 480)
    .webp()
    .toFile(`./public/images/${filename}`, (err, info) => {
      if (err) {
        console.error(err);
        fs.unlink(req.file.path, (err) => {
          console.log(err);
        });
      } else {
        console.log(info);
      }
    });
  next();
};
