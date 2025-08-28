const express = require('express');
const router = express.Router();
const { deleteMyAccount } = require('../controllers/accountController');

router.delete('/delete', deleteMyAccount);

module.exports = router;