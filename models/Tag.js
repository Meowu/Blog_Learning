const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tagSchema = new Schema({
  name: {type: String, required: true, min: 2, max: 16},
}, { timestamps: true})

module.exports = mongoose.model('Tag', tagSchema)