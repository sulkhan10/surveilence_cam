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

class InputOrder extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputorder');
		this.state = {
			orderid: 0,
			userShow: [],
			phoneno: '',
			total: 0,
			status: 0,
			communityid: 0,
			communityShow: [],
			addresslist: [],
			addressselected: '',
			address: ''
		}
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
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	componentDidMount = () =>{
		this.selectUser();
		this.selectAddress(0);
		this.selectCommunity();
	}
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
		this.selectAddress(phoneno);
		this.setState({address: ''});
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
                            <td><Input type="number" disabled="disabled" name="total" id="total" min="0" placeholder="Rp." value={this.state.total} onChange = {(event) => this.setState({ total : event.target.value }) }/></td>
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
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default InputOrder;