require("dotenv").config();
const express = require("express");
const router = express.Router();
const Elearning = require("../models/Elearning");
const axios = require("axios");
const mongoose = require("mongoose");

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);

const checkAutorization = (user, elearningID) => {
  const userID = user ? user._id : null;
  // check validity ID
  if (!mongoose.Types.ObjectId.isValid(elearningID)) {
    console.log('eerste')
    return { code: 404, message: "elearning module not found" };
  }
  // check login status
  if (!userID) {
    return { code: 401, message: "you need to be logged in" };
  }
  // check user is authorized
  async function checkAutorization() {
    try {
      let elearning = await Elearning.findById(elearningID);
      if (!elearning) {
        console.log('tweede')
        return { code: 404, message: "elearning module not found" };
      }
      // objectId format. check match
      if (!elearning.creator.equals(userID)) {
        return {
          code: 401,
          message: "no access - you are not the creator of this e-learning module"
        };
      }
      // success
      return "ok";
    } catch (e) {
      console.log(e);
      return { code: 500, message: "something went wrong" };
    }
  }
  return checkAutorization();
};

// get top 3 elearnings
router.get("/find/:length/:cat", (req, res, next) => {
  // category set in filter? (default = "x")
  query =
    req.params.cat !== "x"
      ? { $and: [{ status: "published" }, { youtube_category: req.params.cat }] }
      : { status: "published" };
  // find next 3 results
  Elearning.find(query)
    .sort({ created_at: "desc" })
    .skip(parseInt(req.params.length, 10))
    .limit(3)
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      console.log(err);
    });
});

// POST - NEW module
router.post("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({ message: "you need to be logged in" });
    return;
  }

  const youtube_img = req.body.state.youtube_img;
  const youtube_title = req.body.state.youtube_title;
  const youtube_category = req.body.state.youtube_category;
  const youtube_description = req.body.state.youtube_description.trim().replace(/(\r\n|\n|\r)/gm, "");
  const youtube_url = req.body.state.youtube_url;
  const youtube_duration = req.body.state.youtube_duration;
  const youtube_duration_seconds = req.body.state.youtube_duration_seconds;
  const creator = req.user._id;

  // filled in required fields?
  if (youtube_title.length < 1 || youtube_url.length < 1) {
    return res.status(400).json({ message: "fill in all required fields" });
  }

  // check length title
  if (youtube_title.length > 100) {
    return res.status(400).json({ message: "title can be max 100 characters" });
  }

  async function checkAndCreate() {
    try {
      // check if name is already used
      const elearning = await Elearning.findOne({ title: youtube_title });
      if (elearning !== null) {
        res.status(400).json({ message: "this title is already used" });
        return;
      }
      const newElearning = new Elearning({
        status: "private",
        title: youtube_title.toLowerCase(),
        creator: creator,
        youtube_url: youtube_url,
        youtube_img: youtube_img,
        youtube_description: youtube_description,
        youtube_duration: youtube_duration,
        youtube_duration_seconds: youtube_duration_seconds,
        youtube_category: youtube_category
      });
      const addToDatabase = await newElearning.save();
      res.status(200).json(addToDatabase);
    } catch (e) {
      console.log(e);
      return { code: 500, message: "something went wrong" };
    }
  }

  checkAndCreate();
});

// retreive all unique categories for filter menu
router.get("/categories", (req, res, next) => {
  Elearning.find({ status: "published" })
    .distinct("youtube_category")
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(400).json({ message: "something went wrong" });
      console.log(err);
    });
});

// DELETE elearning module
router.post("/delete/:id", (req, res, next) => {
  async function deleteModuleFromUser() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> delete
      Elearning.findOneAndDelete({ _id: req.params.id }).then(deleteElearning => {
        res.status(200).json(deleteElearning);
      });
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  deleteModuleFromUser();
});

// PUBLISH
router.post("/create/:id/publish", (req, res, next) => {
  async function publishModuleFromUser() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> change publish state
      Elearning.findOneAndUpdate({ _id: req.params.id }, { status: req.body.status }, { new: true }).then(
        elearnings => {
          res.status(200).json(elearnings);
        }
      );
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }
  publishModuleFromUser();
});

// find elearnigns created by this user ID
router.get("/create", (req, res, next) => {
  if (req.user == null) {
    res.status(404).json({ message: "login first" });
    return;
  }
  const userID = req.user._id;
  Elearning.find({ creator: userID })
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
  async function editModuleFromUser() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> change publish state
      Elearning.findById(req.params.id).then(elearning => {
        res.status(200).json(elearning);
      });
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  editModuleFromUser();
});

// find one e-learning by ID for PLAYING
router.get("/play/:id", (req, res, next) => {
  // check login status
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "you need to be logged in" });
  }
  // variables needed
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
      // success
      res.status(200).json(elearning);
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }
  findElearning();
});

router.post("/create/:id/addquestion", (req, res, next) => {
  async function addQuestionToModule() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> add question
      let elearning = await Elearning.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $push: {
            questions: {
              $each: [
                {
                  question: req.body.questionObject.question,
                  timeStart: req.body.questionObject.timeStart,
                  answer: req.body.questionObject.answer,
                  answerfakes: req.body.questionObject.answerfakes
                }
              ],
              $sort: { timeStart: 1 } // sort all questions. Only to be used in conjunction with $each
            }
          }
        },
        { new: true } // return object with added question
      );
      res.status(200).json(elearning);
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  addQuestionToModule();
});

// Edit 1 question
router.post("/create/:id/editquestion/:idq", (req, res, next) => {
  async function editQuestionToElearning() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> edit question + sort again
      let elearning = await Elearning.findOneAndUpdate(
        {
          _id: req.params.id,
          "questions._id": req.params.idq
        },
        {
          $set: {
            "questions.$.question": req.body.questionObject.question,
            "questions.$.timeStart": req.body.questionObject.timeStart,
            "questions.$.answer": req.body.questionObject.answer,
            "questions.$.answerfakes": req.body.questionObject.answerfakes
          }
        },
        { new: true }
      );
      // sort (had to be seperate call, cannot be in 1 query)
      let sortquestions = await Elearning.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $push: {
            questions: {
              $each: [],
              $sort: { timeStart: 1 } // sort all questions. Only to be used in conjunction with $each
            }
          }
        },
        { new: true }
      );
      // returns the whole elearning object including questions added
      res.status(200).json(sortquestions);
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  editQuestionToElearning();
});

// delete 1 question
router.post("/create/:id/deletequestion/:idq", (req, res, next) => {
  async function deleteOneQuestionFromElearning() {
    try {
      const check = await checkAutorization(req.user, req.params.id);
      if (check !== "ok") {
        res.status(check.code).json(check);
        return;
      }
      // success -> change publish state
      let elearning = await Elearning.findByIdAndUpdate(
        {
          _id: req.params.id
        },
        {
          $pull: {
            questions: { _id: req.params.idq } // remove this item from array
          }
        },
        { new: true } // return object with edited question
      );
      res.status(200).json(elearning);
      // end.
    } catch (e) {
      res.status(500).json({ message: "something went wrong" });
      console.error(e);
    }
  }

  deleteOneQuestionFromElearning();
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
      res.status(500).json({ message: "something went wrong" });
      console.log(e);
    }
  }

  getDetailsByUrl();
});

module.exports = router;
