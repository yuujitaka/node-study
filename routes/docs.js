const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  //both ways
  //res.sendFile(path.join(__dirname, "..", 'docs', 'test.txt'));
  res.sendFile('/docs/test.txt', { root: path.join(__dirname, '..') });
});

module.exports = router;
