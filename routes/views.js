const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile('/views/index.html', { root: path.join(__dirname, '..') });
});

router.get('/new-page(.html)?', (req, res) => {
  res.sendFile('/views/new.html', { root: path.join(__dirname, '..') });
});

//with expression
router.get('/regular-expression|/regex(.html)?', (req, res) => {
  res.sendFile('/views/new.html', { root: path.join(__dirname, '..') });
});

router.get('/old-page(.html)?', (req, res) => {
  //default is 302
  res.redirect(301, '/new-page.html');
});

module.exports = router;
