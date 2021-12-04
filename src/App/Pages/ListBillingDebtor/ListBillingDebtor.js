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
import { convertToRupiah } from "../../../global.js";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactExport from "react-export-excel";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ListBillingDebtor extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listbillingdebtor");
    this.state = {
      tableData: [],
      filter: "",
      communityid: this.props.community.communityid,
      startDate: moment(),
      endDate: moment(),
    };
    this.tableColumns = [
      {
        Header: "No.",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: "Transaction ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "transaksi_id",
        style: { textAlign: "left" },
        width: 250,
      },
      {
        Header: "Invoice Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "external_id",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: this.language.columnmonth,
        headerStyle: { fontWeight: "bold" },
        accessor: "debtor",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Sub Total",
        headerStyle: { fontWeight: "bold" },
        accessor: "subtotal",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.subtotal),
      },
      {
        Header: "Discount",
        headerStyle: { fontWeight: "bold" },
        accessor: "diskon",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.diskon),
      },

      {
        Header: "Charge",
        headerStyle: { fontWeight: "bold" },
        accessor: "denda",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.denda),
      },

      {
        Header: "Paid Amount",
        headerStyle: { fontWeight: "bold" },
        accessor: "amount",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.amount),
      },
      {
        Header: this.language.columncustomerid,
        headerStyle: { fontWeight: "bold" },
        accessor: "status",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.status == "PAID" ? (
            <span style={{ color: "#0066ff" }}>PAID</span>
          ) : (
            <span style={{ color: "#ff8d00" }}>PENDING</span>
          ),
      },
      {
        Header: this.language.columnbillingamount,
        headerStyle: { fontWeight: "bold" },
        accessor: "paid_date",
        width: 200,
        style: { textAlign: "center" },
      },
      // {
      //   Header: "Xendit",
      //   headerStyle: { fontWeight: "bold" },
      //   accessor: "xendit",
      //   style: { textAlign: "center" },
      //   width: 200,
      // },

      // {
      //   Header: "Modernland",
      //   headerStyle: { fontWeight: "bold" },
      //   accessor: "modernland",
      //   style: { textAlign: "center" },
      //   width: 200,
      // },

      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        width: 200,
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.modernland === "NO" ? (
            <div>
              <Button
                color="primary"
                size="sm"
                onClick={() => this.doResend(e.original)}
              >
                <FontAwesomeIcon icon="pen-square" />
                &nbsp;Resend
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
              <Button color="secondary" size="sm">
                <FontAwesomeIcon icon="pen-square" />
                &nbsp;Resend
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

  doResend = (row) => {
    confirmAlert({
      message:
        "Are you sure want to resend payment " +
        row.name +
        " invoice number " +
        row.external_id +
        "?",
      buttons: [
        {
          label: "Yes",
          onClick: (user) => {
            var user = row;
            this.SendToModernland(user);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/detailbillingdebtor/" + row.billingid);
  };

  SendToModernland = (modernland) => {
    console.log(modernland);
    this.props.doLoading();
    axios
      .post(
        serverUrl + "resend_payment_modernland.php",
        {
          paymentId: modernland.billingid,
          payerEmail: modernland.email,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert("Resend Payment Successfully");
        this.reset();
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "billing_list_debtor.php",
        {
          filter: this.state.filter,
          communityid: this.state.communityid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(this.state);
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
    console.log("didMount billing debtor");
    this.props.doLoading();
    // console.log(this.state.communityid);
    axios
      .post(
        serverUrl + "billing_list_debtor.php",
        {
          filter: "",
          communityid: this.state.communityid,
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
    this.setState({
      startDate: moment(),
      endDate: moment(),
    });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "billing_list_debtor.php",
        {
          filter: "",
          communityid: this.state.communityid,
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

  getDataBydate = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "billing_list_debtor_date.php",
        {
          startDate: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          endDate: this.state.endDate
            .clone()
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
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

  setStartDate = (date) => {
    this.setState({ startDate: date });
  };
  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  doSeacrhBydate = () => {
    this.getDataBydate();
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          List Payment IPKL
        </Label>
        <div className="contentDate">
          <div
            style={{
              alignSelf: "center",
              color: "#000",
              fontWeight: "bold",
              marginRight: 10,
            }}
          >
            Start Date:
          </div>
          <div style={{ marginRight: 10 }}>
            <DatePicker
              maxDate={addDays(new Date(), 30)}
              selected={this.state.startDate}
              onChange={(date) => this.setStartDate(date)}
              selectsStart
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              className="datefilter"
            />
          </div>
          &nbsp;&nbsp;
          <div
            style={{
              alignSelf: "center",
              color: "#000",
              fontWeight: "bold",
              marginRight: 10,
            }}
          >
            End Date:
          </div>
          <div style={{ marginRight: 10 }}>
            <DatePicker
              minDate={subDays(new Date(), 30)}
              // maxDate={addDays(new Date(), 31)}
              selected={this.state.endDate}
              onChange={(date) => this.setEndDate(date)}
              selectsEnd
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              minDate={this.state.startDate}
              className="datefilter"
            />
          </div>
          <div style={{ marginRight: 10 }}>
            <Button color="primary" onClick={() => this.doSeacrhBydate()}>
              <FontAwesomeIcon icon="random" />
              &nbsp;Get Data
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
              <ExcelSheet data={this.state.tableData} name="Report Payment">
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Transaction ID" value="transaksi_id" />
                <ExcelColumn label="Invoice Number" value="external_id" />
                <ExcelColumn label="User Name" value="name" />
                <ExcelColumn label="Debtor Account" value="debtor" />
                <ExcelColumn
                  label="Sub Total"
                  value={(col) => convertToRupiah(col.subtotal)}
                />
                <ExcelColumn
                  label="Discount"
                  value={(col) => convertToRupiah(col.diskon)}
                />
                <ExcelColumn
                  label="Charge"
                  value={(col) => convertToRupiah(col.denda)}
                />
                <ExcelColumn
                  label="Paid Amount"
                  value={(col) => convertToRupiah(col.amount)}
                />
                <ExcelColumn
                  label="Status Payement"
                  value={(col) => (col.status === "PAID" ? "PAID" : "PENDING")}
                />
                <ExcelColumn label="Date Paid" value="paid_date" />
                <ExcelColumn label="Xendit" value="xendit" />
                <ExcelColumn label="Modernland" value="modernland" />
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
        </div>
      </FormGroup>
    );
  }
}
export default ListBillingDebtor;
