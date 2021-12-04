import React, { Component } from "react";
import { Input, Label } from "reactstrap";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import TagSelector from "../../Components/TagSelector/TagSelector";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import {
  ArrowBackIos,
  Cancel,
  Save,
  WarningAmber,
  Close,
} from "@mui/icons-material";
import ButtonUI from "@mui/material/Button";
import {
  Typography,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
const stylesListDialog = {
  inline: {
    display: "inline",
  },
};
class EditCommodityMerchant extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "editcommodity");
    this.state = {
      commodityid: props.match.params.id,
      merchantid: "",
      commodityname: "",
      commoditycategoryid: "",
      commodityshortdesc: "",
      commodityfulldesc: "",
      commoditypic: [],
      commoditytags: "",
      commodityprice: 0,
      commodityCategoryShow: [],
      commodityShow: [],
      commoditytagShow: "",
      commodityinfoList: [],
      commodityinfoField: "",
      commodityinfoValue: "",
      tempcommodityid: 1,
      commodityisavailableid: "",
      commodityQtyShow: [
        { id: 0, text: "Unlimited" },
        { id: 1, text: "Limited" },
      ],
      commodityQty: 0,
      commodityQtyStatus: 0,
      commodityisavailableidShow: [
        { id: 0, text: "NO" },
        { id: 1, text: "YES" },
      ],
      commodityIsDiscountId: "",
      commodityIsDiscountShow: [
        { id: 0, text: "NO" },
        { id: 1, text: "YES" },
      ],
      priceDiscountId: "",
      priceDiscountShow: [
        { value: "5%", text: "5%" },
        { value: "10%", text: "10%" },
        { value: "15%", text: "15%" },
        { value: "20%", text: "20%" },
        { value: "25%", text: "25%" },
      ],
      promo1buyget1Id: 0,
      promo1buyget1Show: [
        { id: 0, text: "NO" },
        { id: 1, text: "YES" },
      ],
      recommendedId: "",
      recommendedShow: [
        { id: 0, text: "NO" },
        { id: 1, text: "YES" },
      ],
      deliveryById: "",
      optionOperationDay: [
        { value: 0, text: "All Day" },
        { value: 1, text: "Custom" },
      ],
      operationDayId: "",
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
    this.availableHandleChecked = this.availableHandleChecked.bind(this);
  }

  changeStatusCommodity = (commodityisavailableid) => {
    this.setState({ commodityisavailableid: commodityisavailableid });
  };

  changeIsDiscount = (commodityIsDiscountId) => {
    this.setState({ commodityIsDiscountId: commodityIsDiscountId });
    this.setState({ priceDiscountId: "" });
  };

  changePriceDiscount = (priceDiscountId) => {
    this.setState({ priceDiscountId: priceDiscountId });
  };

  changePromobuy1get1 = (promo1buyget1Id) => {
    this.setState({ promo1buyget1Id: promo1buyget1Id });
  };

  changeQtyCommodity = (commodityQtyStatus) => {
    this.setState({ commodityQtyStatus: commodityQtyStatus, commodityQty: 0 });
  };

  changeRecommended = (recommendedId) => {
    this.setState({ recommendedId: recommendedId });
  };

  onUploadImageCommodity = (result) => {
    this.setState({ commoditypic: result });
  };

  changeTabCommodity = (commoditytags) => {
    this.setState({ commoditytags: commoditytags });
  };

  selectCommodityCategory = (commodityShow) => {
    axios
      .post(
        serverUrl + "commoditycategory_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ commodityCategoryShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  selectTag = (commoditytagShow) => {
    axios
      .post(
        serverUrl + "tag_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let tmp = [];
        response.data.records.map((item, i) => {
          tmp.push(item.tagname);
        });
        this.setState({ commoditytagShow: tmp });
      })
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
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doSubmitGlobal = () => {
    let params = {
      merchantid: this.state.merchantid,
      commodityid: this.state.commodityid,
      commodityname: this.state.commodityname,
      commoditycategoryid: this.state.commoditycategoryid,
      commodityshortdesc: this.state.commodityshortdesc,
      commodityfulldesc: this.state.commodityfulldesc,
      commoditypic: this.state.commoditypic,
      commoditytags: this.state.commoditytags,
      commodityisavailableid: this.state.commodityisavailableid,
      commodityprice: this.state.commodityprice,
      commodityIsDiscountId: this.state.commodityIsDiscountId,
      priceDiscountId: this.state.priceDiscountId,
      promo1buyget1Id: this.state.promo1buyget1Id,
      recommendedId: this.state.recommendedId,
      commodityQtyStatus: this.state.commodityQtyStatus,
      commodityQty: this.state.commodityQty,
    };

    this.props.doLoading();
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/commodity_insert_update_global.php",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          this.onSubmit(response.data.commodityid);
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  onSubmit = (commodityid) => {
    let params = {
      merchantid: this.state.merchantid,
      commodityid: commodityid,
      commodityname: this.state.commodityname,
      commoditycategoryid: this.state.commoditycategoryid,
      commodityshortdesc: this.state.commodityshortdesc,
      commodityfulldesc: this.state.commodityfulldesc,
      commoditypic: this.state.commoditypic,
      commoditytags: this.state.commoditytags,
      commodityisavailableid: this.state.commodityisavailableid,
      commodityprice: this.state.commodityprice,
      commodityIsDiscountId: this.state.commodityIsDiscountId,
      priceDiscountId: this.state.priceDiscountId,
      promo1buyget1Id: this.state.promo1buyget1Id,
      recommendedId: this.state.recommendedId,
      commodityQtyStatus: this.state.commodityQtyStatus,
      commodityQty: this.state.commodityQty,
    };

    this.props.doLoading();
    axios
      .post(serverUrl + "commodity_insert_update_local.php", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          this.setState({
            openSuccess: true,
          });
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changeCommodityCategory = (commoditycategoryid) => {
    this.setState({ commoditycategoryid: commoditycategoryid });
  };

  changeMerchant = (merchantid) => {
    this.setState({ merchantid: merchantid });
  };

  changeTabSelector = (tags) => {
    this.setState({ tags: tags });
  };

  availableHandleChecked(event) {
    let checked = event.target.checked;
    this.setState({ commodityisavailable: checked });
  }

  checkData = () => {
    const { commodityname } = this.state;
    const { commodityisavailableid } = this.state;
    const { commodityprice } = this.state;
    const { commodityIsDiscountId } = this.state;
    const { recommendedId } = this.state;

    // if(commodityname == null || commoditycategoryid == null || commodityshortdesc == null || commodityfulldesc == null || commoditypic == "" || commoditypic == null || commodityprice == null){
    if (commodityname === "") {
      this.setState({
        messageError: "Enter commodity name.",
        setOpenValidation: true,
      });
    } else if (commodityisavailableid === "") {
      this.setState({
        messageError: "Select commodity status.",
        setOpenValidation: true,
      });
    } else if (commodityprice === 0) {
      this.setState({
        messageError: "Enter commodity price.",
        setOpenValidation: true,
      });
    } else if (commodityIsDiscountId === "") {
      this.setState({
        messageError: "Select commodity discount.",
        setOpenValidation: true,
      });
    } else if (recommendedId === "") {
      this.setState({
        messageError: "Select commodity recommended .",
        setOpenValidation: true,
      });
    } else {
      this.doSubmitGlobal();
    }
  };

  addInfo = () => {
    if (this.state.commodityinfoField === "") {
      alert("Please input info name");
      return false;
    }
    if (this.state.commodityinfoValue === "") {
      alert("Please input info value");
      return false;
    }

    let arr = this.state.commodityinfoList;
    arr.push({
      field: this.state.commodityinfoField,
      value: this.state.commodityinfoValue,
    });
    this.setState({
      commodityinfoList: arr,
      commodityinfoField: "",
      commodityinfoValue: "",
    });
  };

  removeInfo = (info) => {
    let tmp = [];
    this.state.commodityinfoList.map((item, i) => {
      if (item !== info) {
        tmp.push(item);
      }
    });
    this.setState({ commodityinfoList: tmp });
  };

  componentDidMount = (commodityCategoryShow, merchantShow, tagShow) => {
    this.selectCommodityCategory(commodityCategoryShow);
    this.selectTag(tagShow);
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
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_get_by_id.php",
        {
          commodityid: this.state.commodityid,
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
        let tmp = [];
        if (response.data.record.commoditypic !== "") {
          tmp.push(response.data.record.commoditypic);
        }
        this.setState({ commodityid: response.data.record.commodityid });
        this.setState({ commodityname: response.data.record.commodityname });
        this.setState({
          commoditycategoryid: response.data.record.commoditycategoryid,
        });
        this.setState({
          commodityshortdesc: response.data.record.commodityshortdesc,
        });
        this.setState({
          commodityfulldesc: response.data.record.commodityshortdesc,
        });
        this.setState({ commoditypic: tmp });
        this.setState({ commoditytags: response.data.record.commoditytags });
        this.setState({ merchantid: response.data.record.merchantid });
        this.setState({
          commodityisavailableid: response.data.record.isavailable,
        });
        this.setState({ commodityprice: response.data.record.commodityprice });

        this.setState({
          commodityIsDiscountId: response.data.record.commodityIsDiscountId,
        });
        this.setState({
          priceDiscountId: response.data.record.priceDiscountId,
        });
        this.setState({
          promo1buyget1Id: response.data.record.promo1buyget1Id,
        });
        this.setState({ recommendedId: response.data.record.recommendedId });
        this.setState({
          commodityQtyStatus: response.data.record.commodityQtyStatus,
        });
        this.setState({ commodityQty: response.data.record.commodityQty });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  renderInfo = () => {
    if (this.state.commodityinfoList.length > 0) {
      return (
        <div className="detail-info-list">
          <table>
            <tbody>
              {this.state.commodityinfoList.map((item, i) => (
                <tr>
                  <td className="td-field">{item.field}</td>
                  <td className="td-doubledot">:</td>
                  <td className="td-value">{item.value}</td>
                  <td className="td-button">
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => this.removeInfo(item)}
                      block
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="detail-info-list">
          <div className="no-data-available">No Info Available</div>
        </div>
      );
    }
  };

  renderDiscount = () => {
    if (this.state.commodityIsDiscountId === 1) {
      return (
        <>
          <tr>
            <td>
              <Label for="priceDiscountId">Price Discount</Label>
            </td>
            <td>
              <SelectMultiColumn
                width={"100%"}
                value={this.state.priceDiscountId}
                valueColumn={"value"}
                showColumn={"text"}
                columns={["text"]}
                data={this.state.priceDiscountShow}
                onChange={this.changePriceDiscount}
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    }
  };

  handleCloseValid = () => {
    this.setState({
      setOpenValidation: false,
      error: "",
    });
  };

  renderDialogValidation = () => {
    return (
      <Dialog
        open={this.state.setOpenValidation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        titleStyle={{ textAlign: "center" }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: "#006432", paddingBottom: 35 }}
        >
          <div style={{ position: "absolute", right: "42%", top: "5%" }}>
            <WarningAmber style={{ color: "#fff", width: 40, height: 40 }} />
          </div>
        </DialogTitle>
        <DialogContent style={{ minWidth: 250, width: 300, marginTop: 10 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListDialog.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.messageError}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleCloseValid}
            color="primary"
            variant="outlined"
            size="small"
          >
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListDialog.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderSuccess = () => {
    if (this.state.openSuccess === true) {
      setTimeout(() => this.props.history.push("/panel/commodityAcc"), 1000);

      return (
        <div style={{ margin: 10 }}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert
              variant="filled"
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => this.props.history.push("/panel/commodityAcc")}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {this.language.savesuccess}
            </Alert>
          </Stack>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <ButtonUI
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#006432",
            }}
            startIcon={<ArrowBackIos />}
            onClick={() => this.props.history.push("/panel/commodityAcc")}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                marginLeft: -10,
                textTransform: "capitalize",
              }}
            >
              Back
            </Typography>
          </ButtonUI>{" "}
          <Typography
            component="span"
            variant="h2"
            style={{
              fontSize: 16,
              color: "#006432",
              fontWeight: "bold",
              textTransform: "capitalize",
              float: "right",
            }}
          >
            Add Commodity
          </Typography>
          <span className="dash">&nbsp;&nbsp;</span>
        </div>
        <div className="box-container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Label for="merchantname">Commodity Name</Label>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="commodityname"
                  id="commodityname"
                  placeholder="Commodity Name"
                  value={this.state.commodityname}
                  onChange={(event) =>
                    this.setState({ commodityname: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commoditycategoryid">Commodity Category</Label>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commoditycategoryid}
                  valueColumn={"commoditycategoryid"}
                  showColumn={"commoditycategoryname"}
                  columns={["commoditycategoryname"]}
                  data={this.state.commodityCategoryShow}
                  onChange={this.changeCommodityCategory}
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commodityshortdesc">Description</Label>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  name="commodityshortdesc"
                  id="commodityshortdesc"
                  placeholder="Commodity Description"
                  value={this.state.commodityshortdesc}
                  onChange={(event) =>
                    this.setState({ commodityshortdesc: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Label>Commodity Picture</Label>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImageCommodity}
                  picList={this.state.commoditypic}
                  picLimit={1}
                ></PictureUploader>
              </Grid>

              <Grid item xs={2}>
                <Label for="commoditytags">Tags</Label>
              </Grid>
              <Grid item xs={10}>
                <TagSelector
                  width={"100%"}
                  value={this.state.commoditytags}
                  data={this.state.commoditytagShow}
                  onChange={this.changeTabCommodity}
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commodityisavailable">Is Available</Label>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commodityisavailableid}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.commodityisavailableidShow}
                  onChange={this.changeStatusCommodity}
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commodityprice">Normal Price (Rp)</Label>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="number"
                  name="commodityprice"
                  id="commodityprice"
                  placeholder="Rp.0"
                  value={this.state.commodityprice}
                  onChange={(event) =>
                    this.setState({ commodityprice: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commodityIsDiscountId">Is Discount</Label>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commodityIsDiscountId}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.commodityIsDiscountShow}
                  onChange={this.changeIsDiscount}
                />
              </Grid>

              {this.state.commodityIsDiscountId === 1 ? (
                <>
                  <Grid item xs={2}>
                    <Label for="priceDiscountId">Price Discount</Label>
                  </Grid>
                  <Grid item xs={10}>
                    <SelectMultiColumn
                      width={"100%"}
                      value={this.state.priceDiscountId}
                      valueColumn={"value"}
                      showColumn={"text"}
                      columns={["text"]}
                      data={this.state.priceDiscountShow}
                      onChange={this.changePriceDiscount}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <Grid item xs={2}>
                <Label for="commodityprice">Recommended</Label>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.recommendedId}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.recommendedShow}
                  onChange={this.changeRecommended}
                />
              </Grid>

              <Grid item xs={2}>
                <Label for="commodityQty">Ready Stock</Label>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commodityQtyStatus}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.commodityQtyShow}
                  onChange={this.changeQtyCommodity}
                />
              </Grid>

              {this.state.commodityQtyStatus === 1 ? (
                <>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={10}>
                    <Input
                      type="number"
                      name="commodityQty"
                      id="commodityQty"
                      value={this.state.commodityQty}
                      onChange={(event) =>
                        this.setState({ commodityQty: event.target.value })
                      }
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Box>

          <br />
        </div>
        <br></br>
        <div className="form-button-container">
          <ButtonUI
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#d0021b",
            }}
            startIcon={<Cancel />}
            onClick={() => this.props.history.push("/panel/commodityAcc")}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Cancel
            </Typography>
          </ButtonUI>{" "}
          &nbsp;&nbsp;
          <ButtonUI
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#004dcf",
            }}
            startIcon={<Save />}
            onClick={() => this.checkData()}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -6,
              }}
            >
              Save
            </Typography>
          </ButtonUI>{" "}
        </div>
        {this.renderDialogValidation()}
        {this.renderSuccess()}
      </div>
    );
  }
}
export default EditCommodityMerchant;
