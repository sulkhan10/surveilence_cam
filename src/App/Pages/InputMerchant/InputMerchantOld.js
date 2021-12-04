import React, { Component } from "react";
import { Button, FormGroup, Label, Input, Col, Row } from "reactstrap";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import TagSelector from "../../Components/TagSelector/TagSelector";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InputMerchant.style.css";
import { el } from "date-fns/locale";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;
// const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
// const {
//   MarkerClusterer,
// } = require("react-google-maps/lib/components/addons/MarkerClusterer");

class InputMerchant extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.lang = getLanguage(activeLanguage, "listcommodity");
    this.language = getLanguage(activeLanguage, "inputmerchant");

    this.state = {
      latitude: -6.1772007,
      longitude: 106.9569963,
      address: "",
      merchantid: 0,
      merchantname: "",
      merchantcategoryid: "",
      shortdesc: "",
      fulldesc: "",
      merchantpic: [],
      gallery: [],
      tags: "",
      about: "",
      communityid: "",
      isavailable: false,
      merchantCategoryShow: [],
      communityShow: [],
      tagShow: [],
      infoList: [],
      infoField: "",
      infoValue: "",
      location: "",
      statusppn: 0,
      price_ppn: "",
      tableData: [],
      commodityid: 0,
      commodityname: "",
      commoditycategoryid: "",
      commodityshortdesc: "",
      commodityfulldesc: "",
      commoditypic: [],
      commoditytags: "",
      commodityisavailable: false,
      commodityprice: 0,
      commodityCategoryShow: [],
      commodityShow: [],
      commoditytagShow: "",
      commodityinfoList: [],
      commodityinfoField: "",
      commodityinfoValue: "",
      merchantStatusShow: [
        { id: 0, text: "Not Available" },
        { id: 1, text: "Available" },
      ],
      merchantStatusId: "",
      workingdayShow: [
        { id: 1, day: "Monday" },
        { id: 2, day: "Tuesday" },
        { id: 3, day: "Wednesday" },
        { id: 4, day: "Thursday" },
        { id: 5, day: "Friday" },
        { id: 6, day: "Saturday" },
        { id: 7, day: "Sunday" },
      ],
      workingdayID: 0,
      hourin: "07",
      minutein: "00",
      hourout: "07",
      minuteout: "00",
      MondayData: [],
      MondayDataDisplay: [],
      mondayPeriode: [],
      TuesdayData: [],
      TuesdayDataDisplay: [],
      tuesdayPeriode: [],
      WednesdayData: [],
      WednesdayDataDisplay: [],
      wednesdayPeriode: [],
      ThursdayData: [],
      ThursdayDataDisplay: [],
      thursdayPeriode: [],
      FridayData: [],
      FridayDataDisplay: [],
      fridayPeriode: [],
      SaturdayData: [],
      SaturdayDataDisplay: [],
      saturdayPeriode: [],
      SundayData: [],
      SundayDataDisplay: [],
      sundayPeriode: [],
      timePeriode: [],
      fee_by_merchant: 0,
      status_diskon_bykosmo: 0,
      feeDiskonByKOSMOShow: [
        { value: "5%", text: "5%" },
        { value: "10%", text: "10%" },
        { value: "15%", text: "15%" },
        { value: "20%", text: "20%" },
        { value: "25%", text: "25%" },
      ],
      feeDiskonByKOSMOID: "",
      rateHargaDeliveryKosmoShow: [
        { value: "<1 KM", display: "<1 KM" },
        { value: ">1-2 KM", display: ">1-2 KM" },
        { value: ">3-4 KM", display: ">3-4 KM" },
        { value: ">5 KM", display: ">5 KM" },
      ],
      rateHargaDeliveryKosmoID: "",
      deliveryByShow: [
        { id: 0, text: "Merchant" },
        { id: 1, text: "ZOOM" },
      ],
      deliveryById: "",
      fee_by_kosmo: "",
      Data1KM: [],
      Data1_2KM: [],
      Data3_4KM: [],
      Data5KM: [],
      dataFeeRateDeliveryKOSMO: [],
      country: "Indonesia",
      posttal_code: "",
      City: "",
      addres_detail: "",
      Latitude: "",
      Longitude: "",
      dataCommunity: [],
      communityIdGlobal: 0,
      communityNameGlobal: "",
    };

    this.tableColumns = [
      {
        Header: this.lang.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "commodityname",
        style: { textAlign: "center" },
      },
      {
        Header: this.lang.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="warning"
              size="sm"
              onClick={() => this.doRowEdit(e.original)}
            >
              {this.globallang.edit}
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              {this.globallang.delete}
            </Button>
          </div>
        ),
      },
    ];
  }

  handleStatusPPN(e) {
    this.setState({
      statusppn: e.target.value,
      price_ppn: "",
    });
    // console.log(this.state.statusppn);
  }

  handleStatusDiskonByKOSMO(e) {
    console.log(e.target.value);
    this.setState({
      status_diskon_bykosmo: e.target.value,
    });
  }

  onUploadGallery = (result) => {
    this.setState({ gallery: result });
  };

  onUploadImage = (result) => {
    this.setState({ merchantpic: result });
  };

  selectMerchantCategory = () => {
    axios
      .post(
        serverUrl + "merchantcategory_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ merchantCategoryShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

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
        console.log(response.data.records);
        this.setState({ communityShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  selectTag = () => {
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
        this.setState({ tagShow: tmp });
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
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.selectMerchantCategory();
    this.selectCommunity();
    this.selectTag();
    this.loadCommodityData();
    this.getListCommunity();
  };

  changeMerchantCategory = (merchantcategoryid) => {
    this.setState({ merchantcategoryid: merchantcategoryid });
  };

  changeCommunity = (communityid) => {
    const dataDT = this.state.communityShow;
    const result = dataDT.filter((elm) => elm.communityid === communityid);
    const dtCommunityGlobal = this.state.dataCommunity;
    const getCommunityIdGlobal = dtCommunityGlobal.filter(
      (elm) => elm.label === result[0].communityname
    );
    // console.log("community local", result[0]);
    // console.log("community global", getCommunityIdGlobal[0]);
    this.setState({ communityid: communityid });
    this.setState({ communityIdGlobal: getCommunityIdGlobal[0].value });
    this.setState({ communityNameGlobal: getCommunityIdGlobal[0].label });
  };

  changeTabSelector = (tags) => {
    this.setState({ tags: tags });
  };

  isAvailableChecked(event) {
    let checked = event.target.checked;
    this.setState({ isavailable: checked });
  }

  changeStatusMerchant = (merchantStatusId) => {
    this.setState({ merchantStatusId: merchantStatusId });
  };

  changeStatusDelivery = (deliveryById) => {
    this.setState({ deliveryById: deliveryById });
  };

  changeFeeDiskonByKOSMO = (feeDiskonByKOSMOID) => {
    this.setState({ feeDiskonByKOSMOID: feeDiskonByKOSMOID });
  };

  changePPN = (price_ppn) => {
    this.setState({ price_ppn: price_ppn });
  };

  changeRateDeliveryKOSMO = (rateHargaDeliveryKosmoID) => {
    // console.log(rateHargaDeliveryKosmoID);
    this.setState({
      rateHargaDeliveryKosmoID: rateHargaDeliveryKosmoID,
      fee_by_kosmo: "",
    });
  };

  addNew = () => {
    this.saveTemporaryData();
    this.props.history.push("/panel/inputcommodity");
  };

  doRowEdit = (commodity) => {
    this.saveTemporaryData();
    this.props.history.push({
      pathname: "/panel/editcommodity/",
      state: { detail: commodity },
    });
  };

  changeWorkingDay = (event) => {
    let workingDayData = this.state.workingdayShow.filter(
      (cmp) => cmp.id == event
    );
    this.setState({ workingdayID: workingDayData[0].id });
    this.setState({ workingDaytext: workingDayData[0].day });
    this.setState({
      hourin: "07",
      hourout: "07",
      minutein: "00",
      minuteout: "00",
    });
  };

  handleHourInChange(e) {
    this.setState({
      hourin: e.target.value,
    });
  }

  handleHourOutChange(e) {
    this.setState({
      hourout: e.target.value,
    });
  }

  handleMinuteInChange(e) {
    this.setState({
      minutein: e.target.value,
    });
  }

  handleMinuteOutChange(e) {
    this.setState({
      minuteout: e.target.value,
    });
  }

  addTime = () => {
    var starttime = this.state.hourin + ":" + this.state.minutein + ":00";
    var endtime = this.state.hourout + ":" + this.state.minuteout + ":00";

    if (this.state.workingdayID === 0) {
      alert("Please choose working day");
      return false;
    }

    if (starttime === endtime) {
      alert("Please input validate time");
      return false;
    }
    if (this.state.hourin > this.state.hourout) {
      alert("Please input validate time");
      return false;
    }

    let MondayData = this.state.MondayData;
    let arrMon = this.state.mondayPeriode;
    if (
      this.state.workingdayID === 1 ||
      this.state.workingDaytext === "Monday"
    ) {
      MondayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(MondayData);
      this.setState({ MondayData: MondayData });

      let arrSenin = this.state.MondayDataDisplay;
      arrSenin.push({ startTime: starttime, endTime: endtime });
      // console.log(arrSenin);

      let output = [];
      MondayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrMon.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrSenin,
      });
      // console.log(arrMon);
      this.setState({
        mondayPeriode: arrMon,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let TuesdayData = this.state.TuesdayData;
    let arrTue = this.state.tuesdayPeriode;

    if (
      this.state.workingdayID === 2 ||
      this.state.workingDaytext === "Tuesday"
    ) {
      TuesdayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(TuesdayData);
      this.setState({ TuesdayData: TuesdayData });

      let arrSelasa = this.state.TuesdayDataDisplay;
      arrSelasa.push({ startTime: starttime, endTime: endtime });
      // console.log(arrSelasa);

      let output = [];
      TuesdayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrTue.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrSelasa,
      });
      // console.log(arrTue);
      this.setState({
        tuesdayPeriode: arrTue,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let WednesdayData = this.state.WednesdayData;
    let arrWed = this.state.wednesdayPeriode;

    if (
      this.state.workingdayID === 3 ||
      this.state.workingDaytext === "Wednesday"
    ) {
      WednesdayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(WednesdayData);
      this.setState({ WednesdayData: WednesdayData });

      let arrRabu = this.state.WednesdayDataDisplay;
      arrRabu.push({ startTime: starttime, endTime: endtime });
      // console.log(arrRabu);

      let output = [];
      WednesdayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrWed.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrRabu,
      });
      // console.log(arrWed);
      this.setState({
        wednesdayPeriode: arrWed,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let ThursdayData = this.state.ThursdayData;
    let arrThurs = this.state.thursdayPeriode;

    if (
      this.state.workingdayID === 4 ||
      this.state.workingDaytext === "Thursday"
    ) {
      ThursdayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(ThursdayData);
      this.setState({ ThursdayData: ThursdayData });

      let arrKamis = this.state.ThursdayDataDisplay;
      arrKamis.push({ startTime: starttime, endTime: endtime });
      // console.log(arrKamis);

      let output = [];
      ThursdayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrThurs.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrKamis,
      });
      // console.log(arrThurs);
      this.setState({
        thursdayPeriode: arrThurs,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let FridayData = this.state.FridayData;
    let arrFriday = this.state.fridayPeriode;

    if (
      this.state.workingdayID === 5 ||
      this.state.workingDaytext === "Friday"
    ) {
      FridayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(FridayData);
      this.setState({ FridayData: FridayData });

      let arrJumat = this.state.FridayDataDisplay;
      arrJumat.push({ startTime: starttime, endTime: endtime });
      // console.log(arrJumat);

      let output = [];
      FridayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrFriday.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrJumat,
      });
      // console.log(arrFriday);
      this.setState({
        fridayPeriode: arrFriday,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let SaturdayData = this.state.SaturdayData;
    let arrSaturday = this.state.saturdayPeriode;

    if (
      this.state.workingdayID === 6 ||
      this.state.workingDaytext === "Saturday"
    ) {
      SaturdayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(SaturdayData);
      this.setState({ SaturdayData: SaturdayData });

      let arrSabtu = this.state.SaturdayDataDisplay;
      arrSabtu.push({ startTime: starttime, endTime: endtime });
      // console.log(arrSabtu);

      let output = [];
      SaturdayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrSaturday.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrSabtu,
      });
      // console.log(arrSaturday);
      this.setState({
        saturdayPeriode: arrSaturday,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    let SundayData = this.state.SundayData;
    let arrSunday = this.state.sundayPeriode;

    if (
      this.state.workingdayID === 7 ||
      this.state.workingDaytext === "Sunday"
    ) {
      SundayData.push({
        display:
          this.state.hourin +
          ":" +
          this.state.minutein +
          " s/d " +
          this.state.hourout +
          ":" +
          this.state.minuteout,
      });
      // console.log(SundayData);
      this.setState({ SundayData: SundayData });

      let arrMinggu = this.state.SundayDataDisplay;
      arrMinggu.push({ startTime: starttime, endTime: endtime });
      // console.log(arrMinggu);

      let output = [];
      SundayData.map((item, i) => {
        output.push(item.display);
      });

      let data = output.join(", ");
      // console.log(data);

      arrSunday.push({
        dayId: this.state.workingdayID,
        dayText: this.state.workingDaytext,
        display: this.state.workingDaytext + " (" + data + ")",
        sendTime: arrMinggu,
      });
      // console.log(arrSunday);
      this.setState({
        sundayPeriode: arrSunday,
        hourin: this.state.hourout,
        hourout: this.state.hourout,
        minutein: this.state.minuteout,
        minuteout: this.state.minuteout,
      });
    }

    const lastMons = arrMon;
    const LastMon = lastMons.slice(-1);

    const lastTues = arrTue;
    const LastTue = lastTues.slice(-1);

    const lastWeds = arrWed;
    const LastWed = lastWeds.slice(-1);

    const lastThurs = arrThurs;
    const LastThur = lastThurs.slice(-1);

    const lastFris = arrFriday;
    const LastFri = lastFris.slice(-1);

    const lastSaturs = arrSaturday;
    const LastSatur = lastSaturs.slice(-1);

    const LastSuns = arrSunday;
    const LastSun = LastSuns.slice(-1);

    let data = LastMon.concat(
      LastTue,
      LastWed,
      LastThur,
      LastFri,
      LastSatur,
      LastSun
    );
    this.setState({ timePeriode: data });
    // console.log(data);
  };

  addFeeDeliveryByKOSMO = () => {
    let Data1KM = this.state.Data1KM;
    let Data1_2KM = this.state.Data1_2KM;
    let Data3_4KM = this.state.Data3_4KM;
    let Data5KM = this.state.Data5KM;
    if (this.state.fee_by_kosmo === "") {
      alert("Please enter fee");
      return false;
    }

    if (this.state.rateHargaDeliveryKosmoID === "<1 KM") {
      if (Data1KM.length > 0) {
        alert("Postage rates have been filled");
        return false;
      }
      if (Data1KM.length > 0) {
        alert("Postage rates have been filled");
        return false;
      }
      Data1KM.push({
        rate_jarak: this.state.rateHargaDeliveryKosmoID,
        fee: this.state.fee_by_kosmo,
      });
      this.setState({
        Data1KM: Data1KM,
      });
    }
    if (this.state.rateHargaDeliveryKosmoID === ">1-2 KM") {
      if (Data1_2KM.length > 0) {
        alert("Postage rates have been filled");
        return false;
      }
      Data1_2KM.push({
        rate_jarak: this.state.rateHargaDeliveryKosmoID,
        fee: this.state.fee_by_kosmo,
      });
      this.setState({
        Data1_2KM: Data1_2KM,
      });
    }

    if (this.state.rateHargaDeliveryKosmoID === ">3-4 KM") {
      if (Data3_4KM.length > 0) {
        alert("Postage rates have been filled");
        return false;
      }
      Data3_4KM.push({
        rate_jarak: this.state.rateHargaDeliveryKosmoID,
        fee: this.state.fee_by_kosmo,
      });
      this.setState({
        Data3_4KM: Data3_4KM,
      });
    }

    if (this.state.rateHargaDeliveryKosmoID === ">5 KM") {
      if (Data5KM.length > 0) {
        alert("Postage rates have been filled");
        return false;
      }
      Data5KM.push({
        rate_jarak: this.state.rateHargaDeliveryKosmoID,
        fee: this.state.fee_by_kosmo,
      });
      this.setState({
        Data5KM: Data5KM,
      });
    }

    let dataResult = this.state.Data1KM.concat(
      this.state.Data1_2KM,
      this.state.Data3_4KM,
      this.state.Data5KM
    );
    this.setState({ dataFeeRateDeliveryKOSMO: dataResult });
  };

  doRowDelete = (tableData) => {
    confirmAlert({
      message: this.lang.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            var stat = tableData;
            var items = JSON.parse(localStorage.getItem("commodity_data"));
            for (var i = 0; i < items.length; i++) {
              if (items[i].tempcommodityid === stat.tempcommodityid) {
                items.splice(i, 1);
              }
            }

            localStorage.setItem("commodity_data", JSON.stringify(items));
            this.setState({ tableData: items });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  saveTemporaryData = () => {
    window.localStorage.setItem("this_is_data", JSON.stringify(this.state));
  };

  loadTemporaryData = () => {
    var test = window.localStorage.getItem("this_is_data");
    var dig = JSON.parse(test);

    if (dig == null) {
      return false;
    }

    this.setState({
      merchantname: dig.merchantname === undefined ? "" : dig.merchantname,
    });
    this.setState({
      merchantcategoryid:
        dig.merchantcategoryid === undefined ? 0 : dig.merchantcategoryid,
    });
    this.setState({
      shortdesc: dig.shortdesc === undefined ? "" : dig.shortdesc,
    });
    this.setState({ fulldesc: dig.fulldesc === undefined ? "" : dig.fulldesc });
    this.setState({
      merchantpic: dig.merchantpic === undefined ? "" : dig.merchantpic,
    });
    this.setState({ tags: dig.tags === undefined ? "" : dig.tags });
    this.setState({ about: dig.about === undefined ? "" : dig.about });
    this.setState({
      communityid: dig.communityid === undefined ? "" : dig.communityid,
    });
    this.setState({
      isavailable: dig.isavailable === undefined ? false : dig.isavailable,
    });
    this.setState({ infoList: dig.infoList === undefined ? [] : dig.infoList });
  };

  loadCommodityData = () => {
    var com = window.localStorage.getItem("commodity_data");
    var commodity = JSON.parse(com);

    if (commodity === null || commodity === "null") return false;

    //let tmp = this.state.tableData;
    //tmp.push(commodity);
    //const newData = tmp.map(d=>({...d}));
    this.setState({ tableData: commodity });
  };

  checkData = () => {
    const { merchantname } = this.state;
    const { merchantcategoryid } = this.state;
    const { merchantpic } = this.state;
    // const { merchantStatusId } = this.state;
    // const { workingdayID } = this.state;
    // const { deliveryById } = this.state;
    // const { location } = this.state;
    // const { addres_detail } = this.state;
    // const { City } = this.state;
    // const { posttal_code } = this.state;
    // const { Latitude } = this.state;
    // const { Longitude } = this.state;
    const { communityid } = this.state;

    if (
      merchantname === "" ||
      merchantcategoryid === "" ||
      merchantpic === null ||
      merchantpic === "" ||
      // merchantStatusId === "" ||
      // workingdayID === 0 ||
      // deliveryById === "" ||
      // location === "" ||
      // addres_detail === "" ||
      // City === "" ||
      // posttal_code === "" ||
      // Latitude === "" ||
      // Longitude === "" ||
      communityid === ""
    ) {
      alert(this.language.validation);
      return false;
    } else {
      // this.onSubmit();
      this.doSubmitGlobal();
    }
  };

  addInfo = () => {
    if (this.state.infoField === "") {
      alert("Please input info name");
      return false;
    }
    if (this.state.infoValue === "") {
      alert("Please input info value");
      return false;
    }

    let arr = this.state.infoList;
    arr.push({ field: this.state.infoField, value: this.state.infoValue });
    this.setState({ infoList: arr, infoField: "", infoValue: "" });
  };

  removeInfo = (info) => {
    let tmp = [];
    this.state.infoList.map((item, i) => {
      if (item !== info) {
        tmp.push(item);
      }
    });
    this.setState({ infoList: tmp });
  };

  onSubmit = (merchantid) => {
    let bodyparams = {
      merchantid: merchantid,
      merchantname: this.state.merchantname,
      merchantcategoryid: this.state.merchantcategoryid,
      shortdesc: this.state.shortdesc,
      fulldesc: this.state.shortdesc,
      merchantpic: this.state.merchantpic,
      gallery: this.state.merchantpic,
      tags: this.state.tags,
      about: this.state.about,
      communityid: this.state.communityid,
      location: this.state.location,
      contact: this.state.contact,
      merchantStatusId: this.state.merchantStatusId,
      statusppn: this.state.statusppn,
      price_ppn: this.state.price_ppn,
      timePeriode: this.state.timePeriode,
      deliveryById: this.state.deliveryById,
      fee_by_merchant: this.state.fee_by_merchant,
      dataFeeRateDeliveryKOSMO: this.state.dataFeeRateDeliveryKOSMO,
      status_diskon_bykosmo: this.state.status_diskon_bykosmo,
      feeDiskonByKOSMOID: this.state.feeDiskonByKOSMOID,
      posttal_code: this.state.posttal_code,
      Latitude: this.state.Latitude,
      Longitude: this.state.Longitude,
      City: this.state.City,
      addres_detail: this.state.addres_detail,
      country: this.state.country,
      fee_by_kosmo: this.state.fee_by_kosmo,
      infolist: this.state.infoList,
      commodity: this.state.tableData,
    };

    // console.log(bodyparams);
    this.props.doLoading();
    axios
      .post(serverUrl + "merchant_insert_update2.php", bodyparams, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          //window.localStorage.clear();
          localStorage.removeItem("this_is_data");
          localStorage.removeItem("commodity_data");
          alert(this.language.savesuccess);
          this.props.history.push("/panel/listmerchant");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        // this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  doSubmitGlobal = () => {
    let bodyparams = {
      merchantid: this.state.merchantid,
      merchantname: this.state.merchantname,
      merchantcategoryid: this.state.merchantcategoryid,
      shortdesc: this.state.shortdesc,
      fulldesc: this.state.shortdesc,
      merchantpic: this.state.merchantpic,
      gallery: this.state.merchantpic,
      tags: this.state.tags,
      about: this.state.about,
      communityid: this.state.communityIdGlobal,
      location: this.state.location,
      contact: this.state.contact,
      merchantStatusId: this.state.merchantStatusId,
      statusppn: this.state.statusppn,
      price_ppn: this.state.price_ppn,
      timePeriode: this.state.timePeriode,
      deliveryById: this.state.deliveryById,
      fee_by_merchant: this.state.fee_by_merchant,
      dataFeeRateDeliveryKOSMO: this.state.dataFeeRateDeliveryKOSMO,
      status_diskon_bykosmo: this.state.status_diskon_bykosmo,
      feeDiskonByKOSMOID: this.state.feeDiskonByKOSMOID,
      posttal_code: this.state.posttal_code,
      Latitude: this.state.Latitude,
      Longitude: this.state.Longitude,
      City: this.state.City,
      addres_detail: this.state.addres_detail,
      country: this.state.country,
      fee_by_kosmo: this.state.fee_by_kosmo,
      statusPromoMerchant: 0,
      dataPromoMerchantDiscount: [],
      infolist: this.state.infoList,
      commodity: this.state.tableData,
    };

    // console.log(bodyparams);
    this.props.doLoading();
    axios
      .post(
        "http://smart-community.csolusi.com/smartcommunity_webapi_cp/merchant_insert_update3.php",
        bodyparams,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        if (response.data.status === "ok") {
          //window.localStorage.clear();
          this.onSubmit(response.data.merchantId);
          // localStorage.removeItem("this_is_data");
          // localStorage.removeItem("commodity_data");
          // alert(this.language.savesuccess);
          // this.props.history.push("/panel/listmerchant");
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

  renderInfo = () => {
    if (this.state.infoList.length > 0) {
      return (
        <div className="detail-info-list">
          <table>
            <tbody>
              {this.state.infoList.map((item, i) => (
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

  renderCommodity = () => {
    return (
      <div className="form-detail">
        <div className="detail-title">Commodity</div>
        <div className="detail-info-input">
          <FormGroup>
            <Button color="success" onClick={() => this.addNew()}>
              {this.globallang.add}
            </Button>
            <br></br>
            <br></br>
            <ReactTable
              data={this.state.tableData}
              columns={this.tableColumns}
              defaultPageSize={10}
            />
          </FormGroup>
        </div>
      </div>
    );
  };

  removeTime = (info) => {
    let tmp1 = [];
    // console.log(info);

    this.state.timePeriode.map((item, i) => {
      if (item !== info) {
        tmp1.push(item);
      }

      if (info.dayId === 1) {
        // console.log(info.dayId)
        this.setState({
          mondayPeriode: [],
          MondayDataDisplay: [],
          MondayData: [],
        });
      }

      if (info.dayId === 2) {
        this.setState({
          tuesdayPeriode: [],
          TuesdayData: [],
          TuesdayDataDisplay: [],
        });
      }

      if (info.dayId === 3) {
        this.setState({
          wednesdayPeriode: [],
          WednesdayData: [],
          WednesdayDataDisplay: [],
        });
      }

      if (info.dayId === 4) {
        this.setState({
          thursdayPeriode: [],
          ThursdayData: [],
          ThursdayDataDisplay: [],
        });
      }

      if (info.dayId === 5) {
        this.setState({
          fridayPeriode: [],
          FridayData: [],
          FridayDataDisplay: [],
        });
      }

      if (info.dayId === 6) {
        this.setState({
          saturdayPeriode: [],
          SaturdayData: [],
          SaturdayDataDisplay: [],
        });
      }

      if (info.dayId === 7) {
        this.setState({
          sundayPeriode: [],
          SundayData: [],
          SundayDataDisplay: [],
        });
      }

      // console.log(item);
      // console.log(tmp1);
      this.setState({ timePeriode: tmp1 });
    });
  };

  renderTimeInfo = () => {
    if (this.state.timePeriode.length > 0) {
      return (
        <div className="detail-info-list">
          <table>
            <tbody>
              {this.state.timePeriode.map((item, i) => (
                <tr>
                  <td className="td-value">{item.display}</td>
                  <td className="td-button">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => this.removeTime(item)}
                      block
                    >
                      <FontAwesomeIcon icon="times-circle" />
                      &nbsp;Remove
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
          <div className="no-data-available">
            Not Avaiable Operational days and hours
          </div>
        </div>
      );
    }
  };

  renderIFDiskonByKOSMO = () => {
    if (this.state.status_diskon_bykosmo === "1") {
      return (
        <tr>
          <td>
            <Label for="fee_diskon_kosmo">Fee Discount By ZOOM</Label>
          </td>
          <td>
            <SelectMultiColumn
              width={"100%"}
              value={this.state.feeDiskonByKOSMOID}
              valueColumn={"value"}
              showColumn={"text"}
              columns={["text"]}
              data={this.state.feeDiskonByKOSMOShow}
              onChange={this.changeFeeDiskonByKOSMO}
            />
          </td>
        </tr>
      );
    }
  };

  removeFeeRateDelivery = (info) => {
    let tmp1 = [];
    this.state.dataFeeRateDeliveryKOSMO.map((item, i) => {
      if (item !== info) {
        tmp1.push(item);
      }

      if (info.rate_jarak === "<1 KM") {
        this.setState({
          Data1KM: [],
        });
      }

      if (info.rate_jarak === ">1-2 KM") {
        this.setState({
          Data1_2KM: [],
        });
      }

      if (info.rate_jarak === ">3-4 KM") {
        this.setState({
          Data3_4KM: [],
        });
      }

      if (info.rate_jarak === ">5 KM") {
        this.setState({
          Data5KM: [],
        });
      }
      this.setState({ dataFeeRateDeliveryKOSMO: tmp1 });
    });
  };

  renderfeeRateByKOSMO = () => {
    if (this.state.dataFeeRateDeliveryKOSMO.length > 0) {
      return (
        <div className="detail-info-list">
          <table>
            <tbody>
              {this.state.dataFeeRateDeliveryKOSMO.map((item, i) => (
                <tr>
                  <td className="td-value">
                    <span>
                      {item.rate_jarak} Rp. {item.fee}
                    </span>
                  </td>
                  <td className="td-button">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => this.removeFeeRateDelivery(item)}
                      block
                    >
                      <FontAwesomeIcon icon="times-circle" />
                      &nbsp;Remove
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
          <div className="no-data-available">Not Avaiable</div>
        </div>
      );
    }
  };

  renderDeliveryFee = () => {
    if (this.state.deliveryById === 0) {
      return (
        <>
          <tr>
            <td>
              <Label for="fee_by_merchant">Fee Delivery By Merchant</Label>
            </td>
            <td>
              <Input
                type="number"
                name="fee_by_merchant"
                id="fee_by_merchant"
                placeholder="Rp."
                value={this.state.fee_by_merchant}
                onChange={(event) =>
                  this.setState({ fee_by_merchant: event.target.value })
                }
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    } else if (this.state.deliveryById === 1) {
      return (
        <>
          <tr>
            <td>
              <Label for="fee_by_kosmo">Fee Delivery By ZOOM</Label>
            </td>
            <td>
              {/* <div className="detail-info-input">
                <Row>
                  <Col sm={3}>
                    <SelectMultiColumn
                      width={"100%"}
                      value={this.state.rateHargaDeliveryKosmoID}
                      valueColumn={"value"}
                      showColumn={"display"}
                      columns={["display"]}
                      data={this.state.rateHargaDeliveryKosmoShow}
                      onChange={this.changeRateDeliveryKOSMO}
                    />
                  </Col>
                  <Col sm={3}>
                    <Input
                      type="number"
                      name="fee_by_kosmo"
                      id="fee_by_kosmo"
                      placeholder="Rp."
                      value={this.state.fee_by_kosmo}
                      onChange={(event) =>
                        this.setState({ fee_by_kosmo: event.target.value })
                      }
                    />
                  </Col>
                  <Col sm={0.8}>
                    <Button
                      color="success"
                      block
                      onClick={() => this.addFeeDeliveryByKOSMO()}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </Button>
                  </Col>
                </Row>
              </div> */}
              <Input
                type="number"
                name="fee_by_kosmo"
                id="fee_by_kosmo"
                placeholder="Rp."
                value={this.state.fee_by_kosmo}
                onChange={(event) =>
                  this.setState({ fee_by_kosmo: event.target.value })
                }
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
          {/* <tr>
            <td></td>
            <td>{this.renderfeeRateByKOSMO()}</td>
          </tr>
          <tr>&nbsp;</tr> */}
          <tr>
            <td>
              <Label for="status">Delivery Discount By ZOOM</Label>
            </td>
            <tr>
              <td>
                <Label>
                  <span style={{ fontSize: 16 }}>
                    <input
                      type="radio"
                      value="1"
                      checked={this.state.status_diskon_bykosmo === "1"}
                      onChange={this.handleStatusDiskonByKOSMO.bind(this)}
                    />
                    YES
                  </span>
                </Label>
              </td>
              &nbsp;&nbsp;&nbsp;
              <td>
                <Label>
                  <span style={{ fontSize: 16 }}>
                    <input
                      type="radio"
                      value="2"
                      checked={this.state.status_diskon_bykosmo === "2"}
                      onChange={this.handleStatusDiskonByKOSMO.bind(this)}
                    />
                    NO
                  </span>
                </Label>
              </td>
            </tr>
          </tr>
          <tr>&nbsp;</tr>
          {this.renderIFDiskonByKOSMO()}
        </>
      );
    } else {
      return null;
    }
  };

  renderPPN = () => {
    if (this.state.statusppn === "1") {
      return (
        <>
          <tr>
            <td>
              <Label for="price_ppn">Price PPN Tax</Label>
            </td>
            <td>
              <SelectMultiColumn
                width={"100%"}
                value={this.state.price_ppn}
                valueColumn={"value"}
                showColumn={"text"}
                columns={["text"]}
                data={this.state.feeDiskonByKOSMOShow}
                onChange={this.changePPN}
              />
            </td>
          </tr>
          <tr>&nbsp;</tr>
        </>
      );
    }
  };

  onMarkerMove = (param) => {
    axios
      .get(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          param.latLng.lat() +
          "," +
          param.latLng.lng() +
          "&key=AIzaSyAdm6TmweM5bzGr1Fry_737Bbcd4T0WxfY"
      )
      .then((response) => {
        this.state.latitude = param.latLng.lat();
        this.state.longitude = param.latLng.lng();
        this.state.address = response.data.results[0].formatted_address;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  render() {
    const MyMapComponent = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={17}
          defaultCenter={{
            lat: this.state.latitude,
            lng: this.state.longitude,
          }}
        >
          {props.isMarkerShown && (
            <Marker
              position={{ lat: this.state.latitude, lng: this.state.longitude }}
              draggable={true}
              onDragEnd={(e) => this.onMarkerMove(e)}
            />
          )}
        </GoogleMap>
      ))
    );

    return (
      <div>
        <div className="page-header">
          Add Merchant <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
        </div>
        <div className="box-container">
          <table>
            <tbody>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td width={250}>
                  <Label for="merchantname">{this.language.fieldname}</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="merchantname"
                    id="merchantname"
                    placeholder={this.language.fieldname}
                    value={this.state.merchantname}
                    onChange={(event) =>
                      this.setState({ merchantname: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="merchantcategoryid">
                    {this.language.fieldcategory}
                  </Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.merchantcategoryid}
                    valueColumn={"merchantcategoryid"}
                    showColumn={"merchantcategoryname"}
                    columns={["merchantcategoryname"]}
                    data={this.state.merchantCategoryShow}
                    onChange={this.changeMerchantCategory}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="shortdesc">{this.language.fieldshortdesc}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="shortdesc"
                    id="shortdesc"
                    rows={6}
                    placeholder={this.language.fieldshortdesc}
                    value={this.state.shortdesc}
                    onChange={(event) =>
                      this.setState({ shortdesc: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              {/* <tr>
                <td>
                  <Label for="fulldesc">{this.language.fieldfulldesc}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    rows={6}
                    name="fulldesc"
                    id="fulldesc"
                    placeholder={this.language.fieldfulldesc}
                    value={this.state.fulldesc}
                    onChange={(event) =>
                      this.setState({ fulldesc: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr> */}
              <tr>
                <td>
                  <Label>Logo Merchant</Label>
                </td>
                <td>
                  <PictureUploader
                    onUpload={this.onUploadImage}
                    picList={this.state.merchantpic}
                    picLimit={1}
                  ></PictureUploader>
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              {/* <tr>
                <td>
                  <Label>Gallery Merchant</Label>
                </td>
                <td>
                  <PictureUploader
                    onUpload={this.onUploadGallery}
                    picList={this.state.gallery}
                    picLimit={9}
                  ></PictureUploader>
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr> */}
              <tr>
                <td>
                  <Label for="tags">{this.language.fieldtags}</Label>
                </td>
                <td>
                  <TagSelector
                    width={"100%"}
                    value={this.state.tags}
                    data={this.state.tagShow}
                    onChange={this.changeTabSelector}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="about">{this.language.fieldabout}</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="about"
                    id="about"
                    placeholder="About"
                    value={this.state.about}
                    onChange={(event) =>
                      this.setState({ about: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="communityid">
                    {this.language.fieldcommunity}
                  </Label>
                </td>
                <td>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.communityid}
                    valueColumn={"communityid"}
                    showColumn={"communityname"}
                    columns={["communityname"]}
                    data={this.state.communityShow}
                    onChange={this.changeCommunity}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="location">Address</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="location"
                    id="location"
                    placeholder="Address"
                    value={this.state.location}
                    onChange={(event) =>
                      this.setState({ location: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="address_detail">Address Detail</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="address_detail"
                    id="address_detail"
                    placeholder="Address Detail"
                    value={this.state.addres_detail}
                    onChange={(event) =>
                      this.setState({ addres_detail: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="Latitude">Latitude</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="Latitude"
                    id="Latitude"
                    placeholder="Exp:-6xxxxx"
                    value={this.state.Latitude}
                    onChange={(event) =>
                      this.setState({ Latitude: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="Longitude">Longitude</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="Longitude"
                    id="Longitude"
                    placeholder="Exp:106xxxxx"
                    value={this.state.Longitude}
                    onChange={(event) =>
                      this.setState({ Longitude: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="City">City</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="City"
                    id="City"
                    placeholder="City"
                    value={this.state.City}
                    onChange={(event) =>
                      this.setState({ City: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="posttal_code">Postal Code</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="posttal_code"
                    id="posttal_code"
                    placeholder="Postal Code"
                    value={this.state.posttal_code}
                    onChange={(event) =>
                      this.setState({ posttal_code: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="country">Country</Label>
                </td>
                <td>
                  <Input
                    type="textarea"
                    name="country"
                    id="country"
                    placeholder="Country"
                    value={this.state.country}
                    onChange={(event) =>
                      this.setState({ country: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td width={250}>
                  <Label for="contact">Contact Merchant</Label>
                </td>
                <td>
                  <Input
                    type="text"
                    name="contact"
                    id="contact"
                    placeholder="Ex:08xxxxxxxxxx"
                    value={this.state.contact}
                    onChange={(event) =>
                      this.setState({ contact: event.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <Label for="isavailable">Status Merchant</Label>
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.merchantStatusId}
                    valueColumn={"id"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.merchantStatusShow}
                    onChange={this.changeStatusMerchant}
                  />
                </td>
              </tr>
              <tr>&nbsp;</tr>
              <tr>
                <td>
                  <Label for="status">Status PPN Tax </Label>
                </td>
                <tr>
                  <td>
                    <Label>
                      <span style={{ fontSize: 16 }}>
                        <input
                          type="radio"
                          value="1"
                          checked={this.state.statusppn === "1"}
                          onChange={this.handleStatusPPN.bind(this)}
                        />
                        YES
                      </span>
                    </Label>
                  </td>
                  &nbsp;&nbsp;&nbsp;
                  <td>
                    <Label>
                      <span style={{ fontSize: 16 }}>
                        <input
                          type="radio"
                          value="2"
                          checked={this.state.statusppn === "2"}
                          onChange={this.handleStatusPPN.bind(this)}
                        />
                        NO
                      </span>
                    </Label>
                  </td>
                </tr>
              </tr>
              <tr>&nbsp;</tr>
              {this.renderPPN()}
              <tr>
                <td>
                  <Label for="operational">Operational days and hours</Label>
                </td>
                <td>
                  <div className="detail-info-input">
                    <Row>
                      {" "}
                      <Col sm={3}>
                        <SelectMultiColumn
                          width={"100%"}
                          value={this.state.workingdayID}
                          valueColumn={"id"}
                          showColumn={"day"}
                          columns={["day"]}
                          data={this.state.workingdayShow}
                          onChange={this.changeWorkingDay}
                        />
                      </Col>
                      <Col sm={3}>
                        <select
                          style={{ width: 50, height: 40 }}
                          onChange={this.handleHourInChange.bind(this)}
                          value={this.state.hourin}
                        >
                          <option value="07">07</option>
                          <option value="08">08</option>
                          <option value="09">09</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                          <option value="15">15</option>
                          <option value="16">16</option>
                          <option value="17">17</option>
                          <option value="18">18</option>
                          <option value="19">19</option>
                          <option value="20">20</option>
                          <option value="21">21</option>
                          <option value="22">22</option>
                        </select>
                        &nbsp;:&nbsp;
                        <select
                          style={{ width: 50, height: 40 }}
                          onChange={this.handleMinuteInChange.bind(this)}
                          value={this.state.minutein}
                        >
                          <option value="00">00</option>
                          <option value="30">30</option>
                        </select>
                        &nbsp; s/d &nbsp;
                        <select
                          style={{ width: 50, height: 40 }}
                          onChange={this.handleHourOutChange.bind(this)}
                          value={this.state.hourout}
                        >
                          <option value="07">07</option>
                          <option value="08">08</option>
                          <option value="09">09</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                          <option value="15">15</option>
                          <option value="16">16</option>
                          <option value="17">17</option>
                          <option value="18">18</option>
                          <option value="19">19</option>
                          <option value="20">20</option>
                          <option value="21">21</option>
                          <option value="22">22</option>
                        </select>
                        &nbsp;:&nbsp;
                        <select
                          style={{ width: 50, height: 40 }}
                          onChange={this.handleMinuteOutChange.bind(this)}
                          value={this.state.minuteout}
                        >
                          <option value="00">00</option>
                          <option value="30">30</option>
                        </select>
                      </Col>
                      <Col sm={0.8}>
                        <Button
                          color="success"
                          block
                          onClick={() => this.addTime()}
                        >
                          <FontAwesomeIcon icon="plus" />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </td>
              </tr>
              <tr>&nbsp;</tr>
              <tr>
                <td></td>
                <td>{this.renderTimeInfo()}</td>
              </tr>
              <tr>&nbsp;</tr>
              <tr>
                <td>
                  <Label for="isavailable">Delivery By</Label>
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <SelectMultiColumn
                    width={"100%"}
                    value={this.state.deliveryById}
                    valueColumn={"id"}
                    showColumn={"text"}
                    columns={["text"]}
                    data={this.state.deliveryByShow}
                    onChange={this.changeStatusDelivery}
                  />
                </td>
              </tr>
              <tr>&nbsp;</tr>
              {this.renderDeliveryFee()}
            </tbody>
          </table>
          <br />
          {/* <div className="form-detail">
            <div className="detail-title">Merchant Info</div>
            <div className="detail-info-input">
              <Row>
                <Col sm={4}>
                  <Input
                    type="text"
                    name="field"
                    id="field"
                    placeholder="Info Name"
                    value={this.state.infoField}
                    onChange={(event) =>
                      this.setState({ infoField: event.target.value })
                    }
                  />
                </Col>

                <Col sm={6}>
                  <Input
                    type="text"
                    name="value"
                    id="value"
                    placeholder="Info Value"
                    value={this.state.infoValue}
                    onChange={(event) =>
                      this.setState({ infoValue: event.target.value })
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
          </div> */}
          <div className="form-button-container">
            <Button
              color="secondary"
              onClick={() => this.props.history.push("/panel/listmerchant")}
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
      </div>
    );
  }
}
export default InputMerchant;
