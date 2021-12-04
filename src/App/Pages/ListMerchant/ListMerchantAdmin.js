import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
// import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Edit, Delete } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};
class ListMerchant extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listmerchant");

    this.state = {
      tableData: [],
      filter: "",
      startDate: moment(),
      endDate: moment(),
      mainCommunity: this.props.community.communityid,
      merchantCategoryShow: [],
      merchantCategory: "",
      merchantid: "",
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
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncategory,
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantcategoryname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columntags,
        headerStyle: { fontWeight: "bold" },
        accessor: "tags",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncommunity,
        headerStyle: { fontWeight: "bold" },
        accessor: "communityname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnppn,
        headerStyle: { fontWeight: "bold" },
        accessor: "set_ppn",
        style: { textAlign: "center" },
        Cell: (e) => (e.original.set_ppn === 2 ? "NO" : "YES"),
      },
      {
        Header: this.language.columnavailable,
        headerStyle: { fontWeight: "bold" },
        accessor: "isavailable",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.isavailable === 0
            ? this.globallang["hidden"]
            : this.globallang["show"],
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

  addNew = () => {
    this.props.history.push("/panel/inputmerchant");
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/editmerchantAcc/" + row.merchantid);
  };

  doRowDelete = (row) => {
    confirmAlert({
      //title: 'Confirm to submit',
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (merchantid) => {
            var merchantid = row.merchantid;
            this.deleteMerchant(merchantid);
            this.deleteMerchantGlobal(merchantid);
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
        serverUrl + "merchant_admin.php",
        {
          merchantid: this.state.merchantid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();

        var temp = this.state.tableData;
        temp = response.data.records;
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteMerchant = (merchantid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_delete.php",
        {
          merchantid: merchantid,
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

  deleteMerchantGlobal = (merchantid) => {
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/merchant_delete.php",
        {
          merchantid: merchantid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  getAdminMerchant = (phone) => {
    axios
      .post(
        serverUrl + "admin_merchat_getId.php",
        {
          phoneno: phone,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = response.data.record;
        this.setState({
          merchantid: tmp.merchantId,
        });
        this.merchantList(tmp.merchantId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  merchantList = (merchantid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_admin.php",
        {
          merchantid: merchantid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();

        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    //localStorage.clear();
    localStorage.removeItem("this_is_data");
    localStorage.removeItem("commodity_data");
    this.merchantCategory();
    let loginInfo = localStorage.getItem("loginInfo");
    if (
      loginInfo === undefined ||
      loginInfo === null ||
      loginInfo === "" ||
      loginInfo === "undefined" ||
      loginInfo === "null"
    ) {
      this.props.history.replace("/");
    } else {
      loginInfo = JSON.parse(loginInfo);
      console.log(loginInfo);
      this.getAdminMerchant(loginInfo.phoneno);
    }
  };

  merchantCategory = () => {
    axios
      .post(
        serverUrl + "merchantcategory_list.php",
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
        let result = response.data;
        this.setState({ merchantCategoryShow: result.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.setState({ merchantCategory: "" });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_admin.php",
        {
          merchantid: this.state.merchantid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();

        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changeCategory = (merchantcategoryid) => {
    this.setState({ merchantCategory: merchantcategoryid });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "merchant_admin_byid.php",
        {
          merchantid: this.state.merchantid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();

        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
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
                  Merchant
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
      </Box>
    );
  }
}
export default ListMerchant;
