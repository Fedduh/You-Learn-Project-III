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
    showQuestion: false
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
    }
  };

  pauseVideo = e => {
    this.player.pauseVideo();
  };

  playOrPause = () => {
    this.state.playerStatus === "playing" ? this.player.pauseVideo() : this.player.playVideo();
  }

  showQuestionForm = question => {
      // go to timeStart (seekTo - true to also seek unbuffered) and pause there
      this.player.seekTo(question.timeStart, true);
      this.player.pauseVideo();
      // show preview question and edit form for this question
      this.setState({  currentQuestion: question, showQuestion: true });
  }

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
              {this.state.showQuestion && <SingleQuestion currentQuestion={this.state.currentQuestion} />}
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

//  // clear timeout
//   // var timeOutID;
//   if (this.timeOutID) {
//     console.log('clearing')
//     clearTimeout(this.timeOutID);
//   }
//   const currentTime = this.player.getCurrentTime();
//   const nextStop = this.state.nextQuestion.timeStart; // make a check for last question
//   // compare time to next question time
//   if (currentTime < nextStop) {
//     const playbackRate = this.player.getPlaybackRate();
//     const remainingSeconds = (nextStop - currentTime) / playbackRate;
//     const stopPlayingAt = () => {
//        this.timeOutID = window.setTimeout(() => this.pauseVideoForQuestion, remainingSeconds * 1000);
//        console.log('remaining time is', remainingSeconds)
//     }
//     stopPlayingAt();
//     // const stopPlayingAt = window.setTimeout(this.pauseVideoForQuestion, remainingSeconds * 1000);
//   }
// }
