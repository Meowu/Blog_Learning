const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {type: String, min:2, max: 8},
  articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
}, { timestamps: true})

categorySchema.virtual('counts').get(function() {
  return this.articles.length
})

module.exports = mongoose.model('Category', categorySchema)