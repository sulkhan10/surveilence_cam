import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";

import "./ChangePassword.style.css";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "changepassword");
    this.state = {
      oldPass: "",
      newPass: "",
      confirmPass: "",
      phonenumber: "",
    };
  }

  doSubmit = () => {
    if (this.state.oldPass === "") {
      alert(this.language.emptyold);
      return false;
    }
    if (this.state.newPass === "") {
      alert(this.language.emptynew);
      return false;
    }
    if (this.state.newPass !== this.state.confirmPass) {
      alert(this.language.invalidconfirm);
      return false;
    }

    let param = {
      oldPass: this.state.oldPass,
      newPass: this.state.newPass,
      confirmPass: this.state.confirmPass,
      phonenumber: this.state.phonenumber,
    };

    this.props.doLoading();

    axios({
      method: "post",
      url: serverUrl + "changePassword.php",
      data: param,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((response) => {
        this.props.doLoading();
        let data = response.data;
        // console.log(data);
        if (data.status === "0001") {
          alert(data.message);
          this.setState({ oldPass: "", newPass: "", confirmPass: "" });
          // localStorage.removeItem("loginInfo");
          this.props.history.replace("/");
        } else {
          alert(this.language.failed + ", " + data.message);
          this.setState({ oldPass: "", newPass: "", confirmPass: "" });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
      });
  };

  componentDidMount = () => {
    let loginInfo = localStorage.getItem("loginInfo");
    if (
      loginInfo === undefined ||
      loginInfo === null ||
      loginInfo === "" ||
      loginInfo === "undefined" ||
      loginInfo === "null"
    ) {
      this.props.history.replace("/");
    } else {
      loginInfo = JSON.parse(loginInfo);
      console.log(loginInfo);
      this.setState({
        phonenumber: loginInfo.phoneno,
      });
    }
    //on enter event
  };

  render() {
    return (
      <div>
        <div className="page-header">{this.language.title}</div>
        <div className="box-container">
          <Form>
            <FormGroup>
              <Label for="old">{this.language.oldpassword} :</Label>
              <Input
                type="password"
                name="old"
                id="old"
                placeholder={this.language.oldpassword}
                value={this.state.oldPass}
                onChange={(event) =>
                  this.setState({ oldPass: event.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="new">{this.language.newpassword} :</Label>
              <Input
                type="password"
                name="new"
                id="new"
                placeholder={this.language.newpassword}
                value={this.state.newPass}
                onChange={(event) =>
                  this.setState({ newPass: event.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirm">{this.language.confirmpassword} :</Label>
              <Input
                type="password"
                name="confirm"
                id="confirm"
                placeholder={this.language.confirmpassword}
                value={this.state.confirmPass}
                onChange={(event) =>
                  this.setState({ confirmPass: event.target.value })
                }
              />
            </FormGroup>
            <div className="form-button-container">
              <Button color="primary" onClick={() => this.doSubmit()}>
                {this.globallang.submit}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
export default ChangePassword;
