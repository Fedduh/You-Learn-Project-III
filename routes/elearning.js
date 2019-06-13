require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const Elearning = require("../models/Elearning");
const axios = require("axios");
const mongoose = require("mongoose");

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// get top 9 elearnings
router.get("/", (req, res, next) => {
  Elearning.find()
    .limit(9)
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/", (req, res, next) => {
  // check login status
  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "you need to be logged in" });
  }

  const youtube_img = req.body.state.youtube_img;
  const youtube_title = req.body.state.youtube_title;
  const youtube_category = req.body.state.youtube_category;
  const youtube_description = req.body.state.youtube_description;
  const youtube_duration = req.body.state.youtube_duration;
  const youtube_url = req.body.state.youtube_url;

  const creator = req.user.username;

  // filled in required fields?
  if (youtube_title.length < 1 || youtube_url.length < 1) {
    return res.status(400).json({ message: "fill in all required fields" });
  }

  // check name unique
  Elearning.findOne({ title: youtube_title }).then(elearning => {
    if (elearning !== null) {
      res.status(400).json({ message: "this title is already used" });
      return;
    }

    // else -> title is unique. Create elearning
    const newElearning = new Elearning({
      title: youtube_title,
      creator: creator,
      youtube_url: youtube_url,
      youtube_img: youtube_img,
      youtube_description: youtube_description,
      youtube_duration: youtube_duration,
      youtube_category: youtube_category
    });

    newElearning
      .save()
      .then(() => {
        res.status(200).send(newElearning);
      })
      .catch(err => {
        res.status(400).json({ message: "something went wrong" });
        console.log(err);
      });
  });
});

// find elearnigns created by this user ID
router.get("/create", (req, res, next) => {
  if (req.user == null) {
    res.status(404).json({ message: "login first" });
    return;
  }
  const username = req.user.username;
  Elearning.find({ creator: username })
    .then(elearnings => {
      res.status(200).json(elearnings);
    })
    .catch(err => {
      res.status(400).json({ message: "something went wrong" });
      console.log(err);
    });
});

// find one e-learning by ID for editing
router.get("/create/:id", (req, res, next) => {
  // check login status
  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "you need to be logged in" });
  }
  // variables needed
  const username = req.user.username;
  const elearningId = req.params.id;
  // check validity ID
  if (!mongoose.Types.ObjectId.isValid(elearningId)) {
    res.status(404).json({ message: "incorrect URL" });
    return;
  }
  // check user is authorized
  async function findElearning() {
    try {
      let elearning = await Elearning.findById(elearningId);
      if (!elearning) {
        res.status(404).json({ message: "elearning module not found" });
        return;
      }
      if (elearning.creator !== username) {
        res.status(401).json({
          message: "no access - you are not the creator of this e-learning module"
        });
        return;
      }
      // success
      res.status(200).json(elearning);
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  findElearning();
});

router.post("/create/:id/addquestion", (req, res, next) => {
  // check login status
  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "you need to be logged in" });
  }

  // variables needed
  const username = req.user.username;
  const elearningId = req.params.id;

  // check ID again.. are you the owner?
  async function addQuestionToElearning() {
    try {
      let elearning = await Elearning.findOneAndUpdate(
        {
          _id: elearningId
        },
        {
          $push: {
            questions: {
              $each: [{question: req.body.question, timeStart: req.body.timeStart}], 
              $sort: { timeStart: 1 } // sort all questions. Only to be used in conjunction with $each
            }
          }
        },
        {new: true} // return object with added question
      );
      // these checks do not work.. are after update
      // if (!elearning) {
      //   res.status(404).json({ message: "elearning module not found" });
      //   return;
      // }
      // if (elearning.creator !== username) {
      //   res.status(401).json({
      //     message: "no access - you are not the creator of this e-learning module"
      //   });
      //   return;
      // }
      // success
      console.log("result is", elearning);
      // returns the whole elearning object including questions added
      res.status(200).json(elearning);
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  addQuestionToElearning(); 
});

// -- YOUTUBE -- //
// get details by url
router.post("/getdetailsbyurl", (req, res, next) => {
  async function getDetailsByUrl() {
    try {
      // find video on youtube
      let findVideo = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${req.body.youtube_url}&key=${
          process.env.YOUTUBE_KEY
        }&part=snippet,contentDetails`
      );
      // returns an array of items. Only take first hit
      const videoResult = findVideo.data.items[0];
      if (videoResult === undefined) {
        res.status(404).json({ message: "video not found or incorrect url" });
        return;
      }
      // find the category name of the ID and attach it
      let findCategory = await axios.get(
        `https://www.googleapis.com/youtube/v3/videoCategories?id=${videoResult.snippet.categoryId}&key=${
          process.env.YOUTUBE_KEY
        }&part=snippet`
      );
      const categoryName = findCategory.data.items[0].snippet.title;
      videoResult.snippet.categoryName = categoryName;
      // success -> return video object
      res.status(200).json(videoResult);
    } catch (e) {
      res.status(400).json({ message: "something went wrong" });
      console.error(e);
      // throw new Error('oh no');
    }
  }

  getDetailsByUrl();
});

module.exports = router;

// ARCHIVE
// router.post("/getnamebyurlOLD", (req, res, next) => {
//   axios
//     .get(
//       `https://www.googleapis.com/youtube/v3/videos?id=${
//         req.body.youtube_url
//       }&key=${process.env.YOUTUBE_KEY}&part=snippet`
//     )
//     .then(youtubeVideo => {
//       console.log(youtubeVideo.data);
//       // returns an array of items. Only take first hit
//       const videoResult = youtubeVideo.data.items[0];
//       if (videoResult === undefined) {
//         res.status(404).json({ message: "video not found" });
//         return;
//       }
//       // USE the youtube api to change category ID to name.
//       // check async await for a nice pattern here
//       // https://developers.google.com/youtube/v3/docs/videoCategories/list?apix_params=%7B%22part%22%3A%22snippet%22%2C%22id%22%3A%2228%22%7D#usage
//       res.status(200).json(videoResult);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(404).json({ message: "something went wrong" });
//     });
// });
