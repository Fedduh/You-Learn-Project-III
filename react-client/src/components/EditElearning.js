import React, { Component } from "react";
import elearningService from "../services/ElearningService";
import ErrorMessage from "./ErrorMessage.js";

import "./EditElearning.css";

class EditElearning extends Component {
  state = {
    currentUser: null,
    elearning: null,
    id: null,
    error: null,
    timeStart: "",
    question: "",
    showAddQuestion: false
  };

  ElearningService = new elearningService();

  componentDidMount() {
    this.setState({ id: this.props.id });
    this.setState({ currentUser: this.props.currentUser }); // not working?
    // load the elearning from db
    this.ElearningService.getOneElearningById(this.props.id)
      .then(elearning => {
        if (elearning.message) {
          this.setState({ error: elearning.message });
          return;
        }
        this.setState({ elearning: elearning });
        console.log(this.state.elearning);
        // load youtube object
        if (!window.YT) {
          // If not, load the script asynchronously
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          // onYouTubeIframeAPIReady will load the video after the script is loaded
          window.onYouTubeIframeAPIReady = this.loadVideo;

          console.log(window.YT);
        } else {
          // If script is already there, load the video directly
          this.loadVideo();
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  }

  loadVideo = () => {
    this.player = new window.YT.Player("youtube-player", {
      // options
      videoId: this.state.elearning.youtube_url,
      width: 640, // standard
      height: 390, // standard
      playerVars: {
        fs: 0, // disable fullscreen
        // controls: 0, // hide controls
        modestbranding: 1 // smaller logo
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange
      }
    });
  };

  onPlayerReady = e => {
    // e.target.playVideo();
    console.log("start playing");
  };

  onPlayerStateChange = e => {
    console.log(e.data);
    console.log(this.player);
    if (e.data === 2) {
      console.log("video is paused");
    }
    if (e.data === 1) {
      console.log("video is playing");

      console.log(this.player.getCurrentTime());
    }
  };

  pauseVideo = e => {
    this.player.pauseVideo();
  };

  // click events
  createQuestion = e => {
    console.log("pressed - create question");
    this.player.pauseVideo();
      this.setState({ showAddQuestion: true, timeStart: Math.ceil(this.player.getCurrentTime()) });
  };

  // form handlers
  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleNewFormSubmit = e => {
    e.preventDefault();
    this.ElearningService.addQuestion(this.props.id, this.state.question, this.state.timeStart)
      .then(elearningWithQuestions => {
        if (elearningWithQuestions.message) {
          this.setState({ error: elearningWithQuestions.message });
          return;
        }
        console.log("client", elearningWithQuestions);
        this.setState({ elearning: elearningWithQuestions });
        this.setState({ error: null });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  render() {
    return (
      <div>
        {this.state.error && <ErrorMessage error={this.state.error} />}
        {this.state.elearning && (
          <section>
            <h2>{this.state.elearning.title}</h2>
            <div className="youtube-player-div">
              <div id="youtube-player" className="youtube-video" />
            </div>

            {/* Button add question */}
            <div className="buttonOne" onClick={this.createQuestion}>
              add question
            </div>

            {/* start - show created questions */}
            {this.state.elearning.questions.length >= 1 && (
              <div className="question-container">
                {this.state.elearning.questions.map((question, index) => {
                  return (
                    <div key={question._id} className="question-bubble">
                      Q{index + 1}
                      <span>@ {question.timeStart} sec</span>
                    </div>
                  );
                })}
              </div>
            )}
            {/* end - show created questions */}

            {/* start - Add new question - form */}
            {this.state.showAddQuestion && (
              <form onSubmit={this.handleNewFormSubmit}>
                <label>Time start in seconds</label>
                <input
                  type="number"
                  name="timeStart"
                  required={true}
                  value={this.state.timeStart}
                  onChange={this.changeHandler}
                />
                <label>Question</label>
                <input
                  type="text"
                  name="question"
                  required={true}
                  // value={this.state.question}
                  onChange={this.changeHandler}
                />
                <button type="submit">save question</button>
              </form>
            )}
            {/* end - Add new question - form */}
          </section>
        )}
      </div>
    );
  }
}

export default EditElearning;
