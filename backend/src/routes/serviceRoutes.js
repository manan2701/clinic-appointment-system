const express = require('express');
const router = express.Router();
const { listMyServices, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', listMyServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;