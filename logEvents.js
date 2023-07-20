const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromisses = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, 'logs')))
      await fsPromisses.mkdir(path.join(__dirname, 'logs'));

    // also create a file if it doesn't exist, but not a directory
    await fsPromisses.appendFile(
      path.join(__dirname, 'logs', 'eventLog.txt'),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;
