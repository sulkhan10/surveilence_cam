import React, { Component } from "react";
import { Input } from "reactstrap";
import axios from "axios";
import moment from "moment";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowBackIos,
  Cancel,
  Save,
  WarningAmber,
  Close,
} from "@mui/icons-material";
import ButtonUI from "@mui/material/Button";
import {
  Typography,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "edituser");
    this.state = {
      phoneno: props.match.params.phoneno,
      name: "",
      genderid: "",
      gendername: "",
      place_ofbirth: "",
      dob: "",
      address: "",
      resident_name: "",
      vehicle_number: "",
      type_fuel: "",
      captiva_type: "",
      chapterName: "",
      locationName: "",
      profilepic: [],
      date: moment(),
      businessqrcode: "",
      company: "",
      location: "",
      email: "",
      isActive: "",
      joinDate: "",
      issuspend: 0,
      password: "",
      colleague: false,
      dataGender: [],
      dataUserType: [],
      userdetailid: 0,
      tempuserdetailid: 0,
      customerid: "",
      label: "",
      address: "",
      userdetailtypeid: 0,
      userdetailtypename: "",
      communityid: 0,
      communityname: "",
      communityShow: [],
      modalIsOpen: false,
      tableUserDetail: [],
      tableDisplay: [],
      tableUserVehicle: [],
      uservehicleid: 0,
      plateno: "",
      vehicletypeid: 0,
      vehicletypeShow: [],
      uservehicletypeid: 0,
      dateExpired: new Date(),
      modalUserVehicleIsOpen: false,
      dataSuspend: [
        { value: 0, label: "NO" },
        { value: 1, label: "YES" },
      ],
      dataActive: [
        { value: "Not Active", label: "Not Active" },
        { value: "Active", label: "Active" },
      ],
      dataFuel: [
        { value: "Diesel", label: "Diesel" },
        { value: "Bensin", label: "Bensin" },
      ],
      dataVehicle: [],
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
  }

  changeSelect = (suspend) => {
    this.setState({ issuspend: suspend });
  };

  changeActive = (isActive) => {
    this.setState({ isActive: isActive });
  };

  changeFuel = (type_fuel) => {
    this.setState({ type_fuel: type_fuel });
  };

  changeVehicleType = (captiva_type) => {
    this.setState({ captiva_type: captiva_type });
  };

  ChangedateExpired = (event) => {
    // console.log(event.target.value);
    this.setState({ dateExpired: event.target.value });
  };

  componentDidMount = (dataGender) => {
    // localStorage.clear();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_by_phoneno.php",
        {
          phoneno: this.state.phoneno,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response, logintype) => {
        this.props.doLoading();
        let tmp = [];
        if (response.data.record.profilepic !== "") {
          tmp.push(response.data.record.profilepic);
        }
        this.setState({ phoneno: response.data.record.phoneno });
        this.setState({ name: response.data.record.name });
        this.setState({ gendername: response.data.record.gendername });
        this.setState({ place_ofbirth: response.data.record.place_ofbirth });
        this.setState({ dob: response.data.record.dob });
        this.setState({ address: response.data.record.address });
        this.setState({ resident_name: response.data.record.resident_name });
        this.setState({ email: response.data.record.email });
        this.setState({ profilepic: tmp });
        this.setState({ vehicle_number: response.data.record.vehicle_number });
        this.setState({ type_fuel: response.data.record.type_fuel });
        this.setState({ captiva_type: response.data.record.captiva_type });
        this.setState({ chapterName: response.data.record.chapterName });
        this.setState({ locationName: response.data.record.locationName });
        this.setState({ issuspend: response.data.record.issuspend });
        this.setState({ isActive: response.data.record.isActive });
        this.setState({ joinDate: response.data.record.joinDate });
        this.setState({ dateExpired: response.data.record.expireDate });

        this.typeVehicle(response.data.record.captiva_type);
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  onSubmit = () => {
    this.props.doLoading();
    let params = {
      phoneno: this.state.phoneno,
      issuspend: this.state.issuspend,
      vehicle_number: this.state.vehicle_number,
      type_fuel: this.state.type_fuel,
      typeVehicle: this.state.captiva_type,
      isActive: this.state.isActive === "Active" ? 1 : 0,
      expireDate: this.state.dateExpired,
    };
    axios
      .post(serverUrl + "user_insert_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          this.setState({
            openSuccess: true,
          });
        }

        // alert(this.language.savesuccess);
        // this.props.history.push("/panel/listuser");
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  typeVehicle = (typeVehicle) => {
    console.log(typeVehicle);
    axios
      .post(
        serverUrl + "vehicle_type.php",
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
        this.setState({ dataVehicle: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
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
        <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: "#006432", paddingBottom: 35 }}
        >
          <div style={{ position: "absolute", right: "42%", top: "5%" }}>
            <WarningAmber style={{ color: "#fff", width: 40, height: 40 }} />
          </div>
        </DialogTitle>
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

  renderSuccess = () => {
    if (this.state.openSuccess === true) {
      setTimeout(() => this.props.history.push("/panel/listuser"), 1000);

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
                  onClick={() => this.props.history.push("/panel/listuser")}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {this.language.savesuccess}
            </Alert>
          </Stack>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <ButtonUI
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#006432",
            }}
            startIcon={<ArrowBackIos />}
            onClick={() => this.props.history.push("/panel/listuser")}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -10,
              }}
            >
              Back
            </Typography>
          </ButtonUI>{" "}
          <Typography
            component="span"
            variant="h2"
            style={{
              fontSize: 16,
              color: "#006432",
              fontWeight: "bold",
              textTransform: "capitalize",
              float: "right",
            }}
          >
            Edit Member
          </Typography>
          <span className="dash">&nbsp;&nbsp;</span>
        </div>
        <div className="box-container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.fieldphone}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="number"
                  disabled="disabled"
                  value={this.state.phoneno}
                  onChange={(event) =>
                    this.setState({ phoneno: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.name}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Gender
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.gendername}
                  onChange={(event) =>
                    this.setState({ gendername: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Place of birth
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.place_ofbirth}
                  onChange={(event) =>
                    this.setState({ place_ofbirth: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Date of birth
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.dob}
                  onChange={(event) =>
                    this.setState({ dob: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Home Address
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  disabled="disabled"
                  value={this.state.address}
                  onChange={(event) =>
                    this.setState({ address: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  City of Residence
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.resident_name}
                  onChange={(event) =>
                    this.setState({ resident_name: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Email
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.email}
                  onChange={(event) =>
                    this.setState({ email: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Vehicle Number
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  // disabled="disabled"
                  value={this.state.vehicle_number}
                  onChange={(event) =>
                    this.setState({ vehicle_number: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Type of Fuel
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.type_fuel}
                  valueColumn={"value"}
                  showColumn={"label"}
                  columns={["label"]}
                  data={this.state.dataFuel}
                  onChange={this.changeFuel}
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Captiva Type of Vehicle
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.captiva_type}
                  valueColumn={"vehicleName"}
                  showColumn={"vehicleName"}
                  columns={["vehicleName"]}
                  data={this.state.dataVehicle}
                  onChange={this.changeVehicleType}
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Chapter
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.chapterName}
                  onChange={(event) =>
                    this.setState({ chapterName: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Location
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.locationName}
                  onChange={(event) =>
                    this.setState({ locationName: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Join Member
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  disabled="disabled"
                  value={this.state.joinDate}
                  onChange={(event) =>
                    this.setState({ joinDate: event.target.value })
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
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Membership
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.isActive}
                  valueColumn={"value"}
                  showColumn={"label"}
                  columns={["label"]}
                  data={this.state.dataActive}
                  onChange={this.changeActive}
                />
              </Grid>

              {this.state.isActive === "Active" ? (
                <>
                  <Grid item xs={2}>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      style={{
                        // fontSize: 16,
                        float: "left",
                        marginTop: 6,
                        color: "#006432",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      Expired Date
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Input
                      autoComplete="off"
                      type="date"
                      name="date"
                      id="exampleDate"
                      value={this.state.dateExpired}
                      onChange={this.ChangedateExpired}
                      placeholder="Expired Date"
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Photo Profile
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImage}
                  picList={this.state.profilepic}
                  picLimit={1}
                ></PictureUploader>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.fieldsuspend}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.issuspend}
                  valueColumn={"value"}
                  showColumn={"label"}
                  columns={["label"]}
                  data={this.state.dataSuspend}
                  onChange={this.changeSelect}
                />
              </Grid>
            </Grid>
            <br></br>
          </Box>
          <br></br>
          <div className="form-button-container">
            <br></br>
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#d0021b",
              }}
              startIcon={<Cancel />}
              onClick={() => this.props.history.push("/panel/listuser")}
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
            </ButtonUI>{" "}
            &nbsp;&nbsp;
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#004dcf",
              }}
              startIcon={<Save />}
              onClick={() => this.onSubmit()}
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
            </ButtonUI>{" "}
          </div>
        </div>
        {this.renderSuccess()}
      </div>
    );
  }
}
export default EditUser;
