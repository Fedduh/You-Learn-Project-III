import React, { Component } from "react";
import elearningService from "../services/ElearningService";
import ErrorMessage from "./ErrorMessage.js";

class EditElearning extends Component {
  state = {
    currentUser: null,
    elearning: null,
    id: null,
    error: null
  };

  ElearningService = new elearningService();

  componentDidMount() {
    this.setState({ elearning: null }); // reset to make sure logout works
    this.setState({ id: this.props.id }); // not working?
    this.setState({ currentUser: this.props.currentUser });
    console.log("state", this.state.id);
    console.log("props", this.props.id);
    this.ElearningService.getOneElearningById(this.props.id)
      .then(elearning => {
        if (elearning.message) {
          this.setState({ error: elearning.message });
          return;
        } 
        this.setState({ elearning: elearning });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "something went wrong" });
      });
  }

  render() {
    return (
      <div>
        {this.state.error && <ErrorMessage error={this.state.error} />}
        {this.state.elearning && <h2>{this.state.elearning.title}</h2>}
      </div>
    );
  }
}

export default EditElearning;
