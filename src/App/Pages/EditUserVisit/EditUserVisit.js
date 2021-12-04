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
import PictureUploader from '../../Components/PictureUploader/PictureUploader';

class EditUserVisit extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'edituservisit');
		this.state = {
			uservisitid: props.match.params.uservisitid,
			hostShow: [],
			hostphoneno: '',
			addressShow: [],
			address: '',
			visit: moment(),
			leave: moment(),
			visitorShow: [],
			visitorphoneno: '',
			visitoric: '',
			visitorname: '',
			visitorpic: [],
			remark: '',
			visitorcontact: '',
			communityid: 0,
			communityShow: [],
			datechanged: false
		}
    }
	
	onUploadImage = (result) => {
        this.setState({ visitorpic: result });
    }

	selectVisitor = () =>{
		axios.post(serverUrl+'user_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ visitorShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectHost = () =>{
		axios.post(serverUrl+'user_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ hostShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectAddress = (hostphoneno) =>{
		axios.post(serverUrl+'userdetail_address.php', {phoneno: hostphoneno},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ addressShow: response.data.records});
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
	
	updateVisitDate = (visit) => {
        this.setState({ visit: visit });
		this.setState({ datechanged: true });
    }
	
	updateLeaveDate = (leave) => {
        this.setState({ leave: leave });
		this.setState({ datechanged: true });
    }
	
	changeHost = (hostphoneno)=>{
        this.setState({hostphoneno: hostphoneno});
		this.selectAddress(hostphoneno);
    }
	
	changeVisitor = (visitorphoneno)=>{
        this.setState({visitorphoneno: visitorphoneno});
    }
	
	changeAddress = (address)=>{
        this.setState({address: address});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	 
	checkData = () => {
		const {hostphoneno} = this.state;
		const {address} = this.state;
		const {visitorphoneno} = this.state;
		const {visitoric} = this.state;
		const {visitorname} = this.state;
		const {visitorpic} = this.state;
		const {visitorcontact} = this.state;
		const {remark} = this.state;
		const {communityid} = this.state;
		
		if(hostphoneno == '' || address == '' || visitorphoneno == '' || visitoric == '' || visitorname == '' || visitorpic == '' || visitorcontact == '' || remark == '' || communityid == 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.validate();
		}
	}
	
	validate=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.visit);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.leave);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+monthin+"-"+datein;
		checkout = yearout+"-"+monthout+"-"+dateout;
		
		if(checkout >= checkin){
			this.onSubmit();
		}

		else{
			alert(this.language.error);
		}
    }
	
	validateWithoutChange=()=>{
		if(this.state.enddate >= this.state.startdate){
			this.onSubmit();
		}
		
		else{
			alert(this.language.error);
		}
    }
	 
	 componentDidMount = () => {
		this.selectHost();
		this.selectAddress(0);
		this.selectVisitor();
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'uservisit_get_by_id.php', {
            uservisitid: this.state.uservisitid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.visitorpic !== ""){
					tmp.push(response.data.record.visitorpic);
				}
				this.setState({uservisitid : response.data.record.uservisitid});
				this.setState({hostphoneno : response.data.record.hostphoneno});
				this.setState({address : response.data.record.address});
				this.setState({visit : response.data.record.visit});
				this.setState({leave : response.data.record.leave});
				this.setState({visitorphoneno : response.data.record.visitorphoneno});
				this.setState({visitoric : response.data.record.visitoric});
				this.setState({visitorname : response.data.record.visitorname});
				this.setState({visitorpic : tmp});
				this.setState({visitorcontact : response.data.record.visitorcontact});
				this.setState({remark : response.data.record.remark});
				this.setState({communityid : response.data.record.communityid});
				
				this.changeHost(this.state.hostphoneno);
				this.changeAddress(this.state.address);
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'uservisit_insert_update.php', {			
			uservisitid: this.state.uservisitid,
			hostphoneno: this.state.hostphoneno,
			address: this.state.address,
			visit: this.state.visit,
			leave: this.state.leave,
			visitorphoneno: this.state.visitorphoneno,
			visitoric: this.state.visitoric,
			visitorname: this.state.visitorname,
			visitorpic: this.state.visitorpic,
			visitorcontact: this.state.visitorcontact,
			remark: this.state.remark,
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
                            <td><Label for="hostphoneno">{this.language.fieldhost}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.hostphoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.hostShow} onChange={this.changeHost} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="address">{this.language.fieldhostaddress}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.address} valueColumn={'address'} showColumn={'address'} columns={['address']} data={this.state.addressShow} onChange={this.changeAddress} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="visit">{this.language.fieldvisit}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.visit)} onChange={this.updateVisitDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="leave">{this.language.fieldleave}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.leave)} onChange={this.updateLeaveDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="visitorphoneno">{this.language.fieldvisitor}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.visitorphoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.visitorShow} onChange={this.changeVisitor} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="ID">{this.language.fieldvisitoric}</Label></td>
                            <td><Input type="text" name="ID" id="ID" placeholder="ID" value={this.state.visitoric} onChange = {(event) => this.setState({ visitoric : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="visitorname">{this.language.fieldvisitorname}</Label></td>
                            <td><Input type="text" name="visitorname" id="visitorname" placeholder="Name" value={this.state.visitorname} onChange = {(event) => this.setState({ visitorname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.visitorpic} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="visitorcontact">{this.language.fieldvisitorcontact}</Label></td>
                            <td><Input type="text" name="visitorcontact" id="visitorcontact" placeholder="08xxxxxxxxxx" value={this.state.visitorcontact} onChange = {(event) => this.setState({ visitorcontact : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="remark">{this.language.fieldremark}</Label></td>
                            <td><Input type="textarea" name="remark" id="remark" placeholder="Description" value={this.state.remark} onChange = {(event) => this.setState({ remark : event.target.value }) }/></td>
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
export default EditUserVisit;