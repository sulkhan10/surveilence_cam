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
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class QuestionnairePage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      tableData: [],
      filter: "",
      startDate: moment(),
      endDate: moment(),
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
        Header: "Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "date",
        style: { textAlign: "center" },
      },
      {
        Header: "Phonenumber",
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "center" },
      },
      {
        Header: "Nama",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
      },
      {
        Header: "Gender",
        headerStyle: { fontWeight: "bold" },
        accessor: "gendername",
        style: { textAlign: "center" },
      },
      {
        Header: "Email",
        headerStyle: { fontWeight: "bold" },
        accessor: "email",
        style: { textAlign: "center" },
      },
      {
        Header: "Pekerjaan",
        headerStyle: { fontWeight: "bold" },
        accessor: "pekerjaan",
        style: { textAlign: "center" },
      },
      {
        Header: "Alamat Rumah",
        headerStyle: { fontWeight: "bold" },
        accessor: "alamatrumah",
        style: { textAlign: "center" },
      },
    ];
  }

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "questionnaire_list.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response);
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
      });
  };

  reset = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "questionnaire_list.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response);
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
      });
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
  };
  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  doSeacrhBydate = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "questionnaire_bydate.php",
        {
          startDate: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD"),
          endDate: this.state.endDate.clone().endOf("day").format("YYYY-MM-DD"),
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
      });
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          CRG Tenant Questionnaire
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
                name="Questionnaire Tenant JGC"
              >
                <ExcelColumn label="No" value="phoneno" />
                <ExcelColumn label="Created" value="date_creted" />
                <ExcelColumn label="Date" value="date" />
                <ExcelColumn label="phonenumber" value="phoneno" />
                <ExcelColumn label="Nama" value="name" />
                <ExcelColumn label="Gender" value="gendername" />
                <ExcelColumn label="Email" value="email" />
                <ExcelColumn label="Pekerjaan" value="pekerjaan" />
                <ExcelColumn label="Alamat Rumah" value="alamatrumah" />
                <ExcelColumn
                  label="Apakah status kepemilikan rumah Anda milik sendiri?"
                  value="pemilikrumah"
                />
                <ExcelColumn
                  label="Apakah pencahayaan didalam rumah Anda cukup ?"
                  value="pencahayaanrumah"
                />
                <ExcelColumn
                  label="Apakah ada halaman disekitar rumah Anda?"
                  value="halamanrumah"
                />
                <ExcelColumn
                  label="Apakah ada jarak antara rumah Anda dengan rumah yang lainnya ?"
                  value="jarakantarrumah"
                />
                <ExcelColumn
                  label="Apakah Akses menuju perumahan Anda cukup baik?"
                  value="aksesrumah"
                />
                <ExcelColumn
                  label="Apakah lingkungan tempat tinggal Anda aman?"
                  value="lingkunganAman"
                />
                <ExcelColumn
                  label="Apakah ada security / tim keamanan di lingkungan tempat tinggal Anda?"
                  value="satpamLingkungan"
                />
                <ExcelColumn
                  label="Apakah Kebersihan di lingkungan Anda sudah Cukup?"
                  value="kebersihanLingkungan"
                />
                <ExcelColumn
                  label="Apakah ada Fasilitas Olah Raga di lingkungan Anda?"
                  value="fasilitasOlahraga"
                />
                <ExcelColumn
                  label="Apakah ada Fasilitas Taman Hijau di lingkungan Anda?"
                  value="fasilitasTamanHijau"
                />
                <ExcelColumn
                  label="Apakah ada Fasilitas umum di lingkungan Anda?"
                  value="fasilitasUmum"
                />
                <ExcelColumn
                  label="Apakah hubungan sosial di lingkungan Anda sudah cukup terorganisir?"
                  value="hubunganSosial"
                />
                <ExcelColumn
                  label="Apakah Anda mempunyai usaha rumahan yang perlu di Promosi?"
                  value="usahaRumah"
                />
                <ExcelColumn
                  label="Apakah Anda merasa perlu di pengiriman real time untuk melayani kebutuhan Anda di kawasan JGC?"
                  value="pengirimanRealTime"
                />
                <ExcelColumn
                  label="Saran Anda untuk kebutuhan/Fasilitas yang di nilai masih kurang dan perlu di kawasan JGC"
                  value="note"
                />
              </ExcelSheet>
            </ExcelFile>
          </div>
          <div style={{ marginRight: 0 }}>
            <Button color="info" onClick={() => this.reset()}>
              <FontAwesomeIcon icon="sync" />
              &nbsp;Reset
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
export default QuestionnairePage;
