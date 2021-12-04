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
import './EditNonWedding.style.css';
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

  class EditNonWedding extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editroom');
		this.state = {

        
			nonweddingid: props.match.params.nonweddingid,
			non_weddingname: '',
            forweddingcategoryid: 0,
            forweddingcategoryname: '',
            nonweddingcategoryid: 0,
            nonweddingcategoryname: '',
			shortdesc: '', 
			fulldesc: '', 
			nonweddingpic: [],
			gallery: [],
			communityid: 0,
			isavailable: false,
			forWeddingCategoryShow: [],
			communityShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
            price: '',
            duration: '',
            kapasitas: '',
            luas: '',
            deposit: '',
            totalpayment: '',
            downpayment: '',
            keterangan : '',
			modalIsOpen: false,
			icon: [],
			forweddingcategoryisavailable: false
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
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	addRoomCategory = (forweddingcategoryid) => {
		const {for_weddingcategoryname} = this.state;
		const {icon} = this.state;
		
		if(for_weddingcategoryname == null || for_weddingcategoryname == '' || icon == null){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'forweddingcategory_insert_update.php', {			
                forweddingcategoryid: this.state.forweddingcategoryid,
                for_weddingcategoryname: this.state.for_weddingcategoryname,
                icon: this.state.icon,
                location: this.state.location,
                isavailable: this.state.isavailable ? 1:0
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({forweddingcategoryid: response.data.record});
					this.selectForWeddingCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	
	onUploadImage = (result) => {
        this.setState({ nonweddingpic: result });
    }
	
	onUploadIcon = (result) => {
        this.setState({ icon: result });
    }
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }
	
	selectForWeddingCategory = () =>{
		axios.post(serverUrl+'forweddingcategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ forweddingCategoryShow: response.data.records});
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
    

	changeForWeddingCategory = (forweddingcategoryid)=>{
		console.log(this.state.forweddingcategoryid);
        this.setState({forweddingcategoryid: forweddingcategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	forweddingCategoryIsAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({forweddingcategoryisavailable: checked});
	}
	
	checkData = () => {
		const {non_weddingname} = this.state;
		const {forweddingcategoryid} = this.state;
		const {shortdesc} = this.state;
		const {fulldesc} = this.state;
		const {nonweddingpic} = this.state;
		const {communityid} = this.state;
		const {isavailable} = this.state;
		
		if(non_weddingname == '' || forweddingcategoryid == 0 || shortdesc == '' || fulldesc == '' || communityid == 0 || nonweddingpic == null){
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
	 
	 componentDidMount = (forweddingCategoryShow, communityShow) => {
        this.selectForWeddingCategory(forweddingCategoryShow);
		this.selectCommunity(communityShow);
		this.props.doLoading();
		axios.post(serverUrl+'nonwedding_get_by_id.php', {
            nonweddingid: this.state.nonweddingid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, forweddingcategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.nonweddingpic !== ""){
					tmp.push(response.data.record.nonweddingpic);
				}
				
				this.setState({nonweddingid : response.data.record.nonweddingid});
				this.setState({non_weddingname : response.data.record.non_weddingname});
				this.setState({forweddingcategoryid : response.data.record.forweddingcategoryid});
				this.setState({shortdesc : response.data.record.shortdesc});
				this.setState({fulldesc : response.data.record.fulldesc});
				this.setState({nonweddingpic : tmp});
				this.setState({gallery : response.data.record.gallery});
                this.setState({communityid : response.data.record.communityid});
                this.setState({duration : response.data.record.duration});
                this.setState({kapasitas : response.data.record.kapasitas});
                this.setState({luas : response.data.record.luas});
                this.setState({price : response.data.record.price});
                this.setState({deposit : response.data.record.deposit});
                this.setState({totalpayment : response.data.record.totalpayment});
                this.setState({downpayment : response.data.record.downpayment});
                this.setState({keterangan : response.data.record.keterangan});
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
        axios.post(serverUrl+'nonwedding_insert_update.php', {			
			nonweddingid: this.state.nonweddingid,
			non_weddingname: this.state.non_weddingname,
			forweddingcategoryid: this.state.forweddingcategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			nonweddingpic: this.state.nonweddingpic,
			gallery: this.state.gallery,
            communityid: this.state.communityid,
            duration: this.state.duration,
            kapasitas: this.state.kapasitas,
            luas: this.state.luas,
            price: this.state.price,
            deposit: this.state.deposit,
            totalpayment: this.state.totalpayment,
            downpayment: this.state.downpayment,
            keterangan : this.state.keterangan,
			isavailable: this.state.isavailable ? 1:0
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/listnonwedding');
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
                            <td><Label for="non_weddingname">Banquet Facilities Name</Label></td>
                            <td><Input type="text" name="non_weddingname" id="non_weddingname" placeholder="Input Banquet Facilities Name" value={this.state.non_weddingname} onChange = {(event) => this.setState({ non_weddingname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="forweddingcategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.forweddingcategoryid} valueColumn={'forweddingcategoryid'} showColumn={'for_weddingcategoryname'} columns={['for_weddingcategoryname']} data={this.state.forweddingCategoryShow} onChange={this.changeForWeddingCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
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
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.nonweddingpic} picLimit={1}></PictureUploader>
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
                            <td><Label for="duration">Duration of use</Label></td>
                            <td><Input type="number" name="duration" id="duration" placeholder="Duration of use" value={this.state.duration} onChange = {(event) => this.setState({ duration : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="kapasitas">Capacity</Label></td>
                            <td><Input type="number" name="kapasitas" id="kapasitas" placeholder="Capacity" value={this.state.kapasitas} onChange = {(event) => this.setState({ kapasitas : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="luas">Large</Label></td>
                            <td><Input type="number" name="luas" id="luas" placeholder="Large" value={this.state.luas} onChange = {(event) => this.setState({ luas : event.target.value }) }/></td>
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
                            <td><Label for="deposit">Deposit</Label></td>
                            <td><Input type="number" name="deposit" id="deposit" placeholder="Rp." value={this.state.deposit} onChange = {(event) => this.setState({ deposit : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="totalpayment">Total Payment</Label></td>
                            <td><Input type="number" name="totalpayment" id="totalpayment" placeholder="Rp." value={this.state.totalpayment} onChange = {(event) => this.setState({ totalpayment : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="downpayment">Down Payment Minimum</Label></td>
                            <td><Input type="number" name="downpayment" id="downpayment" placeholder="Rp." value={this.state.downpayment} onChange = {(event) => this.setState({ downpayment : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="keterangan">Information</Label></td>
                            <td><Input type="text" name="keterangan" id="keterangan" placeholder="Information" value={this.state.keterangan} onChange = {(event) => this.setState({ keterangan : event.target.value }) }/></td>
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
					{/* {this.renderModal()} */}
					<br/>
					{/* <div className="form-detail">
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
					</div> */}
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
                </div>
					
            </div>
        );
    }
}
export default EditNonWedding;

