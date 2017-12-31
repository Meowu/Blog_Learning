const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 60
  },
  comments: {
    type: Array
  },
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
  content: {
    type: String
  },
  tags: {
    type: Array
  },
  category: String,
  status: {
    type: Number,
    default: 1
  },
  disableComment: {
    type: Boolean,
    default: false
  },
  summary: String
}, {
  timestamps: true
})

module.exports = new mongoose.model('Article', ArticleSchema)