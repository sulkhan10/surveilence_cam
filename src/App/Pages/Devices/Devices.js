import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import Iframe from "react-iframe";
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
import { Input } from "reactstrap";
import {
  Refresh,
  Edit,
  Delete,
  AddBox,
  Close,
  Save,
  Cancel,
} from "@mui/icons-material";
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

class DevicesPage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listadmin");
    this.state = {
      tableData: [],
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

  changeSelectIsavailable = (isAvailable) => {
    this.setState({ isAvailable: isAvailable });
  };

  doRowEdit = (row) => {
    this.setState({
      setOpenEdit: true,
      groupId: row.groupId,
      groupName: row.groupName,
      isAvailable: row.isAvailable === "SHOW" ? 1 : 0,
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

  componentDidMount = () => {
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
    };

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
      error: "",
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
        fullWidth="md"
        maxWidth="md"
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
                  Add Devices
                </Typography>

                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <div className="box-container">
          <Iframe
            url={"http://localhost:8080/"}
            width="100%"
            height="1000px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            // onLoad={this.hideLoading}
          />
        </div>
      </Box>
    );
  }
}
export default DevicesPage;
