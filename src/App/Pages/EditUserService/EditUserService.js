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

class EditUserService extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'edituserservice');
		this.state = {
			userserviceid: props.match.params.userserviceid,
			userShow: [],
			dataCompany: [],
			dataTeknisi:[],
			phoneno: '',
			address:'',
			externalID:'',
			email:'',
			transaksi_date:'',
			transaksi_id:'',
			paid_services:'',
			payment_method:'',
			payment_channel:'',
			status_payment:'',
			payment_date:'',
			total: 0,
			servicecentercategoryid: 0,
			serviceCenterCategoryShow: [],
			requestdate: moment(),
			note: '',
			companyid: '',
			companyname: '',
			teknisiid:'',
			nameteknisi: '',
			customerid: '',
			customerIDShow: [],
			assigned: '',
			assignedShow: [],
			status: false,
			communityid: 0,
			userservicedetailid: 0,
			servicecenterid: 0,
			serviceCenterShow: [],
			servicecenterprice: 0,
			quantity: 0,
			tableOrder: [],
			modalIsOpen: false,
			status_order: false
		}
		
		this.tableColumns = [
		{
			Header: this.language.columnservicecenter,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'servicecentername',
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
		// {
        //     Header: this.language.columnaction,
		// 	headerStyle: {fontWeight : 'bold'},
        //     accessor: '',
		// 	style: { textAlign: "center"},
        //     Cell : e => (
        //         <div>
		// 			<Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
        //             <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
        //         </div>
        //     )
		// }
	]
		
		this.statusHandleChecked = this.statusHandleChecked.bind(this);
    }
	
	closeModal() {
		this.setState({modalIsOpen: false});
		this.setState({servicecenterid : 0});
		this.setState({quantity : 0});
		this.setState({price : 0});
	}
	
	selectServiceCenter = (servicecentercategoryid) =>{
		axios.post(serverUrl+'servicecenter_list_by_category.php', {filter: '', servicecentercategoryid: servicecentercategoryid},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ serviceCenterShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
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


	
	selectCustomerID = () =>{
		axios.post(serverUrl+'userdetail_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ customerIDShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectServiceCenterCategory = () =>{
		axios.post(serverUrl+'servicecentercategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ serviceCenterCategoryShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectAssigned = () =>{
		axios.post(serverUrl+'user_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ assignedShow: response.data.records});
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

	selectCompany = () =>{
		axios.post(serverUrl+'company_select_list.php', {},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				console.log(response);
                this.setState({ dataCompany: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
  }

  selectTeknisi = () =>{
	axios.post(serverUrl+'teknisi_select_list.php', {
		companyid : this.state.companyid
	},
	{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
		.then( (response) =>{
			console.log(response);
			this.setState({ dataTeknisi: response.data.records});
		})
		.catch( (error) =>{
			console.log(error);
			alert(error);
		});
}
	
	loadServiceCenterPrice = (servicecenterid) => {
		axios.post(serverUrl+'get_servicecenterprice.php', {servicecenterid: servicecenterid},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response)=>{
				this.setState({ servicecenterprice: response.data.records.price, price: this.state.quantity * response.data.records.price });
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	updateRequestDate = (requestdate) => {
        this.setState({ requestdate: requestdate });
    }
	
	changeServiceCenter = (servicecenterid)=>{
        this.setState({servicecenterid: servicecenterid});
		this.loadServiceCenterPrice(servicecenterid);
    }
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
	}
	
	changeCompany = (companyid)=>{


		setTimeout(() => {

		var dataCompany = this.state.dataCompany;
		
		for (var i = 0; i < dataCompany.length; i++){
			if(dataCompany[i].companyid == companyid){
				companyid = dataCompany[i].companyid;
			}
		}
		this.setState({companyid: companyid});

			// let DataCompany = this.state.dataCompany;
			console.log(dataCompany);
			// this.setState({companyid: companyid});
			console.log(this.state.companyid);
		}, 200);
		
		axios.post(serverUrl+'teknisi_select_list.php', {
			companyid : companyid
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
			.then( (response) =>{
				console.log(response);
				this.setState({ dataTeknisi: response.data.records});
			})
			.catch( (error) =>{
				console.log(error);
				alert(error);
			});
		
	}
	
	changeTeknisi = (teknisiid)=>{
        this.setState({teknisiid: teknisiid});
    }
	
	changeCustomerID = (customerid)=>{
        this.setState({customerid: customerid});
    }
	
	changeServiceCenterCategory = (servicecentercategoryid)=>{
        this.setState({servicecentercategoryid: servicecentercategoryid});
    }
	
	changeAssigned = (assigned)=>{
        this.setState({assigned: assigned});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	statusHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({status: checked});
		this.setState({status_services: checked});
	}

	statusOrderHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({status_order: checked});
	}
	
	 
	checkData = () => {
		const {companyid} = this.state;
		const {teknisiid} = this.state;
		if(companyid == '' || teknisiid == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	addOrder = () =>{
		const {servicecenterid} = this.state;
		
		if(servicecenterid == 0){
			return false;
		}
			
		else{
			this.orderSave();
		}
	}
	
	orderSave = () =>{		
		axios.post(serverUrl+'userservicedetail_insert_update.php', {
			userservicedetailid: 0,
			userserviceid: this.state.userserviceid,
			servicecenterid: this.state.servicecenterid,
			quantity: this.state.quantity,
			price: this.state.price
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				alert(this.language.savesuccess);
				this.setState({servicecenterid : 0});
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
		axios.post(serverUrl+'userservicedetail_list.php', {
			userserviceid: this.state.userserviceid
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
				
				// this.setState({total : temptotal});
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
				onClick: (userservicedetailid) => {
					var userservicedetailid = item.userservicedetailid;
					this.deleteOrder(userservicedetailid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	deleteOrder = (userservicedetailid) => {
		axios.post(serverUrl+'userservicedetail_delete.php', {
            userservicedetailid: userservicedetailid
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
		this.setState({userservicedetailid: row.userservicedetailid});
		this.setState({servicecenterid: row.servicecenterid});
		this.setState({quantity: row.quantity});
		this.setState({price: row.price});
		this.changeServiceCenter(row.servicecenterid);
    }
	
	doEditOrder = (userservicedetailid) => {
		const {servicecenterid} = this.state;
		
		if(servicecenterid == 0){
			return false;
		}
		
		else {
			axios.post(serverUrl+'userservicedetail_insert_update.php', {			
				userservicedetailid: this.state.userservicedetailid,
				userserviceid: this.state.userserviceid,
				servicecenterid: this.state.servicecenterid,
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
		this.selectCompany();
		this.selectTeknisi();
		this.selectServiceCenterCategory();
		this.selectCustomerID();
		this.selectAssigned();
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'userservice_get_by_id.php', {
            userserviceid: this.state.userserviceid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
				console.log(response);
				this.setState({userserviceid : response.data.record.userserviceid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({servicecentercategoryid : response.data.record.servicecentercategoryid});
				this.setState({requestdate : response.data.record.requestdate});
				this.setState({total : response.data.record.price});
				this.setState({note : response.data.record.note});
				this.setState({customerid : response.data.record.customerid});
				this.setState({assigned : response.data.record.assigned});
				this.setState({address : response.data.record.address});
				this.setState({status_services : response.data.record.status_services===1?true:false});
				this.setState({status_order : response.data.record.canceled===1?true:false});
				this.setState({externalID : response.data.record.externalID});
				this.setState({email : response.data.record.email});
				this.setState({transaksi_date : response.data.record.transaksi_date});
				this.setState({transaksi_id : response.data.record.transaksi_id});
				this.setState({paid_services : response.data.record.paid_services});
				this.setState({payment_method : response.data.record.payment_method});
				this.setState({payment_channel : response.data.record.payment_channel});
				this.setState({status_payment : response.data.record.status_payment});
				this.setState({payment_date : response.data.record.payment_date});
				this.setState({status : response.data.record.status===1?true:false});
				this.setState({communityid : response.data.record.communityid});
				this.setState({companyid : response.data.record.companyid});
				this.setState({companyname : response.data.record.companyname});
				this.setState({teknisiid : response.data.record.teknisiid});
				this.setState({nameteknisi : response.data.record.nameteknisi});
				this.loadOrder();
				this.changeServiceCenterCategory(this.state.servicecentercategoryid);
				this.selectServiceCenter(this.state.servicecentercategoryid);
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'userservice_update.php', {			
			userserviceid: this.state.userserviceid,
			companyid : this.state.companyid,
			teknisiid : this.state.teknisiid,
			status_services: this.state.status_services ? 1:0,
			status_order: this.state.status_order ? 1:0,

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
			<div className="detail-title">{this.language.userservicedetail}</div>
			<div className="detail-info-input">
				<FormGroup>
					{/* <table>
						<tbody>
							<tr>
								<td><Label for="servicecenterid">{this.language.fieldservicecenter}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.servicecenterid} valueColumn={'servicecenterid'} showColumn={'servicecentername'} columns={['servicecentername']} data={this.state.serviceCenterShow} onChange={this.changeServiceCenter} /></td>
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
					</table> */}
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
								<td><Label for="servicecenterid">{this.language.fieldservicecenter}</Label></td>
								<td><SelectMultiColumn width={200} value={this.state.servicecenterid} valueColumn={'servicecenterid'} showColumn={'servicecentername'} columns={['servicecentername']} data={this.state.serviceCenterShow} onChange={this.changeServiceCenter} /></td>
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
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="requestdate">{this.language.fieldrequestdate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.requestdate)}  onChange={this.updateRequestDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="phoneno">{this.language.fieldphoneno}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.phoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.userShow} disabled="disabled" onChange={this.changeUser} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="servicecentercategory">{this.language.fieldcategory}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.servicecentercategoryid} valueColumn={'servicecentercategoryid'} showColumn={'servicecentercategoryname'} columns={['servicecentercategoryname']} data={this.state.serviceCenterCategoryShow} disabled="disabled"  onChange={this.changeServiceCenterCategory} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="total">Total Price</Label></td>
                            <td><Input type="number" disabled="disabled" name="total" id="total" min="0" placeholder="Rp." value={this.state.total} onChange = {(event) => this.setState({ total : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="note">{this.language.fieldnote}</Label></td>
                            <td><Input type="textarea" name="note" id="note" placeholder={this.language.fieldnote} value={this.state.note} disabled="disabled" onChange = {(event) => this.setState({ note : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="address">Address</Label></td>
                            <td><Input type="textarea" name="address" id="address" placeholder={this.language.fieldnote} value={this.state.address} disabled="disabled" onChange = {(event) => this.setState({ address : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="externalID">Invoice Number</Label></td>
                            <td><Input type="text" disabled="disabled" name="externalID" id="externalID" placeholder="Invoice Number" value={this.state.externalID}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="payment_method">Payment Method</Label></td>
                            <td><Input type="text" disabled="disabled" name="payment_method" id="payment_method" placeholder="Payment Method" value={this.state.payment_method}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="payment_method">Payment Channel</Label></td>
                            <td><Input type="text" disabled="disabled" name="payment_channel" id="payment_channel" placeholder="Payment Channel" value={this.state.payment_channel}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="payment_amount">Payment Amount Services</Label></td>
                            <td><Input type="text" disabled="disabled" name="payment_amount" id="payment_amount" placeholder="Payment Amount" value={this.state.paid_services}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status_payment">Status Payment Services</Label></td>
                            <td><Input type="text" disabled="disabled" name="status_payment" id="status_payment" placeholder="Status Payment" value={this.state.status_payment}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="paymentDate">Payment Paid Date</Label></td>
                            <td><Input type="text" disabled="disabled" name="paymentDate" id="paymentDate" placeholder="Payment Paid Date" value={this.state.payment_date}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                          	<td><Label for="companyid">Company Name</Label></td>
                          	<td><SelectMultiColumn width={300} value={this.state.companyid} valueColumn={'companyid'} showColumn={'companyname'} columns={['companyname']} data={this.state.dataCompany} onChange={this.changeCompany} /></td>
                     	 </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="teknisiid">Teknisi</Label></td>
                            <td><SelectMultiColumn width={300} value={this.state.teknisiid} valueColumn={'teknisiid'} showColumn={'nameteknisi'} columns={['nameteknisi']} data={this.state.dataTeknisi} onChange={this.changeTeknisi} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status_services">Status Services</Label></td>
                            <td><Input type="checkbox" style={{height:16, width:16}} className="custom-checkbox" name="status_services" id="status_services" checked={this.state.status_services} onChange={(event)=>this.statusHandleChecked(event)}/>&nbsp;<span>Done</span></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status_services">Status Order Service</Label></td>
                            <td><Input type="checkbox" style={{height:16, width:16}} className="custom-checkbox" name="status_services" id="status_services" checked={this.state.status_order} onChange={(event)=>this.statusOrderHandleChecked(event)}/>&nbsp;<span>Canceled</span></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                    </table>
					{this.renderOrderDetail()}
					{this.renderModal()}
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.onSubmit()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditUserService;