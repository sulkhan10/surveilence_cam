import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { convertToRupiah } from '../../../global';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class EditForWeddingReservation extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editforweddingreservation');
		this.state = {
			weddingreservationid: props.match.params.weddingreservationid,
			userShow: [],
			phoneno: '',
			startdate: moment(),
			enddate: moment(),
			hourin: 7,
			minutein: 0,
			hourout: 7,
			minuteout: 0,
			insert:'',
			weddingid: 0,
			weddingname:'',
			duration:'',
			weddingprice:'',
			totalpayment:'',
			downpayment:'',
			external_id:'',
			payer_email:'',
			transaksi_date:'',
			transaksi_id:'',
			paid_amount:'',
			payment_method:'',
			payment_channel:'',
			status_payment:'',
			payment_date:'',
			status:0,
			communityid: 0,
            weddingShow: [],
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
	
	selectFacilities = () =>{
		axios.post(serverUrl+'wedding_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ weddingShow: response.data.records});
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
	
	updateQuantity = (i, event) => {
		let val = event.target.value;
		let addon = this.state.addon;
		addon[i].quantity = parseInt(val);
		this.setState({addon : addon});
    }
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
    }
	
	changeFacilities = (weddingid)=>{
        this.setState({weddingid: weddingid});
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
						this.checkIfExist();
					}
				}else{
					this.checkIfExist();
				}
			}else{
				this.checkIfExist();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }

	checkIfExist=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.datecheckin);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.datecheckout);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();

		checkin = yearin+'-'+(monthin+1 > 9 ? monthin+1 : '0'+(monthin+1))+'-'+(datein > 9 ? datein : '0'+datein)+" "+(this.state.hourin > 9 ? this.state.hourin : '0'+this.state.hourin)+':'+(this.state.minutein > 9 ? this.state.minutein : '0'+this.state.minutein);
		checkout = yearout+'-'+(monthout+1 > 9 ? monthout+1 : '0'+(monthout+1))+'-'+(dateout > 9 ? dateout : '0'+dateout)+" "+(this.state.hourout > 9 ? this.state.hourout : '0'+this.state.hourout)+':'+(this.state.minuteout > 9 ? this.state.minuteout : '0'+this.state.minuteout);
		
        axios({
            method: 'post',
            url: serverUrl + '/app_check_roomreservationdate.php',
            data: {
                checkin: checkin,
				checkout: checkout,
				roomid: this.state.roomid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.records === 1) {
                    alert(this.language.alreadybooked);
                }
				
				else{
					this.onSubmit();
				}
            })
            .catch(function (error) {
                console.log(error);
            });
	}


	 
	 componentDidMount = () => {
		var starttime;
		var start;
		var endtime; 
		var end;
		
		this.selectUser();
		this.selectFacilities();
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'forweddingreservation_get_by_id.php', {
            weddingreservationid: this.state.weddingreservationid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				
				this.setState({weddingreservationid : response.data.record.weddingreservationid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({startdate : response.data.record.checkin});
				this.setState({enddate : response.data.record.checkout});
				this.setState({insert : response.data.record.insert});
				this.setState({weddingid : response.data.record.weddingid});
				this.setState({weddingname : response.data.record.weddingname});
				this.setState({duration : response.data.record.duration});
				this.setState({weddingprice : response.data.record.weddingprice});
				this.setState({deposit : response.data.record.deposit});
				this.setState({totalpayment : response.data.record.totalpayment});
				this.setState({downpayment : response.data.record.downpayment});
				this.setState({external_id : response.data.record.external_id});
				this.setState({payer_email : response.data.record.payer_email});
				this.setState({transaksi_date : response.data.record.transaksi_date});
				this.setState({transaksi_id : response.data.record.transaksi_id});
				this.setState({paid_amount : response.data.record.paid_amount});
				this.setState({payment_method : response.data.record.payment_method});
				this.setState({payment_channel : response.data.record.payment_channel});
				this.setState({status_payment : response.data.record.status_payment});
				this.setState({payment_date : response.data.record.payment_date});
				this.setState({status : response.data.record.status});
				this.setState({communityid : response.data.record.communityid});
				
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
        axios.post(serverUrl+'roomreservation_insert_update.php', {			
			roomreservationid: this.state.roomreservationid,
			phoneno: this.state.phoneno,
			checkin: checkin,
			checkout: checkout,
			roomid: this.state.roomid,
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
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="phoneno">{this.language.fielduser}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.phoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.userShow} disabled="disabled" onChange={this.changeUser} /></td>
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
								<select  onChange = {this.handleHourInChange.bind(this)} value={this.state.hourin}>
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
								<select  onChange = {this.handleMinuteInChange.bind(this)} value={this.state.minutein}>
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
								<select  onChange = {this.handleHourOutChange.bind(this)} value={this.state.hourout}>
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
								<select  onChange = {this.handleMinuteOutChange.bind(this)} value={this.state.minuteout}>
									<option value="00">00</option>
									<option value="30">30</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="weddingid"> Facilities Name</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.weddingid} valueColumn={'weddingid'} showColumn={'weddingname'} columns={['weddingname']} data={this.state.weddingShow} onChange={this.changeFacilities} />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="duration"> Duration </Label></td>
                            <td><Input type="text"  name="duration" id="duration" placeholder="Duration" value={this.state.duration} onChange = {(event) => this.setState({ duration : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="estimated"> Estimated Price </Label></td>
                            <td><Input type="text"  name="estimated" id="estimated" placeholder="Rp." value={convertToRupiah(this.state.weddingprice)} onChange = {(event) => this.setState({ weddingprice : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="deposit"> Deposit </Label></td>
                            <td><Input type="text"  name="deposit" id="deposit" placeholder="Rp." value={convertToRupiah(this.state.deposit)} onChange = {(event) => this.setState({ deposit : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="totalpayment"> Total Payment </Label></td>
                            <td><Input type="text"  name="totalpayment" id="totalpayment" placeholder="Rp." value={convertToRupiah(this.state.totalpayment)} onChange = {(event) => this.setState({ totalpayment : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="downpayment"> Down Payment </Label></td>
                            <td><Input type="text"  name="downpayment" id="downpayment" placeholder="Rp." value={convertToRupiah(this.state.downpayment)} onChange = {(event) => this.setState({ downpayment : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="external_id"> Invoice Number </Label></td>
                            <td><Input type="text"  name="external_id" id="external_id" placeholder="Invoice Number" value={this.state.external_id} onChange = {(event) => this.setState({ external_id : event.target.value }) }/></td>
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
                            <td><Label for="payer_email"> Payer Email </Label></td>
                            <td><Input type="text"  name="payer_email" disabled="disabled" id="payer_email" placeholder="Payer Email" value={this.state.payer_email} onChange = {(event) => this.setState({ payer_email : event.target.value }) }/></td>
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
                            <td><Label for="payment_amount">Payment Amount</Label></td>
                            <td><Input type="text" disabled="disabled" name="payment_amount" id="payment_amount" placeholder="Payment Amount" value={convertToRupiah(this.state.paid_amount)}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status_payment">Status Payment Booking</Label></td>
                            <td><Input type="text" disabled="disabled" name="status_payment" id="status_payment" placeholder="Status Payment" value={this.state.status_payment}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">Status Reservation</Label></td>
							<td><select onChange = {this.handleStatusChange.bind(this)} value={this.state.status}>
									<option value="0">Not yet booked</option>
									<option value="1">Already Booked</option>
									<option value="2">Cancelled</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                    </table>
                </div>
					{/* <div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div> */}
            </div>
        );
    }
}
export default EditForWeddingReservation;