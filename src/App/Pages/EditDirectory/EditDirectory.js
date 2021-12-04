import React, { Component } from "react";
import { Input } from "reactstrap";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import "react-datepicker/dist/react-datepicker.css";
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
  Checkbox,
} from "@mui/material";

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};

class EditDirectory extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.lang = getLanguage(activeLanguage, "listcommodity");
    this.language = getLanguage(activeLanguage, "editdirectory");
    this.state = {
      directoryid: props.match.params.directoryid,
      directoryname: "",
      directorycategoryid: 0,
      directoryCategoryShow: [],
      directoryaddress: "",
      facebook: "",
      twitter: "",
      instagram: "",
      latitude: -6.1772007,
      longitude: 106.9569963,
      directorywebsite: "",
      directoryphone: "",
      directorypicture: [],
      type: "",
      communityid: "",
      isavailable: false,
      zoom: 17,
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
  }

  selectCommunity = (companyShow) => {
    axios
      .post(
        serverUrl + "cp_community_list_available.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ communityShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  selectDirectoryCategory = () => {
    axios
      .post(
        serverUrl + "directorycategory_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ directoryCategoryShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  changeCommunity = (communityid) => {
    this.setState({ communityid: communityid });
  };

  changeDirectoryCategory = (directorycategoryid) => {
    this.setState({ directorycategoryid: directorycategoryid });
  };

  onUploadImage = (result) => {
    this.setState({ directorypicture: result });
  };

  isAvailableChecked(event) {
    let checked = event.target.checked;
    this.setState({ isavailable: checked });
  }

  checkData = () => {
    const { directoryname } = this.state;

    if (directoryname === "") {
      this.setState({
        messageError: "Enter directory name.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
  };

  componentDidMount = () => {
    this.selectCommunity();
    this.selectDirectoryCategory();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "directory_by_id.php",
        {
          directoryid: this.state.directoryid,
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
        if (response.data.record.directorypicture !== "") {
          tmp.push(response.data.record.directorypicture);
        }
        this.setState({ directoryid: response.data.record.directoryid });
        this.setState({
          directorycategoryid: response.data.record.directorycategoryid,
        });
        this.setState({ latitude: response.data.record.latitude });
        this.setState({ longitude: response.data.record.longitude });
        this.setState({
          directoryaddress: response.data.record.directoryaddress,
        });
        this.setState({ facebook: response.data.record.facebook });
        this.setState({ twitter: response.data.record.twitter });
        this.setState({ instagram: response.data.record.instagram });
        this.setState({ directoryname: response.data.record.directoryname });
        this.setState({
          directorywebsite: response.data.record.directorywebsite,
        });
        this.setState({ directoryphone: response.data.record.directoryphone });
        this.setState({ directorypicture: tmp });
        this.setState({ communityid: response.data.record.communityid });
        this.setState({
          isavailable: response.data.record.isavailable === 1 ? true : false,
        });
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  onSubmit = (param) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "directory_insert_update.php",
        {
          directoryid: this.state.directoryid,
          directorycategoryid: this.state.directorycategoryid,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          directoryaddress: this.state.directoryaddress,
          facebook: this.state.facebook,
          twitter: this.state.twitter,
          instagram: this.state.instagram,
          directoryname: this.state.directoryname,
          directorywebsite: this.state.directorywebsite,
          directoryphone: this.state.directoryphone,
          directorypicture: this.state.directorypicture,
          communityid: this.state.communityid,
          isavailable: this.state.isavailable,
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
        // this.props.history.push("/panel/listdirectory");
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
      setTimeout(() => this.props.history.push("/panel/listdirectory"), 1000);

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
                  onClick={() =>
                    this.props.history.push("/panel/listdirectory")
                  }
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
            onClick={() => this.props.history.push("/panel/listdirectory")}
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
            Add Directory
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
                  {this.language.fieldname}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.directoryname}
                  placeholder={this.language.fieldname}
                  onChange={(event) =>
                    this.setState({ directoryname: event.target.value })
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
                  {this.language.fieldcategory}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.directorycategoryid}
                  valueColumn={"directorycategoryid"}
                  showColumn={"directorycategoryname"}
                  columns={["directorycategoryname"]}
                  data={this.state.directoryCategoryShow}
                  onChange={this.changeDirectoryCategory}
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
                  {this.language.fieldaddress}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  name="address"
                  id="address"
                  rows={3}
                  value={this.state.directoryaddress}
                  placeholder={this.language.fieldaddress}
                  onChange={(event) =>
                    this.setState({ directoryaddress: event.target.value })
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
                  {this.language.fieldfacebook}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="facebook"
                  id="facebook"
                  value={this.state.facebook}
                  placeholder={this.language.fieldfacebook}
                  onChange={(event) =>
                    this.setState({ facebook: event.target.value })
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
                  {this.language.fieldtwitter}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="twitter"
                  id="twitter"
                  value={this.state.twitter}
                  placeholder="@twitter"
                  onChange={(event) =>
                    this.setState({ twitter: event.target.value })
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
                  {this.language.fieldinstagram}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="instagram"
                  id="instagram"
                  value={this.state.instagram}
                  placeholder="@instagram"
                  onChange={(event) =>
                    this.setState({ instagram: event.target.value })
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
                  {this.language.fieldlatitude}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="number"
                  name="latitude"
                  id="latitude"
                  value={this.state.latitude}
                  onChange={(event) =>
                    this.setState({ latitude: event.target.value })
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
                  {this.language.fieldlongitude}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="number"
                  name="longitude"
                  id="longitude"
                  value={this.state.longitude}
                  onChange={(event) =>
                    this.setState({ longitude: event.target.value })
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
                  {this.language.fieldwebsite}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="website"
                  id="website"
                  placeholder="www.google.com"
                  value={this.state.directorywebsite}
                  onChange={(event) =>
                    this.setState({ directorywebsite: event.target.value })
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
                  {this.language.fieldphone}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="021xxxxxxx"
                  value={this.state.directoryphone}
                  onChange={(event) =>
                    this.setState({ directoryphone: event.target.value })
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
                  {this.globallang.uploadpicture}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImage}
                  picList={this.state.directorypicture}
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
                  {this.language.fieldcommunity}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.communityid}
                  valueColumn={"communityid"}
                  showColumn={"communityname"}
                  columns={["communityname"]}
                  data={this.state.communityShow}
                  onChange={this.changeCommunity}
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
                  {this.language.fieldavailable}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Checkbox
                  checked={this.state.isavailable}
                  onChange={(event) => this.isAvailableChecked(event)}
                  inputProps={{ "aria-label": "controlled" }}
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
              onClick={() => this.props.history.push("/panel/listdirectory")}
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
export default EditDirectory;
