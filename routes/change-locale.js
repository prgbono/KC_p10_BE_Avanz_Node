var express = require('express');
var router = express.Router();

/* GET /change-locale:language*/
router.get('/:locale', function (req, res, next) {
  // Set cookie with the language that came in :locale
  const locale = req.params.locale;
  res.cookie('nodeapi-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 15 }); //EL nombre de la cookie lo definimos en el archivo de configutación de i18n, i18nConfig.js

  // Send back to the page the user were (referer)
  res.redirect(req.get('referer'));
});

module.exports = router;
