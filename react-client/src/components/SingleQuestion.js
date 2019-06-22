import React, { Component } from "react";

class SingleQuestion extends Component {
  state = {
    answerOptions: null,
    selectedAnswer: null
  };

  shuffleAnswers = () => {
    const answerOptions = [...this.props.currentQuestion.answerfakes, this.props.currentQuestion.answer];
    const shuffledAnswers = [];
    const answeroptions = answerOptions.length;
    for (let i = 0; i < answeroptions; i++) {
      var randomNr = Math.floor(Math.random() * answerOptions.length);
      shuffledAnswers.push(answerOptions[randomNr]);
      answerOptions.splice(randomNr, 1);
    }
    return shuffledAnswers;
  };

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
  componentDidUpdate(prevProps) {
    if (this.props.currentQuestion !== prevProps.currentQuestion) {
      this.setState({
        answerOptions: this.shuffleAnswers()
      });
    }
  }

  render() { 
    return (
      <div id="question-screen-youtube">
        <form>
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
                    />
                    {option}
                  </label>
                </div>
              );
            })}
        </form>
      </div>
    );
  }
}

export default SingleQuestion;
