import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./MenuProfile.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";

class MenuProfile extends Component {
  constructor(props) {
    super(props);

    this.language = getLanguage(activeLanguage, "MenuProfile");

    this.state = {
      isOpen: props.isOpen,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ isOpen: props.isOpen });
  }

  doLogout = () => {
    this.props.onLogout();
  };

  renderMenuProfile() {
    if (this.state.isOpen) {
      return (
        <div className="menuprofile-container">
          <div className="menuprofile-link">
            <Link to={"/panel/profile"} className="none-decoration">
              {this.language["profile"]}
            </Link>
          </div>
          <div className="menuprofile-link">
            <Link to={"/panel/changepassword"} className="none-decoration">
              {this.language["changepassword"]}
            </Link>
          </div>
          <div
            className="menuprofile-link logout"
            onClick={() => this.doLogout()}
          >
            {this.language["logout"]}
          </div>
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderMenuProfile()}</div>;
  }
}
export default MenuProfile;
