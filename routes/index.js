const express = require('express');
const router = express.Router();
const homepagesController = require('../controllers/homepagesController');

// Do work here
router.get('/', homepagesController.homePage);

module.exports = router;