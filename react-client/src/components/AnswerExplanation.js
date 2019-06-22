import React from 'react';

const AnswerExplanation = (props) => {
  return ( 
    <div className="explanation">
      {props.explanation}
      <button type="button" onClick={props.playVideo}>Continue</button>
    </div>
   );
}
 
export default AnswerExplanation;