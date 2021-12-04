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
import matchSorter from 'match-sorter'
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

class EditProduct extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editproduct');
		this.state = {
			productid: props.match.params.productid,
			productname: '',
			productcategoryid: '',
			shortdesc: '', 
			fulldesc: '', 
			productpic: [],
			gallery: [],
			tags: '',
			companyid: '',
			isavailable: false,
			productCategoryShow: [],
			productShow: [],
			tagShow: [],
			infoList:[],
			infoField:'',
			infoValue:'',
			modalIsOpen: false,
			productcategoryname: ''
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
	
	addProductCategory = (productcategoryid) => {
		const {productcategoryname} = this.state;
		
		if(productcategoryname == null || productcategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'productcategory_insert_update.php', {			
				productcategoryid: this.state.productcategoryid,
				productcategoryname: this.state.productcategoryname
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({productcategoryid: response.data.record});
					this.selectProductCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	 
	onUploadImage = (result) => {
        this.setState({ productpic: result });
    }
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }
	
	selectProductCategory = (productShow) =>{
		axios.post(serverUrl+'productcategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ productCategoryShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectCompany = (companyShow) =>{
		axios.post(serverUrl+'company_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ companyShow: response.data.records});
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
	
	changeProductCategory = (productcategoryid)=>{
        this.setState({productcategoryid: productcategoryid});
    }
	
	changeCompany = (companyid)=>{
        this.setState({companyid: companyid});
    }
	
	changeTabSelector = (tags) =>{
        this.setState({tags: tags});
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	checkData = () => {
		const {productname} = this.state;
		const {productcategoryid} = this.state;
		const {shortdesc} = this.state;
		const {fulldesc} = this.state;
		const {productpic} = this.state;
		const {tags} = this.state;
		const {companyid} = this.state;
		const {isavailable} = this.state;
		
		if(productname == null || productcategoryid == null || shortdesc == null || fulldesc == null || companyid == null){
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
	 
	 componentDidMount = (productCategoryShow, companyShow, tagShow) => {
		this.selectProductCategory(productCategoryShow);
		this.selectCompany(companyShow);
		this.selectTag(tagShow);
		this.props.doLoading();
		axios.post(serverUrl+'product_get_by_id.php', {
            productid: this.state.productid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, productcategoryid, companyid) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.productpic !== ""){
					tmp.push(response.data.record.productpic);
				}
				this.setState({productid : response.data.record.productid});
				this.setState({productname : response.data.record.productname});
				this.setState({productcategoryid : response.data.record.productcategoryid});
				this.setState({shortdesc : response.data.record.shortdesc});
				this.setState({fulldesc : response.data.record.fulldesc});
				this.setState({productpic : tmp});
				this.setState({gallery : response.data.record.gallery});
				this.setState({tags : response.data.record.tags});
				this.setState({companyid : response.data.record.companyid});
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
        axios.post(serverUrl+'product_insert_update.php', {
			productid: this.state.productid,
			productname: this.state.productname,
			productcategoryid: this.state.productcategoryid,
			shortdesc: this.state.shortdesc,
			fulldesc: this.state.fulldesc,
			productpic: this.state.productpic,
			gallery: this.state.gallery,
			tags: this.state.tags,
			companyid: this.state.companyid,
			isavailable: this.state.isavailable ? 1:0,
			infolist: this.state.infoList
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listproduct');
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
                            <td><Label for="productcategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="productcategoryname" id="productcategoryname" value={this.state.productcategoryname} placeholder="Product Category" onChange = {(event) => this.setState({ productcategoryname : event.target.value }) }/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addProductCategory()}>{this.language.modalsubmit}</Button>
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
                            <td><Label for="productname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="productname" id="productname" placeholder="Product Name" value={this.state.productname} onChange = {(event) => this.setState({ productname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="productcategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.productcategoryid} valueColumn={'productcategoryid'} showColumn={'productcategoryname'} columns={['productcategoryname']} data={this.state.productCategoryShow} onChange={this.changeProductCategory} />&nbsp;&nbsp;
								<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="shortdesc">{this.language.fieldshortdesc}</Label></td>
                            <td><Input type="textarea" name="shortdesc" id="shortdesc" placeholder="Product Short Description" value={this.state.shortdesc} onChange = {(event) => this.setState({ shortdesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.fieldfulldesc}</Label></td>
                            <td><Input type="textarea" name="fulldesc" id="fulldesc" placeholder="Product Full Description" value={this.state.fulldesc} onChange = {(event) => this.setState({ fulldesc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.productpic} picLimit={1}></PictureUploader>
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
                            <td><Label for="tags">{this.language.fieldtags}</Label></td>
                            <TagSelector width={300} value={this.state.tags} data={this.state.tagShow} onChange={this.changeTabSelector} />
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="companyid">{this.language.fieldcompany}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.companyid} valueColumn={'companyid'} showColumn={'companyname'} columns={['companyname']} data={this.state.companyShow} onChange={this.changeCompany} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.fieldisavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
                    </table>
					{this.renderModal()}
					<br/>
					<div className="form-detail">
						<div className="detail-title">Product Info</div>
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
export default EditProduct;