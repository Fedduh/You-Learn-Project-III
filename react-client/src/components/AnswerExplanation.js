import React from "react";

const AnswerExplanation = props => {
  return (
    <div>
      <div className="explanation">{props.explanation}</div>
      <button className="buttonOne" type="button" onClick={props.playVideo}>
        continue
      </button>
    </div>
  );
};

export default AnswerExplanation;
