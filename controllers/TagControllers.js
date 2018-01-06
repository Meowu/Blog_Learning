const Tag = require('../models/Tag')
const { trim, escape } = require('validator')

exports.getTagsCount = (req, res ,next) => {
  Tag.find({}, '_id name counts', (err, result) => {
    if (err) return next(err)
    res.json({
      code: 1,
      msg: '查找成功',
      data: result
    })
  })
}