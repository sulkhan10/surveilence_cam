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

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-20%",
    transform: "translate(-50%, -50%)",
  },
};

class UserBindingNotOwner extends Component {
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
    };

    this.addNew = this.addNew.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.tableColumns = [
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
        Header: "Binding to the owner",
        headerStyle: { fontWeight: "bold" },
        accessor: "gendername",
        style: { textAlign: "center" },
        width: 300,
      },
      {
        Header: "The owner phone",
        headerStyle: { fontWeight: "bold" },
        accessor: "phonenumberowner",
        style: { textAlign: "center" },
        width: 300,
      },
      {
        Header: "Request Binding",
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
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 300,
        Cell: (e) => (
          <div>
            <Button
              color="primary"
              size="sm"
              onClick={() => this.addNew(e.original)}
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
            &nbsp;
            <Button
              color="success"
              size="sm"
              onClick={() => this.addNew(e.original)}
            >
              <FontAwesomeIcon icon="link" />
              &nbsp;Approval
            </Button>
          </div>
        ),
      },
    ];
  }

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
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (phoneno) => {
            var phoneno = row.phoneno;
            // console.log(phoneno);
            this.deleteUser(phoneno);
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
        serverUrl + "user_binding_list_not_owner.php",
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
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  deleteUser = (phoneno) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_delete.php",
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
        alert(this.language.deletesuccess);
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        // console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list_not_owner.php",
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
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list_not_owner.php",
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
          Link Account Binding <span className="dash">&nbsp;&nbsp;</span>{" "}
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
            &nbsp;{this.globallang.submit}
          </Button>
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Not Owner's Account Binding
        </Label>
        <div className="contentDate">
          <Button color="success" onClick={() => this.reset()}>
            <FontAwesomeIcon icon="sync" />
            &nbsp;{this.globallang.reset}
          </Button>
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
export default UserBindingNotOwner;
