import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { numberFormat } from "../../../global.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertToRupiah } from "../../../global.js";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ListFinancialReport extends Component {
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
        accessor: "OrderDate",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: this.language.columnphone,
        headerStyle: { fontWeight: "bold" },
        accessor: "phone",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "User Order",
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Merchant Name",
        headerStyle: { fontWeight: "bold" },
        accessor: "MerchantName",
        style: { textAlign: "left" },
        width: 200,
      },
      {
        Header: "Merchant Category",
        headerStyle: { fontWeight: "bold" },
        accessor: "MerchantCategory",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Product Item",
        headerStyle: { fontWeight: "bold" },
        accessor: "item_product",
        style: { textAlign: "left" },
        width: 200,
      },

      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "item_discount",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.item_discount === 1
            ? e.original.item_priceDiscountId
            : e.item_promo1buyget1Id === 1
            ? "Promo Buy 1 Get 1"
            : "Normal Price",
      },
      {
        Header: "Payment By",
        headerStyle: { fontWeight: "bold" },
        accessor: "PaymentMethod",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Normal product prices",
        headerStyle: { fontWeight: "bold" },
        accessor: "item_price",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.item_price),
      },
      {
        Header: "Disc",
        headerStyle: { fontWeight: "bold" },
        accessor: "item_discount",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.item_discount === 1
            ? convertToRupiah(
                e.original.item_price *
                  (e.original.item_priceDiscountId.replace("%", "") / 100)
              )
            : "Rp.0-",
      },
      {
        Header: "After Disc product prices",
        headerStyle: { fontWeight: "bold" },
        accessor: "item_price",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.item_discount === 1
            ? convertToRupiah(
                e.original.item_price *
                  ((100 - e.original.item_priceDiscountId.replace("%", "")) /
                    100)
              )
            : convertToRupiah(e.original.item_price),
      },
      {
        Header: "Delivery By",
        headerStyle: { fontWeight: "bold" },
        accessor: "deliveryById",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => (e.original.deliveryById === 1 ? "KOSMO" : "MERCHANT"),
      },
      {
        Header: "Delivery Normal",
        headerStyle: { fontWeight: "bold" },
        accessor: "fee_by_kosmo",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.deliveryById === 1
            ? convertToRupiah(e.original.fee_by_kosmo)
            : convertToRupiah(e.original.fee_by_merchant),
      },
      {
        Header: "Disc Delivery",
        headerStyle: { fontWeight: "bold" },
        accessor: "status_diskon_bykosmo",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.deliveryById === 1
            ? e.original.status_diskon_bykosmo === 1
              ? convertToRupiah(
                  (e.original.fee_by_kosmo *
                    e.original.feeDiskonByKOSMOID.replace("%", "")) /
                    100
                )
              : "Rp.0-"
            : "Rp.0-",
      },
      {
        Header: "Delivery include Disc",
        headerStyle: { fontWeight: "bold" },
        accessor: "deliveryById",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.deliveryById === 1
            ? e.original.status_diskon_bykosmo === 1
              ? convertToRupiah(
                  e.original.fee_by_kosmo *
                    ((100 - e.original.feeDiskonByKOSMOID.replace("%", "")) /
                      100)
                )
              : convertToRupiah(e.original.fee_by_kosmo)
            : convertToRupiah(e.original.fee_by_merchant),
      },
      {
        Header: "Power Merchant Service Fee 1%",
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantcategoryname",
        style: { textAlign: "center" },
        width: 250,
        Cell: (e) =>
          e.original.deliveryById === 2
            ? e.original.item_discount === 0
              ? convertToRupiah((e.original.item_price * 1) / 100)
              : convertToRupiah(
                  (e.original.item_price *
                    ((100 - e.original.item_priceDiscountId.replace("%", "")) /
                      100) *
                    1) /
                    100
                )
            : "Rp.0-",
      },
      {
        Header: "2.5% FREE Delivery Service Fee",
        headerStyle: { fontWeight: "bold" },
        accessor: "deliveryById",
        style: { textAlign: "center" },
        width: 250,
        Cell: (e) =>
          e.original.deliveryById === 2
            ? e.original.item_discount === 0
              ? convertToRupiah((e.original.item_price * 2.5) / 100)
              : convertToRupiah(
                  (e.original.item_price *
                    ((100 - e.original.item_priceDiscountId.replace("%", "")) /
                      100) *
                    2.5) /
                    100
                )
            : "Rp.0-",
      },
      {
        Header: "Xendit gateway payment fee",
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 250,
        Cell: (e) => "Rp.0-",
      },
      {
        Header: "15% KOSMO discount",
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantcategoryname",
        style: { textAlign: "center" },
        width: 250,
        Cell: (e) =>
          e.original.item_discount === 0
            ? convertToRupiah((e.original.item_price * 15) / 100)
            : "Rp.0-",
      },
      {
        Header: "Total Merchant Discounts to KOSMO",
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantcategoryname",
        style: { textAlign: "center" },
        width: 250,
        Cell: (e) =>
          e.original.deliveryById === 2
            ? e.original.item_discount === 0
              ? convertToRupiah(
                  (e.original.item_price * 1) / 100 +
                    (e.original.item_price * 2.5) / 100 +
                    (e.original.item_price * 15) / 100
                )
              : convertToRupiah(
                  (e.original.item_price *
                    ((100 - e.original.item_priceDiscountId.replace("%", "")) /
                      100) *
                    1) /
                    100 +
                    (e.original.item_price *
                      ((100 -
                        e.original.item_priceDiscountId.replace("%", "")) /
                        100) *
                      2.5) /
                      100 +
                    (e.original.item_price * 15) / 100
                )
            : convertToRupiah(0 + 0 + (e.original.item_price * 15) / 100),
      },
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

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "financial_report_list.php",
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
        console.log(response.data);
        alert(this.language.deletesuccess);
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
    this.LoadDataOrder();
  };

  componentWillUnmount() {
    // clearInterval(this.intervalId);
  }

  LoadDataOrder = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "financial_report_list.php",
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
        console.log(response);
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

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.setState({ startDate: moment() });
    this.setState({ endDate: moment() });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "financial_report_list.php",
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
        console.log(response);
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

  getDataBydate = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "financial_report_bydate.php",
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
        this.setState({ tableData: temp });
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
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Merchant financial reports
        </Label>
        <div className="contentDate">
          <div
            style={{
              alignSelf: "center",
              marginRight: 10,
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Start Date:
          </div>
          <div style={{ marginRight: 10 }}>
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
          &nbsp;&nbsp;
          <div
            style={{
              alignSelf: "center",
              marginRight: 10,
              color: "#000",
              fontWeight: "bold",
            }}
          >
            End Date:
          </div>
          <div style={{ marginRight: 10 }}>
            <DatePicker
              minDate={subDays(new Date(), 30)}
              // maxDate={addDays(new Date(), 31)}
              selected={this.state.endDate}
              onChange={(date) => this.setEndDate(date)}
              selectsEnd
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              minDate={this.state.startDate}
              className="datefilter"
            />
          </div>
          <div style={{ marginRight: 10 }}>
            <Button color="primary" onClick={() => this.doSeacrhBydate()}>
              <FontAwesomeIcon icon="random" />
              &nbsp;Get Data
            </Button>
          </div>
          <div style={{ marginRight: 10 }}>
            <ExcelFile
              element={
                <Button color="success">
                  <FontAwesomeIcon icon="file-excel" />
                  Export
                </Button>
              }
            >
              <ExcelSheet data={this.state.tableData} name="Financial Report">
                <ExcelColumn label="No" value="id" />
                <ExcelColumn label="Order Date" value="OrderDate" />
                <ExcelColumn label="Phone number" value="phone" />
                <ExcelColumn label="User Order" value="name" />
                <ExcelColumn label="Merchant Name" value="MerchantName" />
                <ExcelColumn
                  label="Merchant Category"
                  value="MerchantCategory"
                />
                <ExcelColumn label="Product Item" value="item_product" />
                <ExcelColumn
                  label="Status"
                  value={(col) =>
                    col.item_discount === 1
                      ? col.item_priceDiscountId
                      : col.item_promo1buyget1Id === 1
                      ? "Promo Buy 1 Get 1"
                      : "Normal Price"
                  }
                />

                <ExcelColumn label="Payment By" value="PaymentMethod" />
                <ExcelColumn
                  label="Normal product prices"
                  value={(col) => convertToRupiah(col.item_price)}
                />
                <ExcelColumn
                  label="Disc"
                  value={(col) =>
                    col.item_discount === 1
                      ? convertToRupiah(
                          col.item_price *
                            (col.item_priceDiscountId.replace("%", "") / 100)
                        )
                      : "Rp.0"
                  }
                />
                <ExcelColumn
                  label="After Disc product prices"
                  value={(col) =>
                    col.item_discount === 1
                      ? convertToRupiah(
                          col.item_price *
                            ((100 - col.item_priceDiscountId.replace("%", "")) /
                              100)
                        )
                      : convertToRupiah(col.item_price)
                  }
                />
                <ExcelColumn
                  label="Delivery By"
                  value={(col) =>
                    col.deliveryById === 1 ? "KOSMO" : "MERCHANT"
                  }
                />
                <ExcelColumn
                  label="Delivery Normal"
                  value={(col) =>
                    col.deliveryById === 1
                      ? convertToRupiah(col.fee_by_kosmo)
                      : convertToRupiah(col.fee_by_merchant)
                  }
                />
                <ExcelColumn
                  label="Disc Delivery"
                  value={(col) =>
                    col.deliveryById === 1
                      ? col.status_diskon_bykosmo === 1
                        ? convertToRupiah(
                            (col.fee_by_kosmo *
                              col.feeDiskonByKOSMOID.replace("%", "")) /
                              100
                          )
                        : "Rp.0-"
                      : "Rp.0-"
                  }
                />
                <ExcelColumn
                  label="Delivery include Disc"
                  value={(col) =>
                    col.deliveryById === 1
                      ? col.status_diskon_bykosmo === 1
                        ? convertToRupiah(
                            col.fee_by_kosmo *
                              ((100 - col.feeDiskonByKOSMOID.replace("%", "")) /
                                100)
                          )
                        : convertToRupiah(col.fee_by_kosmo)
                      : convertToRupiah(col.fee_by_merchant)
                  }
                />
                <ExcelColumn
                  label="Power Merchant Service Fee 1%"
                  value={(col) =>
                    col.deliveryById === 2
                      ? col.item_discount === 0
                        ? convertToRupiah((col.item_price * 1) / 100)
                        : convertToRupiah(
                            (col.item_price *
                              ((100 -
                                col.item_priceDiscountId.replace("%", "")) /
                                100) *
                              1) /
                              100
                          )
                      : "Rp.0-"
                  }
                />
                <ExcelColumn
                  label="2.5% FREE Delivery Service Fee"
                  value={(col) =>
                    col.deliveryById === 2
                      ? col.item_discount === 0
                        ? convertToRupiah((col.item_price * 2.5) / 100)
                        : convertToRupiah(
                            (col.item_price *
                              ((100 -
                                col.item_priceDiscountId.replace("%", "")) /
                                100) *
                              2.5) /
                              100
                          )
                      : "Rp.0-"
                  }
                />
                <ExcelColumn label="Xendit gateway payment fee" value="Rp.0" />
                <ExcelColumn
                  label="15% KOSMO discount"
                  value={(col) =>
                    col.item_discount === 0
                      ? convertToRupiah((col.item_price * 15) / 100)
                      : "Rp.0-"
                  }
                />
                <ExcelColumn
                  label="Total Merchant Discounts to KOSMO"
                  value={(col) =>
                    col.deliveryById === 2
                      ? col.item_discount === 0
                        ? convertToRupiah(
                            (col.item_price * 1) / 100 +
                              (col.item_price * 2.5) / 100 +
                              (col.item_price * 15) / 100
                          )
                        : convertToRupiah(
                            (col.item_price *
                              ((100 -
                                col.item_priceDiscountId.replace("%", "")) /
                                100) *
                              1) /
                              100 +
                              (col.item_price *
                                ((100 -
                                  col.item_priceDiscountId.replace("%", "")) /
                                  100) *
                                2.5) /
                                100 +
                              (col.item_price * 15) / 100
                          )
                      : convertToRupiah(0 + 0 + (col.item_price * 15) / 100)
                  }
                />
              </ExcelSheet>
            </ExcelFile>
          </div>
          <div style={{ marginRight: 0 }}>
            <Button color="info" onClick={() => this.reset()}>
              <FontAwesomeIcon icon="sync" />
              &nbsp;{this.globallang.reset}
            </Button>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={10}
          />
        </div>
      </FormGroup>
    );
  }
}
export default ListFinancialReport;
