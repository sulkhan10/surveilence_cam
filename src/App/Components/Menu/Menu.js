import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import "./Menu.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Badge } from "reactstrap";
import {
  Dashboard,
  AccountBox,
  Apps,
  Dehaze,
  VideoCall,
  AllInbox,
  Camera,
  Videocam,
  PlayCircleFilled,
  Settings,
  AccountCircle,
  Category,
  SettingsApplications,
  PeopleAlt,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class Menu extends Component {
  constructor(props) {
    super(props);

    this.language = getLanguage(activeLanguage, "Menu");

    this.state = {
      role: 0,
      menus: [],
      loginInfo: props.loginInfo,
      community: props.community,
      currentParent: 0,
      currentChild: -1,
      count: 0,
    };
    this.selectRole(props.loginInfo);
  }

  componentDidMount = () => {};

  componentWillReceiveProps = (props) => {
    if (props.community !== this.state.community) {
      this.selectRole(props.loginInfo, props.community);
    }
    // this.setState({
    //   count: props.count,
    // });
    this.setState({ loginInfo: props.loginInfo, community: props.community });
  };

  selectRole = (loginInfo, community) => {
    this.setState({ role: loginInfo.logintype });
    this.selectType(loginInfo.logintype, community);
  };

  selectType = (role, community) => {
    if (role === 1) {
      this.menuSuperAdmin(community);
    } else if (role === 2) {
      this.menuSubAdmin(community);
    } else if (role === 3) {
      this.adminMerchant(community);
    }
  };

  toogleSubMenu = (menu, idx) => {
    let menus = this.state.menus;

    menus[idx].openChild = !menus[idx].openChild;
    this.setState({ menus: menus });
  };

  menuSuperAdmin = (community) => {
    let tmpMenu = [];
    tmpMenu.push(
      {
        id: 0,
        label: this.language["dashboard"],
        to: "/panel/dashboard",
        openChild: false,
        childs: [],
      },
      {
        id: 2,
        label: "Master",
        to: "",
        openChild: false,
        childs: [
          {
            id: 20,
            label: "Camera",
            to: "/panel/devicecamera",
          },
          {
            id: 21,
            label: "Group",
            to: "/panel/group",
          },
        ],
      },

      {
        id: 3,
        label: "Camera",
        to: "",
        openChild: false,
        childs: [
          {
            id: 31,
            label: "Live View",
            to: "/panel/liveView",
          },
          {
            id: 32,
            label: "Playback",
            to: "/panel/playback",
          },
          {
            id: 33,
            label: "Setting",
            to: "",
          },
        ],
      },

      {
        id: 4,
        label: "Account",
        to: "",
        openChild: false,
        childs: [
          {
            id: 41,
            label: "Admin",
            to: "/panel/admin",
          },
        ],
      },
      {
        id: 5,
        label: "Category",
        to: "",
        openChild: false,
        childs: [],
      },
      {
        id: 6,
        label: "Service",
        to: "",
        openChild: false,
        childs: [],
      },
      {
        id: 7,
        label: "Management",
        to: "",
        openChild: false,
        childs: [],
      }
    );

    this.setState({
      menus: tmpMenu,
    });
  };

  menuSubAdmin = (role) => {
    this.setState({
      menus: [
        {
          id: 0,
          label: this.language["dashboard"],
          to: "/panel/dashboard",
          openChild: false,
          childs: [],
        },
        {
          id: 1,
          label: "User",
          to: "",
          openChild: false,
          childs: [{ id: 12, label: "Member", to: "/panel/listuser" }],
        },
        {
          id: 2,
          label: "Master",
          to: "",
          openChild: false,
          childs: [
            {
              id: 21,
              label: this.language["community"],
              to: "/panel/listcommunity",
            },
            {
              id: 22,
              label: "Tags",
              to: "/panel/listtag",
            },
            {
              id: 23,
              label: "Location",
              to: "/panel/location",
            },
            {
              id: 24,
              label: "Chapter",
              to: "/panel/listchapter",
            },
            {
              id: 25,
              label: "Vehicle Type",
              to: "/panel/vehicletype",
            },
            {
              id: 26,
              label: "Membership Fee",
              to: "/panel/membershipfeelist",
            },
            {
              id: 27,
              label: "Member Number",
              to: "/panel/membernumber",
            },
          ],
        },

        {
          id: 3,
          label: "Category",
          to: "",
          openChild: false,
          childs: [
            {
              id: 31,
              label: "Merchant",
              to: "/panel/listmerchantcategory",
            },
            {
              id: 32,
              label: "Commodity",
              to: "/panel/listcommoditycategory",
            },
            {
              id: 33,
              label: "Directory",
              to: "/panel/listdirectorycategory",
            },
            {
              id: 34,
              label: "News",
              to: "/panel/listnewscategory",
            },
          ],
        },

        {
          id: 4,
          label: "Basic Menu",
          to: "",
          openChild: false,
          childs: [
            { id: 41, label: this.language["news"], to: "/panel/news" },
            {
              id: 42,
              label: this.language["moments"],
              to: "/panel/listmoments",
            },
            {
              id: 43,
              label: "Emergency",
              to: "/panel/listcallcenter",
            },
            {
              id: 44,
              label: this.language["directory"],
              to: "/panel/listdirectory",
            },
          ],
        },
        {
          id: 5,
          label: this.language["marketplace"],
          to: "",
          openChild: false,
          childs: [
            {
              id: 51,
              label: this.language["marketplaceadvertisement"],
              to: "/panel/listmarketplaceadvertisement",
            },
            {
              id: 52,
              label: "List of Merchants",
              to: "/panel/listmerchant",
            },
            {
              id: 53,
              label: "Order List",
              to: "/panel/orderList",
            },
          ],
        },
        {
          id: 6,
          label: "Report",
          to: "",
          openChild: false,
          childs: [
            {
              id: 61,
              label: "Check Out",
              to: "/panel/checktransaction",
            },
            {
              id: 62,
              label: "Payment",
              to: "/panel/paymenttransaction",
            },
          ],
        },
      ],
    });
  };

  adminMerchant = (role) => {
    this.setState({
      menus: [
        {
          id: 0,
          label: this.language["dashboard"],
          to: "/panel/dashboard",
          openChild: false,
          childs: [],
        },
        {
          id: 1,
          label: "Merchant",
          to: "/panel/merchantAcc",
          openChild: false,
          childs: [],
        },
        {
          id: 2,
          label: "Commodity",
          to: "/panel/commodityAcc",
          openChild: false,
          childs: [],
        },
        {
          id: 3,
          label: "Order List",
          to: "/panel/orderAcc",
          openChild: false,
          childs: [],
        },
        {
          id: 4,
          label: "Payment",
          to: "/panel/paymentAcc",
          openChild: false,
          childs: [],
        },
      ],
    });
  };

  updateParent = (id) => {
    this.setState({ currentParent: id, currentChild: -1 });
  };
  updateChild = (id) => {
    this.setState({ currentChild: id, currentParent: -1 });
  };

  iconBadge = () => {
    if (this.state.count !== 0) {
      return (
        <Badge color="primary" pill>
          {this.state.count}
        </Badge>
      );
    }
  };

  renderforBadge = (submenu) => {
    // console.log(submenu);
    if (submenu.label === "Order List") {
      return (
        <div
          className={`submenu ${
            this.state.currentChild === submenu.id ? "menu-active" : ""
          } `}
        >
          {this.renderSubMenuIcon(submenu.label)}{" "}
          <Typography
            component="span"
            variant="subtitle2"
            style={
              (stylesListComent.inline,
              {
                color: "#fff",
                fontWeight: "bolder",
              })
            }
          >
            {submenu.label}
          </Typography>
          &nbsp;
          {this.iconBadge()}
        </div>
      );
    } else {
      return (
        <div
          className={`submenu ${
            this.state.currentChild === submenu.id ? "menu-active" : ""
          } `}
        >
          {this.renderSubMenuIcon(submenu.label)}{" "}
          <Typography
            component="span"
            variant="subtitle2"
            style={
              (stylesListComent.inline,
              {
                color: "#fff",
                fontWeight: "bolder",
              })
            }
          >
            {submenu.label}
          </Typography>
        </div>
      );
    }
  };

  _renderSubMenu = (menu, idx) => {
    // console.log(menu);
    // this.loadCount();
    if (menu.openChild) {
      if (
        menu.label === "Marketplace" &&
        menu.childs[2].label === "Order List"
      ) {
        return (
          <div className="submenu-container">
            {menu.childs.map((submenu, i) => (
              <Link
                key={submenu.id}
                to={submenu.to}
                onClick={() => this.updateChild(submenu.id)}
                className={`link-custom`}
              >
                {this.renderforBadge(submenu)}
              </Link>
            ))}
          </div>
        );
      }
      return (
        <div className="submenu-container">
          {menu.childs.map((submenu, i) => (
            <Link
              key={submenu.id}
              to={submenu.to}
              onClick={() => this.updateChild(submenu.id)}
              className={`link-custom`}
            >
              <div
                className={`submenu ${
                  this.state.currentChild === submenu.id ? "menu-active" : ""
                } `}
              >
                {this.renderSubMenuIcon(submenu.label)}{" "}
                <Typography
                  component="span"
                  variant="subtitle2"
                  style={
                    (stylesListComent.inline,
                    {
                      color: "#fff",
                      fontWeight: "bolder",
                    })
                  }
                >
                  {submenu.label}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      );
    } else {
      return "";
    }
  };

  _renderChevronIcon = (menu) => {
    if (menu.openChild) {
      return <FontAwesomeIcon icon="chevron-down" />;
    } else {
      return <FontAwesomeIcon icon="chevron-left" />;
    }
  };

  _renderMenu = (menu, i) => {
    // console.log(menu);

    if (menu.to === "") {
      if (menu.label === "Marketplace") {
        return (
          <div key={menu.id}>
            <div
              className="menu menu-parent"
              onClick={() => this.toogleSubMenu(menu, i)}
            >
              {this.renderIconMenu(menu.label)}{" "}
              <Typography
                component="span"
                variant="subtitle2"
                style={
                  (stylesListComent.inline,
                  {
                    color: "#fff",
                    fontWeight: "bolder",
                  })
                }
              >
                {menu.label}
              </Typography>
              <div className="chevron-container">
                {this._renderChevronIcon(menu)}
              </div>
            </div>
            {this._renderSubMenu(menu, i)}
          </div>
        );
      }
      return (
        <div key={menu.id}>
          <div
            className="menu menu-parent"
            onClick={() => this.toogleSubMenu(menu, i)}
          >
            {this.renderIconMenu(menu.label)}{" "}
            <Typography
              component="span"
              variant="subtitle2"
              style={
                (stylesListComent.inline,
                {
                  color: "#fff",
                  fontWeight: "bolder",
                })
              }
            >
              {menu.label}
            </Typography>
            <div className="chevron-container">
              {this._renderChevronIcon(menu)}
            </div>
          </div>
          {this._renderSubMenu(menu, i)}
        </div>
      );
    } else {
      return (
        <Link
          key={menu.id}
          to={menu.to}
          onClick={() => this.updateParent(menu.id)}
          className={`link-custom`}
        >
          <div
            className={`menu ${
              this.state.currentParent === menu.id ? "menu-active" : ""
            } `}
          >
            {this.renderIconMenu(menu.label)}{" "}
            <Typography
              component="span"
              variant="subtitle2"
              style={
                (stylesListComent.inline,
                {
                  color: "#fff",
                  fontWeight: "bolder",
                })
              }
            >
              {menu.label}
            </Typography>{" "}
            <div className="chevron-container"></div>
          </div>
        </Link>
      );
    }
  };

  renderIconMenu = (label) => {
    if (label === "Dashboard") {
      return <Dashboard />;
    } else if (label === "User") {
      return <AccountBox />;
    } else if (label === "Master") {
      return <Apps />;
    } else if (label === "Camera") {
      return <Camera />;
    } else if (label === "Account") {
      return <AccountCircle />;
    } else if (label === "Category") {
      return <Category />;
    } else if (label === "Service") {
      return <SettingsApplications />;
    } else if (label === "Management") {
      return <Dehaze />;
    }
  };

  renderSubMenuIcon = (label) => {
    if (label === "Camera") {
      return <VideoCall />;
    } else if (label === "Group") {
      return <AllInbox />;
    } else if (label === "Live View") {
      return <Videocam />;
    } else if (label === "Playback") {
      return <PlayCircleFilled />;
    } else if (label === "Setting") {
      return <Settings />;
    } else if (label === "Admin") {
      return <PeopleAlt />;
    }
  };

  render() {
    return (
      <div className="menu-container">
        {this.state.menus.map((menu, i) => this._renderMenu(menu, i))}
      </div>
    );
  }
}
export default Menu;
