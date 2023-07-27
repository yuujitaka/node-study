const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromisses = require('fs').promises;
const path = require('path');

const logEvents = async (message, file) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    // the two dots refer to a folder outside middleware folder
    if (!fs.existsSync(path.join(__dirname, '..', 'logs')))
      await fsPromisses.mkdir(path.join(__dirname, '..', 'logs'));

    // also creates a file if it doesn't exist, but not a directory
    await fsPromisses.appendFile(
      path.join(__dirname, '..', 'logs', file ?? 'eventLog.txt'),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`);
  next();
};

module.exports = { logger, logEvents };
