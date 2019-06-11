import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // needed for this.history.props

import ElearningService from "../services/ElearningService";
import ErrorMessage from "./ErrorMessage.js";
import moment from "moment";

class CreateNewElearning extends Component {
  state = {
    error_form_one: null,
    error_form_two: null,
    youtube_object_set: false,
    youtube_url: null,
    youtube_img: "",
    youtube_title: "",
    youtube_category: "",
    youtube_description: "",
    youtube_duration: "" // minutes
  };

  elearningService = new ElearningService();

  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmitUrl = e => {
    e.preventDefault();
    if (this.state.youtube_object_set) {
      this.setState({ error_form_one: "you already selected a video" });
      return;
    }
    console.log("sent", this.state);
    this.elearningService
      .getYoutubeSnippetByUrl(this.state.youtube_url)
      .then(result => {
        // if there is an error message
        if (result.message) {
          this.setState({ error_form_one: result.message });
          this.setState({ youtube_object_set: false });
          return;
        } else {
          // success
          document.getElementById("youtube_url").disabled = true;
          this.setState({ error_form_one: null });
          this.setState({ youtube_object_set: true }); // optional (!)
          this.setState({
            youtube_img: result.snippet.thumbnails.standard.url
          });
          this.setState({ youtube_title: result.snippet.title });
          this.setState({ youtube_category: result.snippet.categoryName });
          this.setState({
            youtube_description: result.snippet.description.substring(0, 500)
          });
          this.setState({
            youtube_duration: this.convertTimeToMinutes(result.contentDetails.duration)
          });
          console.log("received", result);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error_form_one: "something went wrong" });
      });
  };

  handleSubmitElearning = e => {
    e.preventDefault();
    this.elearningService
      .createNewElearning(this.state)
      .then(status => {
        if (status.message) {
          this.setState({ error_form_two: status.message });
          return;
        }
        // success
        this.setState({ error_form_two: null });
        this.redirectToElearning(status._id);
      })
      .catch(err => {
        console.log(err);
        this.setState({ error_form_two: "something went wrong" });
      });
  };

  redirectToElearning = id => {
    this.props.history.push(`/create/${id}`);
  };

  convertTimeToMinutes = timeInput => {
    // youtube returns a time format in ISO 8601 string
    // moment.duration converts this to an object. Within this object is a _data object
    const timeObject = moment.duration(timeInput);
    let duration = 1;
    // convert hours
    if (timeObject._data.hours > 0) {
      duration += timeObject._data.hours * 60;
    }
    duration += timeObject._data.minutes;
    return duration;
  };

  render() {
    return (
      <section>
        <h2>Create a new Elearning</h2>

        {/* Form 1 for checking URL and setting name */}
        <form onSubmit={this.handleSubmitUrl}>
          <label>youtube.com/watch?v=</label>
          <input id="youtube_url" name="youtube_url" type="text" onChange={this.changeHandler} />
          {this.state.error_form_one && <ErrorMessage error={this.state.error_form_one} />}
          <button type="submit">check video</button>
        </form>

        {/* Form 2 for showing and changing prefilled data */}
        {this.state.youtube_object_set && (
          <form onSubmit={this.handleSubmitElearning}>
            <h2>Details</h2>
            <img className="img-small" src={this.state.youtube_img} alt="preview elearning" />
            <label>Title*</label>
            <input
              name="youtube_title"
              type="text"
              onChange={this.changeHandler}
              value={this.state.youtube_title}
              required={true}
            />
            <label>Description</label>
            <textarea
              rows="5" // cols (width) is set to 100% in css
              overflow="auto"
              maxLength="500"
              name="youtube_description"
              onChange={this.changeHandler}
              value={this.state.youtube_description}
            />
            <label>Category</label>
            <input name="youtube_category" type="text" value={this.state.youtube_category} disabled={true} />
            <label>Video duration (minutes)</label>
            <input
              name="youtube_duration"
              type="number"
              value={this.state.youtube_duration}
              disabled={true}
            />
            {this.state.error_form_two && <ErrorMessage error={this.state.error_form_two} />}
            <button type="submit">create e-learning module</button>
          </form>
        )}
      </section>
    );
  }
}

// export default CreateNewElearning;
export default withRouter(CreateNewElearning);
