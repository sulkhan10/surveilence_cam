import React, { Component } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { Box, Paper, Grid, Typography } from "@mui/material";
import ReactPlayer from "react-player";

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

  componentDidMount = () => {};

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
                      Camera Channel
                    </Typography>

                    <span className="dash">&nbsp;&nbsp;</span>
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
                  {/* <ReactPlayer url="https://www.youtube.com/watch?v=XZgiNnGB8m4" /> */}
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
