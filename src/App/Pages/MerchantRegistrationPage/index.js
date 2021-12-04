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

class ListMerchantRegistration extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      tableData: [],
      filter: "",
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
        Header: "Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "d_created",
        style: { textAlign: "left" },
        width: 250,
      },
      {
        Header: "Phone number",
        headerStyle: { fontWeight: "bold" },
        accessor: "v_phoneno",
        style: { textAlign: "left" },
        width: 250,
      },
      {
        Header: "Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "nama",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Place of birth",
        headerStyle: { fontWeight: "bold" },
        accessor: "tempat_lahir",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Date of Birth & Year",
        headerStyle: { fontWeight: "bold" },
        accessor: "tgl_lahir",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Gender",
        headerStyle: { fontWeight: "bold" },
        accessor: "gender",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "No KTP",
        headerStyle: { fontWeight: "bold" },
        accessor: "no_ktp",
        style: { textAlign: "center" },
        width: 200,
      },

      {
        Header: "Name of business / shop",
        headerStyle: { fontWeight: "bold" },
        accessor: "nama_usaha",
        style: { textAlign: "center" },
        width: 200,
      },

      {
        Header: "Type of Business",
        headerStyle: { fontWeight: "bold" },
        accessor: "jenis_usaha",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Address of Business Place",
        headerStyle: { fontWeight: "bold" },
        accessor: "alamat_usaha",
        style: { textAlign: "center" },
        width: 200,
      },

      {
        Header: "NPWP",
        headerStyle: { fontWeight: "bold" },
        accessor: "npwp",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "No TLP/Whatsapp",
        headerStyle: { fontWeight: "bold" },
        accessor: "no_tlp",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Email",
        headerStyle: { fontWeight: "bold" },
        accessor: "email",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Disbursement No",
        headerStyle: { fontWeight: "bold" },
        accessor: "no_rekening",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Bank Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "nama_bank",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Account name",
        headerStyle: { fontWeight: "bold" },
        accessor: "nama_rekening",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Operational hour",
        headerStyle: { fontWeight: "bold" },
        accessor: "jam_oprasional",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Delivery settings",
        headerStyle: { fontWeight: "bold" },
        accessor: "pengaturan_delivery",
        style: { textAlign: "center" },
        width: 200,
      },
    ];
  }

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_registration.php",
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
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_registration.php",
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
        serverUrl + "merchant_registration.php",
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
        serverUrl + "merchant_registration_bydate.php",
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
          Merchant Registration
        </Label>
        <div className="contentDate">
          <div
            style={{
              alignSelf: "center",
              marginRight: 10,
              color: "#000",
              fontWeight: "bold",
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
              marginRight: 10,
              color: "#000",
              fontWeight: "bold",
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
              <ExcelSheet
                data={this.state.tableData}
                name="Merchant Registration"
              >
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Date" value="d_created" />
                <ExcelColumn label="Phone number" value="v_phoneno" />
                <ExcelColumn label="Name" value="nama" />
                <ExcelColumn label="Place of birth" value="tempat_lahir" />
                <ExcelColumn label="Date of Birth & Year" value="tgl_lahir" />
                <ExcelColumn label="Gender" value="gender" />
                <ExcelColumn label="No KTP" value="no_ktp" />
                <ExcelColumn
                  label="Name of business / shop"
                  value="nama_usaha"
                />
                <ExcelColumn label="Type of Business" value="jenis_usaha" />
                <ExcelColumn
                  label="Address of Business Place"
                  value="alamat_usaha"
                />
                <ExcelColumn label="NPWP" value="npwp" />
                <ExcelColumn label="No TLP/Whatsapp" value="no_tlp" />
                <ExcelColumn label="Email" value="email" />
                <ExcelColumn label="Disbursement No" value="no_rekening" />
                <ExcelColumn label="Bank Name" value="nama_bank" />
                <ExcelColumn label="Account name" value="nama_rekening" />
                <ExcelColumn label="Operational hour" value="jam_oprasional" />
                <ExcelColumn
                  label="Delivery settings"
                  value="pengaturan_delivery"
                />
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
export default ListMerchantRegistration;
