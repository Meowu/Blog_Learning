const express = require('express')
const router = express.Router()
const qiniu = require('qiniu')


router.get('/', function(req, res, next) {
  const ACCESS_KEY = 'S1SMSH_uEUNqFPILQaiY1YWWtm_920Nan4Cs0Yyv'
  const SECRET_KEY = 'bj2gT5gxTS6z8HT_EkcNmMBjJIlwlLu6McwQRr84'
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
  const bucket = 'fanfou-gallery'
  
  const options = {
    scope: bucket,
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  const TOKEN =  putPolicy.uploadToken(mac)
  res.json({
    code: 0,
    message: '',
    token: TOKEN
  })
})

module.exports = router