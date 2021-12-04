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

export default class UnitClusterList extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
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
        Header: "Debtor Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "DebtorAcct",
        style: { textAlign: "center" },
      },
      {
        Header: "Unit Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "LotNo",
        style: { textAlign: "center" },
      },
      {
        Header: "Bisnis ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "BisnisId",
        style: { textAlign: "center" },
      },
      {
        Header: "Cluster Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "ClusterName",
        style: { textAlign: "center" },
      },
      {
        Header: "Company Code",
        headerStyle: { fontWeight: "bold" },
        accessor: "CompanyCode",
        style: { textAlign: "center" },
      },
      {
        Header: "Is Valid",
        headerStyle: { fontWeight: "bold" },
        accessor: "IsValid",
        style: { textAlign: "center" },
        // Cell: (e) => (e.original.IsValid === 0 ? "NO" : "YES"),
      },
      {
        Header: "Action",
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="warning"
              size="sm"
              onClick={() => this.doRowEdit(e.original)}
            >
              <FontAwesomeIcon icon="pen-square" />
              &nbsp;{this.globallang.edit}
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

  deleteAdmin = (UnitID) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "unit_delete.php",
        {
          UnitID: UnitID,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Deleted Successfully");
        //window.location.reload()
        this.doShowUnit();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doShowUnit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "unit_list.php",
        {},

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
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.doShowUnit();
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/editunit/" + row.UnitID);
  };

  addNew = () => {
    this.props.history.push("/panel/inputunit");
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: "Do you want to delete unit " + row.DebtorAcct + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (UnitID) => {
            var UnitID = row.UnitID;
            console.log(UnitID);
            this.deleteAdmin(UnitID);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  reset = () => {
    this.doShowUnit();
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Unit & Cluster List
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
              <ExcelSheet data={this.state.tableData} name="Unit Cluster List">
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Debtor Account" value="DebtorAcct" />
                <ExcelColumn label="Unit Number" value="LotNo" />
                <ExcelColumn label="Bisnis ID" value="BisnisId" />
                <ExcelColumn label="Cluster Name" value="ClusterName" />
                <ExcelColumn label="Company Code" value="CompanyCode" />
                <ExcelColumn label="Is Valid" value="IsValid" />
              </ExcelSheet>
            </ExcelFile>
          </div>
          <div style={{ marginRight: 10 }}>
            <Button color="primary" onClick={() => this.addNew()}>
              <FontAwesomeIcon icon="plus-square" />
              &nbsp;Add New
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
            defaultPageSize={5}
          />
        </div>
      </FormGroup>
    );
  }
}
