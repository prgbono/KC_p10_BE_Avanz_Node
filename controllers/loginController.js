// TODO: Manage controllers which are in folder routes
const User = require('./../models/User.js');
const jwt = require('jsonwebtoken');

class LoginController {
  /**
   * GET /login
   */
  index(req, res, next) {
    res.locals.email = '';
    res.locals.error = '';
    res.render('login', { title: 'NodePop BE Avanzado' });
  }

  /** TODO:
   * POST /login
   */

  /*
   * POST /api/authenticate
   */
  async loginApi(req, res, next) {
    try {
      const { email, pass } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPass(pass))) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        next(error);
        return;
      }
      // Correct credentials. Generate accessToken //TODO: check 5' expiration
      jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, accessToken) => {
          if (err) {
            next(err);
            return;
          }
          // send token to the client
          res.json({ accessToken });
        },
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LoginController();
