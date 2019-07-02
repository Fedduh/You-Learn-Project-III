import React from "react";

const ErrorMessage = props => {
  return (
    <div>
      <div className="error-message">
        <span role="img" aria-label="exclamation">
          ❗
        </span>
        &nbsp;{props.error}
      </div>
      <br />
    </div>
  );
};

export default ErrorMessage;
