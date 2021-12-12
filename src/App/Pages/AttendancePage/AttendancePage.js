import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactExport from "react-export-excel";
import Modal from "react-modal";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import "moment/locale/id";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import {
  Refresh,
  ImportExport,
  Details,
  Storage,
  Cancel,
} from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};
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

class AttendancePage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      tableData: [],
      filter: "",
      device_id: "",
      deviceShow: [],
      startDate: moment(),
      endDate: moment(),
      getDate: moment(),
      resultMasterJadwal: [],
      resultAttendance: [],
      departmentname: "",
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
        Header: "Nama",
        headerStyle: { fontWeight: "bold" },
        accessor: "staff_name",
        style: { textAlign: "left" },
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "status",
        style: { textAlign: "center" },
      },
      {
        Header: "Jabatan",
        headerStyle: { fontWeight: "bold" },
        accessor: "partment",
        style: { textAlign: "left" },
      },
      {
        Header: "Tanggal",
        headerStyle: { fontWeight: "bold" },
        accessor: "first_check",
        style: { textAlign: "center" },
        Cell: (e) => e.original.first_check.substr(0, 10),
      },
      {
        Header: "Jam Datang (IN)",
        headerStyle: { fontWeight: "bold" },
        accessor: "first_check",
        style: { textAlign: "center" },
        Cell: (e) => e.original.first_check.substr(11, 20),
      },
      {
        Header: "Jam Pulang (OUT)",
        headerStyle: { fontWeight: "bold" },
        accessor: "last_check",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.last_check === e.original.first_check
            ? ""
            : e.original.last_check.substr(11, 20),
      },
      {
        Header: "Keterangan",
        headerStyle: { fontWeight: "bold" },
        accessor: "notes",
        style: { textAlign: "left" },
      },
    ];
  }

  componentDidMount = () => {
    this.getDataBydate();
    // this.getDataBydateSchedule("");
    this.getDepartment("6a4b6626070f11ec966800163c5d7e6d");
  };

  getDepartment = (user_id) => {
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/department_list_by_company.php",
        { user_id: user_id },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = response.data.records;

        tmp.sort(function (a, b) {
          return a.partment - b.partment;
        });
        this.setState({ departmentShow: tmp });

        // this.setState({ departmentname: tmp[0].partment });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doSearch = () => {
    this.getDataBydate();
  };

  reset = () => {
    this.setState({
      departmentname: "",
    });
    this.getDataBydate();
  };

  getDataBydate = () => {
    this.setState({
      tableData: [],
      departmentname: "",
    });
    this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/attendance.php",
        {
          date: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD"),
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
        this.getDataBydateSchedule(temp, "");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getDataBydateSchedule = (dataAttendance, department) => {
    // this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_list.php",
        {
          department: department,
          startDate: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD"),
          endDate: this.state.startDate
            .clone()
            .endOf("day")
            .format("YYYY-MM-DD"),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log("data schedule", response.data.records);
        console.log("data attendance", dataAttendance);
        // this.props.doLoading();
        // var temp = this.state.tableData;
        // temp = response.data.records;
        // for (var i = 0; i < temp.length; i++) {
        //   temp[i].id = i + 1;
        // }
        // this.setState({ tableData: temp });
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changedepartment = (department) => {
    this.doFilter(department);
    // let FilterByDepartment = this.state.tableData.filter(
    //   (v) => v.partment === department
    // );
    // // console.log(FilterByDepartment);
    // var temp = FilterByDepartment;
    // for (var i = 0; i < temp.length; i++) {
    //   temp[i].id = i + 1;
    // }
    // this.setState({ tableData: temp });
    // this.setState({ departmentname: department });
  };

  doFilter = (department) => {
    this.setState({
      tableData: [],
    });
    this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/attendance.php",
        {
          date: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD"),
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

        let FilterByDepartment = temp.filter((v) => v.partment === department);
        this.setState({ departmentname: department });
        this.setState({ tableData: FilterByDepartment });
        this.getDataBydateSchedule(FilterByDepartment, department);
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doSeacrhBydate = () => {
    this.getDataBydate();
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
    // console.log(this.state.startDate);
  };

  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  render() {
    return (
      <Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                style={{
                  borderLeft: 6,
                  borderColor: "#2f55a2",
                  color: "#FFF",
                  maxHeight: 250,
                  padding: 16,
                  paddingBottom: 24,
                }}
              >
                <Typography
                  component="span"
                  variant="h1"
                  style={
                    (stylesListComent.inline,
                    {
                      fontSize: 20,
                      color: "#005379",
                      fontWeight: "bold",
                    })
                  }
                >
                  Attendance
                </Typography>
                <br></br>
                <div className="contentDate">
                  <div
                    style={{
                      marginRight: 20,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="h2"
                      style={
                        (stylesListComent.inline,
                        {
                          fontSize: 16,
                          color: "#000",
                          fontWeight: "bold",
                        })
                      }
                    >
                      Department:
                    </Typography>
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <SelectMultiColumn
                      width={300}
                      value={this.state.departmentname}
                      valueColumn={"partment"}
                      showColumn={"partment"}
                      columns={["partment"]}
                      data={this.state.departmentShow}
                      onChange={this.changedepartment}
                    />
                  </div>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={
                      (stylesListComent.inline,
                      {
                        marginRight: 16,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        color: "#000",
                        fontWeight: "bold",
                      })
                    }
                  >
                    Date:
                  </Typography>
                  <div style={{ marginRight: 16 }}>
                    <DatePicker
                      maxDate={addDays(new Date(), 1)}
                      selected={this.state.startDate}
                      onChange={(date) => this.setStartDate(date)}
                      selectsStart
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      className="datefilter"
                    />
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006b76",
                      }}
                      startIcon={<Storage />}
                      onClick={() => this.doSeacrhBydate()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        Get Data
                      </Typography>
                    </Button>
                  </div>

                  <div style={{ marginRight: 16 }}>
                    <ExcelFile
                      element={
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#4caf50",
                          }}
                          startIcon={<ImportExport />}
                        >
                          <Typography
                            variant="button"
                            style={{
                              fontSize: 14,
                              color: "#fff",
                              textTransform: "capitalize",
                            }}
                          >
                            Export
                          </Typography>
                        </Button>
                      }
                    >
                      <ExcelSheet data={this.state.tableData} name="Attendance">
                        <ExcelColumn label="No" value="id" />
                        <ExcelColumn
                          label="Tanggal"
                          value={(col) =>
                            moment(this.state.startDate).format("l")
                          }
                        />
                        <ExcelColumn
                          label="Hari"
                          value={(col) =>
                            moment(this.state.startDate).format("dddd")
                          }
                        />
                        <ExcelColumn label="Nama" value="staff_name" />
                        <ExcelColumn label="Status" value="status" />
                        <ExcelColumn label="Jabatan" value="partment" />
                        <ExcelColumn
                          label="Jam Datang (IN)"
                          value="first_check"
                        />
                        <ExcelColumn
                          label="Jam Pulang (OUT)"
                          value={(col) =>
                            col.last_check === col.first_check
                              ? ""
                              : col.last_check
                          }
                        />
                      </ExcelSheet>
                    </ExcelFile>
                  </div>
                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#1273DE",
                      }}
                      startIcon={<Refresh />}
                      onClick={() => this.reset()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        {this.globallang.reset}
                      </Typography>
                    </Button>
                  </div>
                </div>
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            style={{ backgroundColor: "#f2f2f2" }}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={5}
          />
        </div>
      </Box>
    );
  }
}
export default AttendancePage;
