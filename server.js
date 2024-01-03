const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { corsOptions } = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const { routerViews, routerEmployees, routerUsers } = require('./routes');
const express = require('express');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3500;

//connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

//built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', routerViews);
app.use('/users', routerUsers);

//waterfall... every route below will use verifyJWT
app.use(verifyJWT);
app.use('/employees', routerEmployees);

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

//only listen for requests if it's successfully connected to db
mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB');
  app.listen(PORT, () => console.log(`server running on port ${PORT} `));
});
