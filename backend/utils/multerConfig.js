'use strict';

const multer = require('multer');

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Where to store files (e.g., uploads/ directory)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Give each file a unique name
  },
});

// Set up multer for handling file uploads
const upload = multer({ storage: storage });

module.exports = upload;