const express = require('express');
const router = express.Router();
const homepagesController = require('../controllers/homepagesController');
const userController = require('../controllers/userController');

// Do work here
router.get('/', homepagesController.homePage);

router.get('/login', userController.loginForm);

router.post('/login', userController.authenticate);

router.get('/logout', userController.logout);

module.exports = router;