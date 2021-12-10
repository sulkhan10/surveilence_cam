import React, { Component } from "react";
import axios from "axios";
import Iframe from "react-iframe";
// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { Box, Paper, Grid, Typography } from "@mui/material";

const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: "",
      groupShow: [],
      url: "http://localhost:8081/",
    };
  }

  changeGroup = (groupId) => {
    this.setState({
      groupId: groupId,
    });
  };

  componentDidMount = () => {
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
                  <div style={{ marginRight: 0 }}>
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
                </div>
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <div className="box-container">
          <Iframe
            url={urlCamera}
            width="100%"
            height="1000px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            // onLoad={this.hideLoading}
          />
        </div>
      </Box>
    );
  }
}
export default CameraPage;
