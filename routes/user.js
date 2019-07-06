const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const mongoose = require("mongoose");

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);

// ==> add question answered to user <==
// body: answerGiven, score
// params: userid, answerid
router.post("/addanswer/:answerid", (req, res, next) => {
  async function addAnswerToUser() {
    try {
      // user valid?
      let user = await User.findOne({ _id: req.user._id });
      if (!user) {
        res.status(404).json({
          message: "user not found"
        });
        return;
      } 
      // already answered?
      const alreadyAnswered = user.questionsAnswered.find(answer => {
        return answer.questionId.equals(req.params.answerid);
      }); 
      if (alreadyAnswered) {
        const message = alreadyAnswered.score
          ? `already answered, your (correct) answer was "${alreadyAnswered.answerGiven}"`
          : `already answered - the answer is: "${alreadyAnswered.answer}", your answer was "${
              alreadyAnswered.answerGiven
            }"`;
        res.status(200).json({
          message: message
        });
        return;
      }
      // check if question is really in the elearing? check id's ....
      //     ||
      // to be done

      // add answer to user
      let updateUser = await User.findOneAndUpdate(
        {
          _id: req.user._id
        },
        {
          $push: {
            questionsAnswered: {
              $each: [
                {
                  elearningid: req.body.elearningid,
                  questionId: req.params.answerid,
                  answerGiven: req.body.answerGiven,
                  score: req.body.score,
                  answer: req.body.answer
                }
              ]
            }
          }
        },
        { new: true } // return object with added answers
      );
      // success
      res.status(200).json(updateUser);
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  addAnswerToUser();
});

module.exports = router;
