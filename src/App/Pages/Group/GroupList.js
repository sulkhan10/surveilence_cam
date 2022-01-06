import React, { Component } from "react";
import { apiCameraSelect } from "../../Service/api";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
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
} from "@mui/material";
import { Input, FormGroup, Label } from "reactstrap";
import {
  Refresh,
  Edit,
  Delete,
  AddBox,
  Close,
  Save,
  Cancel,
  Check,
} from "@mui/icons-material";
import Select from "react-select";
const stylesListComent = {
  inline: {
    display: "inline",
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
    backgroundColor: "#036b50",
  },
  title: {
    marginLeft: 0,
    flex: 1,
    fontSize: 16,
  },
};

class GroupListPage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listadmin");
    this.state = {
      tableData: [],
      tableDisplay: [],
      filter: "",
      groupId: 0,
      groupName: "",
      isAvailable: 0,
      isAvailableShow: [
        { value: 0, text: "HIDDEN" },
        { value: 1, text: "SHOW" },
      ],
      setOpenValidation: false,
      openSuccess: false,
      openSuccessText: "",
      setOpenAddNew: false,
      setOpenEdit: false,
      setOpenFormInfo: false,
      rowDetail: [],
      selectedOptionDevice: null,
      optionsDevice: [],
      deviceSelected: [],
      itemDeleted: {},
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
        Header: "Group Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "groupName",
        style: { textAlign: "center" },
      },
      {
        Header: "Is Available",
        headerStyle: { fontWeight: "bold" },
        accessor: "isAvailable",
        style: { textAlign: "center" },
      },

      {
        Header: this.language.columnaction,
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
  }

  handleChangeOptionDevice = (selectedOptionDevice) => {
    // console.log(selectedOptionDevice);
    this.setState({ selectedOptionDevice });
  };

  changeSelectIsavailable = (isAvailable) => {
    this.setState({ isAvailable: isAvailable });
  };

  doRowEdit = (row) => {
    // console.log(row);
    this.setState({
      setOpenEdit: true,
      groupId: row.groupId,
      groupName: row.groupName,
      isAvailable: row.isAvailable === "SHOW" ? 1 : 0,
      tableDisplay: row.info,
    });
  };

  doRowDelete = (row) => {
    // console.log(row);
    confirmAlert({
      message: "Are you sure want to delete group " + row.groupName + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (phoneno) => {
            var groupId = row.groupId;
            // console.log(groupId);
            this.deleteGroup(groupId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    // this.props.history.push("/panel/inputadmin");
    this.setState({
      setOpenAddNew: true,
    });
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "group_list.php",
        {},

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

  deleteGroup = (groupId) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "group_delete.php",
        {
          groupId: groupId,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        this.setState({
          openSuccess: true,
          openSuccessText: "Data deleted successfully",
        });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  loadCameraSelect = () => {
    apiCameraSelect()
      .then((response) => {
        let dataresponse = response.data;
        // console.log(response);
        if (dataresponse.records.length > 0) {
          this.setState({
            optionsDevice: dataresponse.records,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.loadCameraSelect();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "group_list.php",
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

  reset = () => {
    let data = "";
    this.setState({ filter: data, openSuccess: false, openSuccessText: "" });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "group_list.php",
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

  onSubmit = () => {
    let params = {
      groupId: this.state.groupId,
      groupName: this.state.groupName,
      isAvailable: this.state.isAvailable,
      deviceInfo: this.state.tableDisplay,
    };

    // console.log(params);

    this.props.doLoading();
    axios
      .post(serverUrl + "group_insert_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        this.setState({
          openSuccess: true,
          openSuccessText:
            this.state.setOpenEdit === true
              ? "Edit data successfully updated"
              : "Data save successfully",
        });
        this.handleCloseAddNew();
        this.handleCloseEdit();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  checkData = () => {
    const { groupName } = this.state;

    if (groupName === "") {
      this.setState({
        messageError: "Enter group name.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
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

  handleCloseAddNew = () => {
    this.setState({
      setOpenAddNew: false,
      groupName: "",
      isAvailable: 0,
    });
  };

  renderDialogAddNew = () => {
    return (
      <Dialog
        onClose={this.handleCloseAddNew}
        aria-labelledby="customized-dialog-title"
        open={this.state.setOpenAddNew}
        fullWidth="md"
        maxWidth="md"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography variant="h5" style={stylesDialog.title}>
              Add Group
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleCloseAddNew()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }} style={{ marginBottom: 60, marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#036b50",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Group Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="groupname"
                  id="groupname"
                  placeholder="Enter group name"
                  value={this.state.groupName}
                  onChange={(event) =>
                    this.setState({ groupName: event.target.value })
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
                    color: "#036b50",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Is Available
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.isAvailable}
                  valueColumn={"value"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.isAvailableShow}
                  onChange={this.changeSelectIsavailable}
                />
              </Grid>
            </Grid>
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
            onClick={() => this.handleCloseAddNew()}
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

  handleCloseEdit = () => {
    this.setState({
      setOpenEdit: false,
      groupId: 0,
      groupName: "",
      isAvailable: 0,
    });
  };

  renderDialogEdit = () => {
    return (
      <Dialog
        onClose={this.handleCloseEdit}
        aria-labelledby="customized-dialog-title"
        open={this.state.setOpenEdit}
        fullWidth="lg"
        maxWidth="lg"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography variant="h5" style={stylesDialog.title}>
              Edit Group
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleCloseEdit()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }} style={{ marginBottom: 60, marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#036b50",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Group Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="groupname"
                  id="groupname"
                  placeholder="Enter group name"
                  value={this.state.groupName}
                  onChange={(event) =>
                    this.setState({ groupName: event.target.value })
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
                    color: "#036b50",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Is Available
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.isAvailable}
                  valueColumn={"value"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.isAvailableShow}
                  onChange={this.changeSelectIsavailable}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <div className="form-detail">{this.renderDeviceInfo()}</div>
              </Grid>
            </Grid>
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
            onClick={() => this.handleCloseEdit()}
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

  renderDeviceInfo = () => {
    return (
      <div className="form-detail">
        <div className="page-header">
          <Typography
            component="span"
            variant="h2"
            style={{
              fontSize: 16,
              color: "#006432",
              fontWeight: "bold",
              textTransform: "capitalize",
              float: "left",
            }}
          >
            Device Camera List
          </Typography>
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#008b02",
              float: "right",
            }}
            startIcon={<AddBox />}
            onClick={() => this.addNewInfo()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 14,
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Add Device
            </Typography>
          </Button>
          <span className="dash">&nbsp;&nbsp;</span>
        </div>
        <div className="detail-info-input">
          <FormGroup>
            <br></br>
            <ReactTable
              ref={(r) => (this.reactTable = r)}
              data={this.state.tableDisplay}
              columns={[
                {
                  Header: "Device Name",
                  headerStyle: { fontWeight: "bold" },
                  accessor: "deviceName",
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
                  sortable: true,
                  filterable: true,
                  style: { textAlign: "center" },
                  Cell: (e) => (
                    <div>
                      <Button
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: "#ff0000",
                        }}
                        startIcon={<Delete />}
                        onClick={() => this.doRowDeleteInfo(e.original)}
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
              ]}
              style={{ backgroundColor: "#f2f2f2" }}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id])
                  .toLowerCase()
                  .includes(filter.value.toLowerCase())
              }
              defaultPageSize={5}
            />
          </FormGroup>
        </div>
      </div>
    );
  };

  addNewInfo = () => {
    this.setState({
      setOpenFormInfo: true,
    });
  };

  handleCloseRowInfo = () => {
    this.setState({
      setOpenFormInfo: false,
      selectedOptionDevice: null,
    });
  };

  renderFormInfo = () => {
    return (
      <Dialog
        open={this.state.setOpenFormInfo}
        onClose={this.handleCloseRowInfo}
        aria-labelledby="customized-dialog-title"
        fullWidth="md"
        maxWidth="md"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography
              component="span"
              variant="h2"
              style={stylesDialog.title}
            >
              Add Device
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleCloseRowInfo()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }} style={{ marginBottom: 60, marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Label for="infoName">Device Camera</Label>
              </Grid>
              <Grid item xs={10}>
                <Select
                  isClearable
                  classNamePrefix="select"
                  placeholder="Select For..."
                  value={this.state.selectedOptionDevice}
                  onChange={this.handleChangeOptionDevice}
                  options={this.state.optionsDevice}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#808080",
            }}
            startIcon={<Cancel />}
            onClick={this.handleCloseRowInfo}
          >
            <Typography
              variant="button"
              style={{
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Cancel
            </Typography>
          </Button>{" "}
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#004dcf",
            }}
            startIcon={<Save />}
            onClick={() => this.checkDataInfo()}
          >
            <Typography
              variant="button"
              style={{
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Save
            </Typography>
          </Button>{" "}
        </DialogActions>
      </Dialog>
    );
  };

  checkDataInfo = () => {
    const { selectedOptionDevice } = this.state;
    if (selectedOptionDevice === null) {
      this.setState({
        messageError: "Select device camera",
        setOpenValidation: true,
      });
    } else {
      this.doSaveInfoDevice();
    }
  };

  doSaveInfoDevice = () => {
    var infoData = {
      deviceId: this.state.selectedOptionDevice.deviceId,
      deviceName: this.state.selectedOptionDevice.deviceName,
      urlRTSP: this.state.selectedOptionDevice.urlRTSP,
    };

    var dropDataInfo = this.state.tableDisplay || [];
    dropDataInfo.push(infoData);

    // console.log(dropDataInfo);
    this.setState({
      tableDisplay: dropDataInfo,
    });
    this.handleCloseRowInfo();
  };

  doRowDeleteInfo = (item) => {
    this.setState({
      openAlertDelete: true,
      itemDeleted: item,
    });
  };

  handleCloseItemInfo = () => {
    this.setState({
      openAlertDelete: false,
      itemDeleted: {},
    });
  };

  doDeleteInfoPaket = () => {
    let dataDisplay = this.state.tableDisplay;
    let itemRemove = this.state.itemDeleted;
    let resultItem = dataDisplay.filter(
      (obj, i) => obj.deviceId !== itemRemove.deviceId
    );

    this.setState({
      tableDisplay: resultItem,
      openAlertDelete: false,
      itemDeleted: {},
    });
  };

  renderRemoveItemInfo = () => {
    let item = this.state.itemDeleted;
    return (
      <Dialog
        open={this.state.openAlertDelete}
        onClose={this.handleCloseItemInfo}
        aria-labelledby="customized-dialog-title"
        fullWidth="sm"
        maxWidth="sm"
      >
        <AppBar style={stylesDialog.appBar}>
          <Toolbar>
            <Typography
              component="span"
              variant="h2"
              style={stylesDialog.title}
            >
              Delete Device
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => this.handleCloseItemInfo()}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent style={{ marginTop: 10 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListDialog.inline, { fontSize: 16, color: "#333" })}
            >
              Are you sure want to delete device {item.deviceName}?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#808080",
            }}
            startIcon={<Cancel />}
            onClick={this.handleCloseItemInfo}
          >
            <Typography
              variant="button"
              style={{
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              No
            </Typography>
          </Button>{" "}
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#0693e3",
            }}
            startIcon={<Check />}
            onClick={() => this.doDeleteInfoPaket()}
          >
            <Typography
              variant="button"
              style={{
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Yes
            </Typography>
          </Button>{" "}
        </DialogActions>
      </Dialog>
    );
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
                  Group
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
        {this.renderDialogAddNew()}
        {this.renderDialogValidation()}
        {this.renderSuccess()}
        {this.renderDialogEdit()}
        {this.renderFormInfo()}
        {this.renderRemoveItemInfo()}
      </Box>
    );
  }
}
export default GroupListPage;
