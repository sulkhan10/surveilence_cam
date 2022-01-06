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
import ListAdmin from "./Pages/ListAdmin/ListAdmin";
import EditAdmin from "./Pages/EditAdmin/EditAdmin";
import InputAdmin from "./Pages/InputAdmin/InputAdmin";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import GroupListPage from "./Pages/Group/GroupList";
import DevicesPage from "./Pages/Devices/Devices";
import CameraPage from "./Pages/CameraPage/CameraPage";
import PlayBackPage from "./Pages/PlayBackPage/PlayBackPage";
import DeviceCameraPage from "./Pages/Devices/DeviceCamera";
import AddDevicesPage from "./Pages/Devices/AddDevices";
import EditDevicesPage from "./Pages/Devices/EditDevices";
import LiveViewPage from "./Pages/CameraPage/LiveView";

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
                path={`${match.path}/devicecamera`}
                render={(props) => (
                  <DeviceCameraPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/playback`}
                render={(props) => (
                  <PlayBackPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />
              <Route
                path={`${match.path}/addDevices`}
                render={(props) => (
                  <AddDevicesPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/editDevice/:deviceId`}
                render={(props) => (
                  <EditDevicesPage
                    {...props}
                    doLoading={this.doLoading}
                    community={this.state.community}
                  />
                )}
              />

              <Route
                path={`${match.path}/liveView`}
                render={(props) => (
                  <LiveViewPage
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
