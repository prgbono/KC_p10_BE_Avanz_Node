const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Pick token up from headers, url or body
  const tokenFromClient =
    req.get('Authorization') || req.query.token || req.body.token;

  // check token
  if (!tokenFromClient) {
    const error = new Error('Access token not provided');
    error.status = 401;
    next(error);
    return;
  }

  jwt.verify(tokenFromClient, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      err.status = 401;
      next(err);
      return;
    }
    // send userId to the next middleware which probably will need it
    req.apiAuthUserId = payload._id;
    next();
  });
};
