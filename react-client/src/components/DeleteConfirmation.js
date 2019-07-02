import React from 'react';
import ErrorMessage from "./ErrorMessage";

const DeleteConfirmation = (props) => {
  return ( 
    <div className="delete-confirmation-div">
      <ErrorMessage error={`Are you sure you want to delete this ${props.elearning.title}`} /> 
      <br />
      <button className="buttonOne buttonGreen" onClick={props.deleteYes}>yes, delete</button>
      <button className="buttonOne buttonRed" onClick={props.deleteNo}>no, cancel</button>
    </div>
   );
}
 
export default DeleteConfirmation;