import React, { Component } from "react";
import { apiCameraList, apiCameraDelete } from "../../Service/api";
import { confirmAlert } from "react-confirm-alert";
import ReactTable from "react-table";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import { Refresh, Edit, Delete, AddBox, Close } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class DeviceCameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      filter: "",
      deviceId: 0,
      deviceName: "",
      IpAddress: "",
      urlRTSP: "",
      videoBitRate: "",
      frameRate: "",
      videoSize: "",
      outputFileFormat: "",
      videoCodec: "",
      setOpenValidation: false,
      openSuccess: false,
      openSuccessText: "",
      setOpenAddNew: false,
      setOpenEdit: false,
      rowDetail: [],
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
        Header: "Device Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "deviceName",
        style: { textAlign: "center" },
      },
      {
        Header: "IP Address",
        headerStyle: { fontWeight: "bold" },
        accessor: "IpAddress",
        style: { textAlign: "center" },
      },
      {
        Header: "Url RTSP",
        headerStyle: { fontWeight: "bold" },
        accessor: "urlRTSP",
        style: { textAlign: "center" },
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
                Edit
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
                Delete
              </Typography>
            </Button>
          </div>
        ),
      },
    ];
  }

  //=================================API Service==============================//

  loadCamera = () => {
    this.props.doLoading();
    apiCameraList()
      .then((response) => {
        this.props.doLoading();
        let dataresponse = response.data;
        if (dataresponse.status === "OK") {
          var temp = this.state.tableData;
          temp = response.data.records;
          for (var i = 0; i < temp.length; i++) {
            temp[i].id = i + 1;
          }
          this.setState({ tableData: temp });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
      });
  };

  deleteDevice = (deviceId) => {
    this.props.doLoading();
    apiCameraDelete(deviceId)
      .then((response) => {
        this.props.doLoading();
        let dataresponse = response.data;
        if (dataresponse.status === "OK") {
          this.setState({
            openSuccess: true,
            openSuccessText: "Data deleted successfully",
          });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
      });
  };

  //=================================Function & Method========================//

  componentDidMount = () => {
    this.loadCamera();
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/edit-device/" + row.deviceId);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: "Are you sure want to delete " + row.deviceName + "?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            var deviceId = row.deviceId;
            // console.log(deviceId);
            this.deleteDevice(deviceId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/add-device");
  };

  reset = () => {
    this.setState({ openSuccess: false, openSuccessText: "" });
    this.loadCamera();
  };

  renderSuccess = () => {
    if (this.state.openSuccess === true) {
      setTimeout(() => this.reset(), 1000);

      return (
        <div style={{ margin: 10 }}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert
              variant="filled"
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  // onClick={() => this.reset()}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {this.state.openSuccessText}
            </Alert>
          </Stack>
        </div>
      );
    }
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
                      color: "#006432",
                      fontWeight: "bold",
                    })
                  }
                >
                  Device Camera
                </Typography>
                <br></br>
                <div className="contentDate">
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
                        Refresh
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
                        Add New
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
        {this.renderSuccess()}
      </Box>
    );
  }
}
export default DeviceCameraPage;
