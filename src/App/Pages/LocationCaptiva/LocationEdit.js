import React, { Component } from "react";
import { Input } from "reactstrap";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
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

class EditLocation extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "inputtag");

    this.state = {
      locationId: props.match.params.id,
      locationName: "",
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
  }

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "location_captiva_get_by_id.php",
        {
          locationId: this.state.locationId,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        this.setState({ locationId: response.data.record.locationId });
        this.setState({ locationName: response.data.record.locationName });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  checkData = () => {
    const { locationName } = this.state;

    if (locationName === "") {
      this.setState({
        messageError: "Enter Location Captiva.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
  };

  onSubmit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "location_captiva_insert_update.php",
        {
          locationId: this.state.locationId,
          locationName: this.state.locationName,
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
        });
        // alert(this.language.savesuccess);
        // this.props.history.push("/panel/location");
      })
      .catch((error) => {
        this.props.doLoading();
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
      setTimeout(() => this.props.history.push("/panel/location"), 1000);

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
                  onClick={() => this.props.history.push("/panel/location")}
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
            onClick={() => this.props.history.push("/panel/location")}
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
            Edit Location Captiva
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
                  Location Captiva
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="locationName"
                  id="locationName"
                  value={this.state.locationName}
                  placeholder="Enter location captiva"
                  onChange={(event) =>
                    this.setState({ locationName: event.target.value })
                  }
                />
              </Grid>
            </Grid>
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
              onClick={() => this.props.history.push("/panel/location")}
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
                Submit
              </Typography>
            </ButtonUI>{" "}
          </div>
        </div>
        {this.renderDialogValidation()}
        {this.renderSuccess()}
      </div>
    );
  }
}
export default EditLocation;
