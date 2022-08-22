import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import "./CameraPage.style.css";
import ReactPlayer from "react-player";
import { apiGroupList, apiViewList } from "../../Service/api";
import Select from "react-select";
import Fullscreen from "react-fullscreen-crossbrowser";
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import {
  GridViewTwoTone,
  GridOnTwoTone,
  Fullscreen as fullscreen,
  FullscreenRounded,
  ViewHeadlineOutlined,
  Refresh,
} from "@mui/icons-material";

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#fff" : "#000",
    zIndex: 1,
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

var cameraplayer = null;
const client = new W3CWebSocket("ws://127.0.0.1:4000");
// const client = new W3CWebSocket("ws://192.168.0.107:8000");
// const client = new W3CWebSocket("ws://192.168.0.250:8000");

class LiveViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: "",
      groupShow: [],
      // ffmpegIP: "localhost",
      // ffmpegIP: "192.168.0.107",
      // ffmpegIP: "192.168.0.250",
      baseUrl: "http://127.0.0.1:4000/",
      // baseUrl: "http://192.168.0.250:4000/",
      extenstion: "_.m3u8",
      arrayData: [
        { data: "Camera 1" },
        { data: "Camera 2" },
        { data: "Camera 3" },
      ],
      girdView: 1,
      isFullscreenEnabled: false,
      selectOptionGroup: null,
      optionsDataGroup: [],
      viewListData: [],
      listViewCamera: [],
      getDataPlayer: [],
    };
    this.player = React.createRef();
  }

  //=========================API Service=====================//
  getGroupList = () => {
    apiGroupList()
      .then((response) => {
        let dataresponse = response.data;
        if (dataresponse.status === "OK") {
          if (dataresponse.records.length > 0) {
            this.setState({
              optionsDataGroup: dataresponse.records,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getViewList = () => {
    // this.props.doLoading();
    apiViewList()
      .then((response) => {
        // this.props.doLoading();
        let dataresponse = response.data;
        if (dataresponse.status === "OK") {
          if (dataresponse.records.length > 0) {
            this.setState({
              viewListData: dataresponse.records,
              listViewCamera: dataresponse.records,
            });
            // this.sendRequest("startLiveView", {
            //   listViewCameraData: dataresponse.records,
            // });
          }
        }
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
      });
  };
  //=========================Function & Method===============//

  componentDidMount = () => {
    this.getGroupList();
    this.getViewList();

    // client.onopen = () => {
    //   console.log("WebSocket Client Connected");
    //   this.sendRequest("startDiscovery");
    // };
    // client.onmessage = (message) => {
    //   const dataFromServer = JSON.parse(message.data);
    //   var id = dataFromServer.id;
    //   console.log(dataFromServer);
    //   if (id === "startDiscovery") {
    //     console.log("data from server", dataFromServer);
    //   } else if (id === "streamCameraList") {
    //     this.streamCameraList(dataFromServer);
    //   } else if (id === "stopJsmpeg") {
    //     this.destroyCamera(dataFromServer);
    //   }
    // };
  };

  componentWillUnmount = () => {
    // cameraplayer.destroy();
    // this.sendRequest("disconnectedLive", {
    //   status: "diconnected",
    // });
  };

  // sendRequest = (method, params) => {
  //   client.send(
  //     JSON.stringify({
  //       method: method,
  //       params: params,
  //     })
  //   );
  // };

  streamCameraList = (data) => {
    console.log("stream camera list", data);
    if (data.result.length > 0) {
      this.cameraList = data.result;
      data.result.map((cam, i) => {
        var videoUrl = `ws://${this.state.ffmpegIP}:700${i}/`;
        var idCanvas = `#video-canvas${i}`;
        console.log("id canvas", idCanvas);
        console.log("video", videoUrl);
        cameraplayer = new JSMpeg.VideoElement(idCanvas, videoUrl, {
          autoplay: true,
          control: true,
          needPlayButton: true,
        });
        console.log(cameraplayer);
        let dataCameraStream = [];
        let getDataPlayer = dataCameraStream.push({ player: cameraplayer });
        console.log(getDataPlayer);
        this.setState({
          getDataPlayer: getDataPlayer,
        });
      });
    }
  };

  destroyCamera = (data) => {
    console.log("destroy streaming");
    cameraplayer.stop();
    this.setState({
      cameraplayer: null,
    });
  };

  changeGrid = (value) => {
    this.setState({
      girdView: value,
    });
  };

  handleChangeOptionGroup = (selectOptionGroup) => {
    // this.sendRequest("disconnectedLive", {
    //   status: "diconnected",
    // });
    console.log(selectOptionGroup);
    this.setState({ selectOptionGroup });
    this.setState({
      listViewCamera: selectOptionGroup.info,
    });

    // this.sendRequest("startLiveView", {
    //   listViewCameraData: selectOptionGroup.info,
    // });
  };

  reset = () => {
    this.setState({
      selectOptionGroup: null,
      viewListData: [],
      listViewCamera: [],
    });
    this.getGroupList();
    this.getViewList();
  };

  doViewAll = () => {
    // this.sendRequest("disconnectedLive", {
    //   status: "diconnected",
    // });
    this.setState({
      listViewCamera: this.state.viewListData,
      selectOptionGroup: null,
    });
    // this.sendRequest("startLiveView", {
    //   listViewCameraData: this.state.viewListData,
    // });
  };

  renderView = () => {
    if (this.state.girdView === 1) {
      return (
        <>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => this.changeGrid(1)}
          >
            <GridViewTwoTone style={{ color: "#006432" }} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => this.changeGrid(2)}
          >
            <GridOnTwoTone style={{ color: "#B3B3B3" }} />
          </IconButton>
        </>
      );
    } else if (this.state.girdView === 2) {
      return (
        <>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => this.changeGrid(1)}
          >
            <GridViewTwoTone style={{ color: "#B3B3B3" }} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => this.changeGrid(2)}
          >
            <GridOnTwoTone style={{ color: "#006432" }} />
          </IconButton>
        </>
      );
    }
  };

  pause = () => {
    cameraplayer.stop();
  };

  ref = (player) => {
    // console.log(player.player.isPlaying);
  };

  renderStream1 = (obj, index) => {
    const ref = React.createRef();
    var urlStream = this.state.baseUrl + obj.IpAddress + this.state.extenstion;
    return (
      <Grid item xs={2} key={obj.IpAddress}>
        <Paper style={{ padding: "10px", backgroundColor: "#000" }}>
          <div className="player-wrapper">
            <ReactPlayer
              ref={ref}
              className="react-player"
              key={urlStream}
              url={urlStream}
              width="100%"
              height="100%"
              playing={true}
              playsinline={true}
              controls={
                ref.current != null
                  ? ref.current.player.isReady === true
                    ? true
                    : false
                  : true

                // console.log(ref)
              }
              // onReady={(player) => console.log("video element:", ref.current)}
            />
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "-20px",
              zIndex: 1,
            }}
          >
            <Typography
              component="span"
              variant="h1"
              style={
                (stylesListComent.inline,
                {
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "bold",
                })
              }
            >
              {obj.deviceName}
            </Typography>
          </div>
        </Paper>
      </Grid>
    );
  };

  renderStream2 = (obj, index) => {
    var urlStream = this.state.baseUrl + obj.IpAddress + this.state.extenstion;
    return (
      <Grid item xs={4} key={index}>
        <Paper style={{ padding: "10px", backgroundColor: "#000" }}>
          <div className="player-wrapper">
            <ReactPlayer
              className="react-player"
              key={urlStream}
              url={urlStream}
              width="100%"
              height="100%"
              playing={true}
              loop={true}
              controls={true}
            />
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "-20px",
              zIndex: 1,
            }}
          >
            <Typography
              component="span"
              variant="h1"
              style={
                (stylesListComent.inline,
                {
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "bold",
                })
              }
            >
              {obj.deviceName}
            </Typography>
          </div>
        </Paper>
      </Grid>
    );
  };

  renderGridListView = () => {
    if (this.state.girdView === 1) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2 }} columns={{ xs: 4 }}>
            {this.state.listViewCamera.map((obj, index) =>
              this.renderStream1(obj, index)
            )}
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2 }} columns={{ xs: 12 }}>
            {this.state.listViewCamera.map((obj, index) =>
              this.renderStream2(obj, index)
            )}
          </Grid>
        </Box>
      );
    }
  };

  renderFullScreeen = () => {
    return (
      <Fullscreen
        enabled={this.state.isFullscreenEnabled}
        onChange={(isFullscreenEnabled) =>
          this.setState({ isFullscreenEnabled })
        }
      >
        {this.state.isFullscreenEnabled !== false ? (
          <Box
            style={{
              backgroundColor: "#f2f2f2",
              height: "100vh",
              overflow: "auto",
              padding: 10,
            }}
          >
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
                      All Camera
                    </Typography>
                    <br></br>
                    <div className="contentDate">
                      <Typography
                        component="span"
                        variant="subtitle1"
                        style={
                          (stylesListComent.inline,
                          {
                            marginRight: 16,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            color: "#006432",
                            fontWeight: "bold",
                          })
                        }
                      >
                        Group By:
                      </Typography>
                      <div style={{ marginRight: 16, width: 250 }}>
                        <Select
                          styles={customStyles}
                          classNamePrefix="select"
                          placeholder="Select For..."
                          value={this.state.selectOptionGroup}
                          onChange={this.handleChangeOptionGroup}
                          options={this.state.optionsDataGroup}
                        />
                      </div>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        style={
                          (stylesListComent.inline,
                          {
                            marginRight: 0,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            color: "#006432",
                            fontWeight: "bold",
                          })
                        }
                      >
                        View:
                      </Typography>
                      {this.renderView()}
                      <div style={{ marginLeft: 10 }}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#006432",
                          }}
                          startIcon={<ViewHeadlineOutlined />}
                          onClick={() => this.doViewAll()}
                        >
                          <Typography
                            variant="button"
                            style={{
                              fontSize: 14,
                              color: "#fff",
                              textTransform: "capitalize",
                            }}
                          >
                            View All
                          </Typography>
                        </Button>
                      </div>
                      <div style={{ marginLeft: 10 }}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#006432",
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
                            Reset
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
            {this.renderGridListView()}
          </Box>
        ) : (
          <></>
        )}
      </Fullscreen>
    );
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
                  All Camera
                </Typography>
                <br></br>
                <div className="contentDate">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={
                      (stylesListComent.inline,
                      {
                        marginRight: 16,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        color: "#006432",
                        fontWeight: "bold",
                      })
                    }
                  >
                    Group By:
                  </Typography>
                  <div style={{ marginRight: 16, width: 250 }}>
                    <Select
                      styles={customStyles}
                      // styles={{
                      //   // Fixes the overlapping problem of the component
                      //   menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      // }}
                      classNamePrefix="select"
                      placeholder="Select For..."
                      value={this.state.selectOptionGroup}
                      onChange={this.handleChangeOptionGroup}
                      options={this.state.optionsDataGroup}
                    />
                  </div>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={
                      (stylesListComent.inline,
                      {
                        marginRight: 0,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        color: "#006432",
                        fontWeight: "bold",
                      })
                    }
                  >
                    View:
                  </Typography>
                  {this.renderView()}
                  <div style={{ marginLeft: 10 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006432",
                      }}
                      startIcon={<ViewHeadlineOutlined />}
                      onClick={() => this.doViewAll()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        View All
                      </Typography>
                    </Button>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006432",
                      }}
                      startIcon={<FullscreenRounded />}
                      onClick={() =>
                        this.setState({ isFullscreenEnabled: true })
                      }
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        Fullscreen
                      </Typography>
                    </Button>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006432",
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
                </div>
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        {this.renderGridListView()}
        {this.renderFullScreeen()}
      </Box>
    );
  }
}
export default LiveViewPage;
