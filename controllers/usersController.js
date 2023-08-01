const path = require('path');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const createNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: 'Username and password required.' });

  const duplicate = usersDB.users.find((person) => person.username === user);

  if (duplicate) return res.sendStatus(409);

  try {
    const hashed = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashed };
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    res.status(201).json({ success: 'new user created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: 'Username and password required.' });

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(404);

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    res.json({ success: 'logged in' });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { createNewUser, login };
