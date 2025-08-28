const express = require('express');
const router = express.Router();
const { getDashboardStats, getPendingClinics, approveClinic, rejectClinic, getAllUsers, getAllClinics } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/clinics/pending', getPendingClinics);
router.put('/clinics/:id/approve', approveClinic);
router.put('/clinics/:id/reject', rejectClinic);
router.get('/users', getAllUsers);
router.get('/clinics', getAllClinics);


module.exports = router;