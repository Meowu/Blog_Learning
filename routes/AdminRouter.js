const router = require('express').Router()
const { login, signup, changePassword } =  require('../controllers/AdminController')

router.post('/login', login)
router.post('/signup', signup)
router.put('/password', changePassword)

module.exports = router