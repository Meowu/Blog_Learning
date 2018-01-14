const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  name: {type: String, required: true, min: 4, max: 36},
  email: {type: String, required: true},
  site: String,
  avatar: String,
  article: {type: Schema.Types.ObjectId, ref: 'Article'},
  content: {type: String, required: true, min: 6, max: 800},
  html_string: String,
  ups: {type: Number, default: 0},
  replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  options: Schema.Types.Mixed
})

module.exports = mongoose.model('Comment', CommentSchema)