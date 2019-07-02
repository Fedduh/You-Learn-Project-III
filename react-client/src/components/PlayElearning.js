import React, { Component } from "react";
import LoginOrSignup from "./LoginOrSignup";
import elearningService from "../services/ElearningService";
import userService from "../services/UserService";
import ErrorMessage from "./ErrorMessage";
import SingleQuestion from "./SingleQuestion";
import ElearningQuestionBubble from "./ElearningQuestionBubble";

class PlayElearning extends Component {
  state = {
    currentUser: null,
    elearning: null,
    id: null,
    error: null,
    playerStatus: null,
    showQuestion: false,
    currentQuestion: null,
    errorAnswer: null,
    explanation: null
  };

  UserService = new userService();
  ElearningService = new elearningService();

  componentDidMount() {
    this.setElearning();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.currentUser !== prevProps.currentUser) {
      this.setElearning();
    }
  }

  // (copy from editElearning.js) (still in componentdidmount there)
  setElearning = () => {
    this.setState({ id: this.props.id, currentUser: this.props.currentUser });
    // load the elearning from db
    this.ElearningService.getOneElearningById(this.props.id)
      .then(elearning => {
        if (elearning.message) {
          this.setState({ error: elearning.message });
          return;
        }
        this.setState({ elearning: elearning });
        // load youtube object
        this.loadYoutubeObject(); 
        // remove errors
        this.setState({ error: null });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  loadYoutubeObject = () => {
    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = this.loadVideo;
    } else {
      // If script is already there, load the video directly
      this.loadVideo();
    }
  }

  loadVideo = () => {
    this.player = new window.YT.Player("youtube-player", {
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
    e.target.playVideo();
  };

  onPlayerStateChange = e => {
    if (e.data === 1) {
      // playing -> hide question / preview
      this.setState({ showQuestion: false });
      this.calcTimeToNextQuestion();
    }
    if (e.data === 2) {
      // pausing / manual pause -> clear timeout
      clearTimeout(this.timer);
    }
  };

  calcTimeToNextQuestion = () => {
    clearTimeout(this.timer);
    const currentTime = this.player.getCurrentTime();
    const NextQuestion = this.findNextQuestion(currentTime);
    // no next question
    if (!NextQuestion) {
      return;
    }
    // yes another question
    const playbackRate = this.player.getPlaybackRate();
    const remainingSeconds = (NextQuestion.timeStart - currentTime) / playbackRate;
    const stopPlayingAt = () => {
      this.timer = window.setTimeout(() => this.showQuestionForm(NextQuestion), remainingSeconds * 1000);
    };
    stopPlayingAt();
  };

  findNextQuestion = currentTime => {
    // (data is ordered by timeStart asc in mongoDB - so find first hit)
    return this.state.elearning.questions.find(question => {
      return question.timeStart > currentTime;
    });
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  playOrPause = () => {
    this.state.playerStatus === "playing" ? this.player.pauseVideo() : this.player.playVideo();
  };

  showQuestionForm = question => {
    // go to timeStart (seekTo - true to also seek unbuffered) and pause there
    this.player.seekTo(question.timeStart, true);
    this.player.pauseVideo();
    // show preview question and edit form for this question
    this.setState({ currentQuestion: question, showQuestion: true, errorAnswer: null, explanation: null });
  };

  // handle submit answer
  handleSubmitAnswer = (e, answerGiven) => {
    e.preventDefault();
    // answer provided?
    if (answerGiven === null) {
      this.setState({
        errorAnswer: "provide an answer"
      });
      return;
    }
    // score
    const score = answerGiven === this.state.currentQuestion.answer ? 1 : 0;
    // loop answers
    this.UserService.addAnswerToUser(
      this.state.elearning._id,
      this.state.currentQuestion._id,
      this.state.currentQuestion.answer,
      score,
      answerGiven
    ).then(user => {
      if (user.message) {
        this.setState({ errorAnswer: user.message, explanation: null });
        return;
      }
      // show explanation
      const explanation = this.setExplanation(score, this.state.currentQuestion.answer, answerGiven);
      this.setState({
        explanation: explanation,
        errorAnswer: null
      });
    });
  };

  setExplanation = (score, answer, answerGiven) => {
    return score
      ? `you are correct! - the answer is ${answer}`
      : `false, the correct answer is ${answer} (your answer was ${answerGiven})`;
  };

  render() {
    return (
      <div>
        {/* start - error handling or not logged in */}
        {this.state.error && <ErrorMessage error={this.state.error} />}
        {!this.state.currentUser && <LoginOrSignup setCurrentUser={this.props.setCurrentUser} />}
        {/* end - error handling or not logged in */}

        {this.state.elearning && (
          <section>
            <h2>Elearning module: {this.state.elearning.title}</h2>
            <div className="youtube-player-div">
              <div id="youtube-player" className="youtube-video" />
              {/* Question screen */}
              {this.state.showQuestion && (
                <div>
                  <SingleQuestion
                    currentQuestion={this.state.currentQuestion}
                    handleSubmitAnswer={this.handleSubmitAnswer}
                    error={this.state.errorAnswer}
                    explanation={this.state.explanation}
                    playVideo={this.playOrPause}
                  />
                </div>
              )}
            </div>

            {/* <button className="buttonOne" onClick={this.playOrPause}>
              {this.state.playerStatus === "paused" ? "play" : "pause"}
            </button> */}

            {/* start - show created questions */}
            {this.state.elearning.questions.length >= 1 && (
              <div className="question-container">
                {this.state.elearning.questions.map((question, index) => {
                  return (
                    <ElearningQuestionBubble
                      key={question._id}
                      question={question}
                      index={index}
                      showQuestionForm={this.showQuestionForm}
                      videoLength={this.state.elearning.youtube_duration_seconds}
                    />
                  );
                })}
              </div>
            )}
            {/* end - show created questions */}
          </section>
        )}
      </div>
    );
  }
}

export default PlayElearning;
