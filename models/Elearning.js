const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eLearningSchema = new Schema(
  {
    status: String,
    title: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    youtube_url: { type: String, required: true },
    youtube_img: String,
    youtube_description: String,
    youtube_duration: Number,
    youtube_duration_seconds: Number,
    youtube_category: String,
    // questions
    questions: [
      {
        timeStart: { type: Number },
        question: { type: String },
        answer: { type: String },
        answerfakes: { type: Array }
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Elearning = mongoose.model("Elearning", eLearningSchema);
module.exports = Elearning;
