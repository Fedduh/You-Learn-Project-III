import React, { Component } from "react";
import elearningService from "../services/ElearningService";
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
    answersGiven: [],
    errorAnswer: null,
    explanation: null
  };

  ElearningService = new elearningService();

  // (copy from editElearning.js)
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
        // load youtube object
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
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
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
    // e.target.style.touchAction = 'initial';
    e.target.playVideo();
  };

  onPlayerStateChange = e => {
    if (e.data === 1) {
      // playing -> hide question / preview
      this.setState({ showQuestion: false });
      this.calcTimeToNextQuestion();
    }
    if (e.data === 2) {
      // pausing / manual pause
      console.log("paused");
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
      console.log("remaining time is", remainingSeconds);
    };
    stopPlayingAt();
  };

  findNextQuestion = currentTime => {
    // (data is ordered by timeStart asc in mongoDB)
    return this.state.elearning.questions.find(question => {
      return question.timeStart > currentTime;
    });  
  };

  componentWillUnmount() {
    clearTimeout(this.timer);  
  }

  //--------------

  // pauseVideo = e => {
  //   this.player.pauseVideo();
  // };

  // playVideo = e => {
  //   this.player.playVideo();
  // }

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

  handleSubmitAnswer = (e, answer) => {
    e.preventDefault();
    // answer provided?
    if (answer === null) {
      this.setState({
        errorAnswer: "provide an answer"
      });
      return;
    }
    // loop answers
    const matchFound = this.state.answersGiven.find(answerGiven => {
      return answerGiven._id === this.state.currentQuestion._id;
    });
    // if already answered this question
    if (matchFound) {
      console.log(matchFound);
      this.setState({
        errorAnswer: "already answered this question",
        explanation: this.setExplanation(matchFound.score, matchFound.answer, matchFound.answerGiven)
      });
      return;
    }
    // else add answer given
    const score = answer === this.state.currentQuestion.answer ? 1 : 0;
    const updatedArray = [
      ...this.state.answersGiven,
      {
        _id: this.state.currentQuestion._id,
        score: score,
        answer: this.state.currentQuestion.answer,
        answerGiven: answer
      }
    ];
    const explanation = this.setExplanation(score, this.state.currentQuestion.answer, answer);
    this.setState({
      answersGiven: updatedArray,
      explanation: explanation,
      errorAnswer: null
    });
  };

  setExplanation = (score, answer, answerGiven) => {
    return score
      ? `You are correct! - the answer is ${answer}`
      : `False, the correct answer is ${answer} (your answer was ${answerGiven})`;
  };

  render() {
    return (
      <div>
        {this.state.error && <ErrorMessage error={this.state.error} />}
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
            {/* <div className="buttonOne" onClick={this.playOrPause}>
              {this.state.playerStatus === "paused" ? "play" : "pause"}
            </div> */}

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
