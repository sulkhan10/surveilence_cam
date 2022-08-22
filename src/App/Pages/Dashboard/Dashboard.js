import React, { Component } from "react";
//import { Link, Redirect } from 'react-router-dom';
import "./Dashboard.style.css";
import { Typography } from "@mui/material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    //console.log(props.community);
    this.state = {
      community: props.community,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({ community: props.community });
  };

  startloading = () => {
    this.props.doLoading();
    setTimeout(() => {
      this.props.doLoading();
    }, 5000);
  };

  render() {
    // const communityname =
    //   this.state.community.communityid === 0
    //     ? ""
    //     : this.state.community.communityname;
    return (
      <div>
        <div className="page-header">
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
            Dashboard
          </Typography>
          {/*<button type="button" onClick={()=>this.startloading()} >loading</button>*/}
          {/* <span className="communityname">{communityname}</span> */}
        </div>
      </div>
    );
  }
}
export default Dashboard;
