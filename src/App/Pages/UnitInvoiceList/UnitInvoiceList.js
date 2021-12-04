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
import { convertToRupiah } from "../../../global.js";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class UnitInvoiceList extends Component {
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
        Header: "Invoice Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "InvNo",
        style: { textAlign: "center" },
      },
      {
        Header: "Invoice Amount",
        headerStyle: { fontWeight: "bold" },
        accessor: "InvAmt",
        style: { textAlign: "center" },
        Cell: (e) => convertToRupiah(e.original.InvAmt),
      },
      {
        Header: "Category",
        headerStyle: { fontWeight: "bold" },
        accessor: "Category",
        style: { textAlign: "center" },
      },
      {
        Header: "Periode",
        headerStyle: { fontWeight: "bold" },
        accessor: "Periode",
        style: { textAlign: "center" },
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "Status",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.Status === "PAID" ? (
            <span style={{ color: "#0069d9", fontWeight: "bold" }}>PAID</span>
          ) : (
            <span style={{ color: "#c82333", fontWeight: "bold" }}>UNPAID</span>
          ),
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

  doRowEdit = (row) => {
    this.props.history.push("/panel/editunitinvoice/" + row.invId);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: "Do you want to delete invoice " + row.InvNo + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (invId) => {
            var invId = row.invId;
            // console.log(invId);
            this.deleteInvoice(invId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  deleteInvoice = (invId) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "unit_inv_delete.php",
        {
          invId: invId,
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
        this.doShowInvoice();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doShowInvoice = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "unit_inv_list.php",
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
    this.doShowInvoice();
  };

  addNew = () => {
    this.props.history.push("/panel/inputinvoice");
  };

  reset = () => {
    this.doShowInvoice();
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Unit Invoice List
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
              <ExcelSheet
                data={this.state.tableData}
                name="Invoice Payment Unit"
              >
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Debtor Account" value="DebtorAcct" />
                <ExcelColumn label="Unit Number" value="LotNo" />
                <ExcelColumn label="Invoice Number" value="InvNo" />
                <ExcelColumn label="Invoice Amount" value="InvAmt" />
                <ExcelColumn label="Category" value="Category" />
                <ExcelColumn label="Periode" value="Periode" />
                <ExcelColumn label="Status" value="Status" />
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
