const mongoose = require('mongoose')
const Article = require('./Article')

const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {type: String, min:2, max: 24},
}, { timestamps: true})

module.exports = mongoose.model('Category', categorySchema)