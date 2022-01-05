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

class DeviceCameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      filter: "",
    };

    this.tableColumns = [
      {
        Header: "No",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: "Device Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "center" },
      },
      {
        Header: "Url RTSP",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
      },
      {
        Header: "Action",
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => (
          <div>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#3f51b5",
              }}
              startIcon={<Edit />}
              onClick={() => this.doRowEdit(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.edit}
              </Typography>
            </Button>
            &nbsp;
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#ff0000",
              }}
              startIcon={<Delete />}
              onClick={() => this.doRowDelete(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.delete}
              </Typography>
            </Button>
          </div>
        ),
      },
    ];
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
            url={"http://192.168.0.107:8080/"}
            width="100%"
            height="600px"
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
export default DeviceCameraPage;
