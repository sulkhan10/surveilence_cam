import React, { Component } from "react";
//import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import { Button } from "reactstrap";
import { serverUrl } from "../../../config.js";

import "./Login.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";

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
              src={require("../../../Assets/Images/CaptivaChevyClub.png")}
              alt="logo"
            />
          </div>
          <div
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              color: "#006432",
              justifyContent: "center",
              marginBottom: 6,
            }}
          >
            CAPTIVA CHEVY CLUB
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
            Connecting Estate Community
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
            <Button color="primary" onClick={() => this.doLogin()} block>
              {this.language["login"]}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
