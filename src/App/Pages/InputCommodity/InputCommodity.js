import React, { Component } from "react";
import { Button, Label, Input, Col, Row } from "reactstrap";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import TagSelector from "../../Components/TagSelector/TagSelector";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class InputCommodity extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "inputcommodity");
    this.state = {
      commodityid: 0,
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

  changeRecommended = (recommendedId) => {
    this.setState({ recommendedId: recommendedId });
  };

  onUploadImage = (result) => {
    this.setState({ commoditypic: result });
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

  componentDidMount = (commodityCategoryShow, commoditytagShow) => {
    this.selectCommodityCategory(commodityCategoryShow);
    this.selectTag(commoditytagShow);
  };

  changeCommodityCategory = (commoditycategoryid) => {
    this.setState({ commoditycategoryid: commoditycategoryid });
  };

  changeTabSelector = (commoditytags) => {
    this.setState({ commoditytags: commoditytags });
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
    if (
      commodityname === "" ||
      commodityisavailableid === "" ||
      commodityprice === "" ||
      commodityIsDiscountId === "" ||
      recommendedId === ""
    ) {
      alert(this.language.validation);
      return false;
    } else {
      this.onSubmit();
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

  /* onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'commodity_insert_update.php', {			
			commodityid: this.state.commodityid,
			commodityname: this.state.commodityname,
			commoditycategoryid: this.state.commoditycategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			commoditypic: this.state.commoditypic,
			tags: this.state.tags,
			merchantid: this.state.merchantid,
			isavailable: this.state.isavailable ? 1:0,
			price: this.state.price,
			infolist: this.state.infoList
			
			
			commodityid: this.state.commodityid,
			commodityname: this.state.commodityname,
			commoditycategoryid: this.state.commoditycategoryid,
			commodityshortdesc: this.state.commodityshortdesc,
			commodityfulldesc: this.state.commodityfulldesc,
			commoditypic: this.state.commoditypic,
			commoditytags: this.state.commoditytags,
			commodityisavailable: this.state.commodityisavailable ? 1:0,
			commodityprice: this.state.commodityprice,
			commodityinfolist: this.state.commodityinfolist
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				alert(this.language.savesuccess);
				this.props.history.goBack();
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    } */

  onSubmit = () => {
    var dropd = this.state;
    var drophistory = JSON.parse(localStorage.getItem("commodity_data")) || [];
    dropd.tempcommodityid = drophistory.length + 1;
    drophistory.push(dropd);
    window.localStorage.setItem("commodity_data", JSON.stringify(drophistory));
    this.props.history.goBack();
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

  render() {
    return (
      <div>
        <div className="page-header">
          Add Commodity <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tr>
              <td width={200}>
                <Label for="commodityname">{this.language.fieldname}</Label>
              </td>
              <td>
                <Input
                  type="text"
                  name="commodityname"
                  id="commodityname"
                  placeholder="Commodity Name"
                  value={this.state.commodityname}
                  onChange={(event) =>
                    this.setState({ commodityname: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commoditycategoryid">
                  {this.language.fieldcategory}
                </Label>
              </td>
              <td>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commoditycategoryid}
                  valueColumn={"commoditycategoryid"}
                  showColumn={"commoditycategoryname"}
                  columns={["commoditycategoryname"]}
                  data={this.state.commodityCategoryShow}
                  onChange={this.changeCommodityCategory}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityshortdesc">
                  {this.language.fieldshortdesc}
                </Label>
              </td>
              <td>
                <Input
                  type="textarea"
                  name="commodityshortdesc"
                  id="commodityshortdesc"
                  placeholder="Commodity Short Description"
                  value={this.state.commodityshortdesc}
                  onChange={(event) =>
                    this.setState({ commodityshortdesc: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityfulldesc">
                  {this.language.fieldfulldesc}
                </Label>
              </td>
              <td>
                <Input
                  type="textarea"
                  name="commodityfulldesc"
                  id="commodityfulldesc"
                  placeholder="Commodity Full Description"
                  value={this.state.commodityfulldesc}
                  onChange={(event) =>
                    this.setState({ commodityfulldesc: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label>{this.globallang.uploadpicture}</Label>
              </td>
              <td>
                <PictureUploader
                  onUpload={this.onUploadImage}
                  picList={this.state.commoditypic}
                  picLimit={1}
                ></PictureUploader>
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commoditytags">{this.language.fieldtags}</Label>
              </td>
              <TagSelector
                width={"100%"}
                value={this.state.commoditytags}
                data={this.state.commoditytagShow}
                onChange={this.changeTabSelector}
              />
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityisavailable">
                  {this.language.fieldavailable}
                </Label>
              </td>
              <td>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commodityisavailableid}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.commodityisavailableidShow}
                  onChange={this.changeStatusCommodity}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityprice">Normal Price</Label>
              </td>
              <td>
                <Input
                  type="number"
                  name="commodityprice"
                  id="commodityprice"
                  placeholder="123"
                  value={this.state.commodityprice}
                  onChange={(event) =>
                    this.setState({ commodityprice: event.target.value })
                  }
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityIsDiscountId">Is Discount</Label>
              </td>
              <td>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.commodityIsDiscountId}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.commodityIsDiscountShow}
                  onChange={this.changeIsDiscount}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            {this.renderDiscount()}
            <tr>
              <td>
                <Label for="priceDiscountId">Promo Buy 1 get 1</Label>
              </td>
              <td>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.promo1buyget1Id}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.promo1buyget1Show}
                  onChange={this.changePromobuy1get1}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
            <tr>
              <td>
                <Label for="commodityprice">Recommended</Label>
              </td>
              <td>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.recommendedId}
                  valueColumn={"id"}
                  showColumn={"text"}
                  columns={["text"]}
                  data={this.state.recommendedShow}
                  onChange={this.changeRecommended}
                />
              </td>
            </tr>
            <tr>&nbsp;</tr>
          </table>
          <br />
          <div className="form-detail">
            <div className="detail-title">Commodity Info</div>
            <div className="detail-info-input">
              <Row>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="field"
                    id="field"
                    placeholder="Info Name"
                    value={this.state.commodityinfoField}
                    onChange={(event) =>
                      this.setState({ commodityinfoField: event.target.value })
                    }
                  />
                </Col>

                <Col sm={6}>
                  <Input
                    type="text"
                    name="value"
                    id="value"
                    placeholder="Info Value"
                    value={this.state.commodityinfoValue}
                    onChange={(event) =>
                      this.setState({ commodityinfoValue: event.target.value })
                    }
                  />
                </Col>
                <Col sm={2}>
                  <Button color="success" block onClick={() => this.addInfo()}>
                    {this.globallang.add}
                  </Button>
                </Col>
              </Row>
            </div>
            {this.renderInfo()}
          </div>
        </div>
        <br></br>
        <div className="form-button-container">
          <Button color="secondary" onClick={() => this.props.history.goBack()}>
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
export default InputCommodity;
