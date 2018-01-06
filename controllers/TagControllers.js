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

exports.getTag = (req, res, next) => {
  const { id } = req.params.tag
  Tag.findOne({_id: trim(id)}, (err, result) => {
    if (err) return next(err)
    res.json({})
  })
}