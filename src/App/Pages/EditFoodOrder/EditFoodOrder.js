import React, { Component } from "react";
import { Button, Label, Input } from "reactstrap";
import axios from "axios";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import { convertToRupiah } from "../../../global.js";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "55%",
//     right: "-20%",
//     bottom: "-30%",
//     transform: "translate(-50%, -50%)",
//   },
// };

class EditFoodOrder extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "editfoodorder");
    this.state = {
      foodorderid: props.match.params.foodorderid,
      requestorder: moment(),
      numberorder: "",
      phoneno: "",
      name: "",
      deliverto: "",
      locationdetail: "",
      paymentmethod: "",
      note: "",
      merchantname: "",
      merchantcategoryname: "",
      counteritem: "",
      counterprice: "",
      totalhargaNormal: "",
      totalPayment: "",
      deliveryById: "",
      fee_by_kosmo: "",
      fee_by_merchant: "",
      status_diskon_bykosmo: "",
      feeDiskonByKOSMOID: "",
      // status: "",
      ZoomOrderId: "",
      tax: "",
      statuspayment: "",
      currentdate: moment(),
      max_paiddate: "",
      status_zoom: "",
      paid_amount: "",
      status_payment: 0,
      status_order: false,
      status_canceled: false,
      status: false,
      tableOrder: [],
      tableOrderFood: [],
      modalIsOpen: false,
      Instruction: "",
      contact: "",
      statusShow: [
        { id: 0, display: "PENDING" },
        { id: 1, display: "PAID" },
        { id: 3, display: "REFUND" },
      ],
    };

    this.tableColumns = [
      {
        Header: this.language.columnservicecenter,
        headerStyle: { fontWeight: "bold" },
        accessor: "foodname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnprice,
        headerStyle: { fontWeight: "bold" },
        accessor: "price",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnquantity,
        headerStyle: { fontWeight: "bold" },
        accessor: "qty",
        style: { textAlign: "center" },
      },
    ];

    this.tableColumnsDrink = [
      {
        Header: this.language.columnservicecenter,
        headerStyle: { fontWeight: "bold" },
        accessor: "drinkname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnprice,
        headerStyle: { fontWeight: "bold" },
        accessor: "price",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnquantity,
        headerStyle: { fontWeight: "bold" },
        accessor: "qty",
        style: { textAlign: "center" },
      },
    ];

    this.tableColumnsOther = [
      {
        Header: this.language.columnservicecenter,
        headerStyle: { fontWeight: "bold" },
        accessor: "othername",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnprice,
        headerStyle: { fontWeight: "bold" },
        accessor: "price",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnquantity,
        headerStyle: { fontWeight: "bold" },
        accessor: "qty",
        style: { textAlign: "center" },
      },
    ];

    this.statusHandleChecked = this.statusHandleChecked.bind(this);
    this.statusPaymentHandleChecked =
      this.statusPaymentHandleChecked.bind(this);
    this.statusCanceledChecked = this.statusCanceledChecked.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.setState({ servicecenterid: 0 });
    this.setState({ quantity: 0 });
    this.setState({ price: 0 });
  }

  updateRequestDate = (requestdate) => {
    this.setState({ requestdate: requestdate });
  };

  changeServiceCenter = (servicecenterid) => {
    this.setState({ servicecenterid: servicecenterid });
    this.loadServiceCenterPrice(servicecenterid);
  };

  changeUser = (phoneno) => {
    this.setState({ phoneno: phoneno });
  };

  changeCompany = (companyid) => {
    setTimeout(() => {
      var dataCompany = this.state.dataCompany;

      for (var i = 0; i < dataCompany.length; i++) {
        if (dataCompany[i].companyid === companyid) {
          companyid = dataCompany[i].companyid;
        }
      }
      this.setState({ companyid: companyid });

      // let DataCompany = this.state.dataCompany;
      console.log(dataCompany);
      // this.setState({companyid: companyid});
      console.log(this.state.companyid);
    }, 200);

    axios
      .post(
        serverUrl + "teknisi_select_list.php",
        {
          companyid: companyid,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response);
        this.setState({ dataTeknisi: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  statusHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ status_order: checked });
  }

  statusPaymentHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ status_payment: checked });
  }

  statusCanceledChecked(event) {
    let checked = event.target.checked;
    this.setState({ status_canceled: checked });
  }

  checkData = () => {
    const { paid_amount } = this.state;
    const { totalPayment } = this.state;
    if (paid_amount === "") {
      alert("The paid amount cannot be empty");
      return false;
    } else if (paid_amount !== totalPayment) {
      alert("The payment amount is not the same as the total payment");
      return false;
    } else {
      this.onSubmit();
    }
  };

  addOrder = () => {
    const { servicecenterid } = this.state;

    if (servicecenterid === 0) {
      return false;
    } else {
      this.orderSave();
    }
  };

  orderSave = () => {
    axios
      .post(
        serverUrl + "userservicedetail_insert_update.php",
        {
          userservicedetailid: 0,
          userserviceid: this.state.userserviceid,
          servicecenterid: this.state.servicecenterid,
          quantity: this.state.quantity,
          price: this.state.price,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        alert(this.language.savesuccess);
        this.setState({ servicecenterid: 0 });
        this.setState({ quantity: 0 });
        this.setState({ price: 0 });
        this.loadOrder();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doRowDelete = (item) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (userservicedetailid) => {
            var userservicedetailid1 = item.userservicedetailid;
            this.deleteOrder(userservicedetailid1);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  deleteOrder = (userservicedetailid) => {
    axios
      .post(
        serverUrl + "userservicedetail_delete.php",
        {
          userservicedetailid: userservicedetailid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        alert(this.language.deletesuccess);
        this.loadOrder();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doRowEdit = (row) => {
    this.setState({ modalIsOpen: true });
    this.setState({ userservicedetailid: row.userservicedetailid });
    this.setState({ servicecenterid: row.servicecenterid });
    this.setState({ quantity: row.quantity });
    this.setState({ price: row.price });
    this.changeServiceCenter(row.servicecenterid);
  };

  doEditOrder = (userservicedetailid) => {
    const { servicecenterid } = this.state;

    if (servicecenterid === 0) {
      return false;
    } else {
      axios
        .post(
          serverUrl + "userservicedetail_insert_update.php",
          {
            userservicedetailid: this.state.userservicedetailid,
            userserviceid: this.state.userserviceid,
            servicecenterid: this.state.servicecenterid,
            quantity: this.state.quantity,
            price: this.state.price,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        )
        .then((response) => {
          alert(this.language.savesuccess);
          this.closeModal();
          this.loadOrder();
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "foodorder_get_by_id.php",
        {
          foodorderid: this.state.foodorderid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response);

        this.setState({ foodorderid: response.data.record.foodorderid });
        this.setState({ phoneno: response.data.record.phoneno });
        this.setState({ name: response.data.record.name });
        this.setState({ numberorder: response.data.record.numberorder });
        this.setState({ currentdate: response.data.record.currentdate });
        this.setState({ counterprice: response.data.record.counterprice });
        this.setState({
          totalhargaNormal: response.data.record.totalhargaNormal,
        });
        this.setState({ counteritem: response.data.record.counteritem });
        this.setState({ totalPayment: response.data.record.totalPayment });
        this.setState({
          merchantcategoryname: response.data.record.merchantcategoryname,
        });
        this.setState({ merchantname: response.data.record.merchantname });
        this.setState({ note: response.data.record.note });
        this.setState({ deliveryById: response.data.record.deliveryById });
        this.setState({ fee_by_kosmo: response.data.record.fee_by_kosmo });
        this.setState({
          fee_by_merchant: response.data.record.fee_by_merchant,
        });
        this.setState({
          status_diskon_bykosmo: response.data.record.status_diskon_bykosmo,
        });
        this.setState({
          feeDiskonByKOSMOID: response.data.record.feeDiskonByKOSMOID,
        });
        this.setState({ status: response.data.record.status });
        this.setState({ ZoomOrderId: response.data.record.ZoomOrderId });
        this.setState({ tax: response.data.record.tax });
        this.setState({ statuspayment: response.data.record.statuspayment });
        this.setState({ max_paiddate: response.data.record.max_paiddate });
        this.setState({ status_zoom: response.data.record.status_zoom });
        this.setState({ paid_amount: response.data.record.paid_amount });
        this.setState({ deliverto: response.data.record.deliverto });
        this.setState({ locationdetail: response.data.record.locationdetail });
        this.setState({ contact: response.data.record.contact });
        this.setState({
          status_payment:
            response.data.record.statuspayment === 1 ? true : false,
        });
        this.setState({
          status_order: response.data.record.statusorder === 1 ? true : false,
        });
        this.setState({
          status_canceled: response.data.record.canceled === 1 ? true : false,
        });
        this.setState({ paymentmethod: response.data.record.paymentmethod });
        this.setState({ tableOrderFood: response.data.record.OrderFood });

        var Instruction = response.data.record.OrderFood.map(
          (o) => "Item: " + o.foodname + ", " + " QTY:" + o.qty
        ).join(" | ");
        console.log(
          Instruction +
            " | " +
            " total item " +
            response.data.record.counteritem +
            " Note: " +
            response.data.record.note +
            " Total Price: " +
            response.data.record.totalhargaNormal
        );

        this.setState({
          Instruction:
            Instruction +
            " | " +
            " total item " +
            response.data.record.counteritem +
            " Note: " +
            response.data.record.note +
            " Total Price: " +
            response.data.record.totalhargaNormal,
        });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  onSubmit = () => {
    let params = {
      foodorderid: this.state.foodorderid,
      paid_amount: this.state.paid_amount,
      statuspayment: this.state.statuspayment,
    };
    axios
      .post(serverUrl + "foodorder_update2.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        if (response.data.status === "OK") {
          if (this.state.deliveryById === 1) {
            this.doRequestToZoom(this.state.foodorderid);
          } else {
            this.doNotifToMerchant(
              this.state.Instruction,
              this.state.merchantname,
              this.state.contact
            );
            alert(this.language.savesuccess);
            this.props.history.goBack();
          }
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doRequestToZoom = (orderid) => {
    let params = {
      orderid: orderid,
    };
    this.props.doLoading();
    axios
      .post(serverUrl + "food_request_zoom.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "OK") {
          this.doNotifToMerchant(
            this.state.Instruction,
            this.state.merchantname,
            this.state.contact
          );
          alert(this.language.savesuccess);
          this.props.history.goBack();
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doNotifToMerchant = (order, merchant, contact) => {
    let params = {
      order: order,
      merchant: merchant,
      contact: contact,
      Delivery: this.state.deliveryById === 1 ? "KOSMO" : "MERCHANT",
      OrderName: this.state.name,
      OrderPhone: this.state.phoneno,
    };
    axios
      .post(serverUrl + "/whatsap_cs2.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        alert(error);
      });
  };

  renderPromo = (item) => {
    if (item.commodityIsDiscountId === 1) {
      return <div className="promo">Promo Disc {item.priceDiscountId}</div>;
    } else if (item.promo1buyget1Id === 1) {
      return <div className="promo">Promo Buy 1 Get 1</div>;
    }
  };

  renderPrice = (item) => {
    if (item.commodityIsDiscountId === 1) {
      return (
        <td>
          <span>
            {convertToRupiah(
              item.price * ((100 - item.priceDiscountId.replace("%", "")) / 100)
            )}
          </span>
          &nbsp;
          <span
            style={{
              fontFamily: "monospace",
              textDecoration: "line-through",
              color: "#808080",
            }}
          >
            {convertToRupiah(item.price)}{" "}
          </span>{" "}
        </td>
      );
    } else {
      return (
        <td>
          <span>{convertToRupiah(item.price)}</span>
        </td>
      );
    }
  };

  renderOrderDetail = () => {
    return (
      <div className="form-detail">
        <div className="detail-title">User Order List</div>
        <div className="detail-info-input">
          <table>
            <tbody>
              <tr>
                <th>Order Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
              {this.state.tableOrderFood.map((item) => (
                <tr>
                  <td style={{ paddingLeft: 10 }}>
                    {item.foodname} {this.renderPromo(item)}
                  </td>
                  {this.renderPrice(item)}
                  <td style={{ paddingRight: 10 }}>{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  renderTax = () => {
    if (this.state.tax !== 0) {
      return (
        <>
          <tr>
            <td>
              <Label for="totalhargaNormal">Tax {this.state.tax}%</Label>
            </td>
            <td>
              <Input
                type="text"
                disabled="disabled"
                name="totalhargaNormal"
                id="totalhargaNormal"
                placeholder="Sub Total"
                value={convertToRupiah(
                  this.state.totalhargaNormal * (this.state.tax / 100)
                )}
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    }
  };

  deliveryPromo = () => {
    if (this.state.status_diskon_bykosmo === 1) {
      return (
        <>
          <td>
            <Label for="deliveryById">
              Delivery Fee Disc {this.state.feeDiskonByKOSMOID}
            </Label>
          </td>
          <td>
            <Input
              type="text"
              disabled="disabled"
              name="fee_by_kosmo"
              id="fee_by_kosmo"
              value={convertToRupiah(
                this.state.fee_by_kosmo *
                  ((100 - this.state.feeDiskonByKOSMOID.replace("%", "")) / 100)
              )}
            />
          </td>
        </>
      );
    } else {
      return (
        <>
          <td>
            <Label for="deliveryById">Delivery Fee</Label>
          </td>
          <td>
            <Input
              type="text"
              disabled="disabled"
              name="fee_by_kosmo"
              id="fee_by_kosmo"
              value={convertToRupiah(this.state.fee_by_kosmo)}
            />
          </td>
        </>
      );
    }
  };

  renderDelivery = () => {
    if (this.state.deliveryById === 1) {
      return (
        <>
          <tr>{this.deliveryPromo()}</tr>
          <tr>&nbsp;</tr>
        </>
      );
    } else {
      return (
        <>
          <tr>
            <td>
              <Label for="deliveryById">Delivery Fee</Label>
            </td>
            <td>
              <Input
                type="text"
                disabled="disabled"
                name="fee_by_merchant"
                id="fee_by_merchant"
                value={convertToRupiah(this.state.fee_by_merchant)}
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    }
  };

  renderPaidAmount = () => {
    if (this.state.paid_amount === "" && this.state.statuspayment === 0) {
      return (
        <>
          <tr>
            <td>
              <Label for="paid_amount">Paid Amount</Label>
            </td>
            <td>
              <Input
                type="text"
                name="paid_amount"
                id="paid_amount"
                value={this.state.paid_amount}
                placeholder="Enter paid amount"
                onChange={(event) =>
                  this.setState({ paid_amount: event.target.value })
                }
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
          <tr>
            <td>
              <Label for="paid_amount">Status Payment</Label>
            </td>
            <td>
              <SelectMultiColumn
                width={"100%"}
                value={this.state.statuspayment}
                valueColumn={"id"}
                showColumn={"display"}
                columns={["display"]}
                data={this.state.statusShow}
                onChange={this.changeSelectMultiColumn}
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    } else {
      return (
        <>
          <tr>
            <td>
              <Label for="paid_amount">Paid Amount</Label>
            </td>
            <td>
              <Input
                type="text"
                name="paid_amount"
                id="paid_amount"
                value={this.state.paid_amount}
                placeholder="Enter paid amount"
                onChange={(event) =>
                  this.setState({ paid_amount: event.target.value })
                }
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
          <tr>
            <td>
              <Label for="paid_amount">Status Payment</Label>
            </td>
            {this.renderStatusPayment()}
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    }
  };

  renderStatusPayment = () => {
    if (this.state.statuspayment === 0 && this.state.paid_amount === "") {
      return (
        <td>
          <SelectMultiColumn
            width={"100%"}
            value={this.state.statuspayment}
            valueColumn={"id"}
            showColumn={"display"}
            columns={["display"]}
            data={this.state.statusShow}
            onChange={this.changeSelectMultiColumn}
          />
        </td>
      );
    } else if (this.state.paid_amount !== this.state.totalPayment) {
      return (
        <td>
          <SelectMultiColumn
            width={"100%"}
            value={this.state.statuspayment}
            valueColumn={"id"}
            showColumn={"display"}
            columns={["display"]}
            data={this.state.statusShow}
            onChange={this.changeSelectMultiColumn}
          />
        </td>
      );
    } else {
      return (
        <td>
          <SelectMultiColumn
            width={"100%"}
            value={this.state.statuspayment}
            valueColumn={"id"}
            showColumn={"display"}
            columns={["display"]}
            data={this.state.statusShow}
            onChange={this.changeSelectMultiColumn}
          />
        </td>
      );
    }
  };

  changeSelectMultiColumn = (statuspayment) => {
    console.log(statuspayment);
    this.setState({ statuspayment: statuspayment });
  };

  renderStatusDelivery = () => {
    if (this.state.deliveryById === 1) {
      return this.renderStatusOrderByZoom();
    } else {
      return this.renderStatusOrderByMerchant();
    }
  };

  renderStatusOrderByMerchant = () => {
    if (this.state.paid_amount === "") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Waiting for payment"
          />
        </td>
      );
    } else if (this.state.paid_amount !== this.state.totalPayment) {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Incomplete payment"
          />
        </td>
      );
    } else if (
      this.state.status_zoom === "" &&
      this.state.status_payment !== 0 &&
      this.state.paid_amount !== ""
    ) {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="on Process"
          />
        </td>
      );
    } else {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Done"
          />
        </td>
      );
    }
  };

  renderStatusOrderByZoom = () => {
    if (
      this.state.status_zoom === "" &&
      this.state.statuspayment === 0 &&
      this.state.paid_amount === ""
    ) {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Waiting for Payment"
          />
        </td>
      );
    } else if (this.state.paid_amount !== this.state.totalPayment) {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Incomplete payment"
          />
        </td>
      );
    } else if (
      this.state.status_zoom === "" &&
      this.state.statuspayment !== 0 &&
      this.state.paid_amount !== ""
    ) {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Finding Driver"
          />
        </td>
      );
    } else if (this.state.status_zoom === "finding driver") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Finding Driver"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Available") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Finding Driver"
          />
        </td>
      );
    } else if (this.state.status_zoom === "On Delivery") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Delivering"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Offline") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Driver is offline"
          />
        </td>
      );
    } else if (this.state.status_zoom === "On Road") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="On the way"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Pickup") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Pick Up Order"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Receiving") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Receive orders"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Canceled") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Order not taken by drivers"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Expired") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Expired order"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Unavailable") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Unavailable"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Unsuccessful") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Unsuccessful"
          />
        </td>
      );
    } else if (this.state.status_zoom === "Delivered") {
      return (
        <td>
          <Input
            type="text"
            disabled="disabled"
            name="statuspayment"
            id="statuspayment"
            value="Delivered"
          />
        </td>
      );
    }
  };

  renderButton = () => {
    if (this.state.paid_amount === "") {
      return (
        <Button color="primary" onClick={() => this.checkData()}>
          <FontAwesomeIcon icon="save" />
          &nbsp;Submit
        </Button>
      );
    } else {
      return (
        <Button color="primary" onClick={() => this.checkData()}>
          <FontAwesomeIcon icon="save" />
          &nbsp;Submit
        </Button>
      );
    }
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
                <Label for="requestdate">Date Order</Label>
              </td>
              <td>
                <td>
                  <Input
                    type="text"
                    disabled="disabled"
                    name="requestorder"
                    id="requestorder"
                    value={this.state.currentdate}
                  />
                </td>
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="numberorder">Order Number</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="numberorder"
                  id="numberorder"
                  placeholder="Number Order"
                  value={this.state.numberorder}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="phonenumber">Phone Number</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="phonenumber"
                  id="phonenumber"
                  placeholder="Phone Number"
                  value={this.state.phoneno}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="name">Name Order</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="name"
                  id="name"
                  placeholder="Name Order"
                  value={this.state.name}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="deliverto">Deliver To</Label>
              </td>
              <td>
                <Input
                  type="textarea"
                  disabled="disabled"
                  name="deliverto"
                  id="deliverto"
                  placeholder="Deliver To"
                  value={this.state.deliverto}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="locationdetail">Location Detail</Label>
              </td>
              <td>
                <Input
                  type="textarea"
                  disabled="disabled"
                  name="locationdetail"
                  id="locationdetail"
                  placeholder="Location Detail"
                  value={this.state.locationdetail}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="merchantname">Merchant Name</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="merchantname"
                  id="merchantname"
                  placeholder="Merchant Name"
                  value={this.state.merchantname}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="merchantcategory">Merchant Category</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="merchantcategory"
                  id="merchantcategory"
                  placeholder="Merchant Name"
                  value={this.state.merchantcategoryname}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="counteritem">Total Item</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="counteritem"
                  id="counteritem"
                  placeholder="Total Item"
                  value={this.state.counteritem}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="totalhargaNormal">Sub Total</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="totalhargaNormal"
                  id="totalhargaNormal"
                  placeholder="Sub Total"
                  value={convertToRupiah(this.state.totalhargaNormal)}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {this.renderTax()}
            {this.renderDelivery()}
            <tr>
              <td>
                <Label for="totalPayment">Total Payment</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="totalPayment"
                  id="totalPayment"
                  placeholder="Sub Total"
                  value={convertToRupiah(this.state.totalPayment)}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="paymentmethod">Payment Method</Label>
              </td>
              <td>
                <Input
                  type="text"
                  disabled="disabled"
                  name="paymentmethod"
                  id="paymentmethod"
                  value={this.state.paymentmethod}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {this.renderPaidAmount()}
            <tr>
              <td>
                <Label for="numberorder">Status Order</Label>
              </td>
              {this.renderStatusDelivery()}
            </tr>
            <tr>&nbsp;</tr>
          </table>
          {this.renderOrderDetail()}
        </div>
        <br></br>
        <div className="form-button-container">
          <Button
            color="secondary"
            onClick={() => this.props.history.push("/panel/listfoodorder")}
          >
            <FontAwesomeIcon icon="chevron-circle-left" />
            &nbsp;{this.globallang.cancel}
          </Button>
          &nbsp;&nbsp;
          {this.renderButton()}
        </div>
      </div>
    );
  }
}
export default EditFoodOrder;
