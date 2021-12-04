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

class EditActivityReservation extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editactivityreservation');
		this.state = {
			activityreservationid: props.match.params.activityreservationid,
			userShow: [],
			phoneno: '',
			startdate: moment(),
			enddate: moment(),
			hourin: 7,
			minutein: 0,
			hourout: 7,
			minuteout: 0,
			activityid: 0,
			activityShow: [],
			price: 0,
			status: 0,
			communityid: 0,
			communityShow: [],
			addon: []
		}
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	availableHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
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
	
	selectActivity = () =>{
		axios.post(serverUrl+'activity_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ activityShow: response.data.records});
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
	
	loadAddOn = () =>{
		axios.post(serverUrl+'activityaddon_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ addon: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	updateStartDate = (startdate) => {
        this.setState({ startdate: startdate });
		this.setState({ datechanged: true });
    }
	
	updateEndDate = (enddate) => {
        this.setState({ enddate: enddate });
		this.setState({ datechanged: true });
    }
	
	handleHourInChange(e){
		this.setState({
		  hourin: e.target.value
		})
	}
	
	handleHourOutChange(e){
		this.setState({
		  hourout: e.target.value
		})
	}
	
	handleMinuteInChange(e){
		this.setState({
		  minutein: e.target.value
		})
	}
	
	handleMinuteOutChange(e){
		this.setState({
		  minuteout: e.target.value
		})
	}
	
	updateQuantity = (i, event) => {
		let val = event.target.value;
		let addon = this.state.addon;
		addon[i].quantity = parseInt(val);
		this.setState({addon : addon});
    }
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
    }
	
	changeActivity = (activityid)=>{
        this.setState({activityid: activityid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {roomid} = this.state;
		const {price} = this.state;
		const {communityid} = this.state;
		
		if(phoneno == '' || roomid == 0 || price == null || communityid == 0){
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
		
		var i = new Date(this.state.startdate);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.enddate);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+monthin+"-"+datein;
		checkout = yearout+"-"+monthout+"-"+dateout;
		
		if(o.getTime() >= i.getTime()){
			if(checkin == checkout){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}else if(this.state.hourin === this.state.hourout){
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					else{
						this.onSubmit();
					}
				}else{
					this.onSubmit();
				}
			}else{
				this.onSubmit();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	 
	 componentDidMount = () => {
		var starttime;
		var start;
		var endtime; 
		var end;
		
		this.selectUser();
		this.selectActivity();
		this.selectCommunity();
		this.loadAddOn();
		this.props.doLoading();
		axios.post(serverUrl+'activityreservation_get_by_id.php', {
            activityreservationid: this.state.activityreservationid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				
				this.setState({activityreservationid : response.data.record.activityreservationid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({startdate : response.data.record.checkin});
				this.setState({enddate : response.data.record.checkout});
				this.setState({activityid : response.data.record.activityid});
				this.setState({price : response.data.record.price});
				this.setState({status : response.data.record.status});
				this.setState({communityid : response.data.record.communityid});
				this.setState({addon : response.data.record.addon});
				
				starttime = this.state.startdate.split(" ");
				start = starttime[1].split(":");
				
				this.setState({hourin: start[0]});
				this.setState({minutein: start[1]});
				
				endtime = this.state.enddate.split(" ");
				end = endtime[1].split(":");
				
				this.setState({hourout: end[0]});
				this.setState({minuteout: end[1]});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.startdate);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.enddate);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+(monthin+1)+"-"+datein+" "+this.state.hourin+':'+this.state.minutein+":00";
		checkout = yearout+"-"+(monthout+1)+"-"+dateout+" "+this.state.hourout+':'+this.state.minuteout+":00";
		
		this.props.doLoading();
        axios.post(serverUrl+'activityreservation_insert_update.php', {			
			activityreservationid: this.state.activityreservationid,
			phoneno: this.state.phoneno,
			checkin: checkin,
			checkout: checkout,
			activityid: this.state.activityid,
			price: this.state.price,
			status: this.state.status,
			communityid: this.state.communityid,
			addon: this.state.addon
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
                            <td><Label for="startdate">{this.language.fieldstartdate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.startdate)} onChange={this.updateStartDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="enddate">{this.language.fieldenddate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.enddate)} onChange={this.updateEndDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="starttime">{this.language.fieldstarttime}</Label></td>
							<td>
								<select onChange = {this.handleHourInChange.bind(this)} value={this.state.hourin}>
									<option value="07">07</option>
									<option value="08">08</option>
									<option value="09">09</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
									<option value="13">13</option>
									<option value="14">14</option>
									<option value="15">15</option>
									<option value="16">16</option>
									<option value="17">17</option>
									<option value="18">18</option>
									<option value="19">19</option>
									<option value="20">20</option>
									<option value="21">21</option>
								</select>
								&nbsp;:&nbsp;
								<select onChange = {this.handleMinuteInChange.bind(this)} value={this.state.minutein}>
									<option value="00">00</option>
									<option value="30">30</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="endtime">{this.language.fieldendtime}</Label></td>
							<td>
								<select onChange = {this.handleHourOutChange.bind(this)} value={this.state.hourout}>
									<option value="07">07</option>
									<option value="08">08</option>
									<option value="09">09</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
									<option value="13">13</option>
									<option value="14">14</option>
									<option value="15">15</option>
									<option value="16">16</option>
									<option value="17">17</option>
									<option value="18">18</option>
									<option value="19">19</option>
									<option value="20">20</option>
									<option value="21">21</option>
								</select>
								&nbsp;:&nbsp;
								<select onChange = {this.handleMinuteOutChange.bind(this)} value={this.state.minuteout}>
									<option value="00">00</option>
									<option value="30">30</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="activityid">{this.language.fieldactivity}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.activityid} valueColumn={'activityid'} showColumn={'activityname'} columns={['activityname']} data={this.state.activityShow} onChange={this.changeActivity} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
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
						<tr>
						&nbsp;
						</tr>
						<tr>
							<td colspan="2"><div className="form-detail"><div className="detail-title">Add-Ons</div></div></td>
						</tr>
						<tr>
						&nbsp;
						</tr>
						{this.state.addon.map((item, i)=>
							<tr>
								<td><Label for="addon">{this.state.addon[i].activityaddonname}</Label></td>
								<td><Input type="number" min="0" name="quantity" id="quantity" value={this.state.addon[i].quantity} onChange = {(event) => this.updateQuantity(i, event) }/></td>
							</tr>
						)}
						<tr>
						&nbsp;
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
export default EditActivityReservation;