import React from 'react';

const PasswordShower = (props) => {
  return ( 
    <label>{props.text} <span className="monkey" onClick={props.onClick}>{props.show === "password" ? "🙈" : "🙉"}</span></label>
   );
}
 
export default PasswordShower;