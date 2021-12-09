import React, { Component } from "react";
import Iframe from "react-iframe";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { Box, Paper, Grid, Typography } from "@mui/material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class DevicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
                  Add Devices
                </Typography>

                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <div className="box-container">
          <Iframe
            url={"http://localhost:8080/"}
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
export default DevicesPage;
