const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromisses = require('fs').promises;
const logEvents = require('./logEvents');
const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const serverFile = async (filePath, contentType, response) => {
  try {
    const data = await fsPromisses.readFile(filePath, 'utf-8');
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  const extension = path.extname(req.url);

  serverFile(req.url, 'text/html', res);
});

server.listen(PORT, () => console.log(`server running on port ${PORT} `));

/* myEmitter.on('log', (msg) => logEvents(msg));
myEmitter.emit('log', 'Log event 2!'); */
