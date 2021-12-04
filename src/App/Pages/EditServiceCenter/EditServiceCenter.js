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

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class EditServiceCenter extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editservicecenter');
		this.state = {
			servicecenterid: props.match.params.servicecenterid,
			servicecentername: '',
			servicecentercategoryid: '',
			serviceCenterCategoryShow: [],
			desc: '',
			price: 0,
			isavailable: false,
			communityid: '',
			modalIsOpen: false,
			servicecentercategoryname: '',
			icon: [],
			iscategoryavailable: false
		}
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
		this.availableCategoryHandleChecked = this.availableCategoryHandleChecked.bind(this);
    }
	
	onUploadImage = (result) => {
        this.setState({ icon: result });
    }
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	addServiceCenterCategory = (servicecentercategoryid) => {
		const {servicecentercategoryname} = this.state;
		
		if(servicecentercategoryname == null || servicecentercategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'servicecentercategory_insert_update.php', {			
				servicecentercategoryid: this.state.servicecentercategoryid,
				servicecentercategoryname: this.state.servicecentercategoryname,
				icon: this.state.icon,
				isavailable: this.state.isavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({servicecentercategoryid: response.data.record});
					this.selectServiceCenterCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
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
	
	changeServiceCenterCategory = (servicecentercategoryid)=>{
        this.setState({servicecentercategoryid: servicecentercategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	availableCategoryHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({iscategoryavailable: checked});
	}
	
	availableHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	 
	checkData = () => {
		const {servicecentername} = this.state;
		const {communityid} = this.state;
		const {servicecentercategoryid} = this.state;
		const {desc} = this.state;
		
		if(servicecentername == '' || servicecentercategoryid == 0 || servicecentercategoryid == '' || communityid == 0 || communityid == '' || desc == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.selectServiceCenterCategory();
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'servicecenter_get_by_id.php', {
            servicecenterid: this.state.servicecenterid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				
				this.setState({servicecenterid : response.data.record.servicecenterid});
				this.setState({servicecentername : response.data.record.servicecentername});
				this.setState({servicecentercategoryid : response.data.record.servicecentercategoryid});
				this.setState({desc : response.data.record.desc});
				this.setState({price : response.data.record.price});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});
				this.setState({communityid : response.data.record.communityid});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'servicecenter_insert_update.php', {			
			servicecenterid: this.state.servicecenterid,
			servicecentername: this.state.servicecentername,
			servicecentercategoryid: this.state.servicecentercategoryid,
			desc: this.state.desc,
			price: this.state.price,
			isavailable: this.state.isavailable ? 1:0,
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
                            <td><Label for="servicecentercategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="servicecentercategoryname" id="servicecentercategoryname" value={this.state.servicecentercategoryname} placeholder="Service Center Category" onChange = {(event) => this.setState({ servicecentercategoryname : event.target.value }) }/></td>
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
                            <td><Label for="iscategoryavailable">{this.language.modalfieldavailable}</Label></td>
                            <td><Input type="checkbox" name="iscategoryavailable" id="iscategoryavailable" checked={this.state.iscategoryavailable} onChange={this.availableCategoryHandleChecked}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addServiceCenterCategory()}>{this.language.modalsubmit}</Button>
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
                            <td><Label for="servicecentername">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="servicecentername" id="servicecentername" placeholder="Service Center Name" value={this.state.servicecentername} onChange = {(event) => this.setState({ servicecentername : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="servicecentercategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.servicecentercategoryid} valueColumn={'servicecentercategoryid'} showColumn={'servicecentercategoryname'} columns={['servicecentercategoryname']} data={this.state.serviceCenterCategoryShow} onChange={this.changeServiceCenterCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="desc">{this.language.fielddesc}</Label></td>
                            <td><Input type="textarea" name="desc" id="desc" placeholder="Description" value={this.state.desc} onChange = {(event) => this.setState({ desc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="price">{this.language.fieldprice}</Label></td>
                            <td><Input type="number" name="price" id="price" placeholder="Rp." value={this.state.price} onChange = {(event) => this.setState({ price : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td><Input type="checkbox" className="custom-checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.availableHandleChecked(event)}/></td>
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
export default EditServiceCenter;