import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = (props) => {
  return ( 
    <div className="error-message">{props.error}</div>
   );
}
 
export default ErrorMessage;