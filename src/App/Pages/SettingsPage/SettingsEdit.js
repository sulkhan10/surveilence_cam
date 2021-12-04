import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import CheckboxGroup from "../../Components/CheckboxGroup/CheckboxGroup";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SettingsEdit extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "inputadmin");
    this.state = {
      settingId: props.match.params.settingId,
      menus: "",
      status: "",
      MenusData: [{ value: "Marketplace", text: "Marketplace" }],
      statusData: [
        { value: "Internal", text: "Internal" },
        { value: "Global", text: "Global" },
        { value: "Internal & Global", text: "Internal & Global" },
      ],
    };
  }

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "settings_id.php",
        {
          settingId: this.state.settingId,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response);
        this.props.doLoading();
        this.setState({ settingId: response.data.record.settingId });
        this.setState({ menus: response.data.record.Menu });
        this.setState({ status: response.data.record.Status });
      })
      .catch((error) => {
        this.props.doLoading();

        alert(error);
      });
  };

  checkData = () => {
    const { menus } = this.state;
    const { status } = this.state;

    if (menus === "" || status === "") {
      alert("Data cannot be empty");
      return false;
    } else {
      this.onSubmit();
    }
  };

  onSubmit = () => {
    let params = {
      settingId: this.state.settingId,
      Menu: this.state.menus,
      Status: this.state.status,
    };
    // console.log(params);
    this.props.doLoading();
    axios
      .post(serverUrl + "settings_insert_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        alert(this.language.savesuccess);
        this.props.history.push("/panel/settings");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changeMenus = (menu) => {
    this.setState({ menus: menu });
  };

  changeStatus = (Status) => {
    console.log(Status);
    this.setState({ status: Status });
  };

  render() {
    return (
      <div>
        <div className="page-header">
          Add Settings Menu <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td width={200}>
                  <Label for="menus">Menu</Label>
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <SelectMultiColumn
                    disabled
                    width={"100%"}
                    value={this.state.menus}
                    valueColumn={"value"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.MenusData}
                    onChange={this.changeMenus}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td width={200}>
                  <Label for="status">Status</Label>
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.status}
                    valueColumn={"value"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.statusData}
                    onChange={this.changeStatus}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <div className="form-button-container">
            <Button
              color="secondary"
              onClick={() => this.props.history.push("/panel/settings")}
            >
              <FontAwesomeIcon icon="chevron-circle-left" />
              &nbsp;{this.globallang.cancel}
            </Button>
            &nbsp;&nbsp;
            <Button color="primary" onClick={() => this.checkData()}>
              <FontAwesomeIcon icon="save" />
              &nbsp;Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default SettingsEdit;
