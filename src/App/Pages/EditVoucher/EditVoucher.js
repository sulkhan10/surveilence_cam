import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import Modal from 'react-modal';
import './EditVoucher.style.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class EditVoucher extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editvoucher');
		this.state = {
			voucherid: props.match.params.voucherid,
			vouchername: '',
			fulldesc: '',
			startdate: moment(),
			enddate: moment(),
			voucherprice:0,
			voucherdiscount:0,
			voucherlimit:'',
			voucherpic:[],
			communityid: 0,
			isavailable: false,
			communityShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
			modalIsOpen: false,
			icon: [],
		}
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
    }
	 
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	onUploadImage = (result) => {
        this.setState({ roompic: result });
    }
	
	onUploadIcon = (result) => {
        this.setState({ icon: result });
    }
	
	
	selectCommunity = (communityShow) =>{
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
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	checkData = () => {
		const {vouchername} = this.state;
		const {fulldesc} = this.state;
		const {communityid} = this.state;
		const {isavailable} = this.state;
		const {voucherpic} = this.state;
		
		if(vouchername == '' ||  fulldesc == '' || communityid == 0 || voucherpic == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	 
	 componentDidMount = (communityShow) => {
		this.selectCommunity(communityShow);
		this.props.doLoading();
		axios.post(serverUrl+'voucher_get_by_id.php', {
            voucherid: this.state.voucherid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.voucherpic !== ""){
					tmp.push(response.data.record.voucherpic);
				}
				
				this.setState({voucherid : response.data.record.voucherid});
				this.setState({vouchername : response.data.record.vouchername});
				this.setState({fulldesc : response.data.record.fulldesc});
                this.setState({startdate : response.data.record.validdatein });
                this.setState({enddate : response.data.record.validdateout});
                this.setState({voucherprice : response.data.record.voucherprice});
                this.setState({voucherdiscount : response.data.record.voucherdiscount});
                this.setState({voucherlimit : response.data.record.voucherlimit});
                this.setState({voucherpic : tmp});
				this.setState({communityid : response.data.record.communityid});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});
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
        axios.post(serverUrl+'voucher_insert_update.php', {			
			voucherid: this.state.voucherid,
			vouchername: this.state.vouchername,
			fulldesc: this.state.fulldesc,
			checkin: checkin,
			checkout: checkout,
			voucherprice: this.state.voucherprice,
			voucherdiscount: this.state.voucherdiscount,
			voucherlimit: this.state.voucherlimit,
			voucherpic: this.state.voucherpic,
			communityid: this.state.communityid,
			isavailable: this.state.isavailable ? 1:0,
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/listvoucher');
				}else{
					alert(response.data.message);
				}
				
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
                            <td><Label for="vouchername">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="vouchername" id="vouchername" placeholder={this.language.fieldname} value={this.state.vouchername} onChange = {(event) => this.setState({ vouchername : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.fielddesc}</Label></td>
                            <td><Input type="text" name="fulldesc" id="fulldesc" placeholder={this.language.fulldesc} value={this.state.fulldesc} onChange = {(event) => this.setState({ fulldesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="startdate">{this.language.fieldvaliddatein}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.startdate)} onChange={this.updateStartDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="enddate">{this.language.fieldvaliddateout}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.enddate)} onChange={this.updateEndDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="price">{this.language.fieldvoucherprice}</Label></td>
                            <td><Input type="number" name="price" id="price" placeholder="Rp." value={this.state.voucherprice} onChange = {(event) => this.setState({ voucherprice : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="discount">{this.language.fieldvoucherdisc}</Label></td>
                            <td><Input type="number" name="discount" id="discount" placeholder="Discount %" value={this.state.voucherdiscount} onChange = {(event) => this.setState({ voucherdiscount : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="countlimit">{this.language.fieldvoucherlimit}</Label></td>
                            <td><Input type="number" name="countlimit" id="countlimit" placeholder="Limit Voucher" value={this.state.voucherlimit} onChange = {(event) => this.setState({ voucherlimit : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.roompic} picLimit={1}></PictureUploader>
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
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
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
export default EditVoucher;