import React, { Component } from "react";

class Profile extends Component {
  state = {};
  render() {
    return (
      <div>
        <h2>active modules</h2>
        <p>{this.props.currentUser}, you are currently working on these modules:</p>
        <p>Some module overview which has to be build</p>
      </div>
    );
  }
}

export default Profile;
