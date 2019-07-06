import React, { Component } from "react";
import { Link } from "react-router-dom";
import ElearningService from "../services/ElearningService";
import "./ElearningOverview.css";

class ElearningOverview extends Component {
  state = {
    elearnings: null,
    fullyLoaded: false,
    categories: null,
    categoryChosen: "x"
  };

  elearningService = new ElearningService();

  componentDidMount() {
    // Set e-learning modules
    this.elearningService
      .getThreeModules(this.state.elearnings ? this.state.elearnings.length : 0, this.state.categoryChosen)
      .then(elearnings => {
        this.setState({
          elearnings: elearnings
        });
      });
    // Set categories
    if (this.state.categories === null) { 
      this.elearningService.getCategories().then(categories => {
        this.setState({
          categories: categories
        });
      });
    }
  }

  showMoreResult = newCategoryInd => {
    this.elearningService
      .getThreeModules(this.state.elearnings ? this.state.elearnings.length : 0, this.state.categoryChosen)
      .then(elearnings => { 
        // no new results? Disable the load more button
        if (elearnings.length < 3) {
          this.setState({
            fullyLoaded: true
          });
        }
        // new category? Set new list. Otherwise append
        const newList = newCategoryInd ? elearnings : [...this.state.elearnings, ...elearnings];
        this.setState({
          elearnings: newList
        });
      });
  };

  limitText = (text, lengthOutput) => {
    // title longer than 65? Add "..." else return title
    const shortText = text.substring(0, lengthOutput);
    return text.length > lengthOutput ? text.substring(0, shortText.lastIndexOf(" ")) + " ..." : text;
  };

  setCategory = category => {
    if (category === this.state.categoryChosen) {
      return;
    }
    // new category
    this.setState(
      {
        elearnings: null,
        fullyLoaded: false,
        categoryChosen: category
      },
      // callback, after state is set:
      () => {
        this.showMoreResult(true);
      }
    );
  };

  render() {
    return (
      <section className="Elearning-overview-section">
        <h2>latest modules</h2>
        {this.state.categories && (
          <div className="dropdown">
            <h2 className="dropbtn">filter by category <span className="no-caps small-letter">&#x25BC;</span></h2>
            <div className="dropdown-content">
              {/* set all */}
              <p onClick={() => this.setCategory("x")} key={"x"}>
                - All categories -
              </p>
              {/* go through categories */}
              {this.state.categories.map(cat => {
                return (
                  <p onClick={() => this.setCategory(cat)} key={cat}>
                    {cat}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {this.state.elearnings && (
          <div className="Elearning-overview-container">
            {this.state.elearnings.map(elearning => {
              return (
                <div className="Elearning-overview-module" key={elearning._id}>
                  <Link to={`/play/${elearning._id}`}>
                    <h4>{this.limitText(elearning.title, 55)}</h4>

                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <img src={elearning.youtube_img} alt="elearning thumbnail" />
                        </div>
                        <div className=" flip-card-back">
                          <p className="no-caps">{this.limitText(elearning.youtube_description, 200)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <button
          className="buttonOne"
          disabled={this.state.fullyLoaded}
          onClick={() => this.showMoreResult(false)}
        >
          {this.state.fullyLoaded ? "no more results.." : "load more"}
        </button>
      </section>
    );
  }
}

export default ElearningOverview;
