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

class EditParking extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editparking');
		this.state = {
			parkingid: props.match.params.parkingid,
			userShow: [],
			phoneno: '',
			uservehicleid: 0,
			startdate: moment(),
			enddate: moment(),
			hourin: 7,
			minutein: 0,
			hourout: 7,
			minuteout: 0,
			roomid: 0,
			roomShow: [],
			amount: 0,
			status: 0,
			communityid: 0,
			communityShow: [],
			datechanged: false
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
	
	selectUserVehicle = (phoneno) =>{
		axios.post(serverUrl+'selecteduservehicle_list.php', {phoneno: phoneno},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ uservehicleShow: response.data.records});
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
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
		this.selectUserVehicle(phoneno);
    }
	
	changeUserVehicle = (uservehicleid)=>{
        this.setState({uservehicleid: uservehicleid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {uservehicleid} = this.state;
		const {amount} = this.state;
		const {communityid} = this.state;
		
		if(phoneno == '' || uservehicleid == 0 || amount == null || communityid == 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			if(this.state.datechanged == true){
				this.validate();
			}
			else{
				this.validateWithoutChange();
			}
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
		
		if(checkout >= checkin){
			if(checkin == checkout){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}
				
				else{
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					else{
						this.onSubmit();
					}
				}
			}
			
			else{
				this.onSubmit();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	
	validateWithoutChange=()=>{
		var starttime = this.state.hourin+':'+this.state.minutein;
		var endtime = this.state.hourout+':'+this.state.minuteout;
		
		if(this.state.enddate >= this.state.startdate){
			if(this.state.enddate == this.state.startdate){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}
				
				else{
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					else{
						this.onSubmit();
					}
				}
			}
			
			else{
				this.onSubmit();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	 
	 componentDidMount = () => {
		var starttime;
		var endtime;
		 
		this.selectUser();
		this.selectUserVehicle(0);
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'parking_get_by_id.php', {
            parkingid: this.state.parkingid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				
				this.setState({parkingid : response.data.record.parkingid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({uservehicleid : response.data.record.uservehicleid});
				this.setState({startdate : response.data.record.startdate});
				this.setState({enddate : response.data.record.enddate});
				this.setState({starttime : response.data.record.starttime});
				this.setState({endtime : response.data.record.endtime});
				this.setState({amount : response.data.record.amount});
				this.setState({status : response.data.record.status});
				this.setState({communityid : response.data.record.communityid});
				
				this.changeUser(this.state.phoneno);
				this.changeUserVehicle(this.state.uservehicleid);
				
				starttime=this.state.starttime.split(':');
				this.setState({hourin: starttime[0]});
				this.setState({minutein: starttime[1]});
				
				endtime=this.state.endtime.split(':');
				this.setState({hourout: endtime[0]});
				this.setState({minuteout: endtime[1]});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		var starttime = this.state.hourin+':'+this.state.minutein;
		var endtime = this.state.hourout+':'+this.state.minuteout;
		
		this.props.doLoading();
        axios.post(serverUrl+'parking_insert_update.php', {			
			parkingid: this.state.parkingid,
			phoneno: this.state.phoneno,
			uservehicleid: this.state.uservehicleid,
			startdate: this.state.startdate,
			enddate: this.state.enddate,
			starttime: starttime,
			endtime: endtime,
			roomid: this.state.roomid,
			amount: this.state.amount,
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
                            <td><Label for="uservehicleid">{this.language.fielduservehicle}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.uservehicleid} valueColumn={'uservehicleid'} showColumn={'plateno'} columns={['plateno']} data={this.state.uservehicleShow} onChange={this.changeUserVehicle} />
							</td>
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
                            <td><Label for="amount">{this.language.fieldamount}</Label></td>
                            <td><Input type="number" name="amount" id="amount" placeholder="Rp." value={this.state.amount} onChange = {(event) => this.setState({ amount : event.target.value }) }/></td>
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
export default EditParking;