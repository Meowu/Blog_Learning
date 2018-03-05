const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
const app = require('express')()
const {
  isEmpty,
  trim,
  escape,
  equals,
  isAlphanumeric,
  isEmail,
  normalizeEmail
} = require('validator')
const { return0, return1, return2 } = require('./_response')

exports.login = (req, res, next) => {
  const {email, password} = req.body
  if (isEmpty(email) || isEmpty(password)) {
    const err = new Error('Email or password is required.')
    res
      .status(401)
      .json({code: 0, msg: err})
  }
  console.log(email, password);
  Admin.findOne({
    email: normalizeEmail(email)
  }, '-_id -__v', (err, data) => { // selecting username and email fields.
    if (err) { // todo: query by email or username
      return return3(res)
    }
    if (!data) {
      return return1('用户不存在', res)
    } else {
      console.log(data);
      if (!equals(password, data.password)) {
        return return1('密码错误', res)
      } else {
        const payload = {
          admin: data.email
        }
        const token = jwt.sign(payload, 'Meowu', {
          expiresIn: 60*60*3
        })
        console.log(token);
        const user = {
          created_at: data.createdAt,
          updated_at: data.updatedAt,
          username: data.username,
          token: token,
          email: data.email
        }
        return return0(user, res)
      }
    }
  })
}

exports.signup = (req, res, next) => {
  const {username, email, password, password_again} = req.body
  console.log(isEmail(email));
  if (!username || isEmpty(username)) {
    return1('用户名不能为空', res)
  } else if (isEmpty(email)) {
    return1('邮箱不能为空', res)
  } else if (isEmpty(password)) {
    return1('密码不能为空', res)
  } else if (isEmpty(password_again)) {
    return1('请再次输入密码', res)
  } else if (!equals(password, password_again)) {
    return1('两次输入的密码不一致，请确认后再输入', res)
  } else if (!isAlphanumeric(username)) {
    return1('用户名只能包含字母数字', res)
  } else if (!isEmail(email)) {
    return1('请输入合法的邮箱。', res)
  } else {
    Admin
      .findOne({
        email: normalizeEmail(email)
      }, function (err, result) {
        if (err) 
          return next(err)
        if (result) {
          return1('邮箱已经被占用', res)
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

exports.changePassword = (req, res, next) => {
  const { email, password, new_password } = req.body
  Admin.findOne({email: email}, function (err, result) {
    if (err) return next(err)
    if(!result) {
      res.json({code: 0, msg: '该用户不存在。'})
    }
    if (result) {
      if (!equals(password, result.password)) {
        return1('旧密码错误', res)
      } else {
        Admin.update({email: email}, { $set: {password: new_password}}, function (err, result) {
          if (err) return next(err)
          res.json({code: 1, msg: '更改成功。'})
        })
      }
    }
  })
}