const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router
  .post('/register', userController.createNewUser)
  .post('/login', userController.login)
  .get('/refreshToken', userController.refreshAccessToken)
  .get('/logout', userController.logout);

module.exports = router;
