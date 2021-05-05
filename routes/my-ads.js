var express = require('express');
var router = express.Router();

/* TODO: GET /my-ads. */
router.get('/', function (req, res, next) {
  // This will send a response without a view
  // res.send('This will be My Ads page');

  res.render('my-ads', { title: 'NodePop BE Avanzado' });
});

module.exports = router;
