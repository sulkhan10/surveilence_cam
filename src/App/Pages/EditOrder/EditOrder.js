import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; 
import ReactTable from "react-table";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class EditOrder extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editorder');
		this.state = {
			orderid: props.match.params.orderid,
			userShow: [],
			phoneno: '',
			total: 0,
			status: 0,
			communityid: 0,
			communityShow: [],
			orderdetailid: 0,
			merchantid: 0,
			merchantShow: [],
			commodityid: 0,
			commodityShow: [],
			addresslist: [],
			addressselected: '',
			address: '',
			commodityprice: 0,
			price: 0,
			quantity: 0,
			tableOrder: [],
			modalIsOpen: false
		}
		
		this.tableColumns = [ {
            Header: this.language.columnmerchant,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'merchantname',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columncommodity,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'commodityname',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columnprice,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'price',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columnquantity,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'quantity',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
					<Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
                </div>
            )
        }]
    }
	
	closeModal() {
		this.setState({modalIsOpen: false});
		this.setState({merchantid : 0});
		this.setState({commodityid : 0});
		this.setState({quantity : 0});
		this.setState({price : 0});
	}
	
	handleStatusChange(e){
		this.setState({
		  status: e.target.value
		})
	}

	selectUser = () =>{
		axios.post(serverUrl+'user_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ userShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectCommunity = () =>{
		axios.post(serverUrl+'community_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ communityShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectAddress = (phoneno) =>{
		axios.post(serverUrl+'address_list.php', {phoneno: phoneno},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ addresslist: response.data.records});
				if(this.state.addresslist !== undefined && this.state.addresslist.length > 0){
					this.changeAddress(response.data.records[0].label);
				}
				
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectMerchant = () =>{
		axios.post(serverUrl+'merchant_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ merchantShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectCommodity = (merchantid) =>{
		axios.post(serverUrl+'get_commodity.php', {merchantid: merchantid},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ commodityShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	loadCommodityPrice = (commodityid) => {
		axios.post(serverUrl+'get_commodityprice.php', {commodityid: commodityid},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response)=>{
				this.setState({ commodityprice: response.data.records.price, price: this.state.quantity * response.data.records.price });
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	firstChangeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
		this.selectAddress(phoneno);
    }
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
		this.setState({address: ''});
		this.selectAddress(phoneno);
    }
	
	changeAddress = (addressselected)=>{
        this.setState({addressselected: addressselected});
		
		let check = this.state.addresslist;
		
		for(var i=0;i<check.length;i++){
			if(check[i].label == addressselected){
				this.setState({address: check[i].address});
			}
		}
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	changeMerchant = (merchantid)=>{
        this.setState({merchantid: merchantid});
		this.selectCommodity(merchantid);
    }
	
	changeCommodity = (commodityid)=>{
        this.setState({commodityid: commodityid});
		this.loadCommodityPrice(commodityid);
    }
	
	changeQuantity = (event) =>{
		let qty = event.target.value;
		if(isNaN(qty)){
			qty = 0;
		}

		let total = qty * this.state.commodityprice;

		this.setState({quantity: qty});
		this.setState({price: total});
	}
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {address} = this.state;
		const {communityid} = this.state;
		
		if(phoneno == '' || address == '' || communityid == 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	addOrder = () =>{
		const {merchantid} = this.state;
		const {commodityid} = this.state;
		
		if(merchantid == null || merchantid == 0 || commodityid == null || commodityid == 0){
			return false;
		}
			
		else{
			this.orderSave();
		}
	}
	
	orderSave = () =>{		
		axios.post(serverUrl+'orderdetail_insert_update.php', {
			orderdetailid: 0,
			orderid: this.state.orderid,
			merchantid: this.state.merchantid,
			commodityid: this.state.commodityid,
			quantity: this.state.quantity,
			price: this.state.price
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				alert(this.language.savesuccess);
				this.setState({merchantid : 0});
				this.setState({commodityid : 0});
				this.setState({quantity : 0});
				this.setState({price : 0});
				this.loadOrder();
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	loadOrder = () =>{
		axios.post(serverUrl+'orderdetail_list.php', {
			orderid: this.state.orderid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				var temp = this.state.tableOrder;
				temp = response.data.records;
				this.setState({tableOrder : temp});
				
				let temptotal = 0;
				
				for(var i=0; i<response.data.records.length; i++){
					temptotal += response.data.records[i].price;
				}
				
				this.setState({total : temptotal});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	doRowDelete = (item) => {   
		
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (orderdetailid) => {
					var orderdetailid = item.orderdetailid;
					this.deleteOrder(orderdetailid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	deleteOrder = (orderdetailid) => {
		axios.post(serverUrl+'orderdetail_delete.php', {
            orderdetailid: orderdetailid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				alert(this.language.deletesuccess);
				this.loadOrder();
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	doRowEdit = (row) => {
		this.setState({modalIsOpen: true});
		this.setState({orderdetailid: row.orderdetailid});
		this.setState({merchantid: row.merchantid});
		this.setState({commodityid: row.commodityid});
		this.setState({quantity: row.quantity});
		this.setState({price: row.price});
		this.changeMerchant(row.merchantid);
		this.changeCommodity(row.commodityid);
    }
	
	doEditOrder = (orderdetailid) => {
		const {merchantid} = this.state;
		const {commodityid} = this.state;
		
		if(merchantid == null || merchantid == 0 || commodityid == null || commodityid == 0){
			return false;
		}
		
		else {
			axios.post(serverUrl+'orderdetail_insert_update.php', {			
				orderdetailid: this.state.orderdetailid,
				orderid: this.state.orderid,
				merchantid: this.state.merchantid,
				commodityid: this.state.commodityid,
				quantity: this.state.quantity,
				price: this.state.price
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					alert(this.language.savesuccess);
					this.closeModal();
					this.loadOrder();
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	 
	 componentDidMount = () => {
		this.selectUser();
		//this.selectAddress(0);
		this.selectCommunity();
		this.selectMerchant();
		this.selectCommodity(0);
		this.loadOrder();
		this.props.doLoading();
		axios.post(serverUrl+'order_get_by_id.php', {
            orderid: this.state.orderid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
				this.setState({orderid : response.data.record.orderid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({addressselected : response.data.record.label});
				this.setState({address : response.data.record.address});
				this.setState({total : response.data.record.total});
				this.setState({status : response.data.record.status});
				this.setState({communityid : response.data.record.communityid});
				this.firstChangeUser(this.state.phoneno);
				this.changeAddress(this.state.addressselected);
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'order_insert_update.php', {			
			orderid: this.state.orderid,
			phoneno: this.state.phoneno,
			label: this.state.addressselected,
			address: this.state.address,
			total: this.state.total,
			status: this.state.status,
			communityid: this.state.communityid
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
    } 
	
	renderOrderDetail=()=> {
        return (
		<div className="form-detail">
			<div className="detail-title">{this.language.orderdetail}</div>
			<div className="detail-info-input">
				<FormGroup>
					<table>
						<tbody>
							<tr>
								<td><Label for="merchantid">{this.language.fieldmerchant}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.merchantid} valueColumn={'merchantid'} showColumn={'merchantname'} columns={['merchantname']} data={this.state.merchantShow} onChange={this.changeMerchant} /></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="commodityid">{this.language.fieldcommodity}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.commodityid} valueColumn={'commodityid'} showColumn={'commodityname'} columns={['commodityname']} data={this.state.commodityShow} onChange={this.changeCommodity} /></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="quantity">{this.language.fieldquantity}</Label></td>
								<td><Input type="number" min="0" name="quantity" id="quantity" value={this.state.quantity} onChange = {(event) => this.changeQuantity(event)}/></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="price">{this.language.fieldprice}</Label></td>
								<td><Input type="number" disabled="disabled" name="price" id="price" value={this.state.price}/></td>
							</tr>
							<br></br>
							<tr>
								<td></td>
								<td><Button color="success" onClick={() => this.addOrder()}>Add Order</Button></td>
							</tr>
						</tbody>
					</table>
					<br></br>
					<ReactTable data={this.state.tableOrder} columns={this.tableColumns} defaultPageSize={10} />	
				</FormGroup>
			</div>
		</div>
        );
	}
	
	renderModal() {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles}
			>
			<div className="page-header">
                    {this.language.modaltitle} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tbody>
							<tr>
								<td><Label for="merchantid">{this.language.fieldmerchant}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.merchantid} valueColumn={'merchantid'} showColumn={'merchantname'} columns={['merchantname']} data={this.state.merchantShow} onChange={this.changeMerchant} /></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="commodityid">{this.language.fieldcommodity}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.commodityid} valueColumn={'commodityid'} showColumn={'commodityname'} columns={['commodityname']} data={this.state.commodityShow} onChange={this.changeCommodity} /></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="quantity">{this.language.fieldquantity}</Label></td>
								<td><Input type="number" min="0" name="quantity" id="quantity" value={this.state.quantity} onChange = {(event) => this.changeQuantity(event)}/></td>
							</tr>
							<tr>
							&nbsp;
							</tr>
							<tr>
								<td><Label for="price">{this.language.fieldprice}</Label></td>
								<td><Input type="number" min="0" name="price" id="price" value={this.state.price}/></td>
							</tr>
						</tbody>
					</table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.doEditOrder()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
	}

    render() {
        return (
            <div>
                <div className="page-header">
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="phoneno">{this.language.fieldphoneno}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.phoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.userShow} onChange={this.changeUser} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="label">{this.language.fieldlabel}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.addressselected} valueColumn={'label'} showColumn={'label'} columns={['label']} data={this.state.addresslist} onChange={this.changeAddress} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="address">{this.language.fieldaddress}</Label></td>
                            <td><Input type="textarea" disabled="disabled" value={this.state.address} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="total">{this.language.fieldtotal}</Label></td>
                            <td><Input type="number" disabled="disabled" name="total" id="total" value={this.state.total} onChange = {(event) => this.setState({ total : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">{this.language.fieldstatus}</Label></td>
							<td><select onChange = {this.handleStatusChange.bind(this)} value={this.state.status}>
									<option value="0">Pending</option>
									<option value="1">Paid</option>
									<option value="2">Cancelled</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
                    </table>
					{this.renderOrderDetail()}
					{this.renderModal()}
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditOrder;