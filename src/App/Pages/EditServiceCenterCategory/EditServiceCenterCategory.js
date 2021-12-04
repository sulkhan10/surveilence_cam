import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import ReactTable from "react-table";
import Modal from 'react-modal';
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

class EditServiceCenterCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editservicecentercategory');
		this.state = {
			servicecentercategoryid: props.match.params.servicecentercategoryid,
			servicecentercategoryname: '',
			icon: [],
			isavailable: false,
			modalIsOpen: false,
			modalEditIsOpen: false,
			servicecenteritemid: 0,
			servicecenteritemname: '',
			servicecenteritemisavailable: false
		}
		this.isAvailableChecked = this.isAvailableChecked.bind(this);
		this.serviceCenterItemChecked = this.serviceCenterItemChecked.bind(this);
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.editServiceCenterItem = this.editServiceCenterItem.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		
		this.tableColumns = [ {
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'servicecenteritemname',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columnavailable,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'isavailable',
            style: { textAlign: "center"},
			Cell : e => (e.original.servicecenteritemisavailable === 0 ? this.globallang['hidden'] : this.globallang['show'])
        },
		{
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
                    <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
                </div>
            )
        }]
    }
	
	onUploadImage = (result) => {
        this.setState({ icon: result });
    }
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
		this.setState({servicecenteritemname : ''});
		this.setState({servicecenteritemisavailable : false});
	}
	
	editServiceCenterItem = () => {
		this.setState({modalEditIsOpen: true});
	}
	
	closeEditModal() {
		this.setState({modalEditIsOpen: false});
		this.setState({servicecenteritemid : 0});
		this.setState({servicecenteritemname : ''});
		this.setState({servicecenteritemisavailable : false});
	}
	
	doRowDelete = (item) => {   
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (servicecenteritemid) => {
					var servicecenteritemid = item.servicecenteritemid;
					this.deleteServiceCenterItem(servicecenteritemid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	deleteServiceCenterItem = (servicecenteritemid) => {
		axios.post(serverUrl+'servicecenteritem_delete.php', {
            servicecenteritemid: servicecenteritemid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				alert(this.language.deletesuccess);
				this.loadServiceCenterItem();
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	doRowEdit = (row) => {
		this.setState({modalEditIsOpen: true});
		this.setState({servicecenteritemid: row.servicecenteritemid});
		this.setState({servicecenteritemname: row.servicecenteritemname});
		this.setState({servicecenteritemisavailable: row.servicecenteritemisavailable});
    }
	
	doEditServiceCenterItem = (servicecenteritemid) => {
		const {servicecenteritemname} = this.state;
		
		if(servicecenteritemname == '' || servicecenteritemname == null ){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'servicecenteritem_insert_update.php', {			
				servicecenteritemid: this.state.servicecenteritemid,
				servicecenteritemname: this.state.servicecenteritemname,
				servicecentercategoryid: this.state.servicecentercategoryid,
				servicecenteritemisavailable: this.state.servicecenteritemisavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					alert(this.language.savesuccess);
					this.closeEditModal();
					this.loadServiceCenterItem();
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	serviceCenterItemChecked (event) {
		let checked = event.target.checked;
		this.setState({servicecenteritemisavailable: checked});
	}
	
	checkData = () => {
		const {servicecentercategoryname} = this.state;
		const {icon} = this.state;
		
		if(servicecentercategoryname == null || servicecentercategoryname == '' || icon == null || icon == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	componentDidMount = () => {
		this.loadServiceCenterItem();
		this.props.doLoading();
		axios.post(serverUrl+'servicecentercategory_get_by_id.php', {
            servicecentercategoryid: this.state.servicecentercategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.icon !== ""){
					tmp.push(response.data.record.icon);
				}
				this.setState({servicecentercategoryid : response.data.record.servicecentercategoryid});
				this.setState({servicecentercategoryname : response.data.record.servicecentercategoryname});
				this.setState({icon : tmp});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});				
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'servicecentercategory_insert_update.php', {			
			servicecentercategoryid: this.state.servicecentercategoryid,
			servicecentercategoryname: this.state.servicecentercategoryname,
			icon: this.state.icon,
			isavailable: this.state.isavailable ? 1:0
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listservicecentercategory');
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }
	
	addServiceCenterItem = () =>{
		const {servicecenteritemname} = this.state;
		
		if(servicecenteritemname == '' || servicecenteritemname == null ){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.serviceCenterItemSave();
		}
	}
	
	serviceCenterItemSave = () =>{
		axios.post(serverUrl+'servicecenteritem_insert_update.php', {
			servicecenteritemid: this.state.servicecenteritemid,
			servicecenteritemname: this.state.servicecenteritemname,
			servicecentercategoryid: this.state.servicecentercategoryid,
			servicecenteritemisavailable: this.state.servicecenteritemisavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				alert(this.language.savesuccess);
				this.closeModal();
				this.loadServiceCenterItem();
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	loadServiceCenterItem = () =>{
		axios.post(serverUrl+'servicecenteritem_list.php', {
			servicecentercategoryid: this.state.servicecentercategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				var temp = this.state.tableData;
				temp = response.data.records;
				this.setState({tableData : temp});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	renderServiceCenterItem=()=> {
        return (
		<div className="form-detail">
			<div className="detail-title">Service Center Item</div>
			<div className="detail-info-input">
				<FormGroup>
					<Button color="success" onClick={() => this.addNew()}>New Service Center Item</Button>
					<br></br>
					<br></br>
					<ReactTable data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} />
				</FormGroup>
			</div>
		</div>
        );
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
                            <td><Label for="servicecenteritemname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="servicecenteritemname" id="servicecenteritemname" value={this.state.servicecenteritemname} placeholder="Service Center Item Name" onChange = {(event) => this.setState({ servicecenteritemname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="servicecenteritemisavailable">{this.language.modalfieldavailable}</Label></td>
                            <td><Input type="checkbox" name="servicecenteritemisavailable" id="servicecenteritemisavailable" checked={this.state.servicecenteritemisavailable} onChange={(event)=>this.serviceCenterItemChecked(event)}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addServiceCenterItem()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
	}
	
	renderModalEdit() {
		return (
			<Modal
				isOpen={this.state.modalEditIsOpen}
				onRequestClose={this.closeEditModal}
				style={customStyles}
			>
			<div className="page-header">
                    {this.language.modaltitle} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="servicecenteritemname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="servicecenteritemname" id="servicecenteritemname" value={this.state.servicecenteritemname} placeholder="Service Center Item Name" onChange = {(event) => this.setState({ servicecenteritemname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="servicecenteritemisavailable">{this.language.modalfieldavailable}</Label></td>
                            <td><Input type="checkbox" name="servicecenteritemisavailable" id="servicecenteritemisavailable" checked={this.state.servicecenteritemisavailable} onChange={(event)=>this.serviceCenterItemChecked(event)}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeEditModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.doEditServiceCenterItem()}>{this.language.modalsubmit}</Button>
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
                            <td><Label for="servicecentercategoryname">{this.language.fieldname}</Label></td>
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
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
                    </table>
					{this.renderServiceCenterItem()}
					{this.renderModal()}
					{this.renderModalEdit()}
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditServiceCenterCategory;