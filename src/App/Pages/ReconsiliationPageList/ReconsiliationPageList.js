import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Table,
} from "reactstrap";
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
import { activeLanguage } from "../../../config";
import { convertToRupiah } from "../../../global.js";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink, CSVDownload } from "react-csv";
import ReactExport from "react-export-excel";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ReconsiliationPageList extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      summaryId: 0,
      tableDataKosmo: [],
      tableDataXendit: [],
      tableDataModernland: [],
      tableDataRekon: [],
      filter: "",
      startDate: moment(),
      endDate: moment(),
      sumAmountModern: 0,
      sumAmount: 0,
      cardCount: 0,
      bankCount: 0,
      virtualCount: 0,
      transferCount: 0,
      timeReport: "",
      endReport: "",
      infoSummaryList: [],
      xendit: "XENDIT",
      kosmo: "KOSMO",
      mdln: "MODERNLAND",
      statusrecon: 0,
      showRecon: false,
      dataToDownload: [],
      resultExport: [],
      communityid: this.props.community.communityid,
    };
    this.reactTable = React.createRef();
    this.download = this.download.bind(this);
    this.tableColumnsKosmo = [
      {
        Header: "KOSMO ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "KOSMO_ID",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "XENDIT ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "XENDIT_ID",
        style: { textAlign: "center" },
        width: 300,
      },
      {
        Header: "MODERNLAND ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "MODERNLAND_ID",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Invoice Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "INVOICE_NUMBER",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Payer Email",
        headerStyle: { fontWeight: "bold" },
        accessor: "PAYER_EMAIL",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Debtor Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "DEBTOR_ACCOUNT",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Sub Total",
        headerStyle: { fontWeight: "bold" },
        accessor: "SUB_TOTAL",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.SUB_TOTAL),
      },
      {
        Header: "Discount",
        headerStyle: { fontWeight: "bold" },
        accessor: "DISCOUNT",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.DISCOUNT),
      },
      {
        Header: "Charge",
        headerStyle: { fontWeight: "bold" },
        accessor: "CHARGE",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.CHARGE),
      },
      {
        Header: "Paid Amount",
        headerStyle: { fontWeight: "bold" },
        accessor: "PAID_AMOUNT",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.PAID_AMOUNT),
      },
      {
        Header: "Xendit Fee",
        headerStyle: { fontWeight: "bold" },
        accessor: "XENDIT_FEE",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.XENDIT_FEE),
      },
      {
        Header: "Status Payment",
        headerStyle: { fontWeight: "bold" },
        accessor: "STATUS_PAYMENT",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Paid Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "PAID_DATE",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Payment Method",
        headerStyle: { fontWeight: "bold" },
        accessor: "PAYMENT_METHOD",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Payment Channel",
        headerStyle: { fontWeight: "bold" },
        accessor: "PAYMENT_CHANNEL",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Disbursement Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "DISBURSEMENT_DATE",
        style: { textAlign: "center" },
        width: 200,
        // Cell : e => (e.original.paymentmethod === "CREDIT_CARD" ? <span> {e.original.validdate} </span> : <span></span>)
      },
      {
        Header: "Company Code",
        headerStyle: { fontWeight: "bold" },
        accessor: "COMPANY_CODE",
        style: { textAlign: "center" },
        width: 300,
        // Cell : e => (e.original.companycode === "MDL" ? "PT. Modernland Realty Tbk Site C" : (e.original.companycode === "MSS" ? "PT. Mitra Sukses Sundo" : "PT. Mitra Sukses Makmur"))
      },
    ];

    this.tableColumnsModernland = [
      {
        Header: "MODERNLAND ID",
        headerStyle: { fontWeight: "bold" },
        accessor: "transaksiModernlandId",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Invoice Number",
        headerStyle: { fontWeight: "bold" },
        accessor: "invoiceNumber",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Debtor Account",
        headerStyle: { fontWeight: "bold" },
        accessor: "debtorAccount",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Amount Pay",
        headerStyle: { fontWeight: "bold" },
        accessor: "amount",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => convertToRupiah(e.original.amount),
      },
      {
        Header: "Status Payment",
        headerStyle: { fontWeight: "bold" },
        accessor: "statusPayment",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) =>
          e.original.statusPayment == "PAID" ? (
            <span style={{ color: "#0066ff" }}>PAID</span>
          ) : (
            <span style={{ color: "#ff8d00" }}>PENDING</span>
          ),
      },
      {
        Header: "Paid Date",
        headerStyle: { fontWeight: "bold" },
        accessor: "paidDate",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Payment Method",
        headerStyle: { fontWeight: "bold" },
        accessor: "paymentMethod",
        style: { textAlign: "center" },
        width: 200,
      },
      {
        Header: "Company Code",
        headerStyle: { fontWeight: "bold" },
        accessor: "companyCode",
        style: { textAlign: "center" },
        width: 300,
        Cell: (e) =>
          e.original.companyCode === "MDL"
            ? "PT. Modernland Realty Tbk Site C"
            : e.original.companyCode === "MSS"
            ? "PT. Mitra Sukses Sundo"
            : "PT. Mitra Sukses Makmur",
      },
    ];
  }

  doRowEdit = (row) => {
    this.props.history.push("/panel/detailbillingdebtor/" + row.billingid);
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
    // this.setState({endDate: date})
    // console.log(this.state.startDate);
  };
  setEndDate = (date) => {
    this.setState({ endDate: date });
    // console.log(this.state.startDate);
  };

  doSeacrhBydate = () => {
    this.setState({ showRecon: true });
    this.getDataByDateModernland();
    this.getDataBydate();
  };

  getDataByDateModernland = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "reconsiliation_modernland.php",
        {
          startDate: this.state.startDate
            .clone()
            .startOf("day")
            .format("YYYY-MM-DD"),
          endDate: this.state.endDate.clone().endOf("day").format("YYYY-MM-DD"),
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
        var temp = this.state.tableDataModernland;
        temp = response.data.data;
        // this.setState({tableDataModernland : temp});
        const results = temp.filter(({ invoiceNumber: id1 }) =>
          this.state.tableDataKosmo.some(
            ({ invoiceNumber: id2 }) => id2 === id1
          )
        );
        // console.log(results);
        this.setState({ tableDataModernland: results });

        let resultLast = [];
        var i = 0;
        this.state.tableDataKosmo.map((idx, val1) => {
          results.map((idx2, val2) => {
            if (idx.invoiceNumber == idx2.invoiceNumber) {
              idx.transaksiModernlandId = idx2.transaksiModernlandId;
            }

            // console.log(idx.invoiceNumber+"===="+idx2.invoiceNumber);
          });
          resultLast.push({
            KOSMO_ID: "TRPAY-0" + idx.billingid,
            XENDIT_ID: idx.transaksi_id,
            MODERNLAND_ID:
              idx.transaksiModernlandId == undefined
                ? ""
                : idx.transaksiModernlandId,
            INVOICE_NUMBER: idx.invoiceNumber,
            PAYER_EMAIL: idx.payeremail,
            DEBTOR_ACCOUNT: idx.debtor,
            SUB_TOTAL: idx.subtotal,
            DISCOUNT: idx.diskon,
            CHARGE: idx.denda,
            PAID_AMOUNT: idx.amount,
            XENDIT_FEE: idx.xenditfee,
            STATUS_PAYMENT: idx.status,
            PAID_DATE: idx.paid_date,
            PAYMENT_METHOD: idx.paymentmethod,
            PAYMENT_CHANNEL: idx.paymentchannel,
            PAYMENT_CHANNEL: idx.paymentchannel,
            DISBURSEMENT_DATE: idx.validdate,
            COMPANY_CODE:
              idx.companycode === "MDL"
                ? "PT. Modernland Realty Tbk Site C"
                : idx.companycode === "MSS"
                ? "PT. Mitra Sindo Sukses"
                : "PT. Mitra Sindo Makmur",
          });
          i++;
        });

        // console.log(resultLast);
        this.setState({ tableDataRekon: resultLast });
        this.setState({ resultExport: resultLast });

        let sumAmount = results.reduce(function (prev, current) {
          return prev + +current.amount;
        }, 0);

        // console.log(sumAmount)
        this.setState({ sumAmountModern: sumAmount });

        let bankMethod = results.filter(
          (item) => item.paymentMethod === "Transfer"
        );
        let bankMethodCount = bankMethod.length;
        this.setState({ transferCount: bankMethodCount });

        let cardMethod = results.filter(
          (item) => item.paymentMethod === "Virtual Account"
        );
        let cardMethodCount = cardMethod.length;
        this.setState({ virtualCount: cardMethodCount });

        let arr = this.state.infoSummaryList;
        arr.push({
          transactionby: this.state.kosmo,
          totaltransaction: this.state.tableDataKosmo.length,
          totalamount: this.state.sumAmount,
          totalBank: this.state.bankCount,
          totalCard: this.state.cardCount,
        });
        arr.push({
          transactionby: this.state.xendit,
          totaltransaction: this.state.tableDataXendit.length,
          totalamount: this.state.sumAmount,
          totalBank: this.state.bankCount,
          totalCard: this.state.cardCount,
        });
        arr.push({
          transactionby: this.state.mdln,
          totaltransaction: this.state.tableDataModernland.length,
          totalamount: this.state.sumAmountModern,
          totalBank: this.state.transferCount,
          totalCard: this.state.virtualCount,
        });

        // console.log(arr);
        this.setState({ infoSummaryList: arr });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getDataBydate = () => {
    this.setState({ infoSummaryList: [] });
    // this.props.doLoading();
    axios
      .post(
        serverUrl + "reconsiliation_list_bydate2.php",
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
        // console.log(response);
        // this.props.doLoading();
        var temp = [];
        var temp2 = [];
        temp = response.data.records;
        temp2 = response.data.records2;

        var newArray = temp.concat(temp2);
        // console.log(newArray);

        this.setState({ tableDataKosmo: newArray });
        this.setState({ tableDataXendit: newArray });

        let amountTotal = newArray;
        let sumAmount = amountTotal.reduce(function (prev, current) {
          return prev + +current.amount;
        }, 0);
        this.setState({ sumAmount: sumAmount });

        let bankMethod = newArray.filter(
          (item) => item.paymentmethod === "BANK_TRANSFER"
        );
        let bankMethodCount = bankMethod.length;
        this.setState({ bankCount: bankMethodCount });

        let cardMethod = newArray.filter(
          (item) => item.paymentmethod === "CREDIT_CARD"
        );
        let cardMethodCount = cardMethod.length;
        this.setState({ cardCount: cardMethodCount });

        let dateReport = this.state.startDate
          .clone()
          .startOf("day")
          .format("YYYY-MM-DD");
        this.setState({ timeReport: dateReport });

        let endDateReport = this.state.endDate
          .clone()
          .startOf("day")
          .format("YYYY-MM-DD");
        this.setState({ endReport: endDateReport });

        // let arr = this.state.infoSummaryList;
        // arr.push({ transactionby: this.state.kosmo, totaltransaction: this.state.tableDataKosmo.length, totalamount:this.state.sumAmount, totalBank: this.state.bankCount, totalCard: this.state.cardCount});
        // arr.push({ transactionby: this.state.xendit, totaltransaction: this.state.tableDataXendit.length, totalamount:this.state.sumAmount, totalBank: this.state.bankCount, totalCard: this.state.cardCount});
        // arr.push({ transactionby: this.state.mdln, totaltransaction: this.state.tableDataModernland.length, totalamount:this.state.sumAmountModern, totalBank: this.state.transferCount, totalCard: this.state.virtualCount});

        // console.log(arr);
        // this.setState({infoSummaryList : arr});

        // let resultExport = [];
        // var i = 0;

        // temp.map((idx, val) => {
        //     resultExport.push({KOSMO_ID: "TRPAY-0"+idx.billingid, XENDIT_ID: idx.transaksi_id, MODERNLAND_ID: '', INVOICE_NUMBER: idx.invoiceNumber, PAYER_EMAIL: idx.payeremail, DEBTOR_ACCOUNT: idx.debtor, AMOUNT_PAY: idx.amount, XENDIT_FEE: idx.xenditfee, STATUS_PAYMENT: idx.status,  PAID_DATE: idx.paid_date,  PAYMENT_METHOD: idx.paymentmethod, PAYMENT_CHANNEL: idx.paymentchannel,  PAYMENT_CHANNEL: idx.paymentchannel, DISBURSEMENT_DATE: idx.validdate, COMPANY_CODE: (idx.companycode == 'MDL' ? 'PT. Modernland Realty Tbk Site C' : 'PT. MITRA SUKSES SUDO')})
        //     i++;
        // });

        // this.setState({resultExport : resultExport});
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.loadModernland();
    this.loadKosmo();
    this.loadXendit();
  };

  loadKosmo = () => {
    // this.props.doLoading();
    axios
      .post(
        serverUrl + "reconsiliation_kosmo2.php",
        {
          filter: "",
          communityid: this.state.communityid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        // this.props.doLoading();
        var temp = [];
        var temp2 = [];
        temp = response.data.records;
        temp2 = response.data.records2;

        var newArray = temp.concat(temp2);
        // console.log(newArray);
        this.setState({ tableDataKosmo: newArray });

        let sumAmount = newArray.reduce(function (prev, current) {
          return prev + +current.amount;
        }, 0);
        this.setState({ sumAmount: sumAmount });

        let bankMethod = newArray.filter(
          (item) => item.paymentmethod === "BANK_TRANSFER"
        );
        let bankMethodCount = bankMethod.length;
        this.setState({ bankCount: bankMethodCount });

        let cardMethod = newArray.filter(
          (item) => item.paymentmethod === "CREDIT_CARD"
        );
        let cardMethodCount = cardMethod.length;
        this.setState({ cardCount: cardMethodCount });
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  loadXendit = () => {
    axios
      .post(
        serverUrl + "reconsiliation_xendit2.php",
        {
          filter: "",
          communityid: this.state.communityid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        var temp = [];
        var temp2 = [];
        temp = response.data.records;
        temp2 = response.data.records2;

        var newArray = temp.concat(temp2);
        // console.log(newArray);
        this.setState({ tableDataXendit: newArray });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  loadModernland = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "reconsiliation_modernland.php",
        {
          startDate: "2020-01-01",
          // startDate: this.state.startDate
          //   .clone()
          //   .startOf("day")
          //   .format("YYYY-MM-DD"),
          endDate: this.state.endDate.clone().endOf("day").format("YYYY-MM-DD"),
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        // console.log(response);
        var temp = this.state.tableDataModernland;
        temp = response.data.data;
        // this.setState({tableDataModernland : temp});

        const results = temp.filter(({ invoiceNumber: id1 }) =>
          this.state.tableDataKosmo.some(
            ({ invoiceNumber: id2 }) => id2 === id1
          )
        );
        // console.log(results);
        this.setState({ tableDataModernland: results });

        let resultLast = [];
        var i = 0;
        this.state.tableDataKosmo.map((idx, val1) => {
          results.map((idx2, val2) => {
            if (idx.invoiceNumber == idx2.invoiceNumber) {
              idx.transaksiModernlandId = idx2.transaksiModernlandId;
            }

            // console.log(idx.invoiceNumber+"===="+idx2.invoiceNumber);
          });
          resultLast.push({
            KOSMO_ID: "TRPAY-0" + idx.billingid,
            XENDIT_ID: idx.transaksi_id,
            MODERNLAND_ID:
              idx.transaksiModernlandId == undefined
                ? ""
                : idx.transaksiModernlandId,
            INVOICE_NUMBER: idx.invoiceNumber,
            PAYER_EMAIL: idx.payeremail,
            DEBTOR_ACCOUNT: idx.debtor,
            SUB_TOTAL: idx.subtotal,
            DISCOUNT: idx.diskon,
            CHARGE: idx.denda,
            PAID_AMOUNT: idx.amount,
            XENDIT_FEE: idx.xenditfee,
            STATUS_PAYMENT: idx.status,
            PAID_DATE: idx.paid_date,
            PAYMENT_METHOD: idx.paymentmethod,
            PAYMENT_CHANNEL: idx.paymentchannel,
            PAYMENT_CHANNEL: idx.paymentchannel,
            DISBURSEMENT_DATE: idx.validdate,
            COMPANY_CODE:
              idx.companycode === "MDL"
                ? "PT. Modernland Realty Tbk Site C"
                : idx.companycode === "MSS"
                ? "PT. Mitra Sukses Sundo"
                : "PT. Mitra Sukses Makmur",
          });
          i++;
        });

        // console.log(resultLast);
        this.setState({ tableDataRekon: resultLast });

        let sumAmount = results.reduce(function (prev, current) {
          return prev + +current.amount;
        }, 0);

        // console.log(sumAmount)
        this.setState({ sumAmountModern: sumAmount });

        let bankMethod = results.filter(
          (item) => item.paymentMethod === "Transfer"
        );
        let bankMethodCount = bankMethod.length;
        this.setState({ transferCount: bankMethodCount });

        let cardMethod = results.filter(
          (item) => item.paymentMethod === "Virtual Account"
        );
        let cardMethodCount = cardMethod.length;
        this.setState({ virtualCount: cardMethodCount });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  CheckRecon = () => {
    if (this.state.tableDataKosmo.length === 0) {
      alert(
        "There are no transactions on the date" +
          " " +
          moment(this.state.timeReport).format("LL") +
          "-" +
          moment(this.state.endReport).format("LL")
      );
    } else {
      let bodyParams = {
        timeReport: this.state.timeReport,
        endReport: this.state.endReport,
      };

      // console.log(bodyParams)
      this.props.doLoading();
      axios
        .post(serverUrl + "recon_checkdate.php", bodyParams, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        })
        .then((response) => {
          this.props.doLoading();
          if (response.data.status === "OK") {
            alert(
              "Sorry, the data has been reconciled based on the selected date" +
                " " +
                moment(this.state.timeReport).format("LL") +
                "-" +
                moment(this.state.endReport).format("LL")
            );
          } else {
            this.pushDataRecon();
          }
        })
        .catch((error) => {
          this.props.doLoading();
          console.log(error);
          alert(error);
        });
    }
  };

  pushDataRecon = () => {
    let bodyParams = {
      summaryId: this.state.summaryId,
      timeReport: this.state.timeReport,
      endReport: this.state.endReport,
      statusrecon: this.state.statusrecon,
      datecreated: moment().format("YYYY-MM-DD hh:mm:ss"),
      infoSummaryList: this.state.infoSummaryList,
    };

    console.log(bodyParams);
    this.props.doLoading();
    axios
      .post(serverUrl + "summary_payment.php", bodyParams, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "OK") {
          alert(
            "reconciliation data successfully saved base on the selected date" +
              " " +
              moment(this.state.timeReport).format("LL") +
              " - " +
              moment(this.state.endReport).format("LL")
          );
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    this.setState({ showRecon: false });
    this.setState({ infoSummaryList: [] });
    this.setState({ timeReport: "" });
    this.setState({ endReport: "" });
    this.setState({ startDate: moment() });
    this.setState({ endDate: moment() });
    this.setState({ tableDataRekon: [] });
    this.setState({ tableDataKosmo: [] });
    this.setState({ tableDataXendit: [] });
    this.setState({ tableDataModernland: [] });
    this.loadModernland();
    this.loadKosmo();
    this.loadXendit();
  };

  timeReport = () => {
    if (this.state.timeReport !== "") {
      return (
        <div>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
            {moment(this.state.timeReport).format("LL")} -{" "}
            {moment(this.state.endDate).format("LL")}{" "}
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  showButtonRecon = () => {
    if (this.state.showRecon === true) {
      return (
        <Button color="success" onClick={() => this.CheckRecon()}>
          <FontAwesomeIcon icon="paper-plane" />
          &nbsp;Recon
        </Button>
      );
    } else {
      return null;
    }
  };

  download(event) {
    const currentRecords = this.reactTable.getResolvedState().sortedData;
    var data_to_download = [];

    for (var index = 0; index < currentRecords.length; index++) {
      let record_to_download = {};
      for (
        var colIndex = 0;
        colIndex < this.tableColumnsKosmo.length;
        colIndex++
      ) {
        record_to_download[this.tableColumnsKosmo[colIndex].Header] =
          currentRecords[index][this.tableColumnsKosmo[colIndex].accessor];
      }
      data_to_download.push(record_to_download);
    }
    this.setState({ dataToDownload: data_to_download }, () => {
      // click the CSVLink component to trigger the CSV download
      this.csvLink.link.click();
    });
  }

  showExport = () => {
    if (this.state.showRecon === true) {
      return (
        // <CSVLink
        //   data={this.state.resultExport}
        //   filename={"Reconsiliation_report.csv"}
        //   className="btn btn-success"
        //   target="_blank"
        // >
        //   <FontAwesomeIcon icon="file-excel" />
        //   &nbsp;Export
        // </CSVLink>
        <ExcelFile
          element={
            <Button color="success">
              <FontAwesomeIcon icon="file-excel" />
              Export
            </Button>
          }
        >
          <ExcelSheet
            data={this.state.resultExport}
            name="Report Reconsiliation Payment"
          >
            <ExcelColumn label="KOSMO ID" value="KOSMO_ID" />
            <ExcelColumn label="XENDIT ID" value="XENDIT_ID" />
            <ExcelColumn label="MODERNLAND ID" value="MODERNLAND_ID" />
            <ExcelColumn label="INVOICE NUMBER" value="INVOICE_NUMBER" />
            <ExcelColumn label="PAYER EMAIL" value="PAYER_EMAIL" />
            <ExcelColumn label="DEBTOR ACCOUNT" value="DEBTOR_ACCOUNT" />
            <ExcelColumn
              label="SUB TOTAL"
              value={(col) => convertToRupiah(col.SUB_TOTAL)}
            />
            <ExcelColumn
              label="DISCOUNT"
              value={(col) => convertToRupiah(col.DISCOUNT)}
            />
            <ExcelColumn
              label="CHARGE"
              value={(col) => convertToRupiah(col.CHARGE)}
            />
            <ExcelColumn
              label="PAID AMOUNT"
              value={(col) => convertToRupiah(col.PAID_AMOUNT)}
            />
            <ExcelColumn
              label="XENDIT FEE"
              value={(col) => convertToRupiah(col.XENDIT_FEE)}
            />
            <ExcelColumn label="STATUS PAYMENT" value="STATUS_PAYMENT" />
            <ExcelColumn label="PAID DATE" value="PAID_DATE" />
            <ExcelColumn label="PAYMENT METHOD" value="PAYMENT_METHOD" />
            <ExcelColumn label="PAYMENT CHANNEL" value="PAYMENT_CHANNEL" />
            <ExcelColumn label="DISBURSEMENT_DATE" value="DISBURSEMENT_DATE" />
            <ExcelColumn label="COMPANY CODE" value="COMPANY_CODE" />
          </ExcelSheet>
        </ExcelFile>
      );
    } else {
      return (
        <Button color="secondary">
          <FontAwesomeIcon icon="file-excel" />
          &nbsp;Export
        </Button>
      );
    }
  };

  doExport = () => {
    console.log(
      this.state.startDate
        .clone()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss") +
        "&" +
        this.state.endDate.clone().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    );
    window.open(
      serverUrl +
        "recon_export.php?filter=" +
        this.state.filter +
        "&startDate=" +
        this.state.startDate
          .clone()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        this.state.endDate.clone().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      "_blank"
    );
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Summary of IPKL Bill Payment Reports <br></br>
          {this.timeReport()}
        </Label>
        <div className="contentDate">
          <div
            style={{ alignSelf: "center", color: "#000", fontWeight: "bold" }}
          >
            Start Date:
          </div>
          &nbsp;&nbsp;
          <DatePicker
            maxDate={addDays(new Date(), 30)}
            selected={this.state.startDate}
            onChange={(date) => this.setStartDate(date)}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            className="datefilter"
          />{" "}
          &nbsp;&nbsp;
          <div
            style={{ alignSelf: "center", color: "#000", fontWeight: "bold" }}
          >
            End Date:
          </div>
          &nbsp;&nbsp;
          <DatePicker
            minDate={subDays(new Date(), 30)}
            maxDate={addDays(new Date(), 1)}
            selected={this.state.endDate}
            onChange={(date) => this.setEndDate(date)}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            minDate={this.state.startDate}
            className="datefilter"
          />
          &nbsp;&nbsp;
          <Button color="info" onClick={() => this.doSeacrhBydate()}>
            <FontAwesomeIcon icon="random" />
            &nbsp;Get Data
          </Button>
          &nbsp;&nbsp;
          {this.showExport()}
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.reset()}>
            <FontAwesomeIcon icon="sync" />
            &nbsp;Reset
          </Button>
        </div>
        <br></br>
        <br></br>
        <div className="box-container">
          <Table bordered size="sm">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Transaction By</th>
                <th style={{ textAlign: "center" }}>Total Transaction</th>
                <th style={{ textAlign: "center" }}>Total Paid Amount</th>
                <th style={{ textAlign: "center" }}>
                  Total Payment Method Credit Card
                </th>
                <th style={{ textAlign: "center" }}>
                  Total Payment Method Bank Transfer
                </th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>KOSMO</td>
                <td style={{ textAlign: "center" }}>
                  {this.state.tableDataKosmo.length}
                </td>
                <td style={{ textAlign: "center" }}>
                  {convertToRupiah(this.state.sumAmount)}
                </td>
                <td style={{ textAlign: "center" }}>{this.state.cardCount}</td>
                <td style={{ textAlign: "center" }}>{this.state.bankCount}</td>
                <th
                  style={{ textAlign: "center", alignSelf: "center" }}
                  rowspan="3"
                >
                  {this.showButtonRecon()}
                </th>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>XENDIT</td>
                <td style={{ textAlign: "center" }}>
                  {this.state.tableDataXendit.length}
                </td>
                <td style={{ textAlign: "center" }}>
                  {convertToRupiah(this.state.sumAmount)}
                </td>
                <td style={{ textAlign: "center" }}>{this.state.cardCount}</td>
                <td style={{ textAlign: "center" }}>{this.state.bankCount}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>MODERNLAND</td>
                <td style={{ textAlign: "center" }}>
                  {this.state.tableDataModernland.length}
                </td>
                <td style={{ textAlign: "center" }}>
                  {convertToRupiah(this.state.sumAmountModern)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {this.state.virtualCount}
                </td>
                <td style={{ textAlign: "center" }}>
                  {this.state.transferCount}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <br></br>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>
          List Reconciliation Report
        </Label>
        {/* <ReactTable ref={(r) => this.reactTable = r} data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} defaultPageSize={5} /> */}
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableDataRekon}
            columns={this.tableColumnsKosmo}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={5}
          />
        </div>
        <br></br>
        {/* <ReactTable ref={(r) => this.reactTable = r}
                            data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
                    /> */}
        {/* <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >KOSMO Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} defaultPageSize={5} />
                <br></br>
                <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >Xendit Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataXendit} columns={this.tableColumnsXendit} defaultPageSize={5} />
                <br></br> */}
        {/* <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >Modernland Reconciliation Report</Label> */}
        {/* <ReactTable data={this.state.tableDataModernland} columns={this.tableColumnsModernland} defaultPageSize={5} /> */}
        {/* <ReactTable ref={(r) => this.reactTable = r}
                            data={this.state.tableDataModernland} columns={this.tableColumnsModernland} filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
                            defaultPageSize={5}
                    /> */}
      </FormGroup>
    );
  }
}
export default ReconsiliationPageList;
