import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  Row,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { convertToRupiah } from "../../../global.js";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import ReactTable from "react-table";

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-30%",
    transform: "translate(-50%, -50%)",
  },
};

class DetailBillingDebtor extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "detailbilling");
    this.state = {
      billingid: props.match.params.billingid,
      externalid: "",
      phonenumber: "",
      name_debtor: "",
      transaksi_amount: "",
      payer_email: "",
      transaksi_date: "",
      transaksi_id: "",
      paid_amount: "",
      payment_method: "",
      payment_channel: "",
      status_payment: "",
      payment_date: "",
      debtor_acct: "",
      communityid: "",
      communityShow: [],
      Info: [],
    };

    this.tableColumns = [
      {
        Header: this.language.invoicenumber,
        headerStyle: { fontWeight: "bold" },
        accessor: "invoicenumber",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.amountpayment,
        headerStyle: { fontWeight: "bold" },
        accessor: "priceamount",
        style: { textAlign: "center" },
        Cell: (e) => convertToRupiah(e.original.priceamount),
      },
    ];
  }

  selectCommunity = () => {
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
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  changeCommunity = (communityid) => {
    this.setState({ communityid: communityid });
  };

  componentDidMount = () => {
    this.selectCommunity();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "billingdebtor_get_by_id.php",
        {
          billingid: this.state.billingid,
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

        this.setState({ billingid: response.data.record.billingid });
        this.setState({ externalid: response.data.record.externalid });
        this.setState({ phonenumber: response.data.record.phonenumber });
        this.setState({ name_debtor: response.data.record.name_debtor });
        this.setState({
          transaksi_amount: response.data.record.transaksi_amount,
        });
        this.setState({ payer_email: response.data.record.payer_email });
        this.setState({ transaksi_date: response.data.record.transaksi_date });
        this.setState({ transaksi_id: response.data.record.transaksi_id });
        this.setState({ paid_amount: response.data.record.paid_amount });
        this.setState({ payment_method: response.data.record.payment_method });
        this.setState({
          payment_channel: response.data.record.payment_channel,
        });
        this.setState({ status_payment: response.data.record.status_payment });
        this.setState({ payment_date: response.data.record.payment_date });
        this.setState({ debtor_acct: response.data.record.debtor_acct });
        this.setState({ communityid: response.data.record.communityid });
        this.setState({ Info: response.data.record.info });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  renderOrderDetail = () => {
    return (
      <div className="form-detail">
        <div className="detail-title">Invoice Detail</div>
        <div className="detail-info-input">
          <FormGroup>
            <br></br>
            <ReactTable
              data={this.state.Info}
              columns={this.tableColumns}
              defaultPageSize={5}
            />
          </FormGroup>
        </div>
      </div>
    );
  };

  cancel = () => {
    this.props.history.push("/panel/listbillingdebtor");
  };

  render() {
    return (
      <div>
        <div className="page-header">
          {this.language.title} <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td width={200}>
                <Label for="externalid">{this.language.fieldexternalid}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="externalid"
                  id="externalid"
                  placeholder="Invoice Number"
                  disabled="disabled"
                  value={this.state.externalid}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="debtoraccount">{this.language.fielddebtor}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="debtoraccount"
                  id="debtoraccount"
                  placeholder="Debtor Account"
                  disabled="disabled"
                  value={this.state.debtor_acct}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="phonenumber">{this.language.fieldphone}</Label>
              </td>
              <td>
                <Input
                  type="number"
                  name="phonenumber"
                  id="phonenumber"
                  placeholder="Phone Number"
                  disabled="disabled"
                  value={this.state.phonenumber}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="namedebtor">{this.language.fieldname_debtor}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="namedebtor"
                  id="namedebtor"
                  placeholder="Name Debtor"
                  disabled="disabled"
                  value={this.state.name_debtor}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="email">{this.language.fieldpayer_email}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Payer Email"
                  disabled="disabled"
                  value={this.state.payer_email}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="transaksiid">
                  {this.language.fieldtransaksi_id}
                </Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="transaksi_id"
                  id="transaksi_id"
                  placeholder="Transaksi ID"
                  disabled="disabled"
                  value={this.state.transaksi_id}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {/* <tr>
                            <td><Label for="transaksidate">{this.language.fieldtransaksi_date}</Label></td>
                            <td><Input type="text" name="transaksidate" id="transaksidate" placeholder="Transaksi Date"  disabled="disabled" value={this.state.transaksi_date}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr> */}
            <tr>
              <td>
                <Label for="paymentdate">
                  {this.language.fieldpayment_date}
                </Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="paymentdate"
                  id="paymentdate"
                  placeholder="Payment Date"
                  disabled="disabled"
                  value={this.state.payment_date}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="paidamount">{this.language.fieldpaid_amount}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="paidamount"
                  id="paidamount"
                  placeholder="Paid Amount"
                  disabled="disabled"
                  value={convertToRupiah(this.state.paid_amount)}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="payment_method">
                  {this.language.fieldpayment_method}
                </Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="payment_method"
                  id="payment_method"
                  placeholder="Payment Method"
                  disabled="disabled"
                  value={this.state.payment_method}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="payment_channel">
                  {this.language.fieldpayment_channel}
                </Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="payment_channel"
                  id="payment_channel"
                  placeholder="Payment Channel"
                  disabled="disabled"
                  value={this.state.payment_channel}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="status_payment">
                  {this.language.fieldstatus_payment}
                </Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="status_payment"
                  id="status_payment"
                  placeholder="Status Payment"
                  disabled="disabled"
                  value={this.state.status_payment}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {/* <tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr> */}
          </table>
          {this.renderOrderDetail()}
        </div>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.cancel()}>
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;{this.globallang.cancel}
          </Button>
        </div>
      </div>
    );
  }
}
export default DetailBillingDebtor;
