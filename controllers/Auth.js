const jwt = require('jsonwebtoken')
exports.auth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, 'Meowu', function(err, decoded) {
      if (err) {
        return res.status(200).json({code: 1, message: 'Authenticate Error'})
      } else {
        next()
      }
    })
  } else {
    return res.status(200).send({
      code: 1,
      message: 'No Token'
    })
  }
}