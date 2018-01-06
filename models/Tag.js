const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tagSchema = new Schema({
  name: {type: String, required: true, min: 2, max: 16},
  articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
  options: Schema.Types.Mixed
}, { timestamps: true})

tagSchema.virtual('counts').get(function () {
  return this.articles.length
})
module.exports = mongoose.model('Tag', tagSchema)