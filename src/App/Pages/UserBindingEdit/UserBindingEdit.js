import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import CheckboxGroup from "../../Components/CheckboxGroup/CheckboxGroup";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-30%",
    transform: "translate(-50%, -50%)",
  },
};

class UserBindingEdit extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "edituser");
    this.state = {
      phoneno: props.match.params.bindingid,
      name: "",
      nickname: "",
      genderid: "",
      gendername: "",
      profilepic: [],
      date: moment(),
      businessqrcode: "",
      company: "",
      location: "",
      email: "",
      issuspend: 0,
      password: "",
      colleague: false,
      dataGender: [],
      dataUserType: [],
      userdetailid: 0,
      tempuserdetailid: 0,
      customerid: "",
      label: "",
      address: "",
      userdetailtypeid: 0,
      userdetailtypename: "",
      communityid: 0,
      communityname: "",
      communityShow: [],
      modalIsOpen: false,
      tableUserDetail: [],
      tableDisplay: [],
      tableUserVehicle: [],
      uservehicleid: 0,
      plateno: "",
      vehicletypeid: 0,
      vehicletypeShow: [],
      uservehicletypeid: 0,
      modalUserVehicleIsOpen: false,
      bindingstatus: "",
      bindingacct: [],
      statusAccount: "",
      typeShow: [
        {
          typeID: 1,
          typeText: "The Owner",
        },
        { typeID: 2, typeText: "Not The Owner" },
        { typeID: 3, typeText: "Visitor" },
      ],
      typeID: 0,
    };
  }

  selectGender = (dataGender) => {
    axios
      .post(
        serverUrl + "gender_list.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ dataGender: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  selectCommunity = (communityShow) => {
    axios
      .post(
        serverUrl + "community_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ communityShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  loadUserDetail = () => {
    var userdet = window.localStorage.getItem("user_detail");
    var userdata = JSON.parse(userdet);

    if (userdata === null || userdata === "null") return false;

    let display = [];
    for (let i = 0; i < userdata.length; i++) {
      if (!userdata[i].isDeleted) display.push(userdata[i]);
    }

    this.setState({ tableUserDetail: userdata, tableDisplay: display });
  };

  updateDate = (dob) => {
    this.setState({ dob: dob });
  };

  colleagueHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ colleague: checked });
  }

  suspendHandleChange(e) {
    this.setState({
      issuspend: e.target.value,
    });
  }

  changeGender = (genderid) => {
    this.setState({ genderid: genderid });
  };

  changeUserType = (usertypeid) => {
    this.setState({ usertypeid: usertypeid });
  };

  changeVehicleType = (vehicletypeid) => {
    this.setState({ vehicletypeid: vehicletypeid });
  };

  changeUserDetailType = (
    userdetailtypeid,
    userdetailtypename,
    dataUserType
  ) => {
    var usertypes = this.state.dataUserType;

    for (var i = 0; i < usertypes.length; i++) {
      if (usertypes[i].usertypeid == userdetailtypeid) {
        userdetailtypeid = usertypes[i].usertypeid;
        userdetailtypename = usertypes[i].usertypename;
      }
    }

    this.setState({ userdetailtypeid: userdetailtypeid });
    this.setState({ userdetailtypename: userdetailtypename });
  };

  changeCommunity = (communityid, communityname) => {
    var communities = this.state.communityShow;

    for (var i = 0; i < communities.length; i++) {
      if (communities[i].communityid == communityid) {
        communityname = communities[i].communityname;
      }
    }

    this.setState({ communityid: communityid });
    this.setState({ communityname: communityname });
  };

  suspendHandleChange(e) {
    this.setState({
      issuspend: e.target.value,
    });
  }

  componentDidMount = (dataGender) => {
    localStorage.clear();
    this.selectGender(dataGender);
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_by_phoneno.php",
        {
          phoneno: this.state.phoneno,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response, logintype) => {
        this.props.doLoading();
        let tmp = [];
        if (response.data.record.profilepic !== "") {
          tmp.push(response.data.record.profilepic);
        }
        this.setState({ phoneno: response.data.record.phoneno });
        this.setState({ name: response.data.record.name });
        this.setState({ nickname: response.data.record.nickname });
        this.setState({ usertypeid: response.data.record.usertypeid });
        this.setState({ genderid: response.data.record.genderid });
        this.setState({ gendername: response.data.record.gendername });
        this.setState({ bindingstatus: response.data.record.bindingstatus });
        this.setState({ profilepic: tmp });
        this.setState({ bindingacct: response.data.record.acctbinding });
        this.setState({ dob: response.data.record.dob });
        this.setState({ businessqrcode: response.data.record.businessqrcode });
        this.setState({ company: response.data.record.company });
        this.setState({ location: response.data.record.location });
        this.setState({ statusAccount: response.data.record.statusAccount });
        this.setState({ email: response.data.record.email });
        this.setState({
          colleague: response.data.record.colleague === 1 ? true : false,
        });
        this.setState({ issuspend: response.data.record.issuspend });
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  onSubmit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_insert_update.php",
        {
          phoneno: this.state.phoneno,
          name: this.state.name,
          nickname: this.state.nickname,
          usertypeid: this.state.usertypeid,
          genderid: this.state.genderid,
          gendername: this.state.gendername,
          profilepic: this.state.profilepic,
          dob: this.state.dob,
          businessqrcode: this.state.businessqrcode,
          company: this.state.company,
          location: this.state.location,
          email: this.state.email,
          issuspend: this.state.issuspend,
          colleague: this.state.colleague,
          userdetail: this.state.tableUserDetail,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert(this.language.savesuccess);
        this.props.history.push("/panel/listuser");
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  doUpdateType = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_update_type.php",
        {
          phoneno: this.state.phoneno,
          statusAccount: this.state.statusAccount,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert(this.language.savesuccess);
        this.props.history.push("/panel/listuseraccount");
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  cancel = () => {
    this.props.history.push("/panel/listuseraccount");
  };

  renderBindingDetail = () => {
    if (this.state.bindingacct.length > 0) {
      return (
        <div className="form-detail">
          <div className="detail-title">User Account Binding List</div>
          <div className="detail-info-input">
            <table>
              <tbody>
                <tr>
                  <th>Debtor Account</th>
                  <th>Unitcode Acct</th>
                  <th>Bisnis ID Acct</th>
                </tr>
                {this.state.bindingacct.map((item) => (
                  <tr>
                    <td width={40} align="left">
                      {" "}
                      {item.debtoracct}{" "}
                    </td>
                    <td width={30} align="left">
                      {" "}
                      {item.unitcode}{" "}
                    </td>
                    <td width={30} align="left">
                      {" "}
                      {item.bisnisid}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  renderstatus = () => {
    if (this.state.bindingstatus === 0) {
      return (
        <Input
          type="text"
          name="status"
          id="status"
          value="Unlinked"
          readOnly
        />
      );
    } else {
      return (
        <Input type="text" name="status" id="status" value="Linked" readOnly />
      );
    }
  };

  changeTypeUser = (typeAkun) => {
    console.log(typeAkun);
    this.setState({ statusAccount: typeAkun });
  };

  renderAccount = () => {
    if (this.state.statusAccount === 1) {
      return (
        <SelectMultiColumn
          width={"100%"}
          value={this.state.statusAccount}
          valueColumn={"typeID"}
          showColumn={"typeText"}
          columns={["typeText"]}
          data={this.state.typeShow}
          onChange={this.changeTypeUser}
        />
        /* <Input
          type="text"
          name="status"
          id="status"
          value="The owner"
          readOnly
        /> */
      );
    } else if (this.state.statusAccount === 2) {
      return (
        // <Input
        //   type="text"
        //   name="status"
        //   id="status"
        //   value="Not the owner"
        //   readOnly
        // />
        <SelectMultiColumn
          width={"100%"}
          value={this.state.typeID}
          valueColumn={"typeID"}
          showColumn={"typeText"}
          columns={["typeText"]}
          data={this.state.typeShow}
          onChange={this.changeTypeUser}
        />
      );
    } else if (this.state.statusAccount === 3) {
      return (
        // <Input type="text" name="status" id="status" value="Visitor" readOnly />
        <SelectMultiColumn
          width={"100%"}
          value={this.state.typeID}
          valueColumn={"typeID"}
          showColumn={"typeText"}
          columns={["typeText"]}
          data={this.state.typeShow}
          onChange={this.changeTypeUser}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          User Binding Account <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td width={200}>
                  <Label for="phoneno">Mobile Phone</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="phoneno"
                    disabled="disabled"
                    id="phoneno"
                    value={this.state.phoneno}
                    onChange={(event) =>
                      this.setState({ phoneno: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="email">{this.language.fieldemail}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="email"
                    id="email"
                    value={this.state.email}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="name">{this.language.fieldname}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={this.state.name}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="gendername">Gender</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="gendername"
                    id="gendername"
                    value={this.state.gendername}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="status">Status</Label>
                </td>
                <td>{this.renderstatus()}</td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td width={200}>
                  <Label for="phoneno">User Account</Label>
                </td>
                <td>
                  {" "}
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.statusAccount}
                    valueColumn={"typeID"}
                    showColumn={"typeText"}
                    columns={["typeText"]}
                    data={this.state.typeShow}
                    onChange={this.changeTypeUser}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          {this.renderBindingDetail()}
          <br></br>
        </div>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.cancel()}>
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;Back
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.doUpdateType()}>
            <FontAwesomeIcon icon="save" />
            &nbsp;Update
          </Button>
        </div>
      </div>
    );
  }
}
export default UserBindingEdit;
