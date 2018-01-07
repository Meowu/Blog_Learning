const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 60
  },
  path: {  // seo optimize，used as url path of the article.
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
  likes: {
    type: Number,
    default: 0
  },
  cover: {
    type: String
  },
  markdown: {
    type: String
  },
  html_string: {
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
    default: 1  // 0 - 禁用，1 - 启用
  },
  disableComment: {
    type: Boolean,
    default: false
  },
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  summary: String,
  options: Schema.Types.Mixed
}, {timestamps: true})

module.exports = mongoose.model('Article', ArticleSchema)