import React from "react"; 

const ElearningQuestionBuble = props => {
  var divStyle = { 
    left:  ((props.question.timeStart / (props.videoLength * 60) ) * 100) + '%',
    position: 'absolute'
  }; 

  return (
    <div
      key={props.question._id}
      className="question-bubble"
      style={divStyle}
      onClick={() => props.showEditForm(props.question)}
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

export default ElearningQuestionBuble;
