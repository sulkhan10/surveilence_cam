import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import XLSX from "xlsx";
import { make_cols } from "../../Components/MakeColumns/MakeColumns";
import { SheetJSFT } from "../../Components/MakeColumns/types";
import ReactExport from "react-export-excel";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  DialogActions,
  DialogContent,
  IconButton,
  DialogContentText,
  Stack,
  Alert,
  List,
} from "@mui/material";
import { Input } from "reactstrap";
import {
  Refresh,
  Edit,
  Delete,
  AddBox,
  Close,
  Save,
  Cancel,
  Storage,
  ImportExport,
  Publish,
} from "@mui/icons-material";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const stylesListComent = {
  inline: {
    display: "inline",
  },
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

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};

const stylesDialog = {
  appBar: {
    position: "relative",
    backgroundColor: "#2f55a2",
  },
  title: {
    marginLeft: 0,
    flex: 1,
    fontSize: 16,
  },
};

class ListSchedule extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.reactTableJson = React.createRef();
    this.fileExcel = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      tableData: [],
      filter: "",
      department: "",
      departmentShow: [],
      startDate: moment(),
      endDate: moment(),
      scheduleId: 0,
      dateSchedule: "",
      timeIn: "",
      timeOut: "",
      staffName: "",
      employeeId: "",
      departmentStaff: "",
      status: "",
      golongan: "",
      keterangan: "",
      dataJson: [],
      openResult: false,
      setOpenValidation: false,
      setOpenEdit: false,
      messageError: "",
      file: "",
      data: [],
      cols: [],
      dataTemplate: [
        {
          id: 1,
          department: "IPRS(CS)",
          tanggal: "2021-01-01",
          employeeId: "18062726000",
          nama: "Dr. nama A",
          status: "NON PNS",
          golongan: "I",
          keterangan: "P",
          timeIn: "08:00",
          timeOut: "13:00",
        },
        {
          id: 2,
          department: "IPRS(CS)",
          tanggal: "2021-01-01",
          employeeId: "18062726000",
          nama: "Dr. nama A",
          status: "NON PNS",
          golongan: "I",
          keterangan: "S",
          timeIn: "13:00",
          timeOut: "17:00",
        },
        {
          id: 3,
          department: "IPRS(CS)",
          tanggal: "2021-01-01",
          employeeId: "18062726000",
          nama: "Dr. nama A",
          status: "NON PNS",
          golongan: "I",
          keterangan: "M",
          timeIn: "17:00",
          timeOut: "08:00",
        },
        {
          id: 4,
          department: "IPRS(CS)",
          tanggal: "2021-01-01",
          employeeId: "18062726000",
          nama: "Dr. nama A",
          status: "NON PNS",
          golongan: "I",
          keterangan: "L",
          timeIn: "",
          timeOut: "",
        },
        {
          id: 4,
          department: "IPRS(CS)",
          tanggal: "2021-01-01",
          employeeId: "18062726000",
          nama: "Dr. nama A",
          status: "NON PNS",
          golongan: "I",
          keterangan: "C",
          timeIn: "",
          timeOut: "",
        },
      ],
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);

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
        accessor: "tanggal",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => moment(e.original.tanggal).format("LL"),
      },
      {
        Header: "Nama",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
        // width: 200,
      },
      {
        Header: "Employee Id",
        headerStyle: { fontWeight: "bold" },
        accessor: "employeeId",
        style: { textAlign: "left" },
        // width: 200,
      },
      {
        Header: "Department",
        headerStyle: { fontWeight: "bold" },
        accessor: "department",
        style: { textAlign: "left" },
        // width: 200,
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "status",
        style: { textAlign: "center" },
        // width: 200,
      },
      {
        Header: "Golongan",
        headerStyle: { fontWeight: "bold" },
        accessor: "golongan",
        style: { textAlign: "center" },
        // width: 200,
      },
      {
        Header: "Keterangan",
        headerStyle: { fontWeight: "bold" },
        accessor: "keterangan",
        style: { textAlign: "center" },
        // width: 200,
      },
      {
        Header: "Time",
        headerStyle: { fontWeight: "bold" },
        accessor: "time_in",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.time_in !== "" ? (
            <span>
              {e.original.time_in.substr(0, 5)} -{" "}
              {e.original.time_out.substr(0, 5)}
            </span>
          ) : (
            <span></span>
          ),
      },
      {
        Header: "Action",
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => (
          <div>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#3f51b5",
              }}
              startIcon={<Edit />}
              onClick={() => this.doRowEdit(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.edit}
              </Typography>
            </Button>
            &nbsp;
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#ff0000",
              }}
              startIcon={<Delete />}
              onClick={() => this.doRowDelete(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.delete}
              </Typography>
            </Button>
          </div>
        ),
      },
    ];

    this.tableColumnsJson = [
      {
        Header: "Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "TANGGAL",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Nama",
        headerStyle: { fontWeight: "bold" },
        accessor: "NAMA",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Employee Id",
        headerStyle: { fontWeight: "bold" },
        accessor: "EMPLOYEE_ID",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Department",
        headerStyle: { fontWeight: "bold" },
        accessor: "DEPARTMENT",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "STATUS",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Golongan",
        headerStyle: { fontWeight: "bold" },
        accessor: "GOLONGAN",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Keterangan",
        headerStyle: { fontWeight: "bold" },
        accessor: "KETERANGAN",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Time",
        headerStyle: { fontWeight: "bold" },
        accessor: "TIME_IN",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.TIME_IN !== "" ? (
            <span>
              {e.original.TIME_IN.substr(0, 5)} -{" "}
              {e.original.TIME_OUT.substr(0, 5)}
            </span>
          ) : (
            <span></span>
          ),
      },
    ];
  }

  componentDidMount = () => {
    this.getDepartment();
    this.getDataBydate(this.state.department);
  };

  doRowEdit = (row) => {
    // console.log(row);
    this.setState({
      setOpenEdit: true,
      setOpenForm: true,
      scheduleId: row.scheduleId,
      dateSchedule: row.tanggal,
      staffName: row.name,
      employeeId: row.employeeId,
      departmentStaff: row.department,
      status: row.status,
      golongan: row.golongan,
      keterangan: row.keterangan,
      timeIn: row.time_in,
      timeOut: row.time_out,
    });
  };

  doRowDelete = (row) => {
    // console.log(row);
    confirmAlert({
      message: "Are you sure want to delete schedule " + row.name + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (id) => {
            var id = row.scheduleId;
            // console.log(id);
            this.deleteStaff(id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  deleteStaff = (id) => {
    this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_delete.php",
        {
          id: id,
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
        this.getDataBydate(this.state.department);
        this.getDepartment();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getDepartment = () => {
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_department.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // this.props.doLoading();
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ departmentShow: temp });
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doSearch = () => {};

  reset = () => {
    this.setState({
      department: "",
      dataJson: [],
      file: "",
    });
    this.getDataBydate("");
    this.getDepartment();
  };

  doUploadJadwal = (dataJadwal) => {
    console.log(dataJadwal);
    // this.props.doLoading();
    // let params = {
    //   dataUpload: dataJadwal,
    // };
    // // console.log(params);
    // axios
    //   .post(
    //     "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_upload.php",
    //     params,
    //     {
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     this.props.doLoading();
    //     // console.log(response);
    //     if (response.data.status === "ok") {
    //       alert("Upload Successfully");
    //       this.setState({
    //         file: "",
    //       });
    //       this.getDataBydate(this.state.department);
    //       this.getDepartment();
    //     }
    //   })
    //   .catch((error) => {
    //     this.props.doLoading();
    //     console.log(error);
    //     alert(error);
    //   });
  };

  getDataBydate = (department) => {
    this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_list.php",
        {
          department: department,
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
        alert(error);
      });
  };

  doSubmitForm = () => {
    this.setState({
      setOpenForm: false,
      setOpenEdit: false,
    });
    let paramBody = {
      scheduleId: this.state.scheduleId,
      dateSchedule: this.state.dateSchedule,
      staffName: this.state.staffName,
      employeeId: this.state.employeeId,
      department: this.state.departmentStaff,
      status: this.state.status,
      golongan: this.state.golongan,
      keterangan: this.state.keterangan,
      timeIn: this.state.timeIn,
      timeOut: this.state.timeOut,
    };
    // console.log(paramBody);
    this.props.doLoading();
    axios
      .post(
        "http://202.157.177.50/smarttmp_webapi_cp/rupit_schedule_addupdate.php",
        paramBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          alert("Upload Successfully");
          this.setState({
            file: "",
          });
          this.handleCloseForm();
          this.getDataBydate(this.state.department);
          this.getDepartment();
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  checkDataForm = () => {
    const { staffName } = this.state;
    const { employeeId } = this.state;

    if (staffName === "") {
      this.setState({
        messageError: "Enter staff name.",
        setOpenValidation: true,
      });
    } else if (employeeId === "") {
      this.setState({
        messageError: "Enter employee ID.",
        setOpenValidation: true,
      });
    } else {
      this.doSubmitForm();
    }
  };

  changeDepartment = (department) => {
    this.setState({
      department: department,
    });
    this.getDataBydate(department);
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
    // console.log(this.state.startDate);
  };

  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  doSeacrhBydate = () => {
    this.getDataBydate(this.state.department);
    this.getDepartment();
  };

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
    // this.setState({
    //   file: files,
    // });
  }

  handleFile() {
    if (this.state.file === "") {
      alert("File cannot be empty");
    } else {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;

      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws);
        // console.log("cek data json", data);

        this.setState({
          dataJson: data,
          openResult: true,
          // file: "",
        });
        // this.fileExcel = null;

        // this.doUploadJadwal(data);

        /* Update state */
        // this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
        // console.log(JSON.stringify(this.state.data, null, 2));
        // console.log(this.state.data);
        // });

        // this.doUploadJadwal(data);
      };

      if (rABS) {
        reader.readAsBinaryString(this.state.file);
      } else {
        reader.readAsArrayBuffer(this.state.file);
      }
    }
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    // console.log(file);
    this.setState({ file });

    // console.log(this.state.file);
  }

  readFile() {
    if (this.state.file === "") {
      alert("File cannot be empty");
    } else {
      var f = this.state.file;
      var name = f.name;
      const reader = new FileReader();
      reader.onload = (evt) => {
        // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        /* Update state */
        // console.log("Data>>>" + data); // shows that excel data is read
        // console.log(this.convertToJson(data)); // shows data in json format

        let dataFromExcel = this.convertToJson(data);
        let files = dataFromExcel.filter(
          (elm) => elm.DEPARTMENT !== "" && elm.DEPARTMENT !== undefined
        );
        // console.log("1234", files);
        // this.doUploadJadwal(files);
      };
      reader.readAsBinaryString(f);
    }
  }

  convertToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return result; //JSON
  }

  checkData = () => {
    this.doUploadJadwal(this.state.dataJson);
  };

  handleClose = () => {
    this.setState({
      openResult: false,
      dataJson: [],
    });
  };

  renderDialogDataJson = () => {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.openResult}
        fullWidth="lg"
        maxWidth="lg"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography variant="h5" style={stylesDialog.title}>
              Excel Data Result
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleClose()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }} style={{ marginBottom: 60, marginTop: 20 }}>
            <ReactTable
              ref={(r) => (this.reactTableJson = r)}
              data={this.state.dataJson}
              columns={this.tableColumnsJson}
              style={{ backgroundColor: "#f2f2f2" }}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id])
                  .toLowerCase()
                  .includes(filter.value.toLowerCase())
              }
              defaultPageSize={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#d0021b",
            }}
            startIcon={<Cancel />}
            onClick={() => this.handleClose()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Cancel
            </Typography>
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#004dcf",
            }}
            startIcon={<Save />}
            onClick={() => this.checkData()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Save
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  addNew = () => {
    this.setState({
      setOpenForm: true,
    });
  };

  handleCloseForm = () => {
    this.setState({
      setOpenForm: false,
      setOpenEdit: false,
      scheduleId: 0,
      dateSchedule: "",
      timeIn: "",
      timeOut: "",
      staffName: "",
      employeeId: "",
      departmentStaff: "",
      status: "",
      golongan: "",
      keterangan: "",
    });
  };

  changeDateSchedule = (event) => {
    this.setState({ dateSchedule: event.target.value });
  };

  changeTimeIn = (event) => {
    this.setState({
      timeIn: event.target.value,
    });
  };

  changeTimeOut = (event) => {
    this.setState({
      timeOut: event.target.value,
    });
  };

  renderDialogForm = () => {
    return (
      <Dialog
        onClose={this.handleCloseForm}
        aria-labelledby="customized-dialog-title"
        open={this.state.setOpenForm}
        fullWidth="md"
        maxWidth="md"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography variant="h5" style={stylesDialog.title}>
              {this.state.setOpenEdit === true
                ? "Edit Schedule"
                : "Add Schedule"}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleCloseForm()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <List>
            <Box
              sx={{ flexGrow: 1 }}
              style={{ marginBottom: 60, marginTop: 20 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Date
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                    value={this.state.dateSchedule}
                    onChange={this.changeDateSchedule}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Staff Name
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter staff name"
                    value={this.state.staffName}
                    onChange={(event) =>
                      this.setState({ staffName: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Employee ID
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="employeeId"
                    id="employeeId"
                    placeholder="Enter employee id"
                    value={this.state.employeeId}
                    onChange={(event) =>
                      this.setState({ employeeId: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Department
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="department"
                    id="department"
                    placeholder="Enter department"
                    value={this.state.departmentStaff}
                    onChange={(event) =>
                      this.setState({ departmentStaff: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Status
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="status"
                    id="status"
                    placeholder="Enter status"
                    value={this.state.status}
                    onChange={(event) =>
                      this.setState({ status: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Golongan
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="golongan"
                    id="golongan"
                    placeholder="Enter golongan"
                    value={this.state.golongan}
                    onChange={(event) =>
                      this.setState({ golongan: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Keterangan
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="keterangan"
                    id="keterangan"
                    placeholder="Enter keterangan"
                    value={this.state.keterangan}
                    onChange={(event) =>
                      this.setState({ keterangan: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Time IN
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    type="time"
                    name="time"
                    id="exampleTime"
                    value={this.state.timeIn}
                    onChange={this.changeTimeIn}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={{
                      // fontSize: 16,
                      float: "left",
                      marginTop: 6,
                      color: "#2f55a2",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    Time Out
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Input
                    type="time"
                    name="time"
                    id="exampleTime"
                    value={this.state.timeOut}
                    onChange={this.changeTimeOut}
                  />
                </Grid>
              </Grid>
            </Box>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#d0021b",
            }}
            startIcon={<Cancel />}
            onClick={() => this.handleCloseForm()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Cancel
            </Typography>
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#004dcf",
            }}
            startIcon={<Save />}
            onClick={() => this.checkDataForm()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Save
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handleCloseValid = () => {
    this.setState({
      setOpenValidation: false,
      messageError: "",
    });
  };

  renderDialogValidation = () => {
    return (
      <Dialog
        open={this.state.setOpenValidation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        titleStyle={{ textAlign: "center" }}
      >
        <DialogContent style={{ minWidth: 250, width: 300, marginTop: 10 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListDialog.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.messageError}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleCloseValid}
            color="primary"
            variant="outlined"
            size="small"
          >
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListDialog.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
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
                  maxHeight: 100,
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
                  Schedule
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
                      Start Date:
                    </Typography>
                  </div>
                  <div style={{ marginRight: 16 }}>
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
                      End Date:
                    </Typography>
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <DatePicker
                      minDate={subDays(new Date(), 30)}
                      maxDate={addDays(new Date(), 31)}
                      selected={this.state.endDate}
                      onChange={(date) => this.setEndDate(date)}
                      selectsEnd
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      minDate={this.state.startDate}
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
                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#008b02",
                      }}
                      startIcon={<AddBox />}
                      onClick={() => this.addNew()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        {this.globallang.add}
                      </Typography>
                    </Button>
                  </div>
                </div>
                <br></br>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                style={{
                  borderLeft: 6,
                  borderColor: "#2f55a2",
                  color: "#FFF",
                  maxHeight: 100,
                  padding: 16,
                  paddingBottom: 24,
                }}
              >
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
                      width={200}
                      value={this.state.department}
                      valueColumn={"department"}
                      showColumn={"department"}
                      columns={["department"]}
                      data={this.state.departmentShow}
                      onChange={this.changeDepartment}
                    />
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
                            Download Template
                          </Typography>
                        </Button>
                      }
                    >
                      <ExcelSheet
                        data={this.state.dataTemplate}
                        name="TEMPLATE SCHEDULE"
                      >
                        <ExcelColumn label="TANGGAL" value="tanggal" />
                        <ExcelColumn label="NAMA" value="nama" />
                        <ExcelColumn label="EMPLOYEE_ID" value="employeeId" />
                        <ExcelColumn label="DEPARTMENT" value="department" />
                        <ExcelColumn label="STATUS" value="status" />
                        <ExcelColumn label="GOLONGAN" value="golongan" />
                        <ExcelColumn label="KETERANGAN" value="keterangan" />
                        <ExcelColumn label="TIME_IN" value="timeIn" />
                        <ExcelColumn label="TIME_OUT" value="timeOut" />
                      </ExcelSheet>
                    </ExcelFile>
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <input
                      type="file"
                      className="form-control"
                      id="file"
                      ref={(r) => (this.fileExcel = r)}
                      accept={SheetJSFT}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006b76",
                      }}
                      startIcon={<Publish />}
                      onClick={() => this.handleFile()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        Upload
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
        {this.renderDialogDataJson()}
        {this.renderDialogForm()}
        {this.renderDialogValidation()}
      </Box>
    );
  }
}
export default ListSchedule;
