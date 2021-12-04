import React, { Component } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
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
import Select from "react-select";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Style = {
  control: (provided) => ({ ...provided, width: "160" }),
  container: (provided) => ({ ...provided, width: "160" }),
};

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-20%",
    transform: "translate(-50%, -50%)",
  },
};

class UserBindingList extends Component {
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
      UnitShow: [],
      DebtorAcct: "",
      UnitInfoUser: [],
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
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.id}
            </span>
          ) : (
            <span>{e.original.id}</span>
          ),
      },
      {
        Header: "Mobile Phone",
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "left" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.phoneno}
            </span>
          ) : (
            <span>{e.original.phoneno}</span>
          ),
      },
      {
        Header: "Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.name}
            </span>
          ) : (
            <span>{e.original.name}</span>
          ),
      },
      {
        Header: "Email",
        headerStyle: { fontWeight: "bold" },
        accessor: "email",
        style: { textAlign: "left" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.email}
            </span>
          ) : (
            <span>{e.original.email}</span>
          ),
      },
      {
        Header: "Gender",
        headerStyle: { fontWeight: "bold" },
        accessor: "gendername",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.gendername}
            </span>
          ) : (
            <span>{e.original.gendername}</span>
          ),
      },
      {
        Header: "KTP",
        headerStyle: { fontWeight: "bold" },
        accessor: "ktp",
        style: { textAlign: "left" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {e.original.ktp}
            </span>
          ) : (
            <span>{e.original.ktp}</span>
          ),
      },
      {
        Header: "Cluster & Unit",
        headerStyle: { fontWeight: "bold" },
        accessor: "clusterInfo",
        style: { textAlign: "left" },
        Cell: (e) =>
          e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>
              {this.clusterInfo(e.original.clusterInfo)}
            </span>
          ) : (
            <span>{this.clusterInfo(e.original.clusterInfo)}</span>
          ),
      },
      {
        Header: "User Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "statusAccount",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.statusAccount === 1 ? (
            e.original.read === 0 ? (
              <span style={{ color: "#000", fontWeight: "bold" }}>
                The Owner
              </span>
            ) : (
              <span style={{ color: "#000" }}>The Owner</span>
            )
          ) : e.original.statusAccount === 2 ? (
            e.original.read === 0 ? (
              <span style={{ color: "#000", fontWeight: "bold" }}>
                Not The Owner
              </span>
            ) : (
              <span style={{ color: "#000" }}>Not The Owner</span>
            )
          ) : e.original.read === 0 ? (
            <span style={{ color: "#000", fontWeight: "bold" }}>Visitor</span>
          ) : (
            <span style={{ color: "#000" }}>Visitor</span>
          ),
      },
      {
        Header: "Status Binding",
        headerStyle: { fontWeight: "bold" },
        accessor: "isbinding",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.isbinding === 0 ? (
            e.original.read === 0 ? (
              <span style={{ color: "#ff9800", fontWeight: "bold" }}>
                Unlinked
              </span>
            ) : (
              <span style={{ color: "#ff9800" }}>Unlinked</span>
            )
          ) : e.original.read === 0 ? (
            <span style={{ color: "#2196F3", fontWeight: "bold" }}>Linked</span>
          ) : (
            <span style={{ color: "#2196F3" }}>Linked</span>
          ),
      },
      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="success"
              size="sm"
              onClick={() => this.addNew(e.original)}
            >
              <FontAwesomeIcon icon="link" />
              &nbsp;Approve
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              <FontAwesomeIcon icon="times-circle" />
              &nbsp;Reject
            </Button>
          </div>
        ),
      },
    ];
  }

  clusterInfo = (clusterInfo) => {
    // console.log(clusterInfo);
    // const commaSep = users.map((item) => item.name).join(", ");

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
    this.setState({
      DebtorAcct: "",
      UnitInfoUser: [],
    });
  }

  doRead = (phoneno) => {
    axios
      .post(
        serverUrl + "user_binding_read.php",
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
        this.reset2();
      })
      .catch((error) => {
        alert(error);
      });
  };

  onSearch = (query) => {
    axios
      .post(
        serverUrl + "unit_available.php",
        { filter: query },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ UnitShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doShowUnitInfo = () => {
    axios
      .post(
        serverUrl + "unit_available.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ UnitShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addNew = (user) => {
    this.doRead(user.phoneno);
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
    this.doRead(row.phoneno);
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

  //   addNew = () => {
  //     this.props.history.push("/panel/inputuser");
  //   };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list_type.php",
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
        this.doSmsRejected(phoneno);
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

  componentDidMount = () => {
    this.doShowUnitInfo();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list_type.php",
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
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_binding_list_type.php",
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

  reset2 = () => {
    let data = "";
    this.setState({ filter: data });
    axios
      .post(
        serverUrl + "user_binding_list_type.php",
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
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        // console.log(error);
        alert(error);
      });
  };

  doBindingAccount = () => {
    if (this.state.DebtorAcct === "" && this.state.UnitInfoUser) {
      return confirmAlert({
        message: "Cannot be empty!",
        buttons: [
          {
            label: "OK",
          },
        ],
      });
    }
    let params = {
      phonenumber: this.state.userbinding,
      DebtorInfo: this.state.UnitInfoUser,
    };
    console.log(params);

    this.props.doLoading();
    axios
      .post(serverUrl + "access_user_binding.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        // console.log(response);
        if (response.data.status === "OK") {
          this.doSmsApproved(params.phonenumber);
          this.closeModal();
          this.doSearch();
        } else {
          return confirmAlert({
            message: "Something error",
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

  doSmsApproved = (phonenumber) => {
    let params = {
      phonenumber: phonenumber,
    };
    axios
      .post(serverUrl + "sms_approved.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        // if (response.data.status !== "OK") {
        //   return confirmAlert({
        //     message: response.data.message,
        //     buttons: [
        //       {
        //         label: "OK",
        //       },
        //     ],
        //   });
        // }
      })
      .catch((error) => {
        alert(error);
      });
  };

  doSmsRejected = (phonenumber) => {
    let params = {
      phonenumber: phonenumber,
    };
    axios
      .post(serverUrl + "sms_rejected.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        // if (response.data.status !== "OK") {
        //   return confirmAlert({
        //     message: response.data.message,
        //     buttons: [
        //       {
        //         label: "OK",
        //       },
        //     ],
        //   });
        // }
      })
      .catch((error) => {
        alert(error);
      });
  };

  handleOnSearch = (string) => {
    // console.log(string);
    if (string.trim() !== "") {
      this.onSearch(string);
    }
  };

  changeUnit = (UnitId) => {
    console.log(UnitId);
    console.log(this.state.DebtorAcct);
    this.setState({
      DebtorAcct: UnitId,
    });
    if (this.state.DebtorAcct !== UnitId) {
      let DataUnitInfo = this.state.UnitInfoUser;
      DataUnitInfo.push(UnitId.data);
      // console.log(DataUnitInfo);
      this.setState({
        UnitInfoUser: DataUnitInfo,
      });
    }
  };

  removeInfoUnit = (info) => {
    let tmp = [];
    this.state.UnitInfoUser.map((item, i) => {
      if (item !== info) {
        tmp.push(item);
      }
    });
    this.setState({ UnitInfoUser: tmp });
    this.setState({
      DebtorAcct: "",
    });
  };

  renderUnitInfo = () => {
    if (this.state.UnitInfoUser.length > 0) {
      return (
        <div className="detail-info-list">
          <table>
            <tbody>
              {this.state.UnitInfoUser.map((item, i) => (
                <tr>
                  <td className="td-field">
                    Debtor Acct: {item.DebtorAcct}, Unit Number: {item.LotNo}
                  </td>
                  <td className="td-button">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => this.removeInfoUnit(item)}
                      block
                    >
                      <FontAwesomeIcon icon="times-circle" />
                      &nbsp; Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
              <td width={200}>
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
                <Label for="username">Debtor / Unit</Label>
              </td>
              <td>
                <Select
                  onBlur={false}
                  styles={Style}
                  placeholder="Search Unit..."
                  onInputChange={this.handleOnSearch}
                  value={this.state.DebtorAcct}
                  onChange={this.changeUnit}
                  options={this.state.UnitShow}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td></td>
              <td> {this.renderUnitInfo()}</td>
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

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          User Account Binding Approval
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
            <span>Total: {this.state.tableData.length}</span>
          </div>
          <div style={{ marginRight: 10 }}>
            <ExcelFile
              element={
                <Button color="success">
                  <FontAwesomeIcon icon="file-excel" />
                  Export
                </Button>
              }
            >
              <ExcelSheet
                data={this.state.tableData}
                name="Request User Approval"
              >
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
                <ExcelColumn
                  label="Status Binding"
                  value={(col) => (col.isbinding === 0 ? "Unlinked" : "Linked")}
                />
              </ExcelSheet>
            </ExcelFile>
          </div>
          <div style={{ marginRight: 10 }}>
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
export default UserBindingList;
