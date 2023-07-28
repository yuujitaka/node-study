const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const routerDocs = require('./routes/docs');
const routerViews = require('./routes/views');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);

//third party middleware
//Cross Origin Resource Sharing
const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/docs', express.static(path.join(__dirname, '/public')));

app.use('/', routerViews);
app.use('/docs', routerDocs);

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

app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile('./views/404.html', { root: __dirname });
  } else if (req.accepts('json')) {
    res.json({ err: '404 Not Found' });
  } else {
    res.type('text').send('404 Not Found');
  }
});

//error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT} `));
