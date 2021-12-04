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
      usertypeid: 0,
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
      userdetailtypeid: 0,
      userdetailtypename: "",
      communityid: 0,
      communityname: "",
      communityShow: [],
      modalIsOpen: false,
      modalEditIsOpen: false,
      tableUserDetail: [],
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
    this.selectUserType(dataUserType);
    this.selectCommunity(communityShow);
    this.loadUserDetail();
  };

  changeGender = (genderid) => {
    this.setState({ genderid: genderid });
  };

  changeUserType = (usertypeid) => {
    this.setState({ usertypeid: usertypeid });
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
    const { profilepic } = this.state;
    const { company } = this.state;
    const { location } = this.state;
    const { email } = this.state;
    const { password } = this.state;
    const { confirmpass } = this.state;

    if (
      phoneno == null ||
      name == null ||
      nickname == null ||
      company == null ||
      location == null ||
      email == null ||
      password == null ||
      confirmpass == null
    ) {
      alert(this.language.validation);
      return false;
    } else if (password != confirmpass) {
      alert(this.language.invalidpass);
      return false;
    } else {
      this.onSubmit();
    }
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
          profilepic: this.state.profilepic,
          dob: this.state.dob,
          businessqrcode: this.state.businessqrcode,
          company: this.state.company,
          location: this.state.location,
          email: this.state.email,
          jointime: this.state.jointime,
          issuspend: this.state.issuspend,
          password: this.state.password,
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
        console.log(error);
        alert(error);
      });
  };

  renderUserDetail() {
    return (
      <div className="form-detail">
        <div className="detail-title">User Detail</div>
        <div className="detail-info-input">
          <Button color="success" onClick={() => this.addNew()}>
            {this.globallang.add}
          </Button>
          <br></br>
          <br></br>
          <ReactTable
            data={this.state.tableUserDetail}
            columns={this.tableColumns}
            defaultPageSize={10}
            filtered={this.state.filtered}
            ref={(r) => (this.selectTable = r)}
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
          />
        </div>
      </div>
    );
  }

  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <div className="page-header">
          {this.language.modaltitle} <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <Label for="customerid">
                    {this.language.fieldcustomerid}
                  </Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="customerid"
                    id="customerid"
                    value={this.state.customerid}
                    placeholder={this.language.fieldcustomerid}
                    onChange={(event) =>
                      this.setState({ customerid: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="label">{this.language.fieldlabel}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="label"
                    id="label"
                    value={this.state.label}
                    placeholder={this.language.fieldlabel}
                    onChange={(event) =>
                      this.setState({ label: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="address">{this.language.fieldaddress}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="address"
                    id="address"
                    value={this.state.address}
                    placeholder={this.language.fieldaddress}
                    onChange={(event) =>
                      this.setState({ address: event.target.value })
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
                    width={200}
                    value={this.state.userdetailtypeid}
                    valueColumn={"usertypeid"}
                    showColumn={"usertypename"}
                    columns={["usertypename"]}
                    data={this.state.dataUserType}
                    onChange={this.changeUserDetailType}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="communityid">
                    {this.language.fieldcommunity}
                  </Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={200}
                    value={this.state.communityid}
                    valueColumn={"communityid"}
                    showColumn={"communityname"}
                    columns={["communityname"]}
                    data={this.state.communityShow}
                    onChange={this.changeCommunity}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.closeModal()}>
            {this.language.modalcancel}
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.addUserDetail()}>
            {this.language.modalsubmit}
          </Button>
        </div>
      </Modal>
    );
  }

  renderEditModal() {
    return (
      <Modal
        isOpen={this.state.modalEditIsOpen}
        onRequestClose={this.closeEditModal}
        style={customStyles}
      >
        <div className="page-header">
          {this.language.modaledittitle}{" "}
          <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <Label for="customerid">
                    {this.language.fieldcustomerid}
                  </Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="customerid"
                    id="customerid"
                    value={this.state.customerid}
                    placeholder={this.language.fieldcustomerid}
                    onChange={(event) =>
                      this.setState({ customerid: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="label">{this.language.fieldlabel}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="label"
                    id="label"
                    value={this.state.label}
                    placeholder={this.language.fieldlabel}
                    onChange={(event) =>
                      this.setState({ label: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="address">{this.language.fieldaddress}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="address"
                    id="address"
                    value={this.state.address}
                    placeholder={this.language.fieldaddress}
                    onChange={(event) =>
                      this.setState({ address: event.target.value })
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
                    width={200}
                    value={this.state.userdetailtypeid}
                    valueColumn={"usertypeid"}
                    showColumn={"usertypename"}
                    columns={["usertypename"]}
                    data={this.state.dataUserType}
                    onChange={this.changeUserDetailType}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="communityid">
                    {this.language.fieldcommunity}
                  </Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={200}
                    value={this.state.communityid}
                    valueColumn={"communityid"}
                    showColumn={"communityname"}
                    columns={["communityname"]}
                    data={this.state.communityShow}
                    onChange={this.changeCommunity}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.closeEditModal()}>
            {this.language.modalcancel}
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.editUserDetail()}>
            {this.language.modaledit}
          </Button>
        </div>
      </Modal>
    );
  }

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
                <td>
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
                    width={200}
                    value={this.state.usertypeid}
                    valueColumn={"usertypeid"}
                    showColumn={"usertypename"}
                    columns={["usertypename"]}
                    data={this.state.dataUserType}
                    onChange={this.changeUserType}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp; </td>
              </tr>
              <tr>
                <td>
                  <Label for="genderid">{this.language.fieldgender}</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={200}
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
                  <Label>{this.globallang.uploadpicture}</Label>
                </td>
                <td>
                  <PictureUploader
                    onUpload={this.onUploadImage}
                    picList={this.state.profilepic}
                    picLimit={1}
                  ></PictureUploader>
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
                  <Label for="businessqrcode">
                    {this.language.fieldqrcode}
                  </Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="businessqrcode"
                    id="businessqrcode"
                    placeholder="Temporary Business QR Code"
                    value={this.state.businessqrcode}
                    onChange={(event) =>
                      this.setState({ businessqrcode: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="company">{this.language.fieldcompany}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="company"
                    id="company"
                    placeholder="Company"
                    value={this.state.company}
                    onChange={(event) =>
                      this.setState({ company: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="location">{this.language.fieldlocation}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="location"
                    id="location"
                    placeholder="Company Location"
                    value={this.state.location}
                    onChange={(event) =>
                      this.setState({ location: event.target.value })
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
              <tr>
                <td>
                  <Label for="colleague">{this.language.fieldcolleague}</Label>
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <Input
                    type="checkbox"
                    name="colleague"
                    id="colleague"
                    checked={this.state.colleague}
                    onChange={(event) => this.colleagueHandleChecked(event)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          {this.renderUserDetail()}
          {this.renderModal()}
          {this.renderEditModal()}
        </div>
        <div className="form-button-container">
          <Button color="primary" onClick={() => this.checkData()}>
            {this.globallang.submit}
          </Button>
        </div>
      </div>
    );
  }
}
export default InputUser;
