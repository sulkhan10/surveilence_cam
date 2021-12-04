import React, { Component } from "react";
import { Button, Label, Input, Row, Col } from "reactstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import "react-datepicker/dist/react-datepicker.css";
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

class InputUser extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "inputuser");
    this.state = {
      phoneno: "",
      name: "",
      nickname: "",
      usertypeid: 1,
      ktp: "",
      unit: "",
      cluster: "",
      phoneowner: "",
      dataCluster: [],
      genderid: "",
      profilepic: [],
      dob: moment(),
      businessqrcode: "",
      company: "",
      location: "",
      email: "",
      jointime: moment(),
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
      userdetailtypeid: 1,
      userdetailtypename: "",
      communityid: 0,
      communityname: "",
      communityShow: [],
      modalIsOpen: false,
      modalEditIsOpen: false,
      tableUserDetail: [],
      userTypeShow: [
        { id: 1, display: "I'm The Owner" },
        { id: 2, display: "I'm Not The Owner" },
        { id: 3, display: "None of Above" },
      ],
    };

    this.tableColumns = [
      {
        Header: this.language.columncustomerid,
        headerStyle: { fontWeight: "bold" },
        accessor: "customerid",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnlabel,
        headerStyle: { fontWeight: "bold" },
        accessor: "label",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnaddress,
        headerStyle: { fontWeight: "bold" },
        accessor: "address",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnuserdetailtype,
        headerStyle: { fontWeight: "bold" },
        accessor: "userdetailtypename",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncommunity,
        headerStyle: { fontWeight: "bold" },
        accessor: "communityname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="warning"
              size="sm"
              onClick={() => this.doRowEdit(e.original, e.index)}
            >
              {this.globallang.edit}
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              {this.globallang.delete}
            </Button>
          </div>
        ),
      },
    ];

    this.addNew = this.addNew.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editUserDetail = this.editUserDetail.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }

  onUploadImage = (result) => {
    this.setState({ profilepic: result });
  };

  doRowEdit = (item, index) => {
    this.setState({ modalEditIsOpen: true });

    var test = window.localStorage.getItem("user_detail");
    var dig = JSON.parse(test);

    if (dig == null) {
      return false;
    }

    this.setState({
      customerid:
        dig[index].customerid === undefined ? "" : dig[index].customerid,
    });
    this.setState({
      address: dig[index].address === undefined ? "" : dig[index].address,
    });
    this.setState({
      userdetailtypeid:
        dig[index].userdetailtypeid === undefined
          ? 0
          : dig[index].userdetailtypeid,
    });
    this.setState({
      communityid:
        dig[index].communityid === undefined ? "" : dig[index].communityid,
    });
    this.setState({
      tempuserdetailid:
        dig[index].tempuserdetailid === undefined
          ? 0
          : dig[index].tempuserdetailid,
    });
  };

  doRowDelete = (tableUserDetail) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            var stat = tableUserDetail;
            var items = JSON.parse(localStorage.getItem("user_detail"));
            for (var i = 0; i < items.length; i++) {
              if (items[i].tempuserdetailid === stat.tempuserdetailid) {
                items.splice(i, 1);
              }
            }

            localStorage.setItem("user_detail", JSON.stringify(items));
            this.setState({ tableUserDetail: items });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeEditModal() {
    this.setState({ modalEditIsOpen: false });
  }

  addNew = () => {
    this.setState({ modalIsOpen: true });
    this.setState({ customerid: "" });
    this.setState({ label: "" });
    this.setState({ address: "" });
    this.setState({ userdetailtypeid: 0 });
    this.setState({ communityid: 0 });
  };

  addUserDetail = () => {
    const { customerid } = this.state;
    const { label } = this.state;
    const { address } = this.state;
    const { userdetailtypeid } = this.state;
    const { communityid } = this.state;

    if (
      customerid == "" ||
      label == "" ||
      address == "" ||
      userdetailtypeid == 0 ||
      communityid == 0
    ) {
      alert(this.language.validation);
      return false;
    } else {
      var dropd = this.state;
      var drophistory = JSON.parse(localStorage.getItem("user_detail")) || [];
      dropd.tempuserdetailid = drophistory.length + 1;
      drophistory.push(dropd);
      window.localStorage.setItem("user_detail", JSON.stringify(drophistory));
      this.closeModal();
      this.loadUserDetail();
    }
  };

  editUserDetail = () => {
    const { customerid } = this.state;
    const { label } = this.state;
    const { address } = this.state;
    const { userdetailtypeid } = this.state;
    const { communityid } = this.state;

    if (
      customerid == "" ||
      label == "" ||
      address == "" ||
      userdetailtypeid == 0 ||
      communityid == 0
    ) {
      alert(this.language.validation);
      return false;
    } else {
      var drophistory = JSON.parse(localStorage.getItem("user_detail")) || [];

      let usertypename = "";
      for (var i = 0; i < this.state.dataUserType.length; i++) {
        if (userdetailtypeid === this.state.dataUserType[i].usertypeid) {
          usertypename = this.state.dataUserType[i].usertypename;
          break;
        }
      }

      let communityname = "";
      for (var i = 0; i < this.state.communityShow.length; i++) {
        if (communityid === this.state.communityShow[i].communityid) {
          communityname = this.state.communityShow[i].communityname;
          break;
        }
      }

      for (var i = 0; i < drophistory.length; i++) {
        if (drophistory[i].tempuserdetailid == this.state.tempuserdetailid) {
          drophistory[i].customerid = customerid;
          drophistory[i].label = label;
          drophistory[i].address = address;
          drophistory[i].userdetailtypeid = userdetailtypeid;
          drophistory[i].userdetailtypename = usertypename;
          drophistory[i].communityid = communityid;
          drophistory[i].communityname = communityname;
          break;
        }
      }

      window.localStorage.setItem("user_detail", JSON.stringify(drophistory));
      this.closeEditModal();
      this.loadUserDetail();
    }
  };

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

  selectUserType = (dataUserType) => {
    axios
      .post(
        serverUrl + "usertype_list.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ dataUserType: response.data.records });
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

    this.setState({ tableUserDetail: userdata });
  };

  updateDate = (dob) => {
    this.setState({ dob: dob });
  };

  colleagueHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ colleague: checked });
  }

  componentDidMount = (dataGender, dataUserType, communityShow) => {
    localStorage.clear();
    this.selectGender(dataGender);
    // this.selectUserType(dataUserType);
    this.selectCommunity(communityShow);
    this.loadUserDetail();
  };

  changeGender = (genderid) => {
    this.setState({ genderid: genderid });
  };

  changeUserType = (usertypeid) => {
    this.setState({ usertypeid: usertypeid });
  };

  changeUserDetailType = (userdetailtypeid) => {
    this.setState({ userdetailtypeid: userdetailtypeid });
  };

  changeCommunity = (communityid, communityname, communityShow) => {
    var communities = this.state.communityShow;

    for (var i = 0; i < communities.length; i++) {
      if (communities[i].communityid == communityid) {
        communityid = communities[i].communityid;
        communityname = communities[i].communityname;
      }
    }

    this.setState({ communityid: communityid });
    this.setState({ communityname: communityname });
  };

  checkData = () => {
    const { phoneno } = this.state;
    const { name } = this.state;
    const { nickname } = this.state;
    const { genderid } = this.state;
    const { email } = this.state;
    const { password } = this.state;
    const { confirmpass } = this.state;

    if (
      phoneno === "" ||
      name === "" ||
      nickname === "" ||
      email === "" ||
      genderid === "" ||
      password === "" ||
      confirmpass === ""
    ) {
      alert(this.language.validation);
      return false;
    } else if (password != confirmpass) {
      alert(this.language.invalidpass);
      return false;
    } else {
      this.doCheckPhonenumber();
    }
  };

  doCheckPhonenumber = () => {
    let params = {
      phoneno: this.state.phoneno,
    };
    console.log(params);
    axios
      .post(serverUrl + "do_check_phone.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === "OK") {
          alert("Phone number already exists");
        } else {
          this.onSubmit();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onSubmit = () => {
    this.props.doLoading();
    let params = {
      phoneno: this.state.phoneno,
      name: this.state.name,
      nickname: this.state.nickname,
      usertypeid: this.state.usertypeid,
      genderid: this.state.genderid,
      dob: this.state.dob,
      email: this.state.email,
      password: this.state.password,
      dataCluster: this.state.dataCluster,
      phoneowner: this.state.phoneowner,
      ktp: this.state.ktp,
    };

    console.log(params);
    axios
      .post(serverUrl + "user_insert.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        alert(this.language.savesuccess);
        this.props.history.push("/panel/listuser");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  addClusterUnit = () => {
    let dataInfo = this.state.dataCluster;

    dataInfo.push({
      cluster: this.state.cluster,
      unit: this.state.unit,
    });

    console.log(dataInfo);
    this.setState({ dataCluster: dataInfo });
    this.setState({
      cluster: "",
      unit: "",
    });
  };

  removeCluter = (info) => {
    let tmp = [];
    this.state.dataCluster.map((item, i) => {
      if (item !== info) {
        tmp.push(item);
      }
    });
    this.setState({ dataCluster: tmp });
  };

  loadClusterInfo = () => {
    if (this.state.dataCluster.length > 0) {
      return (
        <>
          <div className="detail-info-list">
            <table>
              <tbody>
                {this.state.dataCluster.map((item, i) => (
                  <tr>
                    <td className="td-value">
                      <span>
                        Cluster: {item.cluster} Unit:{item.unit}
                      </span>
                    </td>
                    <td className="td-button">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.removeCluter(item)}
                        block
                      >
                        <FontAwesomeIcon icon="times-circle" />
                        &nbsp;Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  };

  renderKTP = () => {
    if (this.state.usertypeid === 1) {
      return (
        <>
          <tr>
            <td>
              <Label for="ktp">KTP/Passport</Label>
            </td>
            <td>
              <Input
                type="text"
                name="ktp"
                id="name"
                value={this.state.ktp}
                placeholder="Please enter your KTP/Passport"
                onChange={(event) => this.setState({ ktp: event.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td>
              <Label for="operational">Cluster & Unit</Label>
            </td>
            <td>
              <div className="detail-info-input">
                <Row>
                  <Col sm={4}>
                    <Input
                      type="text"
                      name="cluster"
                      id="cluster"
                      value={this.state.cluster}
                      placeholder="Please enter your cluster"
                      onChange={(event) =>
                        this.setState({ cluster: event.target.value })
                      }
                    />
                  </Col>
                  <Col sm={4}>
                    <Input
                      type="text"
                      name="unit"
                      id="unit"
                      value={this.state.unit}
                      placeholder="Please enter your unit"
                      onChange={(event) =>
                        this.setState({ unit: event.target.value })
                      }
                    />
                  </Col>
                  <Col sm={0.8}>
                    {" "}
                    <Button
                      color="success"
                      block
                      onClick={() => this.addClusterUnit()}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </Button>
                  </Col>
                </Row>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td>{this.loadClusterInfo()}</td>
          </tr>
          <tr>
            <td colSpan="2">&nbsp;</td>
          </tr>
        </>
      );
    } else if (this.state.usertypeid === 2) {
      return (
        <>
          <tr>
            <td>
              <Label for="ktp">Phone Number Owner</Label>
            </td>
            <td>
              <Input
                type="text"
                name="phoneowner"
                id="phoneowner"
                value={this.state.phoneowner}
                placeholder="Please enter phone number owner"
                onChange={(event) =>
                  this.setState({ phoneowner: event.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">&nbsp;</td>
          </tr>
        </>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          {this.language.title} <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td width={200}>
                  <Label for="phoneno">{this.language.fieldphone}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="phoneno"
                    id="phoneno"
                    placeholder="08xxxxxxxxxx"
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
                  <Label for="name">{this.language.fieldname}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={this.state.name}
                    placeholder={this.language.fieldname}
                    onChange={(event) =>
                      this.setState({ name: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="nickname">{this.language.fieldnickname}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="nickname"
                    id="nickname"
                    value={this.state.nickname}
                    placeholder={this.language.fieldnickname}
                    onChange={(event) =>
                      this.setState({ nickname: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="usertypeid">{this.language.fieldusertype}</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.usertypeid}
                    valueColumn={"id"}
                    showColumn={"display"}
                    columns={["display"]}
                    data={this.state.userTypeShow}
                    onChange={this.changeUserType}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              {this.renderKTP()}
              <tr>
                <td>
                  <Label for="genderid">{this.language.fieldgender}</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.genderid}
                    valueColumn={"genderid"}
                    showColumn={"gendername"}
                    columns={["gendername"]}
                    data={this.state.dataGender}
                    onChange={this.changeGender}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="dob">{this.language.fielddob}</Label>
                </td>
                <td>
                  <DatePicker
                    selected={this.state.dob}
                    onChange={this.updateDate}
                    className="date-picker"
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
                    placeholder={this.language.fieldemail}
                    onChange={(event) =>
                      this.setState({ email: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="password">{this.language.fieldpassword}</Label>
                </td>
                <td>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={this.language.fieldpassword}
                    value={this.state.password}
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="confirmpassword">
                    {this.language.fieldconfirmpass}
                  </Label>
                </td>
                <td>
                  <Input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder={this.language.fieldconfirmpass}
                    value={this.state.confirmpass}
                    onChange={(event) =>
                      this.setState({ confirmpass: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
            </tbody>
          </table>
          <br></br>
        </div>
        <div className="form-button-container">
          <Button
            color="secondary"
            onClick={() => this.props.history.push("/panel/listuser")}
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
    );
  }
}
export default InputUser;
