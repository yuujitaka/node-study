const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

//Route handlers: https://expressjs.com/en/guide/routing.html
const createNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: 'Username and password required.' });

  //check duplicates
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409);

  try {
    const hashed = await bcrypt.hash(pwd, 10);

    //create and store in mongoDB
    const result = await User.create({
      username: user,
      password: hashed,
    });

    console.log(result);

    res.status(201).json({ success: 'new user created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: 'Username and password required.' });

  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) return res.sendStatus(404);

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);
    const accesToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //Save refresh token in db
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    //secure doesn't work with thunder client
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accesToken });
  } else {
    res.sendStatus(401);
  }
};

const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    const roles = Object.values(foundUser.roles);

    const accesToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    res.json({ accesToken });
  });
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  //Delete refresh token in db
  foundUser.refreshToken = undefined;
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.sendStatus(204);
};

module.exports = { createNewUser, login, refreshAccessToken, logout };
