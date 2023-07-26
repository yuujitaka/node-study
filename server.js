const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3500;

app.get('/', (req, res) => {
  //both ways
  //res.sendFile(path.join(__dirname, 'docs', 'test.txt'));
  res.sendFile('./docs/test.txt', { root: __dirname });
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile('./views/new.html', { root: __dirname });
});

//with expression
app.get('/regular-expression|/regex(.html)?', (req, res) => {
  res.sendFile('./views/new.html', { root: __dirname });
});

app.get('/old-page(.html)?', (req, res) => {
  //default is 302
  res.redirect(301, '/new-page.html');
});

//handlers

app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('attemped to load hello.html');
    next();
  },
  (req, res) => {
    res.send('Hello world!');
  }
);

const one = (req, res, next) => {
  console.log('one');
  next();
};

const two = (req, res, next) => {
  console.log('two');
  next();
};

const three = (req, res) => {
  res.send('Finished');
};

app.get('/chaning(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
  res.status(404).sendFile('./views/404.html', { root: __dirname });
});

app.listen(PORT, () => console.log(`server running on port ${PORT} `));
