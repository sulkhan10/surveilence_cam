import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
// import { Link, Redirect } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import moment from "moment";
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
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ListRequestPromo extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listadmin");
    this.state = {
      tableData: [],
      filter: "",
    };

    this.tableColumns = [
      {
        Header: "No",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: "Phone number",
        headerStyle: { fontWeight: "bold" },
        accessor: "phonenumber",
        style: { textAlign: "center" },
      },
      {
        Header: "Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
      },
      {
        Header: "Debtor Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "debtor_acc",
        style: { textAlign: "center" },
      },
      {
        Header: "Unit Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "unit_acc",
        style: { textAlign: "center" },
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "status",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.status === 1
            ? "Waiting for approval"
            : e.original.status === 2
            ? "Request Approved"
            : "Request denied",
      },
      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="info"
              size="sm"
              onClick={() => this.doUpdate(e.original)}
            >
              <FontAwesomeIcon icon="pen-square" />
              &nbsp;Update
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              <FontAwesomeIcon icon="times-circle" />
              &nbsp;{this.globallang.delete}
            </Button>
          </div>
        ),
      },
    ];
  }

  doUpdate = (row) => {
    console.log(row);
    confirmAlert({
      message:
        "Do you want to approve or reject the debtor account " +
        row.debtor_acc +
        " and unit " +
        row.unit_acc +
        "?",
      buttons: [
        {
          label: "Aggree",
          onClick: (id_request) => {
            var id_request = row.id_request;
            this.doAggree(id_request);
          },
        },
        {
          label: "Reject",
          onClick: (id_request) => {
            var id_request = row.id_request;
            this.doReject(id_request);
          },
        },
      ],
    });
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/editadmin/" + row.id_request);
  };

  doRowDelete = (row) => {
    console.log(row);
    confirmAlert({
      message: "Delete user request promo?",
      buttons: [
        {
          label: "Yes",
          onClick: (id_request) => {
            var id_request = row.id_request;
            console.log(id_request);
            this.deleteAdmin(id_request);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputadmin");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_list.php",
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
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doAggree = (id_request) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_update.php",
        {
          id_request: id_request,
          status: 2,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Successfully approved");
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doReject = (id_request) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_update.php",
        {
          id_request: id_request,
          status: 3,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Request denied");
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteAdmin = (id_request) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_delete.php",
        {
          id_request: id_request,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Deleted successfully");
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_list.php",
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
        console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "request_promo_list.php",
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
        console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Request Promo
        </Label>
        <div className="contentDate">
          <div style={{ marginRight: 10 }}>
            <Button color="info" onClick={() => this.reset()}>
              <FontAwesomeIcon icon="sync" />
              &nbsp;{this.globallang.reset}
            </Button>
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
              <ExcelSheet data={this.state.tableData} name="Request Promo">
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Phone number" value="phonenumber" />
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Debtor Acc" value="debtor_acc" />
                <ExcelColumn label="Unit Number" value="unit_acc" />
                <ExcelColumn
                  label="Status"
                  value={(col) =>
                    col.status === 1
                      ? "Waiting for approval"
                      : "Request promo approved"
                  }
                />
              </ExcelSheet>
            </ExcelFile>
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
            defaultPageSize={5}
          />
        </div>
      </FormGroup>
    );
  }
}
export default ListRequestPromo;
