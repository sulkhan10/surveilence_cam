import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from '../../../config.js';
import ReactTable from "react-table";
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; 

import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class HomeConfig extends Component {
    constructor(props) {
		super(props);
		
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'homeconfig');
		this.state = {
			newschecked: false,
			newscount: 0,
			advertisechecked: false,
			advertisecount: 0,
			mainCommunity: this.props.community.communityid,
			tableData: [],
			modalIsOpen: false,
			advertisementid: 0,
			title: '',
			desc: '',
			image: [],
			link: '',
			isavailable: false
		}
		
		this.newsHandleChecked = this.newsHandleChecked.bind(this);
		this.advertiseHandleChecked = this.advertiseHandleChecked.bind(this);
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		
		this.tableColumns = [ {
            Header: this.language.columntitle,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'title',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columndesc,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'desc',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columnlink,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'link',
            style: { textAlign: "center"}
        },
		{
			Header: this.language.columnavailable,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'isavailable',
            style: { textAlign: "center"},
			Cell : e => (e.original.isavailable === 0 ? this.globallang['hidden'] : this.globallang['show'])
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
        this.setState({ image: result });
    }
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
		this.setState({title : ''});
		this.setState({desc : ''});
		this.setState({image : []});
		this.setState({link : ''});
		this.setState({isavailable : false});
	}
	
	doRowDelete = (item) => {   
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (advertisementid) => {
					var advertisementid = item.advertisementid;
					this.deleteAdvertisement(advertisementid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	deleteAdvertisement = (advertisementid) => {
		axios.post(serverUrl+'advertisement_delete.php', {
            advertisementid: advertisementid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				alert(this.language.deletesuccess);
				this.loadAdvertisement();
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	doRowEdit = (row) => {
		this.setState({modalIsOpen: true});
		this.setState({advertisementid: row.advertisementid});
		this.setState({title: row.title});
		this.setState({desc: row.desc});
		this.setState({image: row.image});
		this.setState({link: row.link});
		this.setState({isavailable: row.isavailable});
    }
	
	doEditComment = (advertisementid) => {
		const {title} = this.state;
		const {desc} = this.state;
		const {image} = this.state;
		const {link} = this.state;
		
		if(title == '' || desc == '' || image == null || image == '' || link == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'advertisement_insert_update.php', {			
				advertisementid: this.state.advertisementid,
				title : this.state.title,
				desc: this.state.desc,
				image: this.state.image,
				link: this.state.link, 
				isavailable: this.state.isavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					alert(this.language.savesuccess);
					this.closeModal();
					this.loadAdvertisement();
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
	
	newsHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({newschecked: checked});
		this.setState({newscount: 0});
	}
	
	advertiseHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({advertisechecked: checked});
		this.setState({advertisecount: 0});
	}
	
	componentDidMount = () =>{
		this.loadAdvertisement();
		this.props.doLoading();
		axios.post(serverUrl+'homeconfig_getdata.php', {
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
				this.setState({newschecked : response.data.record.newschecked===1?true:false});
				this.setState({newscount : response.data.record.newscount});
				this.setState({advertisechecked : response.data.record.advertisechecked===1?true:false});
				this.setState({advertisecount : response.data.record.advertisecount});
            })
            .catch((error) =>{
				this.props.doLoading();
				alert(error);
            });
	}
	
	doCancel = () => {
		window.location.reload();
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'homeconfig_update.php', {	
			newschecked: this.state.newschecked  ? 1:0,
			newscount: this.state.newscount,
			advertisechecked: this.state.advertisechecked  ? 1:0,
			advertisecount: this.state.advertisecount
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert('OK');
				}else{
					alert(response.data.message);
				}
				
            })
            .catch( (error) =>{
				this.props.doLoading();
				alert(error);
            });
	}
	
	addAdvertisement = () =>{
		const {title} = this.state;
		const {desc} = this.state;
		const {image} = this.state;
		const {link} = this.state;
		
		if(title == '' || desc == '' || image == null || image == '' || link == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.advertisementSave();
		}
	}
	
	advertisementSave = () =>{
		axios.post(serverUrl+'advertisement_insert_update.php', {
			advertisementid: this.state.advertisementid,
			title: this.state.title,
			desc: this.state.desc,
			image: this.state.image,
			link: this.state.link, 
			isavailable: this.state.isavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				alert(this.language.savesuccess);
				this.closeModal();
				this.loadAdvertisement();
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	loadAdvertisement = () =>{
		axios.post(serverUrl+'advertisement_list.php', {
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
	
	renderNewsCount() {
		if(this.state.newschecked == true){
			return (
				<tr>
					<td><Label for="newscount">{this.language.fieldnewscount}</Label></td>
					<td><Input type="number" name="newscount" id="newscount" value={this.state.newscount} onChange = {(event) => this.setState({ newscount : event.target.value })}/></td>
				</tr>
				
			)
		}	
    }
	
	renderAdvertiseCount() {
		if(this.state.advertisechecked == true){
			return (
				<tr>
					<td><Label for="advertisecount">{this.language.fieldadvertisecount}</Label></td>
					<td><Input type="number" name="advertisecount" id="advertisecount" value={this.state.advertisecount} onChange = {(event) => this.setState({ advertisecount : event.target.value }) }/></td>
				</tr>
				
			)
		}	
    }
	
	renderAdvertisement=()=> {
        return (
		<div className="form-detail">
			<div className="detail-title">Advertisement</div>
			<div className="detail-info-input">
				<FormGroup>
					<Button color="success" onClick={() => this.addNew()}>New Advertisement</Button>
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
                            <td><Label for="title">{this.language.modalfieldtitle}</Label></td>
                            <td><Input type="text" name="title" id="title" value={this.state.title} placeholder="Title" onChange = {(event) => this.setState({ title : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="desc">{this.language.modalfielddesc}</Label></td>
                            <td><Input type="textarea" name="desc" id="desc" value={this.state.desc} placeholder="Description" onChange = {(event) => this.setState({ desc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.image} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="link">{this.language.modalfieldlink}</Label></td>
                            <td><Input type="text" name="link" id="link" value={this.state.link} placeholder="http://wwww.tokopedia.com/" onChange = {(event) => this.setState({ link : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.modalfieldavailable}</Label></td>
                            <td><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addAdvertisement()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
	}
	
	render() {
        return (
            <div>
                <div className="page-header">
					{this.language.title} {/*<span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>*/}
                </div>
                <div className="box-container">
				<Form>
					<table>
						<tr>
                            <td><Label for="newschecked">{this.language.fieldnewschecked}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="newschecked" id="newschecked" checked={this.state.newschecked} onChange={(event)=>this.newsHandleChecked(event)}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						{this.renderNewsCount()}
						<tr>
							&nbsp;
						</tr>
						<tr>
                            <td><Label for="advertisechecked">{this.language.fieldadvertisechecked}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="advertisechecked" id="advertisechecked" checked={this.state.advertisechecked} onChange={(event)=>this.advertiseHandleChecked(event)}/></td>
                        </tr>
						<tr>
							&nbsp;
						</tr>
						{this.renderAdvertiseCount()}
                    </table>
					<br>
					</br>
					<div className="form-button-container">
						<Button color="primary" onClick={() => this.onSubmit()}>{this.globallang.submit}</Button> <Button color="secondary" onClick={() => this.doCancel()}>{this.globallang.cancel}</Button>
                    </div>
					{this.renderAdvertisement()}
					{this.renderModal()}
				</Form>
                </div>
					
            </div>
        );
    }
}
export default HomeConfig;