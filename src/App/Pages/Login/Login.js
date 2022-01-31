import React, { Component } from "react";
//import { Link, Redirect } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import "./Login.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Button, Typography } from "@mui/material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

var player = null;
// const client = new W3CWebSocket("ws://192.168.0.250:4000");
const client = new W3CWebSocket("ws://127.0.0.1:4000");
// const client = new W3CWebSocket("ws://192.168.0.107:4000");
class Login extends Component {
  constructor(props) {
    super(props);

    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "Login");

    this.state = {
      userPhone: "",
      userPassword: "",
      errorMessage: "",
    };

    //reset browser history
    //this.props.history.index=0;
    //this.props.history.length=1;
  }

  componentDidMount = () => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      this.sendRequest("startDiscovery");
    };
  };

  sendRequest = (method, params) => {
    client.send(
      JSON.stringify({
        method: method,
        params: params,
      })
    );
  };

  doLogin = () => {
    //this.props.history.replace({pathname:'/panel/dashboard', state:{loginInfo: { name: 'rusman', profilepic:""}}});
    if (this.state.userPhone === "") {
      alert(this.language.alertphoneno);
      return false;
    }
    if (this.state.userPassword === "") {
      alert(this.language.alertpassword);
      return false;
    }

    let param = {
      phone: this.state.userPhone,
      pass: this.state.userPassword,
    };
    let { match } = this.props;
    axios
      .post(serverUrl + "login.php", param, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        let data = response.data;
        if (data.status === "ok") {
          localStorage.setItem("loginInfo", JSON.stringify(data.record));
          this.props.history.replace({
            pathname: `${match.path}panel/dashboard`,
            state: { loginInfo: data.record },
          });
        } else {
          this.setState({ errorMessage: data.message, userPassword: "" });
        }
      })
      .catch((error) => {
        console.log(error);
        //alert(error);
      });
  };

  renderError = () => {
    if (this.state.errorMessage !== "") {
      return this.state.errorMessage;
    }
  };

  render() {
    return (
      <div className="login-container">
        <div className="login-box-container">
          <div className="logo">
            <img
              width="100"
              src={require("../../../Assets/Images/sss_logo.png")}
              alt="logo"
            />
          </div>

          <div
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
              color: "#006432",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            Smart Surveillance System
          </div>
          <div className="login-input">
            <input
              type="text"
              placeholder="Mobile phone number"
              value={this.state.userPhone}
              onChange={(event) =>
                this.setState({ userPhone: event.target.value })
              }
            />
          </div>
          <div className="login-input">
            <input
              type="password"
              placeholder={this.language["password"]}
              value={this.state.userPassword}
              onChange={(event) =>
                this.setState({ userPassword: event.target.value })
              }
            />
          </div>
          <div className="login-error">{this.renderError()}</div>
          <div className="button-container">
            <Button
              variant="contained"
              style={{ backgroundColor: "#2f881a", width: "100%" }}
              onClick={() => this.doLogin()}
              block
            >
              <Typography
                component="span"
                variant="subtitle2"
                style={
                  (stylesListComent.inline,
                  {
                    color: "#fff",
                    fontWeight: "bolder",
                  })
                }
              >
                {this.language["login"]}
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
