import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import { Label, Input } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import Modal from "react-modal";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Edit, Save, Cancel } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const Style = {
  control: (provided) => ({ ...provided, width: "160" }),
  container: (provided) => ({ ...provided, width: "160" }),
};

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-20%",
    transform: "translate(-50%, -50%)",
  },
};

class MemberNumberPage extends Component {
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
      dataDetail: "",
      memberNumber: "",
    };

    this.DetailView = this.DetailView.bind(this);
    this.closeModal = this.closeModal.bind(this);

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
        Header: "Member Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "memberNumber",
        style: { textAlign: "center" },
      },
      {
        Header: "Chapter",
        headerStyle: { fontWeight: "bold" },
        accessor: "chapterName",
        style: { textAlign: "center" },
      },
      {
        Header: "Sub Chapter",
        headerStyle: { fontWeight: "bold" },
        accessor: "sub_chapter",
        style: { textAlign: "center" },
      },
      {
        Header: "Captiva Type",
        headerStyle: { fontWeight: "bold" },
        accessor: "captiva_type",
        style: { textAlign: "center" },
      },
      {
        Header: "Exp. Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "expireDate",
        style: { textAlign: "center" },
      },
      {
        Header: "Membership",
        headerStyle: { fontWeight: "bold" },
        accessor: "isActive",
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
              onClick={() => this.DetailView(e.original)}
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
          </div>
        ),
      },
    ];
  }

  doUpdateMember = (phone) => {
    let params = {
      phonenumber: phone,
      memberNumber: this.state.memberNumber,
    };

    this.props.doLoading();
    axios
      .post(serverUrl + "member_number_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.closeModal();
        this.props.doLoading();
        this.reset();
      })
      .catch((error) => {
        this.props.doLoading();
        alert(error);
      });
  };

  closeModal() {
    this.setState({ modalIsOpen: false, dataDetail: "", memberNumber: "" });
  }

  DetailView(dt) {
    // console.log(dt);
    this.setState({ modalIsOpen: true, dataDetail: dt });
  }

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

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "member_number.php",
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
        serverUrl + "member_number.php",
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
        serverUrl + "member_number.php",
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

  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <div className="page-header">
          Memeber Number <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td width={200}>
                <Label for="name">Name</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  disabled
                  value={this.state.dataDetail.name}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="name">Chapter</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  disabled
                  value={this.state.dataDetail.chapterName}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="name">Member Number</Label>
              </td>
              <td>
                <Input
                  autoComplete="off"
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.memberNumber}
                  placeholder={"Enter member number"}
                  onChange={(event) =>
                    this.setState({ memberNumber: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
          </table>
        </div>
        <br></br>
        <div className="form-button-container">
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#795548",
            }}
            startIcon={<Cancel />}
            onClick={() => this.closeModal()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 14,
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              {this.globallang.cancel}
            </Typography>
          </Button>
          &nbsp;
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#1976d2",
            }}
            startIcon={<Save />}
            onClick={() => this.doUpdateMember(this.state.dataDetail.phoneno)}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 14,
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Update
            </Typography>
          </Button>
        </div>
      </Modal>
    );
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
                  Member Number
                </Typography>
                <br></br>
                <div className="contentDate">
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
        {this.renderModal()}
      </Box>
    );
  }
}
export default MemberNumberPage;
