const express = require('express');
const router = express.Router();
const { listMyDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { updateDoctorImage } = require('../controllers/clinicController');
const upload = require('../middleware/upload');

router.get('/', listMyDoctors);
router.post('/',upload.single('image'), createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.post('/image', upload.single('image'), updateDoctorImage);


module.exports = router;