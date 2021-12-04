import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { serverUrl } from '../../../config.js';
import './Menu.style.css';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class Menu extends Component {

    constructor(props) {
        super(props);

        this.language = getLanguage(activeLanguage, 'Menu');
		
        this.state = {
			role: 0,
			menus: [],
            loginInfo: props.loginInfo,
            community: props.community,
            currentParent:0,
            currentChild:-1
        }
        this.selectRole(props.loginInfo);
    }
	
	componentWillReceiveProps = (props) =>{
        if(props.community !== this.state.community){
            this.selectRole(props.loginInfo, props.community);
        }
        this.setState({loginInfo: props.loginInfo, community: props.community});
	}
	
	selectRole = (loginInfo, community) =>{
		this.setState({role: loginInfo.logintype});
		this.selectType(loginInfo.logintype, community);

	}
	
	selectType = (role, community) =>{
		if(role === 1){
			this.menuSuperAdmin(community);
		}
		else {
			this.menuSubAdmin(community);
		}
	}

    toogleSubMenu = (menu, idx) => {
        let menus = this.state.menus;

        menus[idx].openChild = !menus[idx].openChild;
        this.setState({ menus: menus });
    }
	
	menuSuperAdmin = (community) =>{
        let tmpMenu = [];
        tmpMenu.push(
            {
                id: 0, label: this.language['dashboard'], to: '/smartcp/panel/dashboard', openChild: false, childs: []
            },
            {
                id: 1, label: this.language['master'], to: '', openChild: false, childs:
                    [
                        { id: 0, label: this.language['community'], to: '/panel/listcommunity' },
                        { id: 1, label: this.language['tag'], to: '/panel/listtag' },
                        { id: 2, label: this.language['admin'], to: '/panel/listadmin' },
                        { id: 3, label: this.language['user'], to: '/panel/listuser' },
                    ]
            },
            {
                id: 3, label: this.language['category'], to: '', openChild: false, childs:
                    [
                        { id: 0, label: this.language['newscategory'], to: '/panel/listnewscategory' },
                        /*{ id: 1, label: this.language['companycategory'], to: '/panel/listcompanycategory' },
                        { id: 2, label: this.language['productcategory'], to: '/panel/listproductcategory' },
                        { id: 3, label: this.language['servicecategory'], to: '/panel/listservicecategory' },
                        { id: 4, label: this.language['projectcategory'], to: '/panel/listprojectcategory' },
                        { id: 5, label: this.language['investmentcategory'], to: '/panel/listinvestmentcategory' },
                        { id: 6, label: this.language['talentcategory'], to: '/panel/listtalentcategory' },
                        { id: 7, label: this.language['downloadcategory'], to: '/panel/listdownloadcategory' },*/
                        { id: 8, label: this.language['merchantcategory'], to: '/panel/listmerchantcategory' },
                        { id: 9, label: this.language['commoditycategory'], to: '/panel/listcommoditycategory' },
                        { id: 10, label: this.language['onlinestorecategory'], to: '/panel/listonlinestorecategory' },
						{ id: 11, label: this.language['billingcategory'], to: '/panel/listbillingcategory' }
                    ]
            },
            {
                id: 2, label: this.language['parkinformation'], to: '', openChild: false, childs:
                    [
                        { id: 12, label: this.language['parkintroduction'], to: '/panel/parkintroduction' },
                        { id: 13, label: this.language['servicephilosophy'], to: '/panel/servicephilosophy' },
                        { id: 14, label: this.language['parkpositioning'], to: '/panel/parkpositioning' }
                    ]
            },
            {
                id: 5, label: this.language['parkenterprise'], to: '', openChild: false, childs:
                    [
                        { id: 15, label: this.language['companyintroduction'], to: '/panel/companyintroduction' },
                        { id: 16, label: this.language['businesscase'], to: '/panel/businesscase' },
                        { id: 17, label: this.language['corporatecontact'], to: '/panel/corporatecontact' }
                    ]
            },
            {
                id: 4, label: this.language['news'], to: '/panel/news', openChild: false, childs: []
            }
			
        )
         /*if(community.isdefault == 1){
            tmpMenu.push(
                {
                    id: 9, label: this.language['company'], to: '/panel/listcompany', openChild: false, childs: []
                },
                {
                    id: 10, label: this.language['product'], to: '/panel/listproduct', openChild: false, childs: []
                },
                {
                    id: 11, label: this.language['service'], to: '/panel/listservice', openChild: false, childs: []
                },
				{
                    id: 12, label: this.language['project'], to: '/panel/listproject', openChild: false, childs: []
                },
				{
                    id: 13, label: this.language['investment'], to: '/panel/listinvestment', openChild: false, childs: []
                },
				{
                    id: 14, label: this.language['talent'], to: '/panel/listtalent', openChild: false, childs: []
                },
            )
        } */
        tmpMenu.push(
            {
                id: 16, label: this.language['merchant'], to: '/panel/listmerchant', openChild: false, childs: []
            },
            {
                id: 18, label: this.language['marketplaceevent'], to: '/panel/listmarketplaceevent', openChild: false, childs: []
            },
            {
                id: 19, label: this.language['marketplaceadvertisement'], to: '/panel/listmarketplaceadvertisement', openChild: false, childs: []
            },
            {
                id: 20, label: this.language['onlinestore'], to: '/panel/listonlinestore', openChild: false, childs: []
            },
			{
                id: 21, label: this.language['moments'], to: '/panel/listmoments', openChild: false, childs: []
            },
			{
                id: 22, label: this.language['billing'], to: '/panel/listbilling', openChild: false, childs: []
            },
			/*{
                id: 1000, label: 'Example', to: '/panel/example', openChild: false, childs: []
            }*/ 
        )


		this.setState({
			menus: tmpMenu
		});
	}
	
	menuSubAdmin = (role) =>{
		this.setState({
		menus: [
               /* {
                    id: 0, label: this.language['company'], to: '/panel/listcompany', openChild: false, childs: []
                },
                {
                    id: 1, label: this.language['product'], to: '/panel/listproduct', openChild: false, childs: []
                },
                {
                    id: 2, label: this.language['service'], to: '/panel/listservice', openChild: false, childs: []
                },
				{
                    id: 3, label: this.language['project'], to: '/panel/listproject', openChild: false, childs: []
                },
				{
                    id: 4, label: this.language['investment'], to: '/panel/listinvestment', openChild: false, childs: []
                },
				{
                    id: 5, label: this.language['talent'], to: '/panel/listtalent', openChild: false, childs: []
                }, */
				{
                    id: 0, label: this.language['download'], to: '/panel/listdownload', openChild: false, childs: []
                },
				{
                    id: 1, label: this.language['merchant'], to: '/panel/listmerchant', openChild: false, childs: []
                },
				/* {
                    id: 8, label: this.language['commodity'], to: '/panel/listcommodity', openChild: false, childs: []
                }, */
				{
                    id: 2, label: this.language['marketplaceevent'], to: '/panel/listmarketplaceevent', openChild: false, childs: []
                },
				{
                    id: 3, label: this.language['marketplaceadvertisement'], to: '/panel/listmarketplaceadvertisement', openChild: false, childs: []
                },
				{
					id: 4, label: this.language['moments'], to: '/panel/listmoments', openChild: false, childs: []
				},
				{
					id: 5, label: this.language['billing'], to: '/panel/listbilling', openChild: false, childs: []
				},
				/* {
                    id: 14, label: 'Example', to: '/panel/example', openChild: false, childs: []
                } */
		] })
    }
    
    updateParent = (id)=>{
        this.setState({currentParent : id, currentChild: -1});
    }
    updateChild = (id)=>{
        this.setState({currentChild : id, currentParent: -1});
    }

    _renderSubMenu = (menu, idx) => {
        if (menu.openChild) {
            return (
                <div className="submenu-container">
                    {menu.childs.map((submenu, i) =>
                        <Link key={submenu.id} to={submenu.to} onClick={()=>this.updateChild(submenu.id)} className={`link-custom`} ><div className={`submenu ${this.state.currentChild === submenu.id? 'menu-active' : ''} `}>{submenu.label}</div></Link>
                    )}
                </div>
            )
        } else {
            return ('');
        }
    }

    _renderChevronIcon = (menu) => {
        if (menu.openChild) {
            return (
                <FontAwesomeIcon icon="chevron-down" />
            )
        } else {
            return (
                <FontAwesomeIcon icon="chevron-left" />
            )
        }

    }

    _renderMenu = (menu, i) => {
        if (menu.to === '') {
            return (
                <div key={menu.id}>
                    <div className="menu menu-parent" onClick={() => this.toogleSubMenu(menu, i)}>{menu.label} <div className="chevron-container">{this._renderChevronIcon(menu)}</div></div>
                    {this._renderSubMenu(menu, i)}
                </div>
            )
        } else {
            return (
                <Link key={menu.id} to={menu.to} onClick={()=>this.updateParent(menu.id)} className={`link-custom`}><div className={`menu ${this.state.currentParent === menu.id? 'menu-active' : ''} `} >{menu.label} <div className="chevron-container"></div></div></Link>
            )
        }
    }

    render() {
        return (
            <div className="menu-container">
                {this.state.menus.map((menu, i) =>
                    this._renderMenu(menu, i)
                )}
            </div>
        );
    }
}
export default Menu;