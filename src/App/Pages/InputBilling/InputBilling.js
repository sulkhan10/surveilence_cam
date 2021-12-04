import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import './InputBilling.style.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class InputBilling extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputbilling');
		this.state = {
			userbillingid: 0,
			userShow: [],
			phoneno: '',
			billingcategoryid: '',
			billingCategoryShow: [],
			month: 1,
			year: 2018,
			customerid: '',
			address: '',
			customerIDShow: [],
			amount: 0,
			ispaid: false,
			communityid: '',
			modalIsOpen: false,
			billingcategoryname: '',
			icon: [],
			isavailable: false
		}
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	onUploadImage = (result) => {
        this.setState({ icon: result });
    }
	
	availableHandleChecked (isavailable) {
		this.setState({isavailable: !this.state.isavailable});
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	addBillingCategory = (billingcategoryid) => {
		const {billingcategoryname} = this.state;
		
		if(billingcategoryname == null || billingcategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'billingcategory_insert_update.php', {			
				billingcategoryid: this.state.billingcategoryid,
				billingcategoryname: this.state.billingcategoryname,
				icon: this.state.icon,
				isavailable: this.state.isavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({billingcategoryid: response.data.record});
					this.selectBillingCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	
	selectBillingCategory = () =>{
		axios.post(serverUrl+'billingcategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ billingCategoryShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	handleMonthChange(e){
		this.setState({
		  month: e.target.value
		})
	}
	
	handleYearChange(e){
		this.setState({
		  year: e.target.value
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
	
	selectCustomerID = (phoneno) =>{
		axios.post(serverUrl+'userdetail_list.php', {filter: phoneno},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ customerIDShow: response.data.records});
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
	
	componentDidMount = () =>{
		this.selectUser();
		this.selectBillingCategory();
		//this.selectCustomerID();
		this.selectCommunity();
	}
	
	changeUser = (phoneno)=>{
		this.setState({phoneno: phoneno});
		this.selectCustomerID(phoneno);
    }
	
	changeCustomerID = (customerid)=>{

		let address = '';
		for(let i=0; i< this.state.customerIDShow.length;i++){
			if(this.state.customerIDShow[i].customerid === customerid){
				address = this.state.customerIDShow[i].address;
				break;
			}
		}
		//console.log('address : '+address);
        this.setState({customerid: customerid, address: address});
    }
	
	changeBillingCategory = (billingcategoryid)=>{
        this.setState({billingcategoryid: billingcategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	paidHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({ispaid: checked});
	}
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {customerid} = this.state;
		const {billingcategoryid} = this.state;
		
		if(phoneno == '' || customerid == '' || billingcategoryid == 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'billing_insert_update.php', {			
			userbillingid: this.state.userbillingid,
			phoneno: this.state.phoneno,
			billingcategoryid: this.state.billingcategoryid,
			month: this.state.month,
			year: this.state.year,
			customerid: this.state.customerid,
			amount: this.state.amount,
			ispaid: this.state.ispaid ? 1:0,
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
						<tr>
                            <td><Label for="billingcategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="billingcategoryname" id="billingcategoryname" value={this.state.billingcategoryname} placeholder="Billing Category" onChange = {(event) => this.setState({ billingcategoryname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.icon} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.modalfieldavailable}</Label></td>
                            <td><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={this.availableHandleChecked}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addBillingCategory()}>{this.language.modalsubmit}</Button>
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
                            <td><SelectMultiColumn width={200} value={this.state.phoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name', 'phoneno']} data={this.state.userShow} onChange={this.changeUser} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="billingcategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.billingcategoryid} valueColumn={'billingcategoryid'} showColumn={'billingcategoryname'} columns={['billingcategoryname']} data={this.state.billingCategoryShow} onChange={this.changeBillingCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="month">{this.language.fieldmonth}</Label></td>
							<td>
								<select onChange = {this.handleMonthChange.bind(this)} value={this.state.month}>
									<option value="1">January</option>
									<option value="2">February</option>
									<option value="3">March</option>
									<option value="4">April</option>
									<option value="5">May</option>
									<option value="6">June</option>
									<option value="7">July</option>
									<option value="8">August</option>
									<option value="9">September</option>
									<option value="10">October</option>
									<option value="11">November</option>
									<option value="12">December</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="year">{this.language.fieldyear}</Label></td>
							<td><select onChange = {this.handleYearChange.bind(this)} value={this.state.year}>
									<option value="2018">2018</option>
									<option value="2019">2019</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="customerid">{this.language.fieldcustomerid}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.customerid} valueColumn={'customerid'} showColumn={'customerid'} columns={['customerid']} data={this.state.customerIDShow} onChange={this.changeCustomerID} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="customerid">{this.language.fieldaddress}</Label></td>
                            <td><textarea className="textarea-custom-readonly" rows="3" value={this.state.address} readOnly></textarea></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="amount">{this.language.fieldamount}</Label></td>
                            <td><Input type="number" name="amount" id="amount" placeholder="Rp." value={this.state.amount} onChange = {(event) => this.setState({ amount : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="ispaid">{this.language.fieldstatus}</Label></td>
                            <td><Input type="checkbox" className="custom-checkbox" name="ispaid" id="ispaid" checked={this.state.ispaid} onChange={(event)=>this.paidHandleChecked(event)}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
                    </table>
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
export default InputBilling;