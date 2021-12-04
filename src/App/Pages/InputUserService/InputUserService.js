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

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class InputUserService extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputuserservice');
		this.state = {
			userserviceid: 0,
			userShow: [],
			phoneno: '',
			total: 0,
			servicecentercategoryid: 0,
			serviceCenterCategoryShow: [],
			requestdate: moment(),
			note: '',
			customerid: '',
			customerIDShow: [],
			assigned: '',
			assignedShow: [],
			status: false,
			communityid: 0,
		}
		this.statusHandleChecked = this.statusHandleChecked.bind(this);
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
	
	updateRequestDate = (requestdate) => {
        this.setState({ requestdate: requestdate });
    }
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
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
	}
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {customerid} = this.state;
		const {servicecentercategoryid} = this.state;
		const {assigned} = this.state;
		const {note} = this.state;
		
		if(phoneno == '' || customerid == '' || servicecentercategoryid == 0 || assigned == '' || note == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	componentDidMount = () =>{
		this.selectUser();
		this.selectServiceCenterCategory();
		this.selectCustomerID();
		this.selectAssigned();
		this.selectCommunity();
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'userservice_insert_update.php', {			
			userserviceid: this.state.userserviceid,
			phoneno: this.state.phoneno,
			price: this.state.total,
			servicecentercategoryid: this.state.servicecentercategoryid,
			requestdate: this.state.requestdate,
			note: this.state.note,
			customerid: this.state.customerid,
			assigned: this.state.assigned,
			status: this.state.status ? 1:0,
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
                            <td><Label for="servicecentercategory">{this.language.fieldcategory}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.servicecentercategoryid} valueColumn={'servicecentercategoryid'} showColumn={'servicecentercategoryname'} columns={['servicecentercategoryname']} data={this.state.serviceCenterCategoryShow} onChange={this.changeServiceCenterCategory} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="total">{this.language.fieldprice}</Label></td>
                            <td><Input type="number" disabled="disabled" name="total" id="total" min="0" placeholder="Rp." value={this.state.total} onChange = {(event) => this.setState({ total : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="requestdate">{this.language.fieldrequestdate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.requestdate)} onChange={this.updateRequestDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="note">{this.language.fieldnote}</Label></td>
                            <td><Input type="textarea" name="note" id="note" placeholder={this.language.fieldnote} value={this.state.note} onChange = {(event) => this.setState({ note : event.target.value }) }/></td>
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
                            <td><Label for="assigned">{this.language.fieldassigned}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.assigned} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.assignedShow} onChange={this.changeAssigned} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">{this.language.fieldstatus}</Label></td>
                            <td><Input type="checkbox" className="custom-checkbox" name="status" id="status" checked={this.state.status} onChange={(event)=>this.statusHandleChecked(event)}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
                    </table>
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default InputUserService;