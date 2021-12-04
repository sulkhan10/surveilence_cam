import React, { Component } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
// import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
// import CheckboxGroup from "../../Components/CheckboxGroup/CheckboxGroup";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class UnitClusterInput extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.state = {
      ValidShow: [
        { id: 1, text: "YES" },
        { id: 0, text: "NO" },
      ],
      UnitId: 0,
      isValid: 1,
      DebtorAcct: "",
      LotNo: "",
      BisnisId: "",
      ClusterName: "",
      CompanyCode: "CRG",
    };
  }

  onSubmit = () => {
    let params = {
      UnitID: this.state.UnitId,
      DebtorAcct: this.state.DebtorAcct,
      LotNo: this.state.LotNo,
      BisnisId: this.state.BisnisId,
      ClusterName: this.state.ClusterName,
      CompanyCode: this.state.CompanyCode,
      IsValid: this.state.isValid,
    };
    console.log(params);
    this.props.doLoading();
    axios
      .post(serverUrl + "unit_insert_update.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        alert("Unit saved successfully");
        this.props.history.push("/panel/unitcluster");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  checkData = () => {
    const { DebtorAcct } = this.state;
    const { LotNo } = this.state;

    if (DebtorAcct == null || LotNo == null) {
      alert("Please fill Debtor Account dan Unit Number");
      return false;
    } else {
      this.onSubmit();
    }
  };

  changeValid = (id) => {
    this.setState({ isValid: id });
  };

  render() {
    return (
      <div>
        <div className="page-header">
          Add Unit & Cluster <span className="dash">&nbsp;&nbsp;</span>{" "}
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
                  <Input
                    type="text"
                    name="DebtorAcct"
                    id="DebtorAcct"
                    placeholder="Please enter debtor account"
                    value={this.state.DebtorAcct}
                    onChange={(event) =>
                      this.setState({
                        DebtorAcct: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="LotNo">Unit Number</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="LotNo"
                    id="LotNo"
                    placeholder="Please enter unit number"
                    value={this.state.LotNo}
                    onChange={(event) =>
                      this.setState({ LotNo: event.target.value.toUpperCase() })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="BisnisId">Bisnis Id</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="BisnisId"
                    id="BisnisId"
                    placeholder="Please enter bisnis id"
                    value={this.state.BisnisId}
                    onChange={(event) =>
                      this.setState({
                        BisnisId: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="ClusterName">Cluster Name</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="ClusterName"
                    id="ClusterName"
                    placeholder="Please enter cluster name"
                    value={this.state.ClusterName}
                    onChange={(event) =>
                      this.setState({
                        ClusterName: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="CompanyCode">Company Code</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="CompanyCode"
                    id="CompanyCode"
                    placeholder="Please enter company code"
                    value={this.state.CompanyCode}
                    disabled
                    onChange={(event) =>
                      this.setState({
                        CompanyCode: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="IsValid">Is Valid</Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.isValid}
                    valueColumn={"id"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.ValidShow}
                    onChange={this.changeValid}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div className="form-button-container">
          <Button
            color="secondary"
            onClick={() => this.props.history.push("/panel/unitcluster")}
          >
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;{this.globallang.cancel}
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
