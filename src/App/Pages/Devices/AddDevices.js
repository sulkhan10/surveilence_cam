import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { apiCameraAddUpdate, apiBrandDevice_List } from "../../Service/api";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { Input } from "reactstrap";
import Select from "react-select";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import "./Devices.style.css";
import {
  ArrowBackIos,
  Cancel,
  Save,
  // WarningAmber,
  Close,
  Dns,
  Videocam,
} from "@mui/icons-material";
import {
  Typography,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  // DialogTitle,
  Button,
  Stack,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};
var player = null;
const client = new W3CWebSocket("ws://127.0.0.1:4000");
// const client = new W3CWebSocket("ws://192.168.0.107:8000");
// const client = new W3CWebSocket("ws://192.168.0.250:4000");
class AddDevicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ffmpegIP: "localhost",
      // ffmpegIP: "192.168.0.107",
      // ffmpegIP: "192.168.0.250",
      deviceId: 0,
      deviceName: "",
      IpAddress: "",
      username: "",
      password: "",
      urlRTSP: "",
      testingUrlRtsp: "",
      videoBitRate: "1000K",
      videoBitRateData: [{ value: "1000K", text: "1000K" }],
      frameRate: "30",
      frameRateData: [
        { value: "30", text: "30 FPS" },
        { value: "50", text: "50 FPS" },
        { value: "60", text: "60 FPS" },
      ],
      videoSize: "640x480",
      videoSizeData: [
        { value: "640x480", text: "640x480 (Standard Definition)" },
        { value: "1280x720", text: "1280x720 (High Definition)" },
        { value: "1920x1080", text: "1920x1080 (Full HD)" },
        { value: "2560x1440", text: "1280x720 (Quad HD)" },
      ],
      optionAddress: [
        { value: "IP Address", label: "IP Address" },
        { value: "Mac Address", label: "Mac Address" },
      ],
      optionBrand: [],
      selectedBrandId: null,
      selectedOptionAddress: null,
      outputFileFormat: "mpegts",
      videoCodec: "mpeg1video",
      totalDeviceScan: 0,
      setOpenValidation: false,
      openSuccess: false,
      openSuccessText: "",
      setOpenAddNew: false,
      setOpenEdit: false,
      rowDetail: [],
      device_connected: false,
      player: null,
      mac_address: "",
    };
  }

  //=========================API Service============================//

  doSubmitDevice = () => {
    let params = {
      deviceId: this.state.deviceId,
      brand_device: this.state.selectedBrandId.value,
      type_address: this.state.selectedOptionAddress.value,
      mac_address: this.state.mac_address,
      deviceName: this.state.deviceName,
      username: this.state.username,
      password: this.state.password,
      IpAddress: this.state.IpAddress,
      urlRTSP: this.state.urlRTSP,
      videoBitRate: this.state.videoBitRate,
      frameRate: this.state.frameRate,
      videoSize: this.state.videoSize,
      outputFileFormat: this.state.outputFileFormat,
      videoCodec: this.state.videoCodec,
    };
    console.log("cek parameter body", params);
    this.props.doLoading();
    apiCameraAddUpdate(params)
      .then((response) => {
        this.props.doLoading();
        let responsedata = response.data;
        if (responsedata.status === "OK") {
          this.setState({
            openSuccess: true,
          });
          this.sendRequest("disconnected", {
            status: "diconnected",
          });
          this.sendRequest("addStreaming", {
            dataStream: params,
          });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
      });
  };

  doLoadBrandDevices = () => {
    apiBrandDevice_List()
      .then((res) => {
        let data = res.data;
        if (data.status === "ok") {
          var temp = this.state.tableData;
          temp = data.records;
          for (var i = 0; i < temp.length; i++) {
            temp[i].value = temp[i].brand_name;
            temp[i].label = temp[i].brand_name;
          }
          this.setState({ optionBrand: temp });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //========================Function & Method ======================//

  componentDidMount = () => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      this.sendRequest("startDiscovery");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      var id = dataFromServer.id;
      console.log(dataFromServer);
      if (id === "startDiscovery") {
        console.log("data from server", dataFromServer);
      } else if (id === "startStreaming") {
        this.streamCamera(dataFromServer);
      } else if (id === "result_ip_address") {
        this.getResultIpAddress(dataFromServer);
      }
    };

    this.doLoadBrandDevices();
  };

  componentWillUnmount = () => {
    // if (player !== null) {
    //   player.destroy();
    // }

    this.sendRequest("disconnected", {
      status: "diconnected",
    });
  };

  pressGenerateIpAddress = () => {
    if (this.state.mac_address === "") {
      this.setState({
        messageError: "Enter mac address device",
        setOpenValidation: true,
      });
    } else {
      this.sendRequest("getIpAddressFromMacAddress", {
        mac_address: this.state.mac_address,
      });
    }
  };

  pressedConnectButton = () => {
    const { testingUrlRtsp } = this.state;
    if (testingUrlRtsp === "") {
      this.setState({
        messageError: "Enter url rtsp.",
        setOpenValidation: true,
      });
    } else {
      if (this.state.device_connected === true) {
        this.disconnectCamera();
      } else {
        this.connectCamera();
      }
    }
  };

  disconnectCamera = () => {
    this.sendRequest("disconnected", {
      status: "diconnected",
    });
    player.stop();
    this.setState({
      player: null,
      testingUrlRtsp: "",
      device_connected: false,
    });
  };

  connectCamera = () => {
    this.sendRequest("connect", {
      url_rtsp: this.state.testingUrlRtsp,
    });
  };

  getResultIpAddress = (data) => {
    if (data.result !== "Null" || data.result !== "Error") {
      this.setState({
        IpAddress: data.result,
      });
    }
  };

  streamCamera = (data) => {
    this.setState({
      device_connected: true,
    });
    var videoUrl = `ws://${this.state.ffmpegIP}:${data.wsPort}/`;
    player = new JSMpeg.VideoElement("#video-canvas", videoUrl, {
      autoplay: true,
      control: true,
      needPlayButton: true,
    });
    this.setState({
      player: player,
    });
    console.log(player);
  };

  stopCamera = (data) => {
    console.log("destroy streaming");
    player.stop();
    this.setState({
      player: null,
      testingUrlRtsp: "",
      device_connected: false,
    });
  };

  sendRequest = (method, params) => {
    client.send(
      JSON.stringify({
        method: method,
        params: params,
      })
    );
  };

  handleChangeOptionAddress = (selectedOptionAddress) => {
    this.setState({ selectedOptionAddress });
  };

  handleChangeOptionBrand = (selectedBrandId) => {
    this.setState({
      selectedBrandId,
    });
  };

  changeVideoBitRate = (videoBitRate) => {
    this.setState({ videoBitRate: videoBitRate });
  };

  changeFrameRate = (frameRate) => {
    this.setState({ frameRate: frameRate });
  };

  changeVideoSizeData = (videoSize) => {
    this.setState({ videoSize: videoSize });
  };

  checkData = () => {
    const {
      selectedBrandId,
      selectedOptionAddress,
      deviceName,
      IpAddress,
      urlRTSP,
    } = this.state;

    if (selectedBrandId === null) {
      this.setState({
        messageError: "Select brand device.",
        setOpenValidation: true,
      });
    } else if (selectedOptionAddress === null) {
      this.setState({
        messageError: "Select type address.",
        setOpenValidation: true,
      });
    } else if (deviceName === "") {
      this.setState({
        messageError: "Enter device name.",
        setOpenValidation: true,
      });
    } else if (IpAddress === "") {
      this.setState({
        messageError: "Enter IP address device.",
        setOpenValidation: true,
      });
    } else if (urlRTSP === "") {
      this.setState({
        messageError: "Enter url rtsp device.",
        setOpenValidation: true,
      });
    } else {
      this.doSubmitDevice();
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
        {/* <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: "#006432", paddingBottom: 35 }}
        >
          <div style={{ position: "absolute", right: "42%", top: "5%" }}>
            <WarningAmber style={{ color: "#fff", width: 40, height: 40 }} />
          </div>
        </DialogTitle> */}
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
      setTimeout(() => this.props.history.push("/panel/device-camera"), 1000);

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
                    this.props.history.push("/panel/device-camera")
                  }
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Data saved successfully
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
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#006432",
            }}
            startIcon={<ArrowBackIos />}
            onClick={() => this.props.history.push("/panel/device-camera")}
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
          </Button>{" "}
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
            Add Device
          </Typography>
          <span className="dash">&nbsp;&nbsp;</span>
        </div>
        <div className="box-container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
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
                      Brand
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      classNamePrefix="select"
                      placeholder="Select brand device"
                      value={this.state.selectedBrandId}
                      onChange={this.handleChangeOptionBrand}
                      options={this.state.optionBrand}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12}>
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
                      Type Address
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      classNamePrefix="select"
                      placeholder="Select type address"
                      value={this.state.selectedOptionAddress}
                      onChange={this.handleChangeOptionAddress}
                      options={this.state.optionAddress}
                    />
                  </Grid>
                </Grid>

                {this.state.selectedOptionAddress !== null ? (
                  this.state.selectedOptionAddress.value === "Mac Address" ? (
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
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
                          Mac Address
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Input
                          autoComplete="off"
                          type="text"
                          name="mac_address"
                          id="mac_address"
                          placeholder="Enter mac address"
                          value={this.state.mac_address}
                          onChange={(event) =>
                            this.setState({ mac_address: event.target.value })
                          }
                        />
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          size="medium"
                          style={{
                            backgroundColor: "#388e3c",
                          }}
                          startIcon={<Dns />}
                          onClick={() => this.pressGenerateIpAddress()}
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
                            Generate IP Address
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  ) : null
                ) : null}

                <Grid item xs={12}>
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
                    IP Address
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="IpAddress"
                    id="IpAddress"
                    placeholder="Enter IP address device"
                    value={this.state.IpAddress}
                    onChange={(event) =>
                      this.setState({ IpAddress: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Device Name
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="deviceName"
                    id="deviceName"
                    placeholder="Enter device name"
                    value={this.state.deviceName}
                    onChange={(event) =>
                      this.setState({ deviceName: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Username
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="ipAddress"
                    id="ipAddress"
                    placeholder="Enter username device"
                    value={this.state.username}
                    onChange={(event) =>
                      this.setState({ username: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Password
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="ipAddress"
                    id="ipAddress"
                    placeholder="Enter password device"
                    value={this.state.password}
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Url RTSP
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="urlRtsp"
                    id="urlRtsp"
                    placeholder="Enter url RTSP Exp: rtsp://username:password@ipaddress:port/channel..."
                    value={this.state.urlRTSP}
                    onChange={(event) =>
                      this.setState({ urlRTSP: event.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Video Bit Rate
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.videoBitRate}
                    valueColumn={"value"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.videoBitRateData}
                    onChange={this.changeVideoBitRate}
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Frame Rate (FPS)
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.frameRate}
                    valueColumn={"value"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.frameRateData}
                    onChange={this.changeFrameRate}
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Video Size
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.videoSize}
                    valueColumn={"value"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.videoSizeData}
                    onChange={this.changeVideoSizeData}
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Output File Format
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="outputFileFormat"
                    id="outputFileFormat"
                    value={this.state.outputFileFormat}
                  />
                </Grid>

                <Grid item xs={12}>
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
                    Video Codec
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="videoCodec"
                    id="videoCodec"
                    value={this.state.videoCodec}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  style={{
                    padding: "10px",
                    marginBottom: "20px",
                    backgroundColor: "#d5d5d5",
                  }}
                >
                  <div className="default-video" style={{ height: "420px" }}>
                    <div
                      id="video-canvas"
                      style={{ height: "100%", width: "100%" }}
                    ></div>
                  </div>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Input
                      disabled={this.state.device_connected}
                      autoComplete="off"
                      type="text"
                      name="testingUrlRtsp"
                      id="testingUrlRtsp"
                      placeholder="Exp: rtsp://username:password@ipaddress:port/channel..."
                      value={this.state.testingUrlRtsp}
                      onChange={(event) =>
                        this.setState({ testingUrlRtsp: event.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={3} style={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        backgroundColor: "#388e3c",
                      }}
                      startIcon={<Videocam />}
                      onClick={() => this.pressedConnectButton()}
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
                        {this.state.device_connected === false
                          ? "Testing"
                          : "Disconnect"}
                      </Typography>
                    </Button>{" "}
                  </Grid>
                </Grid>
                {/* <Grid container spacing={2} style={{ marginTop: "4px" }}>
                  <Grid item xs={"auto"}>
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        backgroundColor: "#0d47a1",
                      }}
                      startIcon={<Sync />}
                      onClick={() =>
                        this.props.history.push("/panel/device-camera")
                      }
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
                        Scan Devices
                      </Typography>
                    </Button>{" "}
                  </Grid>
                  <Grid item xs={6}>
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
                      Total device scan : {this.state.totalDeviceScan}
                    </Typography>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          </Box>
          <br></br>
          <div className="form-button-container">
            <br></br>
            <Button
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#d0021b",
              }}
              startIcon={<Cancel />}
              onClick={() => this.props.history.push("/panel/device-camera")}
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
            </Button>{" "}
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
            </Button>{" "}
          </div>
        </div>
        {this.renderDialogValidation()}
        {this.renderSuccess()}
      </div>
    );
  }
}

export default AddDevicesPage;
