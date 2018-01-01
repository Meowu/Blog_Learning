const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  name: {type: String, required: true, min: 4, max: 20},
  email: {type: String, required: true},
  site: {type: String},
  content: {type: String, required: true, min: 6, max: 500},
  ups: {type: Number, default: 0},
  replyies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  options: Schema.Types.Mixed
})

module.exports = mongoose.model('Comment', CommentSchema)