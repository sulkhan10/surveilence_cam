import React, { Component } from "react";
import {
  apiBrandDevice_List,
  apiBrandDevice_insert_update,
  apiBrandDevice_delete,
} from "../../Service/api";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
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
  Check,
} from "@mui/icons-material";
// import Select from "react-select";
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

class BrandDevicePage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listadmin");
    this.state = {
      tableData: [],
      tableDisplay: [],
      filter: "",
      brand_id: 0,
      brand_name: "",
      is_available: 0,
      is_availableShow: [
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
        Header: "Brand Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "brand_name",
        style: { textAlign: "center" },
      },
      {
        Header: "Is Available",
        headerStyle: { fontWeight: "bold" },
        accessor: "is_available",
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

  componentDidMount = () => {
    this.doLoadBrandDevices();
  };

  doLoadBrandDevices = () => {
    this.props.doLoading();
    apiBrandDevice_List()
      .then((res) => {
        this.props.doLoading();
        let data = res.data;
        if (data.status === "ok") {
          var temp = this.state.tableData;
          temp = data.records;
          for (var i = 0; i < temp.length; i++) {
            temp[i].id = i + 1;
            temp[i].is_available =
              temp[i].is_available === 0 ? "HIDDEN" : "SHOW";
          }
          this.setState({ tableData: temp });
        }
      })
      .catch((err) => {
        this.props.doLoading();
        console.log(err);
      });
  };

  deleteBrand = (brand_id) => {
    this.props.doLoading();
    apiBrandDevice_delete(brand_id)
      .then((res) => {
        this.props.doLoading();
        let data = res.data;
        if (data.status === "OK") {
          this.setState({
            openSuccess: true,
            openSuccessText: "Data deleted successfully",
          });
        }
      })
      .catch((err) => {
        this.props.doLoading();
        console.log(err);
      });
  };

  onSubmit = () => {
    let params = {
      brand_id: this.state.brand_id,
      brand_name: this.state.brand_name,
      is_available: this.state.is_available,
    };
    this.props.doLoading();

    apiBrandDevice_insert_update(params)
      .then((res) => {
        this.props.doLoading();
        let data = res.data;
        if (data.status === "OK") {
          this.setState({
            openSuccess: true,
            openSuccessText:
              this.state.setOpenEdit === true
                ? "Edit data successfully updated"
                : "Data save successfully",
          });
          this.handleCloseAddNew();
          this.handleCloseEdit();
        }
      })
      .catch((err) => {
        this.props.doLoading();
        console.log(err);
      });
  };

  changeSelectIsavailable = (is_available) => {
    this.setState({ is_available: is_available });
  };

  doRowEdit = (row) => {
    this.setState({
      setOpenEdit: true,
      brand_id: row.brand_id,
      brand_name: row.brand_name,
      is_available: row.is_available === "SHOW" ? 1 : 0,
    });
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: "Are you sure want to delete brand " + row.brand_name + "?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            var brand_id = row.brand_id;
            this.deleteBrand(brand_id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.setState({
      setOpenAddNew: true,
    });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data, openSuccess: false, openSuccessText: "" });
    this.doLoadBrandDevices();
  };

  checkData = () => {
    const { brand_name } = this.state;

    if (brand_name === "") {
      this.setState({
        messageError: "Enter brand name.",
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
      brand_name: "",
      is_available: 0,
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
              Add Brand
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
                  Brand Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="groupname"
                  id="groupname"
                  placeholder="Enter brand name"
                  value={this.state.brand_name}
                  onChange={(event) =>
                    this.setState({ brand_name: event.target.value })
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
                  value={this.state.is_available}
                  valueColumn={"value"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.is_availableShow}
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
      brand_id: 0,
      brand_name: "",
      is_available: 0,
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
              Edit Brand
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
                  Brand Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="brand_name"
                  id="brand_name"
                  placeholder="Enter brand name"
                  value={this.state.brand_name}
                  onChange={(event) =>
                    this.setState({ brand_name: event.target.value })
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
                  value={this.state.is_available}
                  valueColumn={"value"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.is_availableShow}
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
              Delete Brand
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
              Are you sure want to delete brand {item.deviceName}?
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
                  Brand
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
        {this.renderRemoveItemInfo()}
      </Box>
    );
  }
}
export default BrandDevicePage;
