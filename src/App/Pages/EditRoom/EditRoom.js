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
import './EditRoom.style.css';
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

class EditRoom extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editroom');
		this.state = {
			roomid: props.match.params.roomid,
			roomname: '',
			roomcategoryid: 0,
			shortdesc: '', 
			fulldesc: '',
			price:'', 
			roompic: [],
			gallery: [], 
			communityid: 0,
			isavailable: false,
			roomCategoryShow: [],
			communityShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
			modalIsOpen: false,
			roomcategoryname: '',
			icon: [],
			roomcategoryisavailable: false
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
	
	addRoomCategory = (roomcategoryid) => {
		const {roomcategoryname} = this.state;
		const {icon} = this.state;
		
		if(roomcategoryname == null || roomcategoryname == '' || icon == null ){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'roomcategory_insert_update.php', {			
				roomcategoryid: this.state.roomcategoryid,
				roomcategoryname: this.state.roomcategoryname,
				icon: this.state.icon,
				isavailable: this.state.roomcategoryisavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({roomcategoryid: response.data.record});
					this.selectRoomCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	} 
	
	onUploadImage = (result) => {
        this.setState({ roompic: result });
    }
	
	onUploadIcon = (result) => {
        this.setState({ icon: result });
    }
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }
	
	selectRoomCategory = (roomCategoryShow) =>{
		axios.post(serverUrl+'roomcategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ roomCategoryShow: response.data.records});
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
	
	changeRoomCategory = (roomcategoryid)=>{
        this.setState({roomcategoryid: roomcategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	roomCategoryIsAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({roomcategoryisavailable: checked});
	}
	
	checkData = () => {
		const {roomname} = this.state;
		const {roomcategoryid} = this.state;
		const {shortdesc} = this.state;
		const {fulldesc} = this.state;
		const {roompic} = this.state;
		const {communityid} = this.state;
		const {isavailable} = this.state;
		
		if(roomname == '' || roomcategoryid == 0 || shortdesc == '' || fulldesc == '' || communityid == 0 || roompic == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	addInfo=()=>{
		if(this.state.infoField===''){
			alert('Please input info name');
			return false;
		}
		if(this.state.infoValue===''){
			alert('Please input info value');
			return false;
		}

		let arr = this.state.infoList;
		arr.push({ field: this.state.infoField, value: this.state.infoValue });
		this.setState({infoList: arr, infoField:'', infoValue:''});

	}

	removeInfo=(info)=>{
		let tmp=[];
		this.state.infoList.map((item, i)=>{
			if(item !== info){
				tmp.push(item);
			}
		});
		this.setState({infoList: tmp});
	}
	 
	 componentDidMount = (roomCategoryShow, communityShow) => {
		this.selectRoomCategory(roomCategoryShow);
		this.selectCommunity(communityShow);
		this.props.doLoading();
		axios.post(serverUrl+'room_get_by_id.php', {
            roomid: this.state.roomid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, roomcategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.roompic !== ""){
					tmp.push(response.data.record.roompic);
				}
				
				this.setState({roomid : response.data.record.roomid});
				this.setState({roomname : response.data.record.roomname});
				this.setState({price : response.data.record.price});
				this.setState({roomcategoryid : response.data.record.roomcategoryid});
				this.setState({shortdesc : response.data.record.shortdesc});
				this.setState({fulldesc : response.data.record.fulldesc});
				this.setState({roompic : tmp});
				this.setState({gallery : response.data.record.gallery});
				this.setState({communityid : response.data.record.communityid});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});
				this.setState({infoList : response.data.record.info});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'room_insert_update.php', {
			roomid: this.state.roomid,
			roomname: this.state.roomname,
			price: this.state.price,
			roomcategoryid: this.state.roomcategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			roompic: this.state.roompic,
			gallery: this.state.gallery,
			communityid: this.state.communityid,
			isavailable: this.state.isavailable ? 1:0,
			infolist: this.state.infoList
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/listroom');
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
	
	renderInfo=()=>{
		if(this.state.infoList.length > 0){
			return (
				<div className="detail-info-list">
					<table>
						<tbody>
							{
								this.state.infoList.map((item,i)=>
									<tr>
										<td className="td-field">
											{item.field}
										</td>
										<td className="td-doubledot">:</td>
										<td className="td-value">{item.value}</td>
										<td className="td-button"><Button color="warning" size="sm" onClick={()=>this.removeInfo(item)} block>Remove</Button></td>
									</tr>
								)
							}
							
						</tbody>
					</table>
				</div>
			)
		}else{
			return(
				<div className="detail-info-list">
					<div className="no-data-available">No Info Available</div>
				</div>
			)
		}
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
                            <td><Label for="roomcategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="roomcategoryname" id="roomcategoryname" value={this.state.roomcategoryname} placeholder="Room Category" onChange = {(event) => this.setState({ roomcategoryname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadIcon} picList = {this.state.icon} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="roomcategoryisavailable">{this.language.modalfieldavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="roomcategoryisavailable" id="roomcategoryisavailable" checked={this.state.roomcategoryisavailable} onChange={(event)=>this.roomCategoryIsAvailableChecked(event)}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addRoomCategory()}>{this.language.modalsubmit}</Button>
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
                            <td><Label for="roomname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="roomname" id="roomname" placeholder="Room Name" value={this.state.roomname} onChange = {(event) => this.setState({ roomname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="roomcategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.roomcategoryid} valueColumn={'roomcategoryid'} showColumn={'roomcategoryname'} columns={['roomcategoryname']} data={this.state.roomCategoryShow} onChange={this.changeRoomCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
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
                            <td><Label for="shortdesc">{this.language.fieldshortdesc}</Label></td>
                            <td><Input type="textarea" name="shortdesc" id="shortdesc" placeholder="Room Short Description" value={this.state.shortdesc} onChange = {(event) => this.setState({ shortdesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.fieldfulldesc}</Label></td>
                            <td><Input type="textarea" name="fulldesc" id="fulldesc" placeholder="Room Full Description" value={this.state.fulldesc} onChange = {(event) => this.setState({ fulldesc : event.target.value }) }/></td>
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
                            <td><Label>{this.globallang.gallery}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadGallery} picList = {this.state.gallery} picLimit={9}></PictureUploader>
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
					{this.renderModal()}
					<br/>
					<div className="form-detail">
						<div className="detail-title">Room Info</div>
						<div className="detail-info-input">
							<Row>
								<Col sm={4}>
									<Input type="text" name="field" id="field" placeholder="Info Name" value={this.state.infoField} onChange = {(event) => this.setState({ infoField : event.target.value }) }/>
								</Col>
								
								<Col sm={6}>
								<Input type="text" name="value" id="value" placeholder="Info Value" value={this.state.infoValue} onChange = {(event) => this.setState({ infoValue : event.target.value }) }/>
								</Col>
								<Col sm={2}>
									<Button color="success" block onClick={()=>this.addInfo()}>{this.globallang.add}</Button>
								</Col>
							</Row>
						</div>
						{this.renderInfo()}
					</div>
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditRoom;