import React, { Component } from "react";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import VideoUploader from "../../Components/VideoUploaderBanner/VideoUploader";
import Select from "react-select";
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

class EditCommunity extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "editcommunity");
    this.state = {
      communityid: props.match.params.communityid,
      communityname: "",
      bannerpic: [],
      gallerypic: [],
      videourlTop: [],
      videourlBottom: [],
      isdefault: false,
      isavailable: false,
      dataCommunity: [],
      communitycode: "",
      community: null,
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
    this.defaultHandleChecked = this.defaultHandleChecked.bind(this);
    this.availableHandleChecked = this.availableHandleChecked.bind(this);
  }

  onUploadImage = (result) => {
    this.setState({ bannerpic: result });
  };

  onUploadGallery = (result) => {
    this.setState({ gallerypic: result });
  };

  onUploadVideoUrlTop = (result) => {
    this.setState({ videourlTop: result });
  };

  onUploadVideoUrlBottom = (result) => {
    this.setState({ videourlBottom: result });
  };

  defaultHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ isdefault: checked });
  }

  availableHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ isavailable: checked });
  }

  changeSelectCommunity = (community) => {
    this.setState({
      community: community,
      communitycode: community.communityCode,
      communityname: community.label,
    });
  };

  checkData = () => {
    const { communityname } = this.state;

    if (communityname === "") {
      this.setState({
        messageError: "Select Community.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "community_by_id.php",
        {
          communityid: this.state.communityid,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        this.props.doLoading();
        this.setState({ communityid: response.data.record.communityid });
        this.setState({ communityname: response.data.record.communityname });
        this.setState({ communitycode: response.data.record.communityCode });
        this.setState({ bannerpic: response.data.record.bannerpic });
        this.setState({ gallerypic: response.data.record.gallerypic });
        this.setState({ videourlTop: response.data.record.videoTop });
        this.setState({ videourlBottom: response.data.record.videoBottom });
        this.setState({
          isdefault: response.data.record.isdefault === 1 ? true : false,
        });
        this.setState({
          isavailable: response.data.record.isavailable === 1 ? true : false,
        });
        this.getListCommunity(
          response.data.record.communityname,
          response.data.record.communityCode
        );
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getListCommunity = (communityName, communityCode) => {
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/community.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = response.data.records;
        this.setState({ dataCommunity: tmp });

        const res = tmp.filter(
          (elm) =>
            elm.label === communityName && elm.communityCode === communityCode
        );
        this.setState({
          community: res[0],
        });
        // console.log(res);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  onSubmit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "community_insert_update.php",
        {
          communityid: this.state.communityid,
          communityname: this.state.community.label,
          communitycode: this.state.community.communityCode,
          bannerpic: this.state.bannerpic,
          gallerypic: this.state.gallerypic,
          videourlBottom: this.state.videourlBottom,
          videourlTop: this.state.videourlTop,
          isdefault: this.state.isdefault ? 1 : 0,
          isavailable: this.state.isavailable ? 1 : 0,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        this.props.doLoading();
        this.setState({
          openSuccess: true,
        });
        // alert(this.language.savesuccess);
        // this.props.updateCommunity();
        // this.props.history.push("/panel/listcommunity");
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
      setTimeout(() => this.props.history.push("/panel/listcommunity"), 1000);

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
                    this.props.history.push("/panel/listcommunity")
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
            onClick={() => this.props.history.push("/panel/listadmin")}
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
            Add Community
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
                <Select
                  // isClearable
                  classNamePrefix="select"
                  placeholder="Select For..."
                  value={this.state.community}
                  onChange={this.changeSelectCommunity}
                  options={this.state.dataCommunity}
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
                  Image Banner Top
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImage}
                  picList={this.state.bannerpic}
                  picLimit={20}
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
                  Image Banner Bottom
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadGallery}
                  picList={this.state.gallerypic}
                  picLimit={20}
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
                  Video Banner Top
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <VideoUploader
                  onUpload={this.onUploadVideoUrlTop}
                  picList={this.state.videourlTop}
                  picLimit={3}
                ></VideoUploader>
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
                  Video Banner Bottom
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <VideoUploader
                  onUpload={this.onUploadVideoUrlBottom}
                  picList={this.state.videourlBottom}
                  picLimit={3}
                ></VideoUploader>
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
                  {this.language.fielddefault}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Checkbox
                  checked={this.state.isdefault}
                  onChange={(event) => this.defaultHandleChecked(event)}
                  inputProps={{ "aria-label": "controlled" }}
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
                  onChange={(event) => this.availableHandleChecked(event)}
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
              onClick={() => this.props.history.push("/panel/listcommunity")}
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
export default EditCommunity;
