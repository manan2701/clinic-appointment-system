const express = require('express');
const router = express.Router();
const { getDashboard, bookAppointment, addReview, cancelAppointment, rescheduleAppointment, getProfile, updateProfile } = require('../controllers/userController');

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/appointments/book', bookAppointment);
router.delete('/appointments/:id', cancelAppointment);
router.put('/appointments/:id/reschedule', rescheduleAppointment);
router.post('/reviews', addReview);

module.exports = router;