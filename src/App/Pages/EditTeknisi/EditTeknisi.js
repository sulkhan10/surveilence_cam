import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import CheckboxGroup from '../../Components/CheckboxGroup/CheckboxGroup';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import ReactTable from "react-table";
import { confirmAlert } from 'react-confirm-alert';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '55%',
      right                 : '-20%',
      bottom                : '-30%',
      transform             : 'translate(-50%, -50%)'
    }
  }; 

class EditTeknisi extends Component{
  constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
    this.language = getLanguage(activeLanguage, 'editteknisi');

    this.state = {
      teknisiid: props.match.params.teknisiid,
      phoneno: '',
			name: '',
			nickname: '',
			genderid: '',
			profilepic: [],
			date: moment(),
			businessqrcode: '',
      companyid: '',
      address: '',
			location: '',
			email: '',
      issuspend: 0,
      jobdesc: '',
			colleague: false,
			dataGender: [],
      dataUserType: [],
      dataCompany: [],
			userdetailid: 0,
			tempuserdetailid: 0,
			customerid: '',
			label: '',
			address: '',
			userdetailtypeid: 0,
			userdetailtypename: '',
			communityid: 0,
			communityname: '',
			communityShow: [],
			modalIsOpen: false,
			tableUserDetail: [],
			tableDisplay: [],
			tableUserVehicle: [],
			uservehicleid: 0,
			plateno: '',
			vehicletypeid: 0,
			vehicletypeShow: [],
      uservehicletypeid: 0,
      isavailable: false,
      status: false,
			modalUserVehicleIsOpen: false
    }

  }

  onUploadImage = (result) => {
    this.setState({ profilepic: result });
}


  selectGender = (dataGender) =>{
		axios.post(serverUrl+'gender_list.php', {},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ dataGender: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}

	selectCompany = (dataCompany) =>{
		axios.post(serverUrl+'company_select_list.php', {},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ dataCompany: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
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
  
  componentDidMount = (dataGender, dataCompany) =>{
		localStorage.clear();
		this.selectGender(dataGender);
    this.selectCompany(dataCompany);
    this.props.doLoading();
    axios.post(serverUrl+'teknisi_by_phoneno.php', {
      teknisiid : this.state.teknisiid
    }, 

      {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
              console.log(response);
        this.props.doLoading();
        let tmp = [];
				if(response.data.record.profilepic !== ""){
					tmp.push(response.data.record.profilepic);
        }
          this.setState({teknisiid : response.data.record.teknisiid});
          this.setState({phoneno : response.data.record.phoneno});
          this.setState({name : response.data.record.name});
          this.setState({genderid : response.data.record.genderid});
          this.setState({gendername : response.data.record.gendername});
          this.setState({profilepic : tmp});
          this.setState({companyid : response.data.record.companyid});
          this.setState({address : response.data.record.address});
          this.setState({jobdesc : response.data.record.jobdesc});
          this.setState({email : response.data.record.email});
          this.setState({issuspend : response.data.record.issuspend}); 
          this.setState({status : response.data.record.status}); 
          this.setState({isavailable : response.data.record.isavailable===1?true:false});     
        }).catch((error) =>{
          this.props.doLoading();
          alert(error);
        });
        }
  
  colleagueHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({colleague: checked});
	}
   
  isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
  }

  handleStatusChange(e){
		this.setState({
		  status: e.target.value
		})
	}
  
   changeCommunity = (communityid, communityname)=>{
		var communities = this.state.communityShow;
		
		for (var i = 0; i < communities.length; i++){
			if(communities[i].communityid == communityid){
				communityname = communities[i].communityname;
			}
		}
		
		this.setState({communityid: communityid});
		this.setState({communityname: communityname});
    }
	
	suspendHandleChange(e){
		this.setState({
		  issuspend: e.target.value
		})
	 }
	
	changeGender = (genderid)=>{
        this.setState({genderid: genderid});
	}
	
	changeCompany = (companyid)=>{
        this.setState({companyid: companyid});
    }

    checkData = () => {
      const {phoneno} = this.state;
      const {name} = this.state;
      const {nickname} = this.state;
      const {companyid} = this.state;
      const {address} = this.state;
      const {jobdesc} = this.state;
      const {email} = this.state;
      const {password} = this.state;
      const {confirmpass} = this.state;
      
      if(phoneno == null || name == null ||companyid == null || address == null || email == null){
        alert(this.language.validation);
        return false;
      }	
      else{
        this.onSubmit();
      }
      }
      
      onSubmit = () => {
      this.props.doLoading();
          axios.post(serverUrl+'teknisi_insert_update.php', {			
            teknisiid: this.state.teknisiid,
            phoneno: this.state.phoneno,
            name: this.state.name,
            genderid: this.state.genderid,
            profilepic: this.state.profilepic,
            email: this.state.email,
            address: this.state.address,
            companyid: this.state.companyid,
            jobdesc: this.state.jobdesc,
            issuspend: this.state.issuspend,
            status: this.state.status,
            isavailable: this.state.isavailable ? 1:0,
      }, 
      {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
              .then( (response) =>{
          this.props.doLoading();
          alert(this.language.savesuccess);
          this.props.history.push('/panel/listteknisi');
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
                  <tbody>
                      <tr>
                          <td><Label for="phoneno">{this.language.fieldphone}</Label></td>
                          <td><Input type="text" name="phoneno" id="phoneno" disabled="disabled" placeholder="08xxxxxxxxxx" value={this.state.phoneno} onChange = {(event) => this.setState({ phoneno : event.target.value }) }/></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label for="name">{this.language.fieldname}</Label></td>
                          <td><Input type="text" name="name" id="name" value={this.state.name} placeholder={this.language.fieldname} onChange = {(event) => this.setState({ name : event.target.value }) }/></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label for="email">{this.language.fieldemail}</Label></td>
                          <td><Input type="text" name="email" id="email" value={this.state.email} placeholder={this.language.fieldemail} onChange = {(event) => this.setState({ email : event.target.value }) }/></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label for="genderid">{this.language.fieldgender}</Label></td>
                          <td><SelectMultiColumn width={200} value={this.state.genderid} valueColumn={'genderid'} showColumn={'gendername'} columns={['gendername']} data={this.state.dataGender} onChange={this.changeGender} /></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label>{this.globallang.uploadpicture}</Label></td>
                          <td>
                          <PictureUploader onUpload={this.onUploadImage} picList = {this.state.profilepic} picLimit={1}></PictureUploader>
                          </td>
                      </tr>
                      <tr>
                          <td colSpan="2">
                          &nbsp;
                          </td>
                      </tr>
                      <tr>
                          <td><Label for="address">Address</Label></td>
                          <td><Input type="textarea" name="address" id="address" placeholder="Address Technician" value={this.state.address} onChange = {(event) => this.setState({ address : event.target.value }) }/></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label for="companyid">Company Name</Label></td>
                          <td><SelectMultiColumn width={200} value={this.state.companyid} valueColumn={'companyid'} showColumn={'companyname'} columns={['companyname']} data={this.state.dataCompany} onChange={this.changeCompany} /></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                          <td><Label for="jobdesc">Job Description</Label></td>
                          <td><Input type="text" name="jobdesc" id="jobdesc" placeholder="Job Description" value={this.state.jobdesc} onChange = {(event) => this.setState({ jobdesc : event.target.value }) }/></td>
                      </tr>
                      <tr>
                          <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                      </tr>
                      <tr>
                      &nbsp;
                      </tr>
                      <tr>
                            <td><Label for="status">{this.language.fieldstatus}</Label></td>
                              <td><select onChange = {this.handleStatusChange.bind(this)} value={this.state.status}>
                                  <option value="0">Ready</option>
                                  <option value="1">Working On</option>
                                </select>
                              </td>
                      </tr>
                      <tr>
                      &nbsp;
                      </tr>
                  </tbody>
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
export default EditTeknisi;