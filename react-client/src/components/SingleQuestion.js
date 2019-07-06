import React, { Component } from "react";
import ErrorMessage from "./ErrorMessage";
import AnswerExplanation from "./AnswerExplanation";

class SingleQuestion extends Component {
  state = {
    answerOptions: null,
    selectedAnswer: null
  };

  shuffleAnswers = () => {
    const answerOptions = [...this.props.currentQuestion.answerfakes, this.props.currentQuestion.answer];
    const shuffledAnswers = [];
    const answerLength = answerOptions.length;
    for (let i = 0; i < answerLength; i++) {
      var randomNr = Math.floor(Math.random() * answerOptions.length);
      shuffledAnswers.push(answerOptions[randomNr]);
      answerOptions.splice(randomNr, 1);
    }
    return shuffledAnswers;
  };

  setAnswers = () => {
    return [...this.props.currentQuestion.answerfakes, this.props.currentQuestion.answer];
  }

  handleRadioChange = e => {
    this.setState({
      selectedAnswer: e.target.value
    });
  };

  componentDidMount() {
    this.setState({
      answerOptions: this.shuffleAnswers()
    });
  }

  // needed for when you go to a different question
  // also needed for preview and save when editing questions (state is used)
  componentDidUpdate(prevProps) {
    // edit mode? no need to shuffle
    if (this.props.currentQuestion !== prevProps.currentQuestion && this.props.mode === "edit") {
      this.setState({
        answerOptions: this.setAnswers()
      });
      return;
    } 
    if (this.props.currentQuestion !== prevProps.currentQuestion) {
      this.setState({
        answerOptions: this.shuffleAnswers()
      });
    } 
  }

  render() {
    return (
      <div id="question-screen-youtube">
        <form onSubmit={e => this.props.handleSubmitAnswer(e, this.state.selectedAnswer)}>
          <h3>{this.props.currentQuestion.question}</h3>

          {this.state.answerOptions &&
            this.state.answerOptions.map((option, index) => {
              return (
                <div key={index}>
                  <label>
                    <input
                      className="radio-button"
                      type="radio"
                      name="answer-options"
                      value={option}
                      onChange={this.handleRadioChange}
                      checked={this.state.selectedAnswer === option}
                    />
                    {option}
                  </label>
                </div>
              );
            })}
          <button type="submit" className="buttonOne">
            save
          </button>
          {this.props.error && (
            <div>
              <ErrorMessage error={this.props.error} />
              <button className="buttonOne" type="button" onClick={this.props.playVideo}>
                continue
              </button>
            </div>
          )}
          {this.props.explanation && (
            <AnswerExplanation explanation={this.props.explanation} playVideo={this.props.playVideo} />
          )}
        </form>
      </div>
    );
  }
}

export default SingleQuestion;
