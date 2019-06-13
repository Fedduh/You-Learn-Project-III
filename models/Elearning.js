const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eLearningSchema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: String, required: true },
    youtube_url: { type: String, required: true },
    youtube_img: String,
    youtube_description: String,
    youtube_duration: Number,
    youtube_category: String,
    // questions
    questions: [{ timeStart: Number, question: String }]
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
