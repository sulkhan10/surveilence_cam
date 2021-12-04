import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Edit, Delete } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class ListUser extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listuser");
    this.state = {
      tableData: [],
      filter: "",
      useAndroid: 0,
      useiOS: 0,
      Suspend: 0,
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
        Header: this.language.columnphone,
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "left" },
      },
      {
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
      },
      {
        Header: this.language.columnemail,
        headerStyle: { fontWeight: "bold" },
        accessor: "email",
        style: { textAlign: "left" },
      },
      {
        Header: "Gender",
        headerStyle: { fontWeight: "bold" },
        accessor: "gendername",
        style: { textAlign: "center" },
      },
      {
        Header: "Membership",
        headerStyle: { fontWeight: "bold" },
        accessor: "isActive",
        style: { textAlign: "center" },
      },
      {
        Header: "Last Login",
        headerStyle: { fontWeight: "bold" },
        accessor: "lastlogin",
        style: { textAlign: "center" },
      },
      {
        Header: "Platform",
        headerStyle: { fontWeight: "bold" },
        accessor: "platform",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnsuspend,
        headerStyle: { fontWeight: "bold" },
        accessor: "isSuspend",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnaction,
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

  doRowEdit = (row) => {
    this.props.history.push("/panel/edituser/" + row.phoneno);
  };

  doRowDelete = (row) => {
    // console.log(row);
    confirmAlert({
      message: "Delete member " + row.name + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (phoneno) => {
            var phoneno = row.phoneno;
            // console.log(phoneno);
            this.deleteUser(phoneno);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputuser");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_list.php",
        {
          filter: this.state.filter,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
        var ANDROID = 0;
        var IOS = 0;
        var Suspend = 0;
        temp.forEach((v) => {
          if (v["platform"] === "ANDROID") {
            ANDROID++;
          } else if (v["platform"] === "IOS") {
            IOS++;
          } else if (v["issuspend"] === 1) {
            Suspend++;
          }
        });

        this.setState({
          useAndroid: ANDROID,
          useiOS: IOS,
          Suspend: Suspend,
        });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteUser = (phoneno) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_delete.php",
        {
          phoneno: phoneno,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert(this.language.deletesuccess);
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_list.php",
        {
          filter: "",
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        var ANDROID = 0;
        var IOS = 0;
        var Suspend = 0;
        temp.forEach((v) => {
          if (v["platform"] === "ANDROID") {
            ANDROID++;
          } else if (v["platform"] === "IOS") {
            IOS++;
          } else if (v["issuspend"] === 1) {
            Suspend++;
          }
        });

        this.setState({
          useAndroid: ANDROID,
          useiOS: IOS,
          Suspend: Suspend,
        });

        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "user_list.php",
        {
          filter: "",
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
        var ANDROID = 0;
        var IOS = 0;
        var Suspend = 0;
        temp.forEach((v) => {
          if (v["platform"] === "ANDROID") {
            ANDROID++;
          } else if (v["platform"] === "IOS") {
            IOS++;
          } else if (v["issuspend"] === 1) {
            Suspend++;
          }
        });

        this.setState({
          useAndroid: ANDROID,
          useiOS: IOS,
          Suspend: Suspend,
        });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
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
                  Member
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
                    Android Users: {this.state.useAndroid}
                  </Typography>
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
                    iOS Users: {this.state.useiOS}
                  </Typography>
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
                    Total User Suspend: {this.state.Suspend}
                  </Typography>
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
                    Total User: {this.state.tableData.length}
                  </Typography>
                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#1273DE",
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
                        {this.globallang.reset}
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
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            style={{ backgroundColor: "#f2f2f2" }}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={5}
          />
        </div>
      </Box>
    );
  }
}
export default ListUser;
