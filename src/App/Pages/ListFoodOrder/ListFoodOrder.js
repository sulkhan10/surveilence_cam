import React, { Component } from "react";
import DatePicker from "react-datepicker";
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
import { convertToRupiah } from "../../../global.js";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Storage } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const format1 = "YYYY-MM-DD HH:mm:ss";
var date = new Date();
var DateTimeNow = moment(date).format(format1);

class ListFoodOrder extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listfoodorder");
    this.state = {
      tableData: [],
      filter: "",
      communityid: this.props.community.communityid,
      startDate: moment(),
      endDate: moment(),
      communityShow: [],
      dataCommunity: [],
      communityCode: "",
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
        Header: "Order Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "requestorder",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Invoice",
        headerStyle: { fontWeight: "bold" },
        accessor: "invoiceNumber",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: this.language.columnphone,
        headerStyle: { fontWeight: "bold" },
        accessor: "phoneno",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "User Order",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Merchant Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantname",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Merchant Category",
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantcategoryname",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Total Payment",
        headerStyle: { fontWeight: "bold" },
        accessor: "price",
        style: { textAlign: "center" },
        Cell: (e) => convertToRupiah(e.original.totalPayment),
        width: 200,
      },
      {
        Header: "Max Date Payment",
        headerStyle: { fontWeight: "bold" },
        accessor: "max_paiddate",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Delivery By",
        headerStyle: { fontWeight: "bold" },
        accessor: "deliveryById",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.deliveryById === 1 ? (
            <span>ZOOM</span>
          ) : (
            <span>MERCHANT</span>
          ),
      },
      {
        Header: "Status Payment",
        headerStyle: { fontWeight: "bold" },
        accessor: "statuspayment",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.statuspayment === 0 &&
          e.original.statusorder !== 3 &&
          e.original.max_paiddate > DateTimeNow ? (
            <span style={{ color: "#cc0000", fontWeight: "bold" }}>
              PENDING
            </span>
          ) : e.original.statuspayment === 1 && e.original.statusorder !== 3 ? (
            <span style={{ color: "#007bff", fontWeight: "bold" }}>PAID</span>
          ) : e.original.statuspayment === 0 && e.original.statusorder === 3 ? (
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              UNPAID (EXPIRED)
            </span>
          ) : e.original.max_paiddate < DateTimeNow &&
            e.original.statuspayment === 0 &&
            e.original.statusorder !== 3 ? (
            <span style={{ color: "red", fontWeight: "bold" }}>
              EXPIRED PAYMENT
            </span>
          ) : (
            <span style={{ color: "#999999", fontWeight: "bold" }}>
              PAID (REFUND)
            </span>
          ),
      },

      {
        Header: "Status Order",
        headerStyle: { fontWeight: "bold" },
        accessor: "statusorder",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.deliveryById === 1 ? (
            e.original.max_paiddate > DateTimeNow &&
            e.original.statuspayment === 0 &&
            e.original.paid_amount === "" ? (
              <span style={{ color: "#ff0018", fontWeight: "bold" }}>
                Waiting for payment
              </span>
            ) : e.original.paid_amount !== e.original.totalPayment ? (
              <span style={{ color: "#6c757d", fontWeight: "bold" }}>
                Incomplete payment
              </span>
            ) : e.original.status_zoom === "" &&
              e.original.statuspayment !== 0 &&
              e.original.paid_amount !== "" ? (
              <span style={{ color: "#ff9933", fontWeight: "bold" }}>
                Processed
              </span>
            ) : e.original.status_zoom === "finding driver" ? (
              <span style={{ color: "#ff9933", fontWeight: "bold" }}>
                Finding Driver
              </span>
            ) : e.original.status_zoom === "Available" ? (
              <span style={{ color: "#ff9933", fontWeight: "bold" }}>
                Finding Driver
              </span>
            ) : e.original.status_zoom === "On Delivery" ? (
              <span style={{ color: "#28a745", fontWeight: "bold" }}>
                Delivering
              </span>
            ) : e.original.status_zoom === "Offline" ? (
              <span style={{ color: "#6c757d", fontWeight: "bold" }}>
                Driver is offline
              </span>
            ) : e.original.status_zoom === "Pickup" ? (
              <span style={{ color: "#28a745", fontWeight: "bold" }}>
                Pick Up Order
              </span>
            ) : e.original.status_zoom === "Canceled" ? (
              <span style={{ color: "#6c757d", fontWeight: "bold" }}>
                Order not taken by drivers
              </span>
            ) : e.original.status_zoom === "Unsuccessful" ? (
              <span style={{ color: "#ff0018", fontWeight: "bold" }}>
                Unsuccessful
              </span>
            ) : e.original.status_zoom === "Delivered" ? (
              <span style={{ color: "#007bff", fontWeight: "bold" }}>
                Delivered
              </span>
            ) : e.original.max_paiddate < DateTimeNow &&
              e.original.statuspayment === 0 &&
              e.original.paid_amount === "" ? (
              <span style={{ color: "#ff0018", fontWeight: "bold" }}>
                Expired
              </span>
            ) : (
              ""
            )
          ) : e.original.max_paiddate > DateTimeNow &&
            e.original.statuspayment === 0 &&
            e.original.paid_amount === "" ? (
            <span style={{ color: "#ff0018", fontWeight: "bold" }}>
              Waiting for payment
            </span>
          ) : e.original.paid_amount !== e.original.totalPayment ? (
            <span style={{ color: "#6c757d", fontWeight: "bold" }}>
              Incomplete payment
            </span>
          ) : e.original.status_zoom === "" &&
            e.original.statuspayment !== 0 &&
            e.original.paid_amount !== "" ? (
            <span style={{ color: "#28a745", fontWeight: "bold" }}>
              on Process
            </span>
          ) : e.original.max_paiddate < DateTimeNow &&
            e.original.statuspayment === 0 &&
            e.original.paid_amount === "" ? (
            <span style={{ color: "#ff0018", fontWeight: "bold" }}>
              Expired
            </span>
          ) : (
            <span style={{ color: "#007bff", fontWeight: "bold" }}>
              Delivered
            </span>
          ),
      },

      // {
      //   Header: this.language.columnaction,
      //   headerStyle: { fontWeight: "bold" },
      //   accessor: "",
      //   style: { textAlign: "center" },
      //   width: 200,
      //   Cell: (e) => (
      //     <div>
      //       <Button
      //         color="warning"
      //         size="sm"
      //         onClick={() => this.doRowEdit(e.original)}
      //       >
      //         <FontAwesomeIcon icon="pen-square" />
      //         &nbsp;{this.globallang.edit}
      //       </Button>
      //       &nbsp;
      //       <Button
      //         color="danger"
      //         size="sm"
      //         onClick={() => this.doRowDelete(e.original)}
      //       >
      //         <FontAwesomeIcon icon="times-circle" />
      //         &nbsp;{this.globallang.delete}
      //       </Button>
      //     </div>
      //   ),
      // },
    ];
  }

  StatusOrder = (row) => {
    if (row.statusorder === 1) {
      return (
        <span style={{ fontSize: 14, color: "#007bff", fontWeight: "bold" }}>
          Delivered
        </span>
      );
    }
  };

  doRowEdit = (row) => {
    this.props.history.push("/panel/editfoodorder/" + row.foodorderid);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (foodorderid) => {
            var foodorderid = row.foodorderid;
            this.deleteFoodOrder(foodorderid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputfoodorder");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "foodorder_list.php",
        {
          filter: this.state.filter,
          communityid: this.state.communityid,
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
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteFoodOrder = (foodorderid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "foodorder_delete.php",
        {
          foodorderid: foodorderid,
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
        alert(this.language.deletesuccess);
        this.reset();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doUpdateCount = (foodorderid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "count_update.php",
        {
          foodorderid: foodorderid,
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
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    // this.intervalId = setInterval(() => this.LoadDataOrder(), 100000);
    this.getListCommunity();
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  selectCommunity = (dataCommunity) => {
    axios
      .post(
        serverUrl + "community_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ communityShow: response.data.records });

        const dataDT = this.state.communityShow;
        const result = dataDT.filter(
          (elm) => elm.communityid === this.state.communityid
        );
        const dtCommunityGlobal = dataCommunity;
        const getCommunityIdGlobal = dtCommunityGlobal.filter(
          (elm) => elm.label === result[0].communityname
        );
        // console.log("community local", result[0]);
        // console.log("community global", getCommunityIdGlobal[0]);
        this.setState({
          communityCode: getCommunityIdGlobal[0].communityCode,
        });
        this.LoadDataOrder(getCommunityIdGlobal[0].communityCode);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  getListCommunity = () => {
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/community.php",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = response.data.records;

        this.setState({ dataCommunity: tmp });
        this.selectCommunity(tmp);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  LoadDataOrder = (communityCode) => {
    this.props.doLoading();
    // console.log("userservices");
    // console.log(this.state.communityid);
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/foodorder_list.php",
        {
          filter: "",
          communityid: 0,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        this.props.doLoading();
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }

        const result = temp.filter((elm) => elm.companyCode === communityCode);
        this.setState({ tableData: result });
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
    this.setState({ startDate: moment() });
    this.setState({ endDate: moment() });
    this.props.doLoading();
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/foodorder_list.php",
        {
          filter: "",
          communityid: 0,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        this.props.doLoading();
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }

        const result = temp.filter(
          (elm) => elm.companyCode === this.state.communityCode
        );
        this.setState({ tableData: result });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getDataBydate = () => {
    this.props.doLoading();
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/foodorder_bydate.php",
        {
          startDate: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          endDate: this.state.endDate
            .clone()
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
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

        const result = temp.filter(
          (elm) => elm.companyCode === this.state.communityCode
        );
        this.setState({ tableData: result });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
  };
  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  doSeacrhBydate = () => {
    this.getDataBydate();
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
                  Order List
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
                    Start Date:
                  </Typography>
                  <div style={{ marginRight: 16 }}>
                    <DatePicker
                      maxDate={addDays(new Date(), 30)}
                      selected={this.state.startDate}
                      onChange={(date) => this.setStartDate(date)}
                      selectsStart
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      className="datefilter"
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
                    End Date:
                  </Typography>
                  <div style={{ marginRight: 16 }}>
                    <DatePicker
                      minDate={subDays(new Date(), 30)}
                      maxDate={addDays(new Date(), 31)}
                      selected={this.state.endDate}
                      onChange={(date) => this.setEndDate(date)}
                      selectsEnd
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      minDate={this.state.startDate}
                      className="datefilter"
                    />
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#006b76",
                      }}
                      startIcon={<Storage />}
                      onClick={() => this.doSeacrhBydate()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        Get Data
                      </Typography>
                    </Button>
                  </div>

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
export default ListFoodOrder;
