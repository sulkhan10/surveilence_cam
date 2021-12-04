import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { convertToRupiah } from "../../../global.js";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Edit, Delete, AddBox } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class ListCommoditySub extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listcommodity");
    this.state = {
      tableData: [],
      filter: "",
      merchantid: "",
    };

    this.tableColumns = [
      {
        Header: "Commodity",
        headerStyle: { fontWeight: "bold" },
        accessor: "commodityname",
        style: { textAlign: "center" },
      },
      {
        Header: "Price",
        headerStyle: { fontWeight: "bold" },
        accessor: "commodityprice",
        style: { textAlign: "center" },
        Cell: (e) => convertToRupiah(e.original.commodityprice),
      },
      {
        Header: this.language.columnavailable,
        headerStyle: { fontWeight: "bold" },
        accessor: "isavailable",
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
    this.props.history.push("/panel/editcommodityAcc/" + row.commodityid);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: "Delete commodity " + row.commodityname + "?",
      buttons: [
        {
          label: "Yes",
          onClick: (commodityid) => {
            var commodityid = row.commodityid;
            // console.log(commodityid);
            this.deleteCommodity(commodityid);
            this.deleteMerchantGlobal(commodityid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputCommodityAcc");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_list.php",
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
        console.log(response.data);
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

  deleteCommodity = (commodityid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_delete.php",
        {
          commodityid: commodityid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response.data);
        alert(this.language.deletesuccess);
        //window.location.reload()
        this.reset();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteMerchantGlobal = (commodityid) => {
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/commodity_delete.php",
        {
          commodityid: commodityid,
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
        this.commoditList(tmp.merchantId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  commoditList = (merchantId) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_merchant.php",
        {
          merchantid: merchantId,
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
        // console.log(temp);
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_merchant.php",
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
        // console.log(temp);
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    // localStorage.removeItem("this_is_data");
    // localStorage.removeItem("commodity_data");
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
                  Commodity
                </Typography>
                <br></br>
                <div className="contentDate">
                  <div style={{ marginRight: 16 }}>
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
                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#008b02",
                      }}
                      startIcon={<AddBox />}
                      onClick={() => this.addNew()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        {this.globallang.add}
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
export default ListCommoditySub;
