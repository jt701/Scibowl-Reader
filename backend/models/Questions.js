const mongoose = require('mongoose');
const Schema = mongoose.Schema

const questionSchema = new mongoose.Schema({
    set: {
      type: Number,
      required: true
    },
    round: {
      type: Number,
      required: true
    },
    q_num: {
      type: Number,
      required: true
    },
    q_type: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    ans_type: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    computer_question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    computer_ans: {
      type: [String],
      required: true
    },
    ans_choices: {
      type: [String],
      required: false
    }
  }, {collection: 'questions'});

  module.exports = mongoose.model('Question', questionSchema);
