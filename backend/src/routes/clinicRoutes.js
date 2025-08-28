const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getAppointments,
  updateAppointmentStatus,
  updateProfile,
  updateClinicImage,
  updateDoctorImage,
} = require("../controllers/clinicController");
const doctorRouter = require("./doctorRoutes");
const serviceRouter = require("./serviceRoutes");
const upload = require("../middleware/upload");

router.get("/dashboard", getDashboard);
router.get("/appointments", getAppointments);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.put("/profile", updateProfile);
router.put("/image", upload.single("image"), updateClinicImage);
router.put("/doctorimage", upload.single("image"), updateDoctorImage);

// Manage Doctors & Services
router.use("/doctors", doctorRouter);
router.use("/services", serviceRouter);

module.exports = router;
