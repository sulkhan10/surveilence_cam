import React, { Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import axios from "axios";
import { serverUrl } from "../config";
import "./Default.style.css";
import Header from "./Components/Header/Header";
import Menu from "./Components/Menu/Menu";
import MenuProfile from "./Components/MenuProfile/MenuProfile";
import Loading from "./Components/Loading/Loading";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CorporateContact from "./Pages/CorporateContact/CorporateContact";
import InputCorporateContact from "./Pages/InputCorporateContact/InputCorporateContact";
import EditCorporateContact from "./Pages/EditCorporateContact/EditCorporateContact";
import ListCommunity from "./Pages/ListCommunity/ListCommunity";
import EditCommunity from "./Pages/EditCommunity/EditCommunity";
import InputCommunity from "./Pages/InputCommunity/InputCommunity";
import ListAdmin from "./Pages/ListAdmin/ListAdmin";
import EditAdmin from "./Pages/EditAdmin/EditAdmin";
import InputAdmin from "./Pages/InputAdmin/InputAdmin";
import ListUser from "./Pages/ListUser/ListUser";
import EditUser from "./Pages/EditUser/EditUser";
import InputUser from "./Pages/InputUser/InputUser";
import ListTag from "./Pages/ListTag/ListTag";
import EditTag from "./Pages/EditTag/EditTag";
import InputTag from "./Pages/InputTag/InputTag";
import News from "./Pages/News/News";
import NewsSub from "./Pages/NewsSub/News";
import InputNews from "./Pages/InputNews/InputNews";
import EditNews from "./Pages/EditNews/EditNews";
import InputNewsCategory from "./Pages/InputNewsCategory/InputNewsCategory";
import ListNewsCategory from "./Pages/ListNewsCategory/ListNewsCategory";
import EditNewsCategory from "./Pages/EditNewsCategory/EditNewsCategory";
import InputMerchantCategory from "./Pages/InputMerchantCategory/InputMerchantCategory";
import ListMerchantCategory from "./Pages/ListMerchantCategory/ListMerchantCategory";
import EditMerchantCategory from "./Pages/EditMerchantCategory/EditMerchantCategory";
import InputMerchant from "./Pages/InputMerchant/InputMerchant";
import ListMerchant from "./Pages/ListMerchant/ListMerchant";
import ListMerchantSub from "./Pages/ListMerchantSub/ListMerchant";
import EditMerchant from "./Pages/EditMerchant/EditMerchant";
import InputCommodityCategory from "./Pages/InputCommodityCategory/InputCommodityCategory";
import ListCommodityCategory from "./Pages/ListCommodityCategory/ListCommodityCategory";
import EditCommodityCategory from "./Pages/EditCommodityCategory/EditCommodityCategory";
import InputCommodity from "./Pages/InputCommodity/InputCommodity";
import ListCommodity from "./Pages/ListCommodity/ListCommodity";
import EditCommodity from "./Pages/EditCommodity/EditCommodity";
import InputMarketplaceEvent from "./Pages/InputMarketplaceEvent/InputMarketplaceEvent";
import ListMarketplaceEvent from "./Pages/ListMarketplaceEvent/ListMarketplaceEvent";
import EditMarketplaceEvent from "./Pages/EditMarketplaceEvent/EditMarketplaceEvent";
import InputMarketplaceAdvertisement from "./Pages/InputMarketplaceAdvertisement/InputMarketplaceAdvertisement";
import ListMarketplaceAdvertisement from "./Pages/ListMarketplaceAdvertisement/ListMarketplaceAdvertisement";
import EditMarketplaceAdvertisement from "./Pages/EditMarketplaceAdvertisement/EditMarketplaceAdvertisement";
import InputMoments from "./Pages/InputMoments/InputMoments";
import ListMoments from "./Pages/ListMoments/ListMoments";
import EditMoments from "./Pages/EditMoments/EditMoments";
import InputCallCenter from "./Pages/InputCallCenter/InputCallCenter";
import ListCallCenter from "./Pages/ListCallCenter/ListCallCenter";
import ListCallCenterSub from "./Pages/ListCallCenterSub/ListCallCenter";
import EditCallCenter from "./Pages/EditCallCenter/EditCallCenter";
import InputDirectoryCategory from "./Pages/InputDirectoryCategory/InputDirectoryCategory";
import ListDirectoryCategory from "./Pages/ListDirectoryCategory/ListDirectoryCategory";
import EditDirectoryCategory from "./Pages/EditDirectoryCategory/EditDirectoryCategory";
import InputDirectory from "./Pages/InputDirectory/InputDirectory";
import ListDirectory from "./Pages/ListDirectory/ListDirectory";
import ListDirectorySub from "./Pages/ListDirectorySub/ListDirectory";
import EditDirectory from "./Pages/EditDirectory/EditDirectory";
import ListFoodOrder from "./Pages/ListFoodOrder/ListFoodOrder";
import InputFoodOrder from "./Pages/InputFoodOrder/InputFoodOrder";
import EditFoodOrder from "./Pages/EditFoodOrder/EditFoodOrder";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import ChapterPage from "./Pages/ChapterPage/ChapterPage";
import InputChapter from "./Pages/ChapterPage/ChapterAdd";
import EditChapter from "./Pages/ChapterPage/ChapterEdit";
import ListLocationCaptiva from "./Pages/LocationCaptiva/LocationList";
import InputLocation from "./Pages/LocationCaptiva/LocationInput";
import EditLocation from "./Pages/LocationCaptiva/LocationEdit";
import ChapterList from "./Pages/ChapterCaptiva/ChapterCaptivaList";
import ChapterInputPage from "./Pages/ChapterCaptiva/ChapterCaptivaInput";
import ChapterEditPage from "./Pages/ChapterCaptiva/ChapterCaptivaEdit";
import TypeVehicleList from "./Pages/VehicleType/TypeList";
import InputVehiclePage from "./Pages/VehicleType/TypeInput";
import EditVehicleType from "./Pages/VehicleType/TypeEdit";
import ListMembershipFeePage from "./Pages/MembershipFee/MembershipFee_List";
import EditMembershipFeePage from "./Pages/MembershipFee/MembershipFee_Edit";
import InputMembershipFeePage from "./Pages/MembershipFee/MembershipFee_Input";
import CheckTransactionPage from "./Pages/CheckTransaction/CheckTransaction";
import PaymentTransactionPage from "./Pages/PaymentTransaction/PaymentTransaction";
import MemberNumberPage from "./Pages/MemberNumber/MemberNu,mber";
import MerchantOrder from "./Pages/ListFoodOrder/ListFoodOrderSubAdmin";
import MerchantListAdmin from "./Pages/ListMerchant/ListMerchantAdmin";
import MerchantEdit from "./Pages/EditMerchant/EditMerchants";
import ListCommoditySub from "./Pages/ListCommodity/ListCommoditySub";
import PaymentTransactionMerchantPage from "./Pages/PaymentTransaction/PaymentTransactionMerchant";
import InputCommodityAcc from "./Pages/InputCommodity/InputCommodityMerchant";
import EditCommodityMerchant from "./Pages/EditCommodity/EditCommodityMerchant";
import GroupListPage from "./Pages/Group/GroupList";
import DevicesPage from "./Pages/Devices/Devices";
import CameraPage from "./Pages/CameraPage/CameraPage";
import ListSchedule from "./Pages/ScheduleManagementPage/ScheduleManagementPage";
import AttendancePage from "./Pages/AttendancePage/AttendancePage";

class Default extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: {},
      menuProfileShow: false,
      community: {
        communityid: 0,
        communityname: "- SELECT COMMUNITY -",
        isdefault: 1,
      },
      communityList: [],
      loadingShow: false,
      redirect: false,
    };
    this.flag = {
      menuProfileJustOpen: false,
    };
    this.history = createBrowserHistory();

    this.history.listen((location, action) => {
      //event when change page
    });

    this.menuRef = null;
  }

  componentDidMount = () => {
    let loginInfo;

    if (
      this.props.location.state === undefined ||
      this.props.location.state === null
    ) {
      loginInfo = localStorage.getItem("loginInfo");

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
        this.setState({ loginInfo: loginInfo });
      }
    } else {
      loginInfo = this.props.location.state.loginInfo;
      this.setState({ loginInfo: this.props.location.state.loginInfo });
    }
    //set event click in document
    document.addEventListener("click", this.eventDocumentClick);
    if (loginInfo !== undefined) this.getCommunityAvailable(loginInfo.phoneno);
  };

  getCommunityAvailable = (phoneno) => {
    axios({
      method: "post",
      url: serverUrl + "cp_community_list_available_admin.php",
      data: { phoneno: phoneno },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((response) => {
        let data = response.data;
        let defaultCommunity = {
          communityid: 0,
          communityname: "- SELECT COMMUNITY -",
          isdefault: 1,
        };
        let getDefault = false;
        data.records.map((comm, i) => {
          if (comm.isdefault === 1) {
            defaultCommunity = comm;
            getDefault = true;
          }
        });
        if (!getDefault && data.records.length > 0) {
          defaultCommunity = data.records[0];
        }
        this.setState({
          communityList: data.records,
          community: defaultCommunity,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.eventDocumentClick);
  }

  eventDocumentClick = (event) => {
    //check if menu profile is open then close
    if (this.state.menuProfileShow) {
      if (this.flag.menuProfileJustOpen) {
        this.flag.menuProfileJustOpen = false;
      } else {
        this.setState({ menuProfileShow: !this.state.menuProfileShow });
      }
    }
  };

  onLogout = () => {
    localStorage.removeItem("loginInfo");
    this.props.history.replace("/");
  };
  toogleMenuProfile = () => {
    this.flag.menuProfileJustOpen = true;
    this.setState({ menuProfileShow: !this.state.menuProfileShow });
  };

  changeCommunity = (community) => {
    //console.log('change community : '+community);
    this.menuRef.updateParent(0);
    this.setState({ community: community });

    let { match } = this.props;
    //this.history.replace('/smartcp/panel/dashboard');
    this.history.replace(`${match.path}/dashboard`);
  };

  updateCommunity = () => {
    this.getCommunityAvailable();
  };

  doLoading = () => {
    this.setState({ loadingShow: !this.state.loadingShow });
  };

  render() {
    let { match } = this.props;
    // console.log(`${match.path}/dashboard`);
    return (
      <Router history={this.history}>
        <div>
          <Loading isShow={this.state.loadingShow} />
          <Header
            loginInfo={this.state.loginInfo}
            community={this.state.community}
            communityList={this.state.communityList}
            toogleMenuProfile={this.toogleMenuProfile}
            changeCommunity={this.changeCommunity}
          ></Header>
          <Menu
            ref={(ref) => (this.menuRef = ref)}
            loginInfo={this.state.loginInfo}
            community={this.state.community}
          ></Menu>
          <MenuProfile
            isOpen={this.state.menuProfileShow}
            onLogout={this.onLogout}
          ></MenuProfile>
          <div className="content-container">
            <Switch>
              <Route
                path={`${match.path}/dashboard`}
                render={(props) => (
                  <Dashboard
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              {/*<Route path="/panel/dashboard" render={(props)=><Dashboard {...props} doLoading={this.doLoading} community={this.state.community} />} />*/}
              {/* <Route
                path={`${match.path}/parkintroduction`}
                render={(props) => (
                  <ParkIntroduction
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/parkpositioning`}
                render={(props) => (
                  <ParkPositioning
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/companyintroduction`}
                render={(props) => (
                  <CompanyIntroduction
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/businesscase`}
                render={(props) => (
                  <BusinessCase
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputbusinesscase`}
                render={(props) => (
                  <InputBusinessCase
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editbusinesscase/:id`}
                render={(props) => (
                  <EditBusinessCase
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/corporatecontact`}
                render={(props) => (
                  <CorporateContact
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcorporatecontact`}
                render={(props) => (
                  <InputCorporateContact
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcorporatecontact/:id`}
                render={(props) => (
                  <EditCorporateContact
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/servicephilosophy`}
                render={(props) => (
                  <ServicePhilosophy
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/example`}
                render={(props) => (
                  <Example {...props} doLoading={this.doLoading} />
                )}
              />
              <Route
                path={`${match.path}/info`}
                render={(props) => (
                  <Info {...props} doLoading={this.doLoading} />
                )}
              />
              <Route
                path={`${match.path}/inputinfo`}
                render={(props) => (
                  <InputInfo {...props} doLoading={this.doLoading} />
                )}
              />
              <Route
                path={`${match.path}/editinfo/:infoid`}
                render={(props) => (
                  <EditInfo {...props} doLoading={this.doLoading} />
                )}
              /> */}
              <Route
                path={`${match.path}/changepassword`}
                render={(props) => (
                  <ChangePassword
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcommunity`}
                render={(props) => (
                  <ListCommunity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                    updateCommunity={this.updateCommunity}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcommunity`}
                render={(props) => (
                  <InputCommunity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                    updateCommunity={this.updateCommunity}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcommunity/:communityid`}
                render={(props) => (
                  <EditCommunity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                    updateCommunity={this.updateCommunity}
                  />
                )}
              />
              <Route
                path={`${match.path}/admin`}
                render={(props) => (
                  <ListAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputadmin`}
                render={(props) => (
                  <InputAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editadmin/:phoneno`}
                render={(props) => (
                  <EditAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listuser`}
                render={(props) => (
                  <ListUser
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputuser`}
                render={(props) => (
                  <InputUser
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edituser/:phoneno`}
                render={(props) => (
                  <EditUser
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/merchantAcc`}
                render={(props) => (
                  <MerchantListAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmerchantAcc/:merchantid`}
                render={(props) => (
                  <MerchantEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcommodityAcc/:id`}
                render={(props) => (
                  <EditCommodityMerchant
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listteknisi`}
                render={(props) => (
                  <ListTeknisi
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputteknisi`}
                render={(props) => (
                  <InputTeknisi
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editteknisi/:teknisiid`}
                render={(props) => (
                  <EditTeknisi
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/listtag`}
                render={(props) => (
                  <ListTag
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputtag`}
                render={(props) => (
                  <InputTag
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edittag/:tagid`}
                render={(props) => (
                  <EditTag
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listcompanycategory`}
                render={(props) => (
                  <ListCompanyCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcompanycategory`}
                render={(props) => (
                  <InputCompanyCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcompanycategory/:companycategoryid`}
                render={(props) => (
                  <EditCompanyCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcompany`}
                render={(props) => (
                  <ListCompany
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcompany`}
                render={(props) => (
                  <InputCompany
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcompany/:companyid`}
                render={(props) => (
                  <EditCompany
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listproduct`}
                render={(props) => (
                  <ListProduct
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputproduct`}
                render={(props) => (
                  <InputProduct
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editproduct/:productid`}
                render={(props) => (
                  <EditProduct
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listservice`}
                render={(props) => (
                  <ListService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputservice`}
                render={(props) => (
                  <InputService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editservice/:serviceid`}
                render={(props) => (
                  <EditService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listproductcategory`}
                render={(props) => (
                  <ListProductCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputproductcategory`}
                render={(props) => (
                  <InputProductCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editproductcategory/:productcategoryid`}
                render={(props) => (
                  <EditProductCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listservicecategory`}
                render={(props) => (
                  <ListServiceCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputservicecategory`}
                render={(props) => (
                  <InputServiceCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editservicecategory/:servicecategoryid`}
                render={(props) => (
                  <EditServiceCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              */}
              <Route
                path={`${match.path}/news`}
                render={(props) => (
                  <News
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/newsSub`}
                render={(props) => (
                  <NewsSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputnews`}
                render={(props) => (
                  <InputNews
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnews/:newsid`}
                render={(props) => (
                  <EditNews
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listnewscategory`}
                render={(props) => (
                  <ListNewsCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputnewscategory`}
                render={(props) => (
                  <InputNewsCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnewscategory/:newscategoryid`}
                render={(props) => (
                  <EditNewsCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listproject`}
                render={(props) => (
                  <ListProject
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputproject`}
                render={(props) => (
                  <InputProject
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editproject/:projectid`}
                render={(props) => (
                  <EditProject
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listprojectcategory`}
                render={(props) => (
                  <ListProjectCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputprojectcategory`}
                render={(props) => (
                  <InputProjectCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editprojectcategory/:projectcategoryid`}
                render={(props) => (
                  <EditProjectCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listinvestment`}
                render={(props) => (
                  <ListInvestment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputinvestment`}
                render={(props) => (
                  <InputInvestment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editinvestment/:investmentid`}
                render={(props) => (
                  <EditInvestment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listinvestmentcategory`}
                render={(props) => (
                  <ListInvestmentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputinvestmentcategory`}
                render={(props) => (
                  <InputInvestmentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editinvestmentcategory/:investmentcategoryid`}
                render={(props) => (
                  <EditInvestmentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listtalent`}
                render={(props) => (
                  <ListTalent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputtalent`}
                render={(props) => (
                  <InputTalent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edittalent/:talentid`}
                render={(props) => (
                  <EditTalent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listtalentcategory`}
                render={(props) => (
                  <ListTalentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputtalentcategory`}
                render={(props) => (
                  <InputTalentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edittalentcategory/:talentcategoryid`}
                render={(props) => (
                  <EditTalentCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listdownload`}
                render={(props) => (
                  <ListDownload
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputdownload`}
                render={(props) => (
                  <InputDownload
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editdownload/:downloadid`}
                render={(props) => (
                  <EditDownload
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listdownloadcategory`}
                render={(props) => (
                  <ListDownloadCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputdownloadcategory`}
                render={(props) => (
                  <InputDownloadCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editdownloadcategory/:downloadcategoryid`}
                render={(props) => (
                  <EditDownloadCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/listmerchantcategory`}
                render={(props) => (
                  <ListMerchantCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputmerchantcategory`}
                render={(props) => (
                  <InputMerchantCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmerchantcategory/:merchantcategoryid`}
                render={(props) => (
                  <EditMerchantCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listmerchant`}
                render={(props) => (
                  <ListMerchant
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listmerchantSub`}
                render={(props) => (
                  <ListMerchantSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputmerchant`}
                render={(props) => (
                  <InputMerchant
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmerchant/:merchantid`}
                render={(props) => (
                  <EditMerchant
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcommoditycategory`}
                render={(props) => (
                  <ListCommodityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcommoditycategory`}
                render={(props) => (
                  <InputCommodityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcommoditycategory/:commoditycategoryid`}
                render={(props) => (
                  <EditCommodityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcommodity`}
                render={(props) => (
                  <ListCommodity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcommodity`}
                render={(props) => (
                  <InputCommodity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcommodity`}
                render={(props) => (
                  <EditCommodity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listmarketplaceevent`}
                render={(props) => (
                  <ListMarketplaceEvent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputmarketplaceevent`}
                render={(props) => (
                  <InputMarketplaceEvent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmarketplaceevent/:marketplaceeventid`}
                render={(props) => (
                  <EditMarketplaceEvent
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listmarketplaceadvertisement`}
                render={(props) => (
                  <ListMarketplaceAdvertisement
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputmarketplaceadvertisement`}
                render={(props) => (
                  <InputMarketplaceAdvertisement
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmarketplaceadvertisement/:marketplaceadvertisementid`}
                render={(props) => (
                  <EditMarketplaceAdvertisement
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listonlinestorecategory`}
                render={(props) => (
                  <ListOnlineStoreCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputonlinestorecategory`}
                render={(props) => (
                  <InputOnlineStoreCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editonlinestorecategory/:onlinestorecategoryid`}
                render={(props) => (
                  <EditOnlineStoreCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listonlinestore`}
                render={(props) => (
                  <ListOnlineStore
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputonlinestore`}
                render={(props) => (
                  <InputOnlineStore
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editonlinestore/:onlinestoreid`}
                render={(props) => (
                  <EditOnlineStore
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/listmoments`}
                render={(props) => (
                  <ListMoments
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputmoments`}
                render={(props) => (
                  <InputMoments
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmoments/:momentid`}
                render={(props) => (
                  <EditMoments
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listbillingdebtor`}
                render={(props) => (
                  <ListBillingDebtor
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/detailbillingdebtor/:billingid`}
                render={(props) => (
                  <DetailBillingDebtor
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listbilling`}
                render={(props) => (
                  <ListBilling
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputbilling`}
                render={(props) => (
                  <InputBilling
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editbilling/:userbillingid`}
                render={(props) => (
                  <EditBilling
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listbillingcategory`}
                render={(props) => (
                  <ListBillingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputbillingcategory`}
                render={(props) => (
                  <InputBillingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editbillingcategory/:billingcategoryid`}
                render={(props) => (
                  <EditBillingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listservicecenter`}
                render={(props) => (
                  <ListServiceCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listservicecenterSub`}
                render={(props) => (
                  <ListServiceCenterSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputservicecenter`}
                render={(props) => (
                  <InputServiceCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editservicecenter/:servicecenterid`}
                render={(props) => (
                  <EditServiceCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listservicecentercategory`}
                render={(props) => (
                  <ListServiceCenterCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputservicecentercategory`}
                render={(props) => (
                  <InputServiceCenterCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editservicecentercategory/:servicecentercategoryid`}
                render={(props) => (
                  <EditServiceCenterCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/homeconfig`}
                render={(props) => (
                  <HomeConfig
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listentertainment`}
                render={(props) => (
                  <ListEntertainment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputentertainment`}
                render={(props) => (
                  <InputEntertainment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editentertainment/:entertainmentid`}
                render={(props) => (
                  <EditEntertainment
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listuserservice`}
                render={(props) => (
                  <ListUserService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputuserservice`}
                render={(props) => (
                  <InputUserService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edituserservice/:userserviceid`}
                render={(props) => (
                  <EditUserService
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listroomcategory`}
                render={(props) => (
                  <ListRoomCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputroomcategory`}
                render={(props) => (
                  <InputRoomCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editroomcategory/:roomcategoryid`}
                render={(props) => (
                  <EditRoomCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listroom`}
                render={(props) => (
                  <ListRoom
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listroomSub`}
                render={(props) => (
                  <ListRoomSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputroom`}
                render={(props) => (
                  <InputRoom
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editroom/:roomid`}
                render={(props) => (
                  <EditRoom
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listroomreservation`}
                render={(props) => (
                  <ListRoomReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputroomreservation`}
                render={(props) => (
                  <InputRoomReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editroomreservation/:roomreservationid`}
                render={(props) => (
                  <EditRoomReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listactivitycategory`}
                render={(props) => (
                  <ListActivityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputactivitycategory`}
                render={(props) => (
                  <InputActivityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editactivitycategory/:activitycategoryid`}
                render={(props) => (
                  <EditActivityCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listactivity`}
                render={(props) => (
                  <ListActivity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listactivitySub`}
                render={(props) => (
                  <ListActivitySub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputactivity`}
                render={(props) => (
                  <InputActivity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editactivity/:activityid`}
                render={(props) => (
                  <EditActivity
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listactivityreservation`}
                render={(props) => (
                  <ListActivityReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputactivityreservation`}
                render={(props) => (
                  <InputActivityReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editactivityreservation/:activityreservationid`}
                render={(props) => (
                  <EditActivityReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              {/* <Route
                path={`${match.path}/listorder`}
                render={(props) => (
                  <ListOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputorder`}
                render={(props) => (
                  <InputOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editorder/:orderid`}
                render={(props) => (
                  <EditOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              {/* <Route
                path={`${match.path}/listuservehicle`}
                render={(props) => (
                  <ListUserVehicle
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputuservehicle`}
                render={(props) => (
                  <InputUserVehicle
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edituservehicle/:uservehicleid`}
                render={(props) => (
                  <EditUserVehicle
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listparking`}
                render={(props) => (
                  <ListParking
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputparking`}
                render={(props) => (
                  <InputParking
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editparking/:parkingid`}
                render={(props) => (
                  <EditParking
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listuservisit`}
                render={(props) => (
                  <ListUserVisit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputuservisit`}
                render={(props) => (
                  <InputUserVisit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/edituservisit/:uservisitid`}
                render={(props) => (
                  <EditUserVisit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/listcallcenter`}
                render={(props) => (
                  <ListCallCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcallcenterSub`}
                render={(props) => (
                  <ListCallCenterSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcallcenter`}
                render={(props) => (
                  <InputCallCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcallcenter/:id`}
                render={(props) => (
                  <EditCallCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listdirectorycategory`}
                render={(props) => (
                  <ListDirectoryCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputdirectorycategory`}
                render={(props) => (
                  <InputDirectoryCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editdirectorycategory/:directorycategoryid`}
                render={(props) => (
                  <EditDirectoryCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listdirectory`}
                render={(props) => (
                  <ListDirectory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listdirectorySub`}
                render={(props) => (
                  <ListDirectorySub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputdirectory`}
                render={(props) => (
                  <InputDirectory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editdirectory/:directoryid`}
                render={(props) => (
                  <EditDirectory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listforweddingcategory`}
                render={(props) => (
                  <ListForWeddingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputforweddingcategory`}
                render={(props) => (
                  <InputForWeddingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editforweddingcategory/:forweddingcategoryid`}
                render={(props) => (
                  <EditForWeddingCategory
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listforwedding`}
                render={(props) => (
                  <ListForWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listforweddingSub`}
                render={(props) => (
                  <ListForWeddingSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputforwedding`}
                render={(props) => (
                  <InputForWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editforwedding/:forweddingid`}
                render={(props) => (
                  <EditForWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listnonwedding`}
                render={(props) => (
                  <ListNonWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listnonweddingSub`}
                render={(props) => (
                  <ListNonWeddingSub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputnonwedding`}
                render={(props) => (
                  <InputNonWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnonwedding/:nonweddingid`}
                render={(props) => (
                  <EditNonWedding
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listforweddingreservation`}
                render={(props) => (
                  <ListForWeddingReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listnonweddingreservation`}
                render={(props) => (
                  <ListNonWeddingReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editforweddingreservation/:weddingreservationid`}
                render={(props) => (
                  <EditForWeddingReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnonweddingreservation/:nonweddingreservationid`}
                render={(props) => (
                  <EditNonWeddingReservation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listvoucher`}
                render={(props) => (
                  <ListVoucher
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputvoucher`}
                render={(props) => (
                  <InputVoucher
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editvoucher/:voucherid`}
                render={(props) => (
                  <EditVoucher
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listfoodgarden`}
                render={(props) => (
                  <ListFoodGarden
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputfoodgarden`}
                render={(props) => (
                  <InputFoodGarden
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/orderList`}
                render={(props) => (
                  <ListFoodOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputfoodorder`}
                render={(props) => (
                  <InputFoodOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editfoodorder/:foodorderid`}
                render={(props) => (
                  <EditFoodOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/orderAcc`}
                render={(props) => (
                  <MerchantOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/commodityAcc`}
                render={(props) => (
                  <ListCommoditySub
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputCommodityAcc`}
                render={(props) => (
                  <InputCommodityAcc
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              {/* <Route
                path={`${match.path}/listnewscovid19`}
                render={(props) => (
                  <ListNewsCovid19
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputnewscovid19`}
                render={(props) => (
                  <InputNewsCovid19
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnewscovid19/:newsid`}
                render={(props) => (
                  <EditNewsCovid19
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              {/* <Route
                path={`${match.path}/listcomplaint`}
                render={(props) => (
                  <ListComplaint
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/detailcomplaint/:complaintid`}
                render={(props) => (
                  <EditComplaint
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/dailydeclaration`}
                render={(props) => (
                  <ListHealthDeclaration
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listreturntrip`}
                render={(props) => (
                  <ListReturnTrip
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listspringfestival`}
                render={(props) => (
                  <ListSpringFestival
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listcallcovidcenter`}
                render={(props) => (
                  <ListCallCovidCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputcallcovidcenter`}
                render={(props) => (
                  <InputCallCovidCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editcallcovidcenter/:id`}
                render={(props) => (
                  <EditCallCovidCenter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listnewswfh`}
                render={(props) => (
                  <ListNewsWFH
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputnewswfh`}
                render={(props) => (
                  <InputNewsWFH
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editnewswfh/:newsid`}
                render={(props) => (
                  <EditNewsWFH
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/reconsiliation`}
                render={(props) => (
                  <ReconsiliationPageList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listuserbinding`}
                render={(props) => (
                  <UserBindingList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/detailuserbinding/:bindingid`}
                render={(props) => (
                  <UserBindingEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listbindingnotowner`}
                render={(props) => (
                  <UserBidingNotOwner
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listuseraccount`}
                render={(props) => (
                  <UserAccountList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listquestionnaire`}
                render={(props) => (
                  <QuestionnairePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/merchantregistration`}
                render={(props) => (
                  <MerchantRegistrationPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/requestpromo`}
                render={(props) => (
                  <RequestPromo
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/financialreport`}
                render={(props) => (
                  <FinancialReport
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/listoforder`}
                render={(props) => (
                  <MerchantOrder
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              {/* <Route
                path={`${match.path}/merchant`}
                render={(props) => (
                  <MerchantAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editorderlist/:foodorderid`}
                render={(props) => (
                  <EditOrderList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/merchantreport`}
                render={(props) => (
                  <MerchantReport
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/merchants`}
                render={(props) => (
                  <MerchantListAdmin
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editmerchants/:merchantid`}
                render={(props) => (
                  <MerchantEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/unitcluster`}
                render={(props) => (
                  <UnitClusterList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/inputunit`}
                render={(props) => (
                  <UnitClusterInput
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/editunit/:unitid`}
                render={(props) => (
                  <UnitClusterEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/unitinvoice`}
                render={(props) => (
                  <UnitInvoiceList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputinvoice`}
                render={(props) => (
                  <UnitInvoiceInput
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editunitinvoice/:invid`}
                render={(props) => (
                  <UnitInvoiceEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/settings`}
                render={(props) => (
                  <SettingsPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/settingmenu`}
                render={(props) => (
                  <SettingsAdd
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/settingmenuedit/:settingId`}
                render={(props) => (
                  <SettingsEdit
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              /> */}
              <Route
                path={`${match.path}/chapter`}
                render={(props) => (
                  <ChapterPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputchapter`}
                render={(props) => (
                  <InputChapter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editchapter/:infoid`}
                render={(props) => (
                  <EditChapter
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/location`}
                render={(props) => (
                  <ListLocationCaptiva
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/inputlocation`}
                render={(props) => (
                  <InputLocation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/editlocation/:id`}
                render={(props) => (
                  <EditLocation
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/listchapter`}
                render={(props) => (
                  <ChapterList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/chapterinput`}
                render={(props) => (
                  <ChapterInputPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/chapteredit/:id`}
                render={(props) => (
                  <ChapterEditPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/vehicletype`}
                render={(props) => (
                  <TypeVehicleList
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/inputvehicletype`}
                render={(props) => (
                  <InputVehiclePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/editvehicletype/:id`}
                render={(props) => (
                  <EditVehicleType
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/membershipfeelist`}
                render={(props) => (
                  <ListMembershipFeePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/membershipfeeinput`}
                render={(props) => (
                  <InputMembershipFeePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/membershipfeeedit/:id`}
                render={(props) => (
                  <EditMembershipFeePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/checktransaction`}
                render={(props) => (
                  <CheckTransactionPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/paymenttransaction`}
                render={(props) => (
                  <PaymentTransactionPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/paymentAcc`}
                render={(props) => (
                  <PaymentTransactionMerchantPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/membernumber`}
                render={(props) => (
                  <MemberNumberPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/group`}
                render={(props) => (
                  <GroupListPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/devices`}
                render={(props) => (
                  <DevicesPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/camera`}
                render={(props) => (
                  <CameraPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/schedule`}
                render={(props) => (
                  <ListSchedule
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/attendance`}
                render={(props) => (
                  <AttendancePage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Default;
