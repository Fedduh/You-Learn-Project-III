import React, { Component } from "react";
import elearningService from "../services/ElearningService";
import ErrorMessage from "./ErrorMessage";

import ElearningQuestionBubble from "./ElearningQuestionBubble";
import SingleQuestion from "./SingleQuestion";

import "./EditElearning.css";

class EditElearning extends Component {
  state = {
    currentUser: null,
    elearning: null,
    id: null,
    error: null,
    errorForm: null,
    showPreview: false,
    changeQuestionStatus: null, // null, 'edit', 'new'
    currentQuestion: {
      _id: "",
      timeStart: "",
      question: "",
      answer: "",
      answerfakes: ["", ""]
    }
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
    e.target.playVideo();
  };

  // playing? hide preview
  onPlayerStateChange = e => {
    if (e.data === 1) {
      // playing -> hide question / preview
      this.setState({ showPreview: false });
    }
  };

  pauseVideo = e => {
    this.player.pauseVideo();
  };

  // -- click events & event handlers - start -- //
  createQuestion = e => {
    // clicking  "create new question at this time"
    // pause and set timeStart equeal to video pause time
    this.player.pauseVideo();
    this.setState(prevState => ({
      changeQuestionStatus: "new",
      currentQuestion: {
        ...prevState.currentQuestion,
        _id: "",
        timeStart: Math.ceil(this.player.getCurrentTime()),
        question: "",
        answer: "",
        answerfakes: ["", "", ""]
      }
    }));
  };

  deleteQuestion = e => {
    this.ElearningService.deleteQuestion(this.state.id, this.state.currentQuestion)
      .then(elearningWithQuestions => {
        if (elearningWithQuestions.message) {
          this.setState({ error: elearningWithQuestions.message });
          return;
        }
        this.setState({
          elearning: elearningWithQuestions,
          error: null,
          changeQuestionStatus: null,
          showPreview: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  changeHandlerCurrentQuestion = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      currentQuestion: {
        ...prevState.currentQuestion, // keep all other key-value pairs
        [name]: value
      }
    }));
  };

  changeHandlerFakeAnswers = (index, e) => {
    const newValue = e.target.value;
    const updatedArray = [...this.state.currentQuestion.answerfakes];
    updatedArray[index] = newValue;
    this.setState(prevState => ({
      currentQuestion: {
        ...prevState.currentQuestion, // keep all other key-value pairs
        answerfakes: updatedArray
      }
    }));
  };
  // -- click events & event handlers - end -- //

  // -- show & submit forms - start - //
  showQuestionForm = question => {
    // go to timeStart (seekTo - true to also seek unbuffered) and pause there
    this.player.seekTo(question.timeStart, true);
    this.player.pauseVideo();
    // show preview question and edit form for this question
    this.setState({ changeQuestionStatus: "edit", currentQuestion: question, showPreview: true });
  };

  handleSubmit = e => {
    this.setState({
      errorForm: null
    });
    this.state.changeQuestionStatus === "new" ? this.handleNewFormSubmit(e) : this.handleEditFormSubmit(e);
  };

  handleNewFormSubmit = e => {
    e.preventDefault();
    this.ElearningService.addQuestion(this.state.id, this.state.currentQuestion)
      .then(elearningWithQuestions => {
        if (elearningWithQuestions.message) {
          this.setState({ error: elearningWithQuestions.message });
          return;
        }
        this.setState({
          elearning: elearningWithQuestions,
          error: null,
          changeQuestionStatus: null,
          showPreview: true // the current question is already in the state
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  handleEditFormSubmit = e => {
    e.preventDefault();
    console.log('handleEditForm' )
    this.ElearningService.editQuestion(this.state.id, this.state.currentQuestion)
      .then(elearningWithQuestions => {
        if (elearningWithQuestions.message) {
          this.setState({ error: elearningWithQuestions.message });
          return;
        }
        this.setState({
          elearning: elearningWithQuestions,
          error: null,
          changeQuestionStatus: null
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };
  // -- show & submit forms - start - //

  // -- fake answers - start - //
  addFakeAnswer = () => {
    var updatedArray = this.state.currentQuestion.answerfakes;
    switch (updatedArray.length) {
      case 0:
        updatedArray = [""];
        break;
      case 5:
        this.setState({
          errorForm: "maximum of 5 false answers"
        });
        break;
      default:
        updatedArray = [...this.state.currentQuestion.answerfakes, ""];
    }

    this.setState(prevState => ({
      currentQuestion: {
        ...prevState.currentQuestion,
        answerfakes: updatedArray
      }
    }));
  };

  deleteFakeAnswer = (e, index) => {
    e.preventDefault();
    const updatedArray = [...this.state.currentQuestion.answerfakes];
    updatedArray.splice(index, 1);
    this.setState(prevState => ({
      currentQuestion: {
        ...prevState.currentQuestion,
        answerfakes: updatedArray
      }
    }));
    this.setState({
      errorForm: null
    });
  };
  // -- fake answers - end - //

  handleSubmitAnswer = (e, answer) => {
    e.preventDefault();
    // no action (part of single question)
  };

  publishModule = (id, status) => {
    this.ElearningService.publishElearning(id, status)
      .then(result => {
        this.setState({ elearning: result });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  };

  cancelQuestion = () => {
    this.setState({
      changeQuestionStatus: null
    });
    this.player.playVideo();
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
              {/* Question screen */}
              {this.state.showPreview && (
                <SingleQuestion
                  currentQuestion={this.state.currentQuestion}
                  handleSubmitAnswer={this.handleSubmitAnswer}
                />
              )}
            </div>

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

            {/* Button add question */}
            <button className="buttonOne" onClick={this.createQuestion}>
              add question at current time
            </button>
            <button
              className="buttonOne buttonGreen"
              onClick={() => this.publishModule(this.state.elearning._id, this.state.elearning.status)}
            >
              {this.state.elearning.status === "private"
                ? "publish module to public"
                : "set module on private"}
            </button>
            <br />

            {/* start - Add or edit question - form */}
            {this.state.changeQuestionStatus &&
              (this.state.changeQuestionStatus === "new" ? (
                <h2>add new question</h2>
              ) : (
                <h2>edit question</h2>
              ))}

            {this.state.changeQuestionStatus && (
              <form onSubmit={this.handleSubmit} id="question-form">
                <label>time start in seconds</label>
                <input
                  type="number"
                  name="timeStart"
                  required={true}
                  value={this.state.currentQuestion.timeStart}
                  onChange={this.changeHandlerCurrentQuestion}
                />
                <label>question</label>
                <input
                  type="text"
                  name="question"
                  required={true}
                  value={this.state.currentQuestion.question}
                  onChange={this.changeHandlerCurrentQuestion}
                />
                <label>answer</label>
                <input
                  type="text"
                  name="answer"
                  required={true}
                  value={this.state.currentQuestion.answer}
                  onChange={this.changeHandlerCurrentQuestion}
                />
                <label>false answers</label>
                {this.state.currentQuestion.answerfakes &&
                  this.state.currentQuestion.answerfakes.map((answer, index) => (
                    <div key={index}>
                      <button className="buttonOne buttonRed" onClick={e => this.deleteFakeAnswer(e, index)}>
                        x
                      </button>
                      <input
                        className="input-inline"
                        required={true}
                        value={this.state.currentQuestion.answerfakes[index]}
                        type="text"
                        onChange={e => this.changeHandlerFakeAnswers(index, e)}
                      />
                    </div>
                  ))}
                {this.state.errorForm && <ErrorMessage error={this.state.errorForm} />}
                <div>
                  <button className="buttonOne" onClick={this.addFakeAnswer}>
                    add false answer option
                  </button>
                  <button className="buttonOne buttonGreen" type="submit">
                    save question
                  </button>
                  {/* If edit , show delete question */}
                  {this.state.changeQuestionStatus === "edit" && (
                    <button type="button" className="buttonOne buttonRed" onClick={this.deleteQuestion}>
                      delete question
                    </button>
                  )}
                  {/* cancel button */}
                  <button className="buttonOne buttonGrey" onClick={this.cancelQuestion}>
                    cancel
                  </button>
                </div>
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
