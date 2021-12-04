import React, { Component } from "react";
import { Label, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { convertToRupiah } from "../../../global.js";
import { getLanguage } from "../../../languages";
import ReactExport from "react-export-excel";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import {
  Refresh,
  ImportExport,
  Assignment,
  Storage,
  Cancel,
} from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

const format1 = "YYYY-MM-DD HH:mm:ss";
var date = new Date();
var DateTimeNow = moment(date).format(format1);

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-20%",
    transform: "translate(-50%, -50%)",
  },
};

class CheckTransactionPage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listbillingdebtor");
    this.state = {
      tableData: [],
      filter: "",
      communityid: this.props.community.communityid,
      startDate: moment(),
      endDate: moment(),
      modalIsOpen: false,
      dataDetail: "",
      communityCode: "",
    };
    this.DetailView = this.DetailView.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.tableColumns = [
      {
        Header: "No.",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: "Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "dateCreated",
        style: { textAlign: "left" },
      },
      {
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
      },
      {
        Header: "Transaction ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "request_id",
        style: { textAlign: "center" },
      },
      {
        Header: "Invoice Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "invoiceId",
        style: { textAlign: "center" },
      },
      {
        Header: "Amount",
        headerStyle: { fontWeight: "bold" },
        accessor: "totalAmount",
        style: { textAlign: "center" },
        Cell: (e) => convertToRupiah(e.original.totalAmount),
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "dokuStatus",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.dokuStatus === "SUCCESS" ? (
            <span style={{ color: "#0066ff", fontWeight: "bold" }}>
              SUCCESS
            </span>
          ) : e.original.expired_date < DateTimeNow ? (
            <span style={{ color: "red", fontWeight: "bold" }}>
              EXPIRED PAYMENT
            </span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>PENDING</span>
          ),
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
                backgroundColor: "#00bcd4",
              }}
              startIcon={<Assignment />}
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
                Detail
              </Typography>
            </Button>
          </div>
        ),
      },
    ];
  }

  closeModal() {
    this.setState({ modalIsOpen: false, dataDetail: "" });
  }

  DetailView(dt) {
    // console.log(dt);
    this.setState({ modalIsOpen: true, dataDetail: dt });
  }

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "check_transaction.php",
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
        // console.log(this.state);
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }

        const result = temp.filter(
          (elm) => elm.CompanyCode === this.state.communityCode
        );

        this.setState({ tableData: result });
      })
      .catch((error) => {
        this.props.doLoading();
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
        this.loadDataCheckOutTransaction(getCommunityIdGlobal[0].communityCode);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  loadDataCheckOutTransaction = (communityCode) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "check_transaction.php",
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
        // console.log(response);
        this.props.doLoading();
        var dataTransaction = this.state.tableData;
        dataTransaction = response.data.records;
        for (var i = 0; i < dataTransaction.length; i++) {
          dataTransaction[i].id = i + 1;
        }

        const result = dataTransaction.filter(
          (elm) => elm.CompanyCode === communityCode
        );

        this.setState({ tableData: result });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.getListCommunity();
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.setState({
      startDate: moment(),
      endDate: moment(),
    });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "check_transaction.php",
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
        // console.log(response);
        this.props.doLoading();
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }

        const result = temp.filter(
          (elm) => elm.CompanyCode === this.state.communityCode
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
        serverUrl + "check_transaction_date.php",
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
          (elm) => elm.CompanyCode === this.state.communityCode
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

  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
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
            Check Out Transaction Detail
          </Typography>
          <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td width={200}>
                <Label for="dateCreated">Order Date Request</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="dateCreated"
                  id="dateCreated"
                  value={this.state.dataDetail.dateCreated}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="request_id">Transaction ID</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="request_id"
                  id="request_id"
                  value={this.state.dataDetail.request_id}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="invoiceId">Invoice Number</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="invoiceId"
                  id="invoiceId"
                  value={this.state.dataDetail.invoiceId}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="amount">Amount</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="amount"
                  id="amount"
                  value={convertToRupiah(this.state.dataDetail.totalAmount)}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="status">Status</Label>
              </td>
              <td>
                {this.state.dataDetail.dokuStatus === "SUCCESS" ? (
                  <Input
                    style={{ color: "#0066ff", fontWeight: "bold" }}
                    type="text"
                    name="status"
                    id="status"
                    value="SUCCESS"
                  />
                ) : this.state.dataDetail.expired_date < DateTimeNow ? (
                  <Input
                    style={{ color: "red", fontWeight: "bold" }}
                    type="text"
                    name="status"
                    id="status"
                    value="EXPIRED PAYMENT"
                  />
                ) : (
                  <Input
                    style={{ color: "red", fontWeight: "bold" }}
                    type="text"
                    name="status"
                    id="status"
                    value="PENDING"
                  />
                )}
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {this.state.dataDetail.dokuStatus === "SUCCESS" ? (
              <>
                <tr>
                  <td width={200}>
                    <Label for="invoiceId">Transaction Date</Label>
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="invoiceId"
                      id="invoiceId"
                      value={this.state.dataDetail.transactionDate}
                    />
                  </td>
                </tr>
                <tr>&nbsp;</tr>
                {this.state.dataDetail.virtual_account_number !==
                "CREDIT_CARD" ? (
                  <>
                    {" "}
                    <tr>
                      <td width={200}>
                        <Label for="invoiceId">VA Number</Label>
                      </td>
                      <td>
                        <Input
                          type="text"
                          name="invoiceId"
                          id="invoiceId"
                          value={this.state.dataDetail.virtual_account_number}
                        />
                      </td>
                    </tr>
                    <tr>&nbsp;</tr>
                  </>
                ) : (
                  <></>
                )}

                <tr>
                  <td width={200}>
                    <Label for="invoiceId">Payment Method</Label>
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="invoiceId"
                      id="invoiceId"
                      value={this.state.dataDetail.service}
                    />
                  </td>
                </tr>
                <tr>&nbsp;</tr>
                <tr>
                  <td width={200}>
                    <Label for="invoiceId">Payment Channel</Label>
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="invoiceId"
                      id="invoiceId"
                      value={this.state.dataDetail.channel}
                    />
                  </td>
                </tr>
                <tr>&nbsp;</tr>
                <tr>
                  <td width={200}>
                    <Label for="invoiceId">Payment Acquirer</Label>
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="invoiceId"
                      id="invoiceId"
                      value={this.state.dataDetail.acquirer}
                    />
                  </td>
                </tr>
                <tr>&nbsp;</tr>
              </>
            ) : (
              <></>
            )}
          </table>
        </div>
        <br></br>
        <div className="page-header">
          Customer Information <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td width={200}>
                <Label for="nama">Name</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="nama"
                  id="nama"
                  value={this.state.dataDetail.name}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="phone">Phone Number</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  value={this.state.dataDetail.phone}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td width={200}>
                <Label for="email">Email</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  value={this.state.dataDetail.email}
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
              backgroundColor: "#d0021b",
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
              Close
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
                  Check Out Transaction
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
                      // minDate={this.state.startDate}
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
                  <div style={{ marginRight: 10 }}>
                    <ExcelFile
                      element={
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#4caf50",
                          }}
                          startIcon={<ImportExport />}
                        >
                          <Typography
                            variant="button"
                            style={{
                              fontSize: 14,
                              color: "#fff",
                              textTransform: "capitalize",
                            }}
                          >
                            Export
                          </Typography>
                        </Button>
                      }
                    >
                      <ExcelSheet
                        data={this.state.tableData}
                        name="Check Out Transaction"
                      >
                        <ExcelColumn label="No" value="id" />
                        <ExcelColumn label="Date" value="dateCreated" />
                        <ExcelColumn label="Phone" value="phone" />
                        <ExcelColumn label="Name" value="name" />
                        <ExcelColumn label="Email" value="email" />
                        <ExcelColumn
                          label="Transaction ID"
                          value="request_id"
                        />
                        <ExcelColumn label="Invoice Number" value="invoiceId" />
                        <ExcelColumn
                          label="Amount"
                          value={(col) => convertToRupiah(col.totalAmount)}
                        />
                        <ExcelColumn
                          label="Transaction Date"
                          value="transactionDate"
                        />
                        <ExcelColumn
                          label="VA Number Date"
                          value="virtual_account_number"
                        />
                        <ExcelColumn label="Payment Method" value="service" />
                        <ExcelColumn label="Payment Channel" value="channel" />
                        <ExcelColumn
                          label="Payment Acquirer"
                          value="acquirer"
                        />
                        <ExcelColumn label="Status" value="dokuStatus" />
                      </ExcelSheet>
                    </ExcelFile>
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
        {this.renderModal()}
      </Box>
    );
  }
}
export default CheckTransactionPage;
