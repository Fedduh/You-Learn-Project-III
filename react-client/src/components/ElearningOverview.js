import React, { Component } from "react";
import { Link } from "react-router-dom";
import ElearningService from "../services/ElearningService";
import "./ElearningOverview.css";

class ElearningOverview extends Component {
  state = {
    elearnings: null
  };

  elearningService = new ElearningService();

  componentDidMount() {
    this.elearningService.getAll().then(elearnings => {
      console.log(elearnings);
      this.setState({
        elearnings: elearnings
      });
    });
  }

  render() {
    return (
      <section className="Elearning-overview-section">
        <h2>Overview</h2>
        {this.state.elearnings && (
          <div className="Elearning-overview-container">
            {this.state.elearnings.map(elearning => {
              return (
                <div className="Elearning-overview-module" key={elearning._id}>
                  <Link to={`/play/${elearning._id}`}>
                    <h3>{elearning.title}</h3>
                    <img src={elearning.youtube_img} alt="elearning thumbnail" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  }
}

export default ElearningOverview;
