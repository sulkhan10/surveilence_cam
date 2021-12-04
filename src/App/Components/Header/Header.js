import React, { Component } from "react";
//import { Link, Redirect } from 'react-router-dom';
import DefaultUserImg from "../../../Assets/Images/user-default-image.png";
import { Typography } from "@mui/material";
import "./Header.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.language = getLanguage(activeLanguage, "header");
    this.state = {
      loginInfo: props.loginInfo,
      communityList: props.communityList,
      community: props.community,
      showCommunityOption: false,
      communityOptionJustOpen: false,
    };
  }

  componentDidMount = () => {
    document.addEventListener("click", this.eventDocumentClick);
  };
  componentWillUnmount() {
    document.removeEventListener("click", this.eventDocumentClick);
  }

  componentWillReceiveProps(props) {
    this.setState({
      loginInfo: props.loginInfo,
      community: props.community,
      communityList: props.communityList,
    });
  }

  eventDocumentClick = () => {
    if (this.state.showCommunityOption) {
      if (this.state.communityOptionJustOpen) {
        this.setState({ communityOptionJustOpen: false });
      } else {
        this.setState({ showCommunityOption: !this.state.showCommunityOption });
      }
    }
  };

  doToogleMenuProfile = () => {
    this.props.toogleMenuProfile();
  };

  doToogleCommunityOption = () => {
    //this.props.toogleCommunityOption();
    this.setState({
      showCommunityOption: !this.state.showCommunityOption,
      communityOptionJustOpen: true,
    });
  };

  doChangeCommunity = (community) => {
    if (community.communityid !== this.state.community.communityid) {
      this.props.changeCommunity(community);
    }
  };

  renderCommunityOption = () => {
    if (this.state.showCommunityOption) {
      return (
        <div className="select-community-option-container">
          {this.state.communityList.map((comm, i) => (
            <div
              key={comm.communityid}
              className="select-community-option"
              onClick={() => this.doChangeCommunity(comm)}
            >
              {comm.communityname}
            </div>
          ))}
        </div>
      );
    }
  };

  renderProfilePic = () => {
    if (
      this.state.loginInfo.profilepic === "" ||
      this.state.loginInfo.profilepic === undefined
    ) {
      return <img src={DefaultUserImg} alt="defaultpic" />;
    } else
      return <img src={this.state.loginInfo.profilepic} alt="profilepic" />;
  };

  render() {
    return (
      <div className="header-container">
        <div className="header-title">
          {" "}
          <img
            style={{
              width: 66,
              height: 60,
              // color: "#006432",
              // boxShadow:
              //   "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19",
            }}
            src={require("../../../Assets/Images/sss_logo.png")}
            alt="logo"
          />{" "}
          <Typography
            component="span"
            variant="subtitle1"
            style={
              (stylesListComent.inline,
              {
                color: "#006432",
                fontWeight: "bolder",
              })
            }
          >
            Smart Surveillance System
          </Typography>
        </div>
        <div
          className="header-profilepic"
          onClick={() => this.doToogleMenuProfile()}
        >
          <div className="header-profileimg">{this.renderProfilePic()}</div>
        </div>
        <div className="header-profilename">
          <Typography
            component="span"
            variant="subtitle2"
            style={
              (stylesListComent.inline,
              {
                color: "#006432",
                fontWeight: "bolder",
              })
            }
          >
            {this.state.loginInfo.name}
          </Typography>
        </div>
      </div>
    );
  }
}
export default Header;
