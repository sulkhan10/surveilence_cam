import React, { Component } from "react";
import { Button, InputGroup, InputGroupAddon, Label, Input } from "reactstrap";
import axios from "axios";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";

const Style = {
  control: (provided) => ({ ...provided, width: "160" }),
  container: (provided) => ({ ...provided, width: "160" }),
};

export default class UnitInvoiceInput extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      UnitShow: [],
      DebtorAcct: "",
      PeriodeMonth: "",
      PeriodeMonthShow: [
        { id: "01", text: "JANUARI" },
        { id: "02", text: "FEBRUARI" },
        { id: "03", text: "MARET" },
        { id: "04", text: "APRIL" },
        { id: "05", text: "MEI" },
        { id: "06", text: "JUNI" },
        { id: "07", text: "JULI" },
        { id: "08", text: "AGUSTUS" },
        { id: "09", text: "SEPTEMBER" },
        { id: "10", text: "OKTOBER" },
        { id: "11", text: "NOVEMBER" },
        { id: "12", text: "DESEMBER" },
      ],
      PeriodeYear: "",
      PeriodeYearShow: [],
      Category: "",
      CategoryShow: [],
      InvAmt: "",
      InvNo: "",
    };
  }

  onSearch = (query) => {
    axios
      .post(
        serverUrl + "unit_available.php",
        { filter: query },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ UnitShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doShowUnitInfo = () => {
    axios
      .post(
        serverUrl + "unit_available.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ UnitShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doGetYear = () => {
    axios
      .post(
        serverUrl + "year_available.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ PeriodeYearShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doGetCategory = () => {
    axios
      .post(
        serverUrl + "paymentcategory.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let result = response.data;
        this.setState({ CategoryShow: result.records });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doCheckInvoice = () => {
    let params = {
      InvNo: this.state.InvNo,
    };
    // console.log(params);

    axios
      .post(serverUrl + "unit_inv_validation.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        let result = response.data;
        if (result.status === "OK") {
          console.log("Ready Invoice");
          alert("The invoice already exists");
          return false;
        } else {
          this.doSubmit();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  doSubmit = () => {
    let params = {
      idInv: 0,
      DebtorAcct: this.state.DebtorAcct.value,
      PeriodeMonth: this.state.PeriodeMonth,
      PeriodeYear: this.state.PeriodeYear,
      Periode: this.state.PeriodeYear + this.state.PeriodeMonth,
      Category: this.state.Category,
      InvNo: this.state.InvNo,
      InvAmt: this.state.InvAmt,
      InvDate:
        this.state.PeriodeYear + "-" + this.state.PeriodeMonth + "-" + "01",
    };

    console.log(params);
    this.props.doLoading();
    axios
      .post(serverUrl + "unit_inv_insert_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        alert("Invoice payment saved successfully");
        this.props.history.push("/panel/unitinvoice");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.doShowUnitInfo();
    this.doGetYear();
    this.doGetCategory();
  };

  checkData = () => {
    const { DebtorAcct } = this.state;
    const { PeriodeMonth } = this.state;
    const { PeriodeYear } = this.state;
    const { Category } = this.state;
    const { InvAmt } = this.state;
    const { InvNo } = this.state;

    if (
      DebtorAcct === "" ||
      PeriodeMonth === "" ||
      PeriodeYear === "" ||
      Category === "" ||
      InvAmt === "" ||
      InvNo === ""
    ) {
      alert("Please fill all form invoice payment");
      return false;
    } else {
      this.doCheckInvoice();
    }
  };

  handleOnSearch = (string) => {
    // console.log(string);
    if (string.trim() !== "") {
      this.onSearch(string);
    }
  };

  changeUnit = (UnitId) => {
    console.log(UnitId);
    this.setState({
      DebtorAcct: UnitId,
    });
  };

  changePeriodeMonth = (month) => {
    this.setState({ PeriodeMonth: month });
  };

  changePeriodeYear = (year) => {
    this.setState({ PeriodeYear: year });
  };

  changeCategory = (category) => {
    this.setState({ Category: category });
  };

  doGenerateInv = () => {
    let Inv =
      "CR/" +
      this.state.Category +
      "/" +
      this.state.PeriodeYear +
      this.state.PeriodeMonth +
      "/" +
      this.state.DebtorAcct.value;
    this.setState({
      InvNo: Inv,
    });
  };

  GenerateInvoice = () => {
    const { DebtorAcct } = this.state;
    const { PeriodeMonth } = this.state;
    const { PeriodeYear } = this.state;
    const { Category } = this.state;
    const { InvAmt } = this.state;

    if (
      DebtorAcct !== "" &&
      PeriodeMonth !== "" &&
      PeriodeYear !== "" &&
      Category !== "" &&
      InvAmt !== ""
    ) {
      return (
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button
              color="primary"
              size="sm"
              onClick={() => this.doGenerateInv()}
            >
              Generate Invoice
            </Button>
          </InputGroupAddon>
          <Input
            type="text"
            name="InvNo"
            id="InvNo"
            disabled
            value={this.state.InvNo}
            onChange={(event) =>
              this.setState({
                InvNo: event.target.value.toUpperCase(),
              })
            }
          />
        </InputGroup>
      );
    } else {
      return (
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button color="secondary" size="sm">
              Generate Invoice
            </Button>
          </InputGroupAddon>
          <Input
            type="text"
            name="InvNo"
            id="InvNo"
            disabled
            value={this.state.InvNo}
            onChange={(event) =>
              this.setState({
                InvNo: event.target.value.toUpperCase(),
              })
            }
          />
        </InputGroup>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          Add Unit Invoice Payment <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td width={200}>
                  <Label for="DebtorAcct">Debtor Account</Label>
                </td>
                <td>
                  <Select
                    onBlur={false}
                    styles={Style}
                    placeholder="Search Unit..."
                    onInputChange={this.handleOnSearch}
                    value={this.state.DebtorAcct}
                    onChange={this.changeUnit}
                    options={this.state.UnitShow}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="PeriodeMonth">Periode Month</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.PeriodeMonth}
                    valueColumn={"id"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.PeriodeMonthShow}
                    onChange={this.changePeriodeMonth}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="PeriodeYear">Periode Year</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.PeriodeYear}
                    valueColumn={"id"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.PeriodeYearShow}
                    onChange={this.changePeriodeYear}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="Category">Category</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.Category}
                    valueColumn={"text"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.CategoryShow}
                    onChange={this.changeCategory}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="LotNo">Invoice Amount</Label>
                </td>
                <td>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">Rp.</InputGroupAddon>
                    <Input
                      placeholder="Amount"
                      min={0}
                      max={100}
                      type="number"
                      step="1"
                      value={this.state.InvAmt}
                      onChange={(event) =>
                        this.setState({
                          InvAmt: event.target.value.toUpperCase(),
                        })
                      }
                    />
                    <InputGroupAddon addonType="append">.00</InputGroupAddon>
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="InvNo">Invoice Number</Label>
                </td>
                <td>{this.GenerateInvoice()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div className="form-button-container">
          <Button
            color="secondary"
            onClick={() => this.props.history.push("/panel/unitinvoice")}
          >
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;Cancel
          </Button>
          &nbsp;&nbsp;
          <Button color="primary" onClick={() => this.checkData()}>
            <FontAwesomeIcon icon="save" />
            &nbsp;Submit
          </Button>
        </div>
      </div>
    );
  }
}
