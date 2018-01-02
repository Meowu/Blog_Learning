const Admin = require('../models/Admin')
const {
  isEmpty,
  trim,
  escape,
  equals,
  isAlphanumeric,
  isEmail,
  normalizeEmail
} = require('validator')

exports.login = (req, res, next) => {
  const {email, password} = req.body
  if (isEmpty(email) || isEmpty(password)) {
    const err = new Error('Email or password is required.')
    res
      .status(401)
      .json({code: 0, msg: err})
  }
  Admin.findOne({
    email: normalizeEmail(email)
  }, 'username email createdAt updatedAt', (err, data) => { // selecting username and email fields.
    if (err) { // todo: query by email or username
      return next(err)
    }
    if (!data) {
      res.json({code: 0, msg: '该用户不存在'})
    } else {
      if (!equals(password, data.password)) {
        res.json({code: 0, msg: '密码错误'})
      } else {
        res
          .status(200)
          .json({code: 1, msg: '查找成功', data: data})
      }
    }
  })
}

exports.signup = (req, res, next) => {
  const {username, email, password, password_again} = req.body
  console.log(isEmail(email));
  if (!username || isEmpty(username)) {
    res.json({code: 0, msg: '用户名不能为空'})
  } else if (isEmpty(email)) {
    res.json({code: 0, msg: '邮箱不能为空'})
  } else if (isEmpty(password)) {
    res.json({code: 0, msg: '密码不能为空'})
  } else if (isEmpty(password_again)) {
    res.json({code: 0, msg: '请再次输入密码'})
  } else if (!equals(password, password_again)) {
    res.json({code: 0, msg: '两次输入的密码不一致，请确认后再输入'})
  } else if (!isAlphanumeric(username)) {
    res.json({code: 0, msg: '用户名只能包含字母数字'})
  } else if (!isEmail(email)) {
    res.json({code:0, msg: '请输入合法的邮箱。'})
  } else {
    Admin
      .findOne({
        email: normalizeEmail(email)
      }, function (err, result) {
        if (err) 
          return next(err)
        if (result) {
          res.json({code: 0, msg: '邮箱已经被占用'})
        } else {
          const newAdmin = new Admin({username: trim(username), email: normalizeEmail(email), password: trim(password)})
          newAdmin.save(function (err, result) {
            if (err) 
              return next(err)
            res
              .status(200)
              .json({code: 1, msg: '注册成功'})
          })

        }
      })
  }
}