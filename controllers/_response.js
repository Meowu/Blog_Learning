exports.return0 = (data, res) => {
  res.json({
    code: 0,
    message: '处理成功',
    data: data
  })
}

exports.return1 = (msg, res) => {
/** 
* The 422 (Unprocessable Entity) status code means the server
understands the content type of the request entity (hence a
415(Unsupported Media Type) status code is inappropriate), and the
syntax of the request entity is correct (thus a 400 (Bad Request)
status code is inappropriate) but was unable to process the contained
instructions.  For example, this error condition may occur if an XML
request body contains well-formed (i.e., syntactically correct), but
semantically erroneous, XML instructions.
*/
  res.status(422).json({
    code: 1,
    message: msg
  })
}

exports.return2 = (msg, res) => {
  res.status(404).json({
    code: 2,
    message: msg
  })
}

exports.return3 = (res) => {
  res.status(500).json({
    code: 3,
    message: '系统异常'
  })
}