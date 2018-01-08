const router = require('express').Router()

const { addCategory } = require('../controllers/CategoryControll')

router.post('/new', addCategory)

module.exports = router