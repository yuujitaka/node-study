const express = require('express');
const router = express.Router();
const data = require('../model/employees.json');
const employeesController = require('../controllers/employeesController');

router
  .route('/')
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(demployeesController.eleteEmployee);

router.route('/:id').get(employeesController.getEmployee);

module.exports = router;
