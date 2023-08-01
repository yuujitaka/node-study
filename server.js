const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { routerViews, routerEmployees, routerUsers } = require('./routes');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);
app.use(cors(corsOptions));

//built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//serve static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', routerViews);
app.use('/employees', routerEmployees);
app.use('/users', routerUsers);

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
