import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-20%",
    transform: "translate(-50%, -50%)",
  },
};

class UserAccountList extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listuser");
    this.state = {
      tableData: [],
      filter: "",
      modalIsOpen: false,
      userbinding: "",
      UserName: "",
      Password: "",
      typeId: "",
      typeShow: [
        { id: 1, display: "The Owner" },
        { id: 2, display: "Not The Owner" },
        { id: 3, display: "Visitor" },
      ],
    };

    this.addNew = this.addNew.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.tableColumns = [
      {
        Header: "No",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: "Mobile Phone",
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Email",
        headerStyle: { fontWeight: "bold" },
        accessor: "email",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Gender",
        headerStyle: { fontWeight: "bold" },
        accessor: "gendername",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "KTP",
        headerStyle: { fontWeight: "bold" },
        accessor: "ktp",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Cluster & Unit",
        headerStyle: { fontWeight: "bold" },
        accessor: "clusterInfo",
        style: { textAlign: "center" },
        Cell: (e) => <span>{this.clusterInfo(e.original.clusterInfo)}</span>,
        width: 200,
      },
      {
        Header: "User Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "statusAccount",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.statusAccount === 1 ? (
            <span style={{ color: "#000" }}>The Owner</span>
          ) : e.original.statusAccount === 2 ? (
            <span style={{ color: "#000" }}>Not The Owner</span>
          ) : (
            <span style={{ color: "#000" }}>Visitor</span>
          ),
      },
      {
        Header: "Phone Owner ",
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneowner",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Status Binding",
        headerStyle: { fontWeight: "bold" },
        accessor: "isbinding",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.isbinding === 0 ? (
            <span style={{ color: "#ff9800", fontWeight: "bold" }}>
              Unlinked
            </span>
          ) : (
            <span style={{ color: "#2196F3", fontWeight: "bold" }}>Linked</span>
          ),
      },
      {
        Header: "Platform",
        headerStyle: { fontWeight: "bold" },
        accessor: "platform",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.statusAccount === 2 || e.original.statusAccount === 3 ? (
            <div>
              <Button color="secondary" size="sm">
                <FontAwesomeIcon icon="link" />
                &nbsp;Binding
              </Button>
              &nbsp;
              <Button
                color="info"
                size="sm"
                onClick={() => this.doRowEdit(e.original)}
              >
                <FontAwesomeIcon icon="pen-square" />
                &nbsp;View
              </Button>
            </div>
          ) : e.original.statusAccount === 1 && e.original.isbinding === 1 ? (
            <div>
              <Button
                color="danger"
                size="sm"
                onClick={() => this.doRowUnBinded(e.original)}
              >
                <FontAwesomeIcon icon="link" />
                &nbsp;Unbind
              </Button>
              &nbsp;
              <Button
                color="info"
                size="sm"
                onClick={() => this.doRowEdit(e.original)}
              >
                <FontAwesomeIcon icon="pen-square" />
                &nbsp;View
              </Button>
            </div>
          ) : (
            <div>
              <Button
                color="secondary"
                size="sm"
                // onClick={() => this.addNew(e.original)}
              >
                <FontAwesomeIcon icon="link" />
                &nbsp;Binding
              </Button>
              &nbsp;
              <Button
                color="info"
                size="sm"
                onClick={() => this.doRowEdit(e.original)}
              >
                <FontAwesomeIcon icon="pen-square" />
                &nbsp;View
              </Button>
            </div>
          ),
      },
    ];
  }

  clusterInfo = (clusterInfo) => {
    if (clusterInfo.length > 0) {
      return (
        <span>
          {clusterInfo.map((item, i) => {
            return (
              <span>
                [{item.cluster}:{item.unit}]
              </span>
            );
          })}
        </span>
      );
    }
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.setState({ userbinding: "" });
    this.setState({
      UserName: "",
      Password: "",
    });
  }

  addNew = (user) => {
    this.setState({ modalIsOpen: true });
    this.setState({ userbinding: user.phoneno });
    this.setState({
      UserName: "",
      Password: "",
    });
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/detailuserbinding/" + row.phoneno);
  };

  doRowDelete = (row) => {
    // console.log(row);
    confirmAlert({
      message: "Are you sure want to reject account " + row.name + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (phoneno) => {
            var phoneno = row.phoneno;
            // console.log(phoneno);
            this.rejectUser(phoneno);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  doRowUnBinded = (row) => {
    // console.log(row);
    confirmAlert({
      message: "Are you sure want to unbind account " + row.name + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (phoneno) => {
            var phoneno = row.phoneno;
            // console.log(phoneno);
            this.UnbindUser(phoneno);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  //   addNew = () => {
  //     this.props.history.push("/panel/inputuser");
  //   };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list2.php",
        {
          filter: this.state.filter,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  rejectUser = (phoneno) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_reject.php",
        {
          phoneno: phoneno,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Reject Account Successfully");
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  UnbindUser = (phoneno) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_unbinded.php",
        {
          phoneno: phoneno,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.doSmsunbound(phoneno);
        this.props.doLoading();
        alert("Unbind Account Successfully");
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  doSmsunbound = (phonenumber) => {
    let params = {
      phonenumber: phonenumber,
    };
    axios
      .post(serverUrl + "sms_unbound.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {})
      .catch((error) => {
        alert(error);
      });
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list2.php",
        {
          filter: "",
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.setState({
      typeId: "",
    });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list2.php",
        {
          filter: "",
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  doBindingAccount = () => {
    if (this.state.UserName === "") {
      return confirmAlert({
        message: "User name cannot be empty!",
        buttons: [
          {
            label: "OK",
          },
        ],
      });
    }
    if (this.state.Password === "") {
      return confirmAlert({
        message: "Password cannot be empty!",
        buttons: [
          {
            label: "OK",
          },
        ],
      });
    }
    let params = {
      phonenumber: this.state.userbinding,
      UserName: this.state.UserName,
      Password: this.state.Password,
      datecreated: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    // console.log(params);

    this.props.doLoading();
    axios
      .post(serverUrl + "access_token_binding.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        // console.log(response);
        if (response.data.status === "OK") {
          this.closeModal();
          this.doSearch();
        } else {
          return confirmAlert({
            message: response.data.message,
            buttons: [
              {
                label: "OK",
              },
            ],
          });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <div className="page-header">
          Account Binding <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td>
                <Label for="phonenumber">Mobile Phone Number</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="phonenumber"
                  id="phonenumber"
                  value={this.state.userbinding}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="username">User Name</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="UserName"
                  id="UserName"
                  value={this.state.UserName}
                  placeholder="Enter User Name"
                  onChange={(event) =>
                    this.setState({ UserName: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="Password">Password</Label>
              </td>
              <td>
                <Input
                  type="password"
                  name="Password"
                  id="Password"
                  value={this.state.Password}
                  placeholder="Enter Password"
                  onChange={(event) =>
                    this.setState({ Password: event.target.value })
                  }
                />
              </td>
            </tr>
          </table>
        </div>
        <br></br>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.closeModal()}>
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;{this.globallang.cancel}
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.doBindingAccount()}>
            <FontAwesomeIcon icon="save" />
            &nbsp;Binding
          </Button>
        </div>
      </Modal>
    );
  }

  changeType = (typeid) => {
    this.setState({
      typeId: typeid,
    });

    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list2.php",
        {
          filter: typeid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          User Account
        </Label>
        <div className="contentDate">
          <div
            style={{
              marginRight: 16,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <span>Type User:</span>
          </div>
          <div style={{ marginRight: 16 }}>
            <SelectMultiColumn
              width={200}
              value={this.state.typeId}
              valueColumn={"id"}
              showColumn={"display"}
              columns={["display"]}
              data={this.state.typeShow}
              onChange={this.changeType}
            />
          </div>
          <div
            style={{
              marginRight: 16,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            <span>Total: {this.state.tableData.length}</span>
          </div>
          <div style={{ marginRight: 16 }}>
            <ExcelFile
              element={
                <Button color="success">
                  <FontAwesomeIcon icon="file-excel" />
                  Export
                </Button>
              }
            >
              <ExcelSheet data={this.state.tableData} name="User Account">
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Mobile Phone" value="phoneno" />
                <ExcelColumn label="User Name" value="name" />
                <ExcelColumn label="Email" value="email" />
                <ExcelColumn label="Gender" value="gendername" />
                <ExcelColumn label="KTP" value="ktp" />
                <ExcelColumn
                  label="Cluster"
                  value={(col) =>
                    col.clusterInfo.length > 0
                      ? col.clusterInfo.map((item) => item.cluster).join(", ")
                      : ""
                  }
                />
                <ExcelColumn
                  label="Unit"
                  value={(col) =>
                    col.clusterInfo.length > 0
                      ? col.clusterInfo.map((item) => item.unit).join(", ")
                      : ""
                  }
                />
                <ExcelColumn
                  label="User Account"
                  value={(col) =>
                    col.statusAccount === 1
                      ? "The Owner"
                      : col.statusAccount === 2
                      ? "Not The Owner"
                      : "Visitor"
                  }
                />
                <ExcelColumn label="Phone Owner" value="phoneowner" />
                <ExcelColumn
                  label="Status Binding"
                  value={(col) => (col.isbinding === 0 ? "Unlinked" : "Linked")}
                />
                <ExcelColumn label="Platform" value="platform" />
              </ExcelSheet>
            </ExcelFile>
          </div>
          <div style={{ marginRight: 0 }}>
            <Button color="info" onClick={() => this.reset()}>
              <FontAwesomeIcon icon="sync" />
              &nbsp;{this.globallang.reset}
            </Button>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={10}
          />
          {this.renderModal()}
        </div>
      </FormGroup>
    );
  }
}
export default UserAccountList;
