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
import './InputActivity.style.css';
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

class InputActivity extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputactivity');

		this.state = {
			activityid: 0,
			activityname: '',
			activitycategoryid: 0,
			shortdesc: '', 
			fulldesc: '', 
			activitypic: [],
			gallery: [],
			communityid: 0,
			isavailable: false,
			activityCategoryShow: [],
			communityShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
			price: 0,
			modalIsOpen: false,
			activitycategoryname: '',
			icon: [],
			activitycategoryisavailable: false
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
	
	addActivityCategory = (activitycategoryid) => {
		const {activitycategoryname} = this.state;
		const {icon} = this.state;
		
		if(activitycategoryname == null || activitycategoryname == '' || icon == null){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'activitycategory_insert_update.php', {			
				activitycategoryid: this.state.activitycategoryid,
				activitycategoryname: this.state.activitycategoryname,
				icon: this.state.icon,
				isavailable: this.state.activitycategoryisavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({activitycategoryid: response.data.record});
					this.selectActivityCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	
	onUploadImage = (result) => {
        this.setState({ activitypic: result });
    }
	
	onUploadIcon = (result) => {
        this.setState({ icon: result });
    }
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }
	
	selectActivityCategory = () =>{
		axios.post(serverUrl+'activitycategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ activityCategoryShow: response.data.records});
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
	
	componentDidMount = () =>{
		this.selectActivityCategory();
		this.selectCommunity();
	}
	
	changeActivityCategory = (activitycategoryid)=>{
		console.log(this.state.activitycategoryid);
        this.setState({activitycategoryid: activitycategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	activityCategoryIsAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({activitycategoryisavailable: checked});
	}
	 
	checkData = () => {
		const {activityname} = this.state;
		const {activitycategoryid} = this.state;
		const {shortdesc} = this.state;
		const {fulldesc} = this.state;
		const {activitypic} = this.state;
		const {communityid} = this.state;
		const {isavailable} = this.state;
		
		if(activityname == '' || activitycategoryid == 0 || shortdesc == '' || fulldesc == '' || communityid == 0 || activitypic == null){
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
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'activity_insert_update.php', {			
			activityid: this.state.activityid,
			activityname: this.state.activityname,
			activitycategoryid: this.state.activitycategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			activitypic: this.state.activitypic,
			gallery: this.state.gallery,
			communityid: this.state.communityid,
			price: this.state.price,
			isavailable: this.state.isavailable ? 1:0,
			infolist: this.state.infoList
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/listactivity');
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
                            <td><Label for="activitycategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="activitycategoryname" id="activitycategoryname" value={this.state.activitycategoryname} placeholder="Activity Category" onChange = {(event) => this.setState({ activitycategoryname : event.target.value }) }/></td>
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
                            <td><Label for="activitycategoryisavailable">{this.language.modalfieldavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="activitycategoryisavailable" id="activitycategoryisavailable" checked={this.state.activitycategoryisavailable} onChange={(event)=>this.activityCategoryIsAvailableChecked(event)}/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addActivityCategory()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
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
	
	render() {
        return (
            <div>
                <div className="page-header">
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="activityname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="activityname" id="activityname" placeholder={this.language.fieldname} value={this.state.activityname} onChange = {(event) => this.setState({ activityname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="activitycategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.activitycategoryid} valueColumn={'activitycategoryid'} showColumn={'activitycategoryname'} columns={['activitycategoryname']} data={this.state.activityCategoryShow} onChange={this.changeActivityCategory} />&nbsp;&nbsp;
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
                            <td><Input type="textarea" name="shortdesc" id="shortdesc" placeholder={this.language.fieldshortdesc} value={this.state.shortdesc} onChange = {(event) => this.setState({ shortdesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.fieldfulldesc}</Label></td>
                            <td><Input type="textarea" name="fulldesc" id="fulldesc" placeholder={this.language.fieldfulldesc} value={this.state.fulldesc} onChange = {(event) => this.setState({ fulldesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.activitypic} picLimit={1}></PictureUploader>
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
						<div className="detail-title">Activity Info</div>
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
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
                </div>
					
            </div>
        );
    }
}
export default InputActivity;