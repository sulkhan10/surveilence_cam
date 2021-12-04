import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import FileUploader from '../../Components/FileUploader/FileUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import Modal from 'react-modal';
import matchSorter from 'match-sorter';
import './EditDownload.style.css';
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

class EditDownload extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editdownload');
		this.state = {
			downloadid: props.match.params.downloadid,
			downloadname: '',
			downloadcategoryid: '',
			shortdesc: '', 
			fulldesc: '', 
			downloadpic: [],
			tags: '',
			communityid: '',
			isavailable: false,
			downloadCategoryShow: [],
			communityShow: [],
			tagShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
			fileLists: [],
			modalIsOpen: false,
			downloadcategoryname: ''
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
	
	addDownloadCategory = (downloadcategoryid) => {
		const {downloadcategoryname} = this.state;
		
		if(downloadcategoryname == null || downloadcategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'downloadcategory_insert_update.php', {			
				downloadcategoryid: this.state.downloadcategoryid,
				downloadcategoryname: this.state.downloadcategoryname
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({downloadcategoryid: response.data.record});
					this.selectDownloadCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	 
	onUploadImage = (result) => {
        this.setState({ downloadpic: result });
    }
	
	onUploadFile = (result) => {
        this.setState({ fileLists: result });
    }
	
	selectDownloadCategory = (downloadCategoryShow) =>{
		axios.post(serverUrl+'downloadcategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ downloadCategoryShow: response.data.records});
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
	
	selectTag = (tagShow) =>{
		axios.post(serverUrl+'tag_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				let tmp = []
				response.data.records.map((item,i)=>{
					tmp.push(item.tagname);
				});
                this.setState({ tagShow: tmp});
				console.log(this.state.tagShow);
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	changeDownloadCategory = (downloadcategoryid)=>{
        this.setState({downloadcategoryid: downloadcategoryid});
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	changeTabSelector = (tags) =>{
        this.setState({tags: tags});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	checkData = () => {
		const {downloadname} = this.state;
		const {downloadcategoryid} = this.state;
		const {shortdesc} = this.state;
		const {fulldesc} = this.state;
		const {downloadpic} = this.state;
		const {tags} = this.state;
		const {communityid} = this.state;
		const {isavailable} = this.state;
		
		if(downloadname == null || downloadcategoryid == null || shortdesc == null || fulldesc == null || communityid == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = (downloadCategoryShow, communityShow, tagShow) => {
		this.selectDownloadCategory(downloadCategoryShow);
		this.selectCommunity(communityShow);
		this.selectTag(tagShow);
		this.props.doLoading();
		axios.post(serverUrl+'download_get_by_id.php', {
            downloadid: this.state.downloadid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, downloadcategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.downloadpic !== ""){
					tmp.push(response.data.record.downloadpic);
				}
				
				let filetemp = [];
				if(response.data.record.filelist !== ""){
					let filename = response.data.record.filelist.split('/');
					
					let tmp = {
						name: filename[filename.length-1],
						base64: response.data.record.filelist
					}

					filetemp.push(tmp);
				}
				
				this.setState({downloadid : response.data.record.downloadid});
				this.setState({downloadname : response.data.record.downloadname});
				this.setState({downloadcategoryid : response.data.record.downloadcategoryid});
				this.setState({shortdesc : response.data.record.shortdesc});
				this.setState({fulldesc : response.data.record.fulldesc});
				this.setState({downloadpic : tmp});
				this.setState({tags : response.data.record.tags});
				this.setState({communityid : response.data.record.communityid});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});
				this.setState({fileLists : filetemp});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		console.log(this.state.fileLists);
		this.props.doLoading();
        axios.post(serverUrl+'download_insert_update.php', {
			downloadid: this.state.downloadid,
			downloadname: this.state.downloadname,
			downloadcategoryid: this.state.downloadcategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			downloadpic: this.state.downloadpic,
			tags: this.state.tags,
			communityid: this.state.communityid,
			isavailable: this.state.isavailable ? 1:0,
			filelist: this.state.fileLists
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listdownload');
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
                            <td><Label for="downloadcategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="downloadcategoryname" id="downloadcategoryname" value={this.state.downloadcategoryname} placeholder="Download Category" onChange = {(event) => this.setState({ downloadcategoryname : event.target.value }) }/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addDownloadCategory()}>{this.language.modalsubmit}</Button>
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
                            <td><Label for="downloadname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="downloadname" id="downloadname" placeholder="Download Name" value={this.state.downloadname} onChange = {(event) => this.setState({ downloadname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="downloadcategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.downloadcategoryid} valueColumn={'downloadcategoryid'} showColumn={'downloadcategoryname'} columns={['downloadcategoryname']} data={this.state.downloadCategoryShow} onChange={this.changeDownloadCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="shortdesc">{this.language.fieldshortdesc}</Label></td>
                            <td><Input type="textarea" name="shortdesc" id="shortdesc" placeholder="Download Short Description" value={this.state.shortdesc} onChange = {(event) => this.setState({ shortdesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.fieldfulldesc}</Label></td>
                            <td><Input type="textarea" name="fulldesc" id="fulldesc" placeholder="Download Full Description" value={this.state.fulldesc} onChange = {(event) => this.setState({ fulldesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.downloadpic} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="tags">{this.language.fieldtags}</Label></td>
                            <TagSelector width={300} value={this.state.tags} data={this.state.tagShow} onChange={this.changeTabSelector} />
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
                            <td><Label for="isavailable">{this.language.fieldisavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
							<td><Label>Upload File</Label></td>
                            <td><FileUploader onUpload={this.onUploadFile} fileLimit={3} fileList={this.state.fileLists}></FileUploader></td>
						</tr>
                    </table>
					{this.renderModal()}
					<br/>
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditDownload;