import React from "react";

const ElearningQuestionBubble = props => {
  var divStyle = {
    left: (props.question.timeStart / props.videoLength) * 100 + "%",
    position: "absolute"
  };

  return (
    <div
      key={props.question._id}
      className="question-bubble"
      style={divStyle}
      onClick={() => props.showQuestionForm(props.question)}
    >
      Q{props.index + 1}
      <span>
        @ {props.question.timeStart} sec
        <br />
        {Math.floor(props.question.timeStart / 60)} min {props.question.timeStart % 60} sec
      </span>
    </div>
  );
};

export default ElearningQuestionBubble;
