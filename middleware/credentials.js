const { whiteList } = require('../config/corsOptions');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  //cross-domain
  //frontend need to include credentials option
  if (whiteList.includes(origin))
    res.header('Access-Control-Allow-Credentials', true);

  next();
};

module.exports = credentials;
