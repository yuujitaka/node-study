const Employee = require('../model/Employee');

//Route handlers:https://expressjs.com/en/guide/routing.html
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (employees) return res.status(204).json({ message: 'No employee found' });

  res.json(employees);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'Employee id required' });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  res.json(employee);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname)
    return res.status(400).json({ message: 'Fist and last name required' });

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (e) {
    console.error(e);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID parameter is required' });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: 'Employee id required' });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) return res.status(204).json({ message: 'Employee not found' });

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
