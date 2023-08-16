const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    question_stats: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: false
      },
}, {collection: 'users'})

module.exports = mongoose.model('User', userSchema)
