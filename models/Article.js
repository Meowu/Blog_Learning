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
  cover: String,
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

ArticleSchema.virtual('info').get(function () {
  return {
    id: this._id,
    title: this.title,
    path: this.path,
    page_views: this.page_views,
    cover: this.cover,
    summary: this.summary,
    likes: this.likes,
    tags: this.tags,
    category: this.category,
    comments_count: this.comments.length,
    post_date: this.createdAt
  }
})

module.exports = mongoose.model('Article', ArticleSchema)