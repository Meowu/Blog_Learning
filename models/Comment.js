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

// Only non-virtual properties work as part of queries and for field selection. Since virtuals are not stored in MongoDB, you can't query with them.
CommentSchema.virtual('info').get(function() {
  return {
    id: this._id,
    name: this.name,
    site: this.site,
    avatar: this.avatar,
    content: this.html_string,
    ups: this.ups,
    replies: this.replies
  }
})
CommentSchema.virtual('counts').get(function () {
  return this.replies.length
})
module.exports = mongoose.model('Comment', CommentSchema)