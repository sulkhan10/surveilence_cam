import React, { Component } from "react";
import axios from "axios";
import Iframe from "react-iframe";
// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { Box, Paper, Grid, Typography } from "@mui/material";

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class PlayBackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: "",
      groupShow: [],
      cameraShow: [],
      cameraId: "",
    };
  }

  changeGroup = (groupId) => {
    this.setState({
      groupId: groupId,
    });
    this.cameraList(groupId);
  };

  changeCamera = (cameraId) => {
    this.setState({
      cameraId: cameraId,
    });
  };

  componentDidMount = () => {
    this.groupList();
  };

  groupList = () => {
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
        var temp = this.state.groupShow;
        temp = response.data.records;
        this.setState({ groupShow: temp, groupId: temp[0].groupId });
        this.cameraList(temp[0].groupId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  cameraList = (groupId) => {
    axios
      .post(
        serverUrl + "device_list.php",
        { groupId: groupId },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        if (response.data.records) var temp = this.state.cameraShow;
        temp = response.data.records;
        this.setState({ cameraShow: temp, cameraId: temp[0].deviceId });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  render() {
    const urlCamera = this.state.url + "?groupby=" + this.state.groupId;

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
                  <div style={{ marginRight: 16 }}>
                    <SelectMultiColumn
                      width={200}
                      value={this.state.groupId}
                      valueColumn={"groupId"}
                      showColumn={"groupName"}
                      columns={["groupName"]}
                      data={this.state.groupShow}
                      onChange={this.changeGroup}
                    />
                  </div>
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
                    Camera:
                  </Typography>
                  <div style={{ marginRight: 0 }}>
                    <SelectMultiColumn
                      width={200}
                      value={this.state.cameraId}
                      valueColumn={"deviceId"}
                      showColumn={"deviceName"}
                      columns={["deviceName"]}
                      data={this.state.cameraShow}
                      onChange={this.changeCamera}
                    />
                  </div>
                </div>
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
export default PlayBackPage;
