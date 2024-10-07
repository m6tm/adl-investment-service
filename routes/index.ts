import express from 'express';
import multer from 'multer';
import path from 'path';

var route = express.Router();

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
route.get('/', function(req, res, next) {
  res.render('index', {
    title: 'My Website',
    message: 'Welcome to my website!',
    items: ['Item 1', 'Item 2', 'Item 3']
  });
})
.get('/winwheel', function(req, res, next) {
  res.render('spinner', {
    title: 'Winwheel',
  });
})
// Upload image
.post('/upload', upload.single('image'), function(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune image n\'a été téléchargée.' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
  });
});

export const router = route;