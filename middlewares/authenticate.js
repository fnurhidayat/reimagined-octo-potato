const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  try {
    const payload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY);

    req.headers.authorization = payload._id;
    next();
  } catch (err) {
    res.status(401).json({
      status: false,
      errors: 'Invalid Token',
    });
  }
}

module.exports = authenticate;
