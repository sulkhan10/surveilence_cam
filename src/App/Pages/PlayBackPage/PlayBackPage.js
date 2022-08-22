import React, { Component } from "react";
import { apiGroupList, apiViewList } from "../../Service/api";
import { Input } from "reactstrap";
// import moment from "moment";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import {
  Box,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import { Videocam, CameraRoll } from "@mui/icons-material";
import ReactPlayer from "react-player";
import "./PlayBackPage.style.css";
import Select from "react-select";

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#fff" : "#000",
  }),
};

class PlayBackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: "",
      groupShow: [],
      cameraShow: [],
      cameraId: "",
      urlVideo: "",
      selectOptionGroup: null,
      optionsDataGroup: [],
      listViewCamera: [],
      selectedCamera: 0,
      startDate: new Date(),
    };
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
  };

  handleChangeOptionGroup = (selectOptionGroup) => {
    console.log(selectOptionGroup);
    this.setState({ selectOptionGroup });
    this.setState({
      listViewCamera: selectOptionGroup.info,
      selectedCamera: 0,
      selectedDeviceCamera: "",
    });
  };

  selectedCamera = (obj) => {
    console.log(obj);
    let arr = [];
    arr.push(obj);

    console.log(arr);

    this.setState({
      selectedCamera: obj.deviceId,
      selectedDeviceCamera: arr,
    });
  };

  ChangeDate = (event) => {
    console.log(event.target.value);
    this.setState({ startDate: event.target.value });
  };

  renderCannelCamera = () => {
    if (this.state.listViewCamera.length > 0) {
      return (
        <>
          {this.state.listViewCamera.map((obj, i) => {
            if (this.state.selectedCamera === obj.deviceId) {
              return (
                <>
                  <ListItem
                    button
                    style={{
                      backgroundColor: "#036b50",
                    }}
                    onClick={() => this.selectedCamera(obj)}
                  >
                    <ListItemIcon>
                      <Videocam style={{ color: "#fff" }} />
                    </ListItemIcon>
                    <ListItemText
                      style={{ color: "#fff" }}
                      primary={obj.deviceName}
                    />
                  </ListItem>
                  <Divider />
                </>
              );
            } else {
              return (
                <>
                  <ListItem button onClick={() => this.selectedCamera(obj)}>
                    <ListItemIcon>
                      <Videocam />
                    </ListItemIcon>
                    <ListItemText primary={obj.deviceName} />
                  </ListItem>
                  <Divider />
                </>
              );
            }
          })}
        </>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Typography
            component="span"
            variant="h1"
            style={
              (stylesListComent.inline,
              {
                fontSize: 18,
                color: "#9e9e9e",
                fontWeight: "bold",
              })
            }
          >
            Not Available
          </Typography>
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
                  Playback
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Grid item xs={12}>
                <Paper
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    height: "75vh",
                  }}
                >
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
                      Group
                    </Typography>
                    <span className="dash">&nbsp;&nbsp;</span>
                  </div>
                  <div style={{ width: "100%", marginBottom: "10px" }}>
                    <Select
                      styles={customStyles}
                      classNamePrefix="select"
                      placeholder="-Select Group-"
                      value={this.state.selectOptionGroup}
                      onChange={this.handleChangeOptionGroup}
                      options={this.state.optionsDataGroup}
                    />
                  </div>
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
                      Camera Channel
                    </Typography>
                    <span className="dash">&nbsp;&nbsp;</span>
                  </div>
                  <List className="list-camera-channel">
                    {this.renderCannelCamera()}
                  </List>
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
                      Date
                    </Typography>
                    <span className="dash">&nbsp;&nbsp;</span>
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Input
                          autoComplete="off"
                          type="date"
                          name="date"
                          id="exampleDate"
                          value={this.state.startDate}
                          onChange={this.ChangeDate}
                          placeholder="Expired Date"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="medium"
                          style={{
                            backgroundColor: "#388e3c",
                          }}
                          startIcon={<CameraRoll />}
                          // onClick={() => this.pressedConnectButton()}
                        >
                          <Typography
                            variant="button"
                            style={{
                              fontSize: 11,
                              color: "#fff",
                              textTransform: "capitalize",
                              marginLeft: -5,
                            }}
                          >
                            Get Video
                          </Typography>
                        </Button>{" "}
                      </Grid>
                    </Grid>
                  </div>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid item xs={12}>
                <Paper
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    height: "75vh",
                  }}
                >
                  <div
                    className="player-wrapper"
                    style={{
                      backgroundColor: "#000",
                    }}
                  >
                    <ReactPlayer
                      className="react-player"
                      url={this.state.urlVideo}
                      width="100%"
                      height="100%"
                      controls={true}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
export default PlayBackPage;
