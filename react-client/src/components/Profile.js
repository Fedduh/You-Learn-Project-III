import React, { Component } from "react";

class Profile extends Component {
  state = {};
  render() {
    return (
      <div>
        <h2>Welcome {this.props.currentUser}</h2>
        <div>abc</div>
      </div>
    );
  }
}

export default Profile;
