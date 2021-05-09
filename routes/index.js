var express = require('express');
var router = express.Router();

const asyncHandler = require('express-async-handler');
const adsProvider = require('../lib/adsProvider');

/* GET / -> homePage */
router.get(
  '/',
  // TODO: jwtAuth should be set here. Not set because not Login Page implemented. See ReadMe.
  asyncHandler(async function (req, res, next) {
    res.locals.ads = await adsProvider.getAds(req);
    res.render('index', { title: 'NodePop BE Avanzado' }); // We can set title as global in app.js (in fact, is commented)
  }),
);

module.exports = router;
