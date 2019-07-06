const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: String,
  questionsAnswered: [
    {
      elearningid: {type: mongoose.Schema.Types.ObjectId, ref: 'Elearning'},
      questionId: {type: mongoose.Schema.Types.ObjectId},
      answerGiven: String,
      score: Number,
      answer: String
    }
  ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
