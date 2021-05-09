var express = require('express');
var router = express.Router();

/* TODO: GET /my-ads. */
router.get('/', function (req, res, next) {
  res.render('my-ads', { title: 'NodePop BE Avanzado' });
});

module.exports = router;
