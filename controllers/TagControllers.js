const Tag = require('../models/Tag')
const {trim, escape} = require('validator')
const { return0, return1, return2, return3 } = require('./_response')

exports.getTags = (req, res, next) => {
  Tag.find({}, '_id name', (err, result) => {
    if (err) 
      return next(err)
    const data = result.map(rs => ({id: rs._id, name: rs.name}))
    return return0(data, res)
  })
}

exports.changeTag = (req, res, next) => {
  let id = req.params.id
  id = trim(id)
  if (!id) {
    return return1('id不能为空', res)
  }
  switch (req.method) {
    case 'GET':
      Tag
        .findOne({_id: id})
        .populate('articles')
        .exec(function (err, result) {
          if (err) 
            return next(err)
          if (!result) {
            return2('id不存在', res)
          }
          res.json({code: 0, msg: '查找成功', data: result})
        }) 
    break;
    case 'PUT':
      const name = escape(trim(req.body.name))
      if (!name) {
        return1('name 不能为空', res)
      }
      Tag.findByIdAndUpdate(id, {'$set': {name: name}}, {'new': true}, (err, result) => {
        if (err) return next(err)
        if (!result) {
            return return2('id不存在', res)
        }
        res.json({
          code: 0,
          msg: '更新成功',
          data: result
        })
      })
      break;
      case 'DELETE':
        Tag.findByIdAndRemove(id, (err, result) => {
          if (err) return next(err)
          if (!result) {
            return2('id不存在', res)
        }
          res.json({
            code: 0,
            msg: '删除成功'
          })
        })
        break;
  }
}

exports.addTag = (req, res, next) => {
  const {name} = req.body
  console.log(name);
  const newname = escape(trim(name))
  if (!name) {
    return return1('缺少标签名', res)
  }
  Tag.findOne({
    name: newname
  }, (err, result) => {
    if (err) 
      return return3(res) // 如果找不到 result 返回 null。
    if (result) {
      return return1('标签已存在', res)
    } else {
      const tag = new Tag({name: newname})
      // tag.toJSON({virtuals: true})
      tag.save(function (err, result) {
        if (err) 
          return return3(res)
        res.json({code: 0, msg: '添加成功', data: result})
      })
    }
  })
}
