import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { serverUrl } from "../../../config.js";
import "./Menu.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { Badge } from "reactstrap";

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

  componentDidMount = () => {
    this.loadCount();
  };

  loadCount = () => {
    axios
      .post(
        serverUrl + "count_order.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        let count = response.data.count;
        this.setState({ count: count });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

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
        id: 1,
        label: this.language["master"],
        to: "",
        openChild: false,
        childs: [
          {
            id: 0,
            label: this.language["community"],
            to: "/panel/listcommunity",
          },

          { id: 2, label: this.language["admin"], to: "/panel/listadmin" },
          { id: 3, label: this.language["user"], to: "/panel/listuser" },
        ],
      },
      // {
      //   id: 11,
      //   label: this.language["bannermanagement"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 0,
      //       label: this.language["bannerhome"],
      //       to: "/panel/listcommunity",
      //     },
      //   ],
      // },

      {
        id: 2,
        label: this.language["category"],
        to: "",
        openChild: false,
        childs: [
          // {
          //   id: 0,
          //   label: this.language["companycategory"],
          //   to: "/panel/listcompanycategory",
          // },
          // { id: 1, label: this.language['downloadcategory'], to: '/panel/listdownloadcategory' },
          { id: 1, label: this.language["tag"], to: "/panel/listtag" },
          {
            id: 2,
            label: this.language["merchantcategory"],
            to: "/panel/listmerchantcategory",
          },
          {
            id: 3,
            label: this.language["commoditycategory"],
            to: "/panel/listcommoditycategory",
          },
          // {
          //   id: 4,
          //   label: this.language["billingcategory"],
          //   to: "/panel/listbillingcategory",
          // },
          // {
          //   id: 5,
          //   label: this.language["servicecentercategory"],
          //   to: "/panel/listservicecentercategory",
          // },
          // {
          //   id: 6,
          //   label: this.language["roomcategory"],
          //   to: "/panel/listroomcategory",
          // },
          // {
          //   id: 7,
          //   label: this.language["activitycategory"],
          //   to: "/panel/listactivitycategory",
          // },
          {
            id: 8,
            label: this.language["directorycategory"],
            to: "/panel/listdirectorycategory",
          },
          {
            id: 9,
            label: this.language["newscategory"],
            to: "/panel/listnewscategory",
          },
          // {
          //   id: 9,
          //   label: this.language["forweddingcategory"],
          //   to: "/panel/listforweddingcategory",
          // },
        ],
      },
      {
        id: 3,
        label: this.language["newsactivities"],
        to: "",
        openChild: false,
        childs: [{ id: 0, label: this.language["news"], to: "/panel/news" }],
      },
      // {
      //   id: 4,
      //   label: this.language["ordermanagement"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 0,
      //       label: this.language["activity"],
      //       to: "/panel/listactivity",
      //     },
      //     {
      //       id: 1,
      //       label: this.language["activityreservation"],
      //       to: "/panel/listactivityreservation",
      //     },
      //     { id: 2, label: this.language["room"], to: "/panel/listroom" },
      //     {
      //       id: 3,
      //       label: this.language["roomreservation"],
      //       to: "/panel/listroomreservation",
      //     },
      //     {
      //       id: 4,
      //       label: this.language["wedding"],
      //       to: "/panel/listforwedding",
      //     },
      //     {
      //       id: 5,
      //       label: this.language["weddingreservation"],
      //       to: "/panel/listforweddingreservation",
      //     },
      //     {
      //       id: 6,
      //       label: this.language["nonwedding"],
      //       to: "/panel/listnonwedding",
      //     },
      //     {
      //       id: 7,
      //       label: this.language["nonweddingreservation"],
      //       to: "/panel/listnonweddingreservation",
      //     },
      //   ],
      // },
      // {
      //   id: 5,
      //   label: this.language["servicemanagement"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 0,
      //       label: this.language["servicecenter"],
      //       to: "/panel/listservicecenter",
      //     },
      //     {
      //       id: 1,
      //       label: this.language["userservice"],
      //       to: "/panel/listuserservice",
      //     },
      //     { id: 2, label: this.language["company"], to: "/panel/listcompany" },
      //     { id: 3, label: this.language["teknisi"], to: "/panel/listteknisi" },
      //   ],
      // },

      {
        id: 7,
        label: this.language["basicmanagement"],
        to: "",
        openChild: false,
        childs: [
          {
            id: 0,
            label: this.language["callcenter"],
            to: "/panel/listcallcenter",
          },
          {
            id: 1,
            label: this.language["directory"],
            to: "/panel/listdirectory",
          },
          { id: 2, label: this.language["moments"], to: "/panel/listmoments" },
        ],
      },
      // {
      //   id: 9,
      //   label: this.language["infocovid19"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 0,
      //       label: this.language["newscovid"],
      //       to: "/panel/listnewscovid19",
      //     },
      //     {
      //       id: 1,
      //       label: this.language["callcovidcenter"],
      //       to: "/panel/listcallcovidcenter",
      //     },
      //     {
      //       id: 2,
      //       label: this.language["complaintform"],
      //       to: "/panel/listcomplaint",
      //     },
      //   ],
      // },

      // {
      //   id: 10,
      //   label: this.language["healthdeclaration"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 78,
      //       label: this.language["dailydeclaration"],
      //       to: "/panel/dailydeclaration",
      //     },
      //     {
      //       id: 79,
      //       label: this.language["returntrip"],
      //       to: "/panel/listreturntrip",
      //     },
      //     {
      //       id: 80,
      //       label: this.language["springfestival"],
      //       to: "/panel/listspringfestival",
      //     },
      //   ],
      // },
      // {
      //   id: 11,
      //   label: this.language["wfhmanagement"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     { id: 85, label: this.language["wfh"], to: "/panel/listnewswfh" },
      //   ],
      // },
      {
        id: 6,
        label: this.language["marketplace"],
        to: "",
        openChild: false,
        childs: [
          {
            id: 2,
            label: this.language["marketplaceadvertisement"],
            to: "/panel/listmarketplaceadvertisement",
          },
          // {
          //   id: 87,
          //   label: "Merchant Registration",
          //   to: "/panel/merchantregistration",
          // },
          {
            id: 0,
            label: "List of Merchants",
            to: "/panel/listmerchant",
          },
          {
            id: 1,
            label: "Order List",
            to: "/panel/listfoodorder",
          },
          // {
          //   id: 91,
          //   label: "Financial Report",
          //   to: "/panel/financialreport",
          // },
        ],
      }
      // {
      //   id: 14,
      //   label: "Inquiry Management",
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 86,
      //       label: "Tenant CRG",
      //       to: "/panel/listquestionnaire",
      //     },
      //   ],
      // },
      // {
      //   id: 12,
      //   label: "User Binding",
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 81,
      //       label: "Approval Account",
      //       to: "/panel/listuserbinding",
      //     },
      //     {
      //       id: 82,
      //       label: "Account List",
      //       to: "/panel/listuseraccount",
      //     },
      //   ],
      // },
      // {
      //   id: 13,
      //   label: "Management Unit",
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 91,
      //       label: "Unit & Cluster List",
      //       to: "/panel/unitcluster",
      //     },
      //     {
      //       id: 92,
      //       label: "Unit Invoice List",
      //       to: "/panel/unitinvoice",
      //     },
      //   ],
      // },
      // {
      //   id: 8,
      //   label: this.language["payment"],
      //   to: "",
      //   openChild: false,
      //   childs: [
      //     {
      //       id: 90,
      //       label: "Promo Request",
      //       to: "/panel/requestpromo",
      //     },
      //     {
      //       id: 83,
      //       label: "Billing Payment",
      //       to: "/panel/listbillingdebtor",
      //     },
      //   ],
      // }
    );

    this.setState({
      menus: tmpMenu,
    });
  };

  menuSubAdmin = (role) => {
    this.setState({
      menus: [
        // {
        //   id: 0,
        //   label: this.language["payment"],
        //   to: "",
        //   openChild: false,
        //   childs: [
        //     {
        //       id: 0,
        //       label: this.language["billingdebtor"],
        //       to: "/panel/listbillingdebtor",
        //     },
        //     {
        //       id: 1,
        //       label: "Reconsiliation Billing",
        //       to: "/panel/reconsiliation",
        //     },
        //   ],
        // },
        {
          id: 12,
          label: "User Binding",
          to: "",
          openChild: false,
          childs: [
            {
              id: 81,
              label: "Approval Account",
              to: "/panel/listuserbinding",
            },
            {
              id: 82,
              label: "Account List",
              to: "/panel/listuseraccount",
            },
          ],
        },
        {
          id: 8,
          label: this.language["payment"],
          to: "",
          openChild: false,
          childs: [
            {
              id: 83,
              label: this.language["billingdebtor"],
              to: "/panel/listbillingdebtor",
            },
            // {
            //   id: 84,
            //   label: "Reconsiliation Billing",
            //   to: "/panel/reconsiliation",
            // },
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
          label: "Merchants",
          to: "/panel/merchants",
          openChild: false,
          childs: [],
        },
        {
          id: 2,
          label: "Order List",
          to: "/panel/listoforder",
          openChild: false,
          childs: [],
        },
        {
          id: 3,
          label: "Financial Report",
          to: "/panel/merchantreport",
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
          {submenu.label}&nbsp;
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
          {submenu.label}
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
                {submenu.label}
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
              {menu.label} {this.iconBadge()}
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
            {menu.label}
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
            {menu.label} <div className="chevron-container"></div>
          </div>
        </Link>
      );
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
