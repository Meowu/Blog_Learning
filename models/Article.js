const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 60
  },
  path: {
    type: String,
    max: 100,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  page_views: {
    type: Number,
    default: 0
  },
  cover: {
    type: String
  },
  markdown: {
    type: String
  },
  html_text: {
    type: String
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  status: {
    type: Number,
    default: 1
  },
  disableComment: {
    type: Boolean,
    default: false
  },
  summary: String,
  options: Schema.Types.Mixed
}, {timestamps: true})

module.exports = mongoose.model('Article', ArticleSchema)