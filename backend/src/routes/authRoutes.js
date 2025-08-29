const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerClinic,
  login,
} = require("../controllers/authController");

router.post("/register/user", registerUser);
router.post("/register/clinic", registerClinic);
router.post("/login", login);

module.exports = router;
