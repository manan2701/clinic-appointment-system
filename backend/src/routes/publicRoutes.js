const express = require('express');
const router = express.Router();
const { getAllApprovedClinics, getClinicById } = require('../controllers/publicController');
const { getDoctorsByClinicPublic, getDoctorPublic } = require('../controllers/doctorController');
const { getServicesByClinicPublic } = require('../controllers/serviceController');

router.get('/clinics', getAllApprovedClinics);
router.get('/clinics/:id', getClinicById);

// Doctors & Services
router.get('/clinics/:id/doctors', getDoctorsByClinicPublic);
router.get('/doctors/:id', getDoctorPublic);
router.get('/clinics/:id/services', getServicesByClinicPublic);



module.exports = router;