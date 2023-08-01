const data = require('../model/employees.json');

const getAllEmployees = (req, res) => {
  res.json(data);
};

const getEmployee = (req, res) => {
  res.json({ id: req.params.id });
};

const createNewEmployee = (req, res) => {
  res.status(201).json({
    firstname: req.body.firstname,
  });
};

const updateEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
  });
};

const deleteEmployee = (req, res) => {
  res.json({
    id: req.body.id,
  });
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
