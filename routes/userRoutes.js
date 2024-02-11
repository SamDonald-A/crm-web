const express = require("express");
const {registerUser, loginUser, currentUser, updateCurrentUser} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const multer = require('multer');
const router = express.Router();


// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Store files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename
    }
  });
  const upload = multer({ storage: storage });


router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current', validateToken, currentUser);

router.put('/current', validateToken, upload.single('profilePicture'), updateCurrentUser);


module.exports = router;