import React, { Component } from "react";
import { Input } from "reactstrap";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import CheckboxGroup from "../../Components/CheckboxGroup/CheckboxGroup";
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

class EditAdmin extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "editadmin");
    this.state = {
      phoneno: props.match.params.phoneno,
      name: "",
      logintype: "",
      profilepic: [],
      email: "",
      issuspend: 0,
      dataShow: [],
      communityList: [],
      MerchantShow: [],
      suspendShow: [
        { issuspendId: 0, issuspendName: "No" },
        { issuspendId: 1, issuspendName: "Yes" },
      ],
      merchantId: "",
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
  }

  selectRole = (dataShow) => {
    //var dataShow;
    axios
      .post(
        serverUrl + "cp_get_logincptype_list.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ dataShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  getrMerchant = () => {
    axios
      .post(
        serverUrl + "merchant_list.php",
        {
          filter: "",
          communityid: 22,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = response.data.records;
        this.setState({ MerchantShow: tmp });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  changeSelectMultiColumn = (logintypeid) => {
    this.setState({ logintype: logintypeid });
  };

  onUploadImage = (result) => {
    this.setState({ profilepic: result });
  };

  suspendHandleChange = (issuspend) => {
    this.setState({
      issuspend: issuspend,
    });
  };

  checkData = () => {
    const { phoneno } = this.state;
    const { name } = this.state;
    const { logintype } = this.state;
    const { password } = this.state;
    const { confirmpass } = this.state;
    const { communityList } = this.state;

    if (phoneno === "") {
      this.setState({
        messageError: "Enter phone number.",
        setOpenValidation: true,
      });
    } else if (name === "") {
      this.setState({
        messageError: "Enter name.",
        setOpenValidation: true,
      });
    } else if (logintype === "") {
      this.setState({
        messageError: "Select type user.",
        setOpenValidation: true,
      });
    } else if (password === "") {
      this.setState({
        messageError: "Enter Password.",
        setOpenValidation: true,
      });
    } else if (password !== confirmpass) {
      this.setState({
        messageError: "Password and confirm password do not match.",
        setOpenValidation: true,
      });
    } else if (communityList.length === 0) {
      this.setState({
        messageError: "Select access community.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
  };

  componentDidMount = (dataShow) => {
    this.selectRole(dataShow);
    this.props.doLoading();
    axios
      .post(
        serverUrl + "admin_by_phoneno.php",
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
        this.setState({ logintype: response.data.record.logintypeid });
        this.setState({ profilepic: tmp });
        this.setState({ email: response.data.record.email });
        this.setState({ issuspend: response.data.record.issuspend });
        this.setState({ communityList: response.data.record.community });
      })
      .catch((error) => {
        this.props.doLoading();

        alert(error);
      });
  };

  onChangeAccessCommunity = (update) => {
    this.setState({ communityList: update });
  };

  changeMerchant = (merchantId) => {
    this.setState({ merchantId: merchantId });
  };

  onSubmit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "admin_insert_update.php",
        {
          phoneno: this.state.phoneno,
          name: this.state.name,
          logintype: this.state.logintype,
          profilepic: this.state.profilepic,
          email: this.state.email,
          issuspend: this.state.issuspend,
          merchantId: this.state.merchantId,
          community: this.state.communityList,
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
        // this.props.history.push("/panel/admin");
      })
      .catch((error) => {
        this.props.doLoading();
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
      setTimeout(() => this.props.history.push("/panel/admin"), 1000);

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
                  onClick={() => this.props.history.push("/panel/admin")}
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
            onClick={() => this.props.history.push("/panel/admin")}
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
            Edit Admin
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
                  name="phoneno"
                  id="phoneno"
                  placeholder="08xxxxxxxxxx"
                  value={this.state.phoneno}
                  onChange={(event) =>
                    this.setState({ phoneno: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  for="name"
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
                  value={this.state.name}
                  placeholder={this.language.fieldname}
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
                  {this.language.fieldtype}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.logintype}
                  valueColumn={"logintypeid"}
                  showColumn={"logintypename"}
                  columns={["logintypename"]}
                  data={this.state.dataShow}
                  onChange={this.changeSelectMultiColumn}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  for="name"
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
                  Upload Photo
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
                  for="name"
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
                  {this.language.fieldemail}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="email"
                  name="email"
                  id="email"
                  placeholder={this.language.fieldemail}
                  value={this.state.email}
                  onChange={(event) =>
                    this.setState({ email: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  for="name"
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
                  {this.language.fieldaccesscommunity}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <CheckboxGroup
                  width={"100%"}
                  showKey={"communityname"}
                  data={this.state.communityList}
                  onChange={this.onChangeAccessCommunity}
                />
              </Grid>
              {this.state.logintype === 3 ? (
                <>
                  <Grid item xs={2}>
                    <Typography
                      for="name"
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
                      Access Merchant
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <SelectMultiColumn
                      width={"100%"}
                      value={this.state.merchantId}
                      valueColumn={"merchantid"}
                      showColumn={"merchantname"}
                      columns={["merchantname"]}
                      data={this.state.MerchantShow}
                      onChange={this.changeMerchant}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <Grid item xs={2}>
                <Typography
                  for="name"
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
                  valueColumn={"issuspendId"}
                  showColumn={"issuspendName"}
                  columns={["issuspendName"]}
                  data={this.state.suspendShow}
                  onChange={this.suspendHandleChange}
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
              onClick={() => this.props.history.push("/panel/admin")}
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
                Save
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
export default EditAdmin;
