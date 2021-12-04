import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
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
import ReactTable from "react-table";
import Modal from 'react-modal';
import matchSorter from 'match-sorter';
import { confirmAlert } from 'react-confirm-alert'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TagSelector from '../../Components/TagSelector/TagSelector';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '55%',
      right                 : '-20%',
      bottom                : '-30%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  const config = {
	toolbarGroups: [
	  { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
	  { name: "document", groups: ["document", "doctools"] },
	  {
		name: "editing",
		groups: ["find", "selection", "spellchecker", "editing"]
	  },
	  { name: "forms", groups: ["forms"] },
	  {
		name: "paragraph",
		groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"]
	  },
	  { name: "links", groups: ["links"] },
	  { name: "insert", groups: ["insert"] },
	  { name: "styles", groups: ["styles"] },
	  { name: "colors", groups: ["colors"] },
	  { name: "tools", groups: ["tools"] },
	  { name: "clipboard", groups: ["clipboard", "undo"] },
	  { name: "others", groups: ["others"] },
	],
	
	fontSize_sizes: "16/16px;24/24px;48/48px;",
	font_names:
	  "Arial/Arial, Helvetica, sans-serif;" +
	  "Times New Roman/Times New Roman, Times, serif;" +
	  "Verdana",
	allowedContent: true,
	height: 200
    
}; 

class InputFoodGarden extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputfoodgarden');
		this.state = {
			foodgardenid: 0,
			foodgardenname: '',
			directorycategoryid: 0,
            directoryCategoryShow: [],
			tagShow: [],
            foodgardenlocation: '',
            foodgardenshortdesc:'',
            foodgardenfulldesc:'',
			foodgardenphone: '',
            foodgardenpicture: [],
            infoDrinkspicture:[],
            infoFoodspicture:[],
            infoOtherspicture:[],
			type: '',
			communityid: '',
            isavailable: false,
            tags:'',
            infoListFoods:[],
            infoFoodsField:'',
            infoFoodsValue:'',
            infoFoodsPic:[],
            infoFoodsDesc:'',
            infoListDrinks:[],
            infoDrinksField:'',
            infoDrinksValue:'',
            infoDrinksPic:[],
            infoDrinksDesc:'',
            infoListOthers:[],
            infoOthersField:'',
            infoOthersValue:'',
            infoOthersPic:[],
            infoOthersDesc:'',
            modalIsOpen: false
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

    addDirectoryCategory = (directorycategoryid) => {
		const {directorycategoryname} = this.state;
		
		if(directorycategoryname == null || directorycategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'directorycategory_insert_update.php', {			
				directorycategoryid: this.state.directorycategoryid,
				directorycategoryname: this.state.directorycategoryname
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({directorycategoryid: response.data.record});
					this.selectDirectoryCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
    }
    

    selectDirectoryCategory = () =>{
		axios.post(serverUrl+'directorycategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ directoryCategoryShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
    

	selectCommunity = () =>{
		axios.post(serverUrl+'cp_community_list_available.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ communityShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectTag = () =>{
		axios.post(serverUrl+'tag_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				let tmp = []
				response.data.records.map((item,i)=>{
					tmp.push(item.tagname);
				});
                this.setState({ tagShow: tmp});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	changeDirectoryCategory = (directorycategoryid)=>{
        this.setState({directorycategoryid: directorycategoryid});
    }

    changeTabSelector = (tags) =>{
        this.setState({tags: tags});
    }
	
	
	onUploadImage = (result) => {
        this.setState({ foodgardenpicture: result });
    }

    onUploadImageFoods = (result) => {
        this.setState({ infoFoodspicture: result });
    }

    onUploadImageDrinks = (result) => {
        this.setState({ infoDrinkspicture: result });
    }

    onUploadImageOthers = (result) => {
        this.setState({ infoOtherspicture: result });
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
    
    onEditorChange( evt ) {
		
		this.setState( {
			foodgardenshortdesc: evt.editor.getData()
        } );
		console.log(this.state.foodgardenshortdesc);
    }
	 
	checkData = () => {
        const {foodgardenname} = this.state;
        const {directorycategoryid} = this.state;
        const {foodgardenshortdesc} = this.state;
        const {communityid} = this.state;
        const {isavailable} = this.state;
		
		if(foodgardenname == null || directorycategoryid == null || foodgardenshortdesc == null || communityid == null){
			alert(this.language.validation);
			return false;
		}
		
		else{
			this.onSubmit();
		}
	}
	
	componentDidMount = () => {
        this.selectDirectoryCategory();
		this.selectCommunity();
        this.selectTag();
        
    }
    
    addInfoFood=()=>{
		if(this.state.infoFoodsField===''){
			alert('Please input info name');
			return false;
		}
		if(this.state.infoFoodsValue===''){
			alert('Please input info value');
			return false;
        }
        if(this.state.infoFoodsDesc===''){
			alert('Please input info description');
			return false;
        }
        
        // if(this.state.infoFoodspicture===''){
		// 	return true;
		// }

		let arr = this.state.infoListFoods ;
        arr.push({ field: this.state.infoFoodsField, value: this.state.infoFoodsValue, desc: this.state.infoFoodsDesc, picture: this.state.infoFoodspicture[0]});
        console.log(this.state.infoFoodsPic);
        this.setState({infoListFoods: arr, infoFoodsField:'', infoFoodsValue:'', infoFoodsDesc:'', infoFoodspicture:''});
        console.log(this.state.infoListFoods);

    }

    addInfoDrink=()=>{
		if(this.state.infoDrinksField===''){
			alert('Please input info name');
			return false;
		}
		if(this.state.infoDrinksValue===''){
			alert('Please input info value');
			return false;
        }
        if(this.state.infoDrinksDesc===''){
			alert('Please input info Desc');
			return false;
        }
        
        // if(this.state.infoDrinkspicture===''){
		// 	return true;
		// }

		let arr = this.state.infoListDrinks ;
		arr.push({ field: this.state.infoDrinksField, value: this.state.infoDrinksValue, desc:this.state.infoDrinksDesc, picture: this.state.infoDrinkspicture[0]});
		this.setState({infoListDrinks: arr, infoDrinksField:'', infoDrinksValue:'', infoDrinksDesc:'', infoDrinkspicture:''});
        console.log(this.state.infoListDrinks);
    }

    addInfoOther=()=>{
		if(this.state.infoOthersField===''){
			alert('Please input info name');
			return false;
		}
		if(this.state.infoOthersValue===''){
			alert('Please input info value');
			return false;
        }
        if(this.state.infoOthersDesc===''){
			alert('Please input info desc');
			return false;
        }
        
        // if(this.state.infoOtherspicture===''){
		// 	return true;
		// }

		let arr = this.state.infoListOthers ;
		arr.push({ field: this.state.infoOthersField, value: this.state.infoOthersValue, desc: this.state.infoOthersDesc, picture: this.state.infoOtherspicture[0] });
		this.setState({infoListOther: arr, infoOthersField:'', infoOthersValue:'', infoOthersDesc:'', infoOtherspicture:'' });
        console.log(this.state.infoListOthers);
    }
    
    removeInfoFoods=(info)=>{
		let tmp=[];
		this.state.infoListFoods.map((item, i)=>{
			if(item !== info){
				tmp.push(item);
			}
		});
		this.setState({infoListFoods: tmp});
    }
    
    removeInfoDrinks=(info)=>{
		let tmp=[];
		this.state.infoListDrinks.map((item, i)=>{
			if(item !== info){
				tmp.push(item);
			}
		});
		this.setState({infoListDrinks: tmp});
    }
    
    removeInfoOthers=(info)=>{
		let tmp=[];
		this.state.infoListOthers.map((item, i)=>{
			if(item !== info){
				tmp.push(item);
			}
		});
		this.setState({infoListOthers: tmp});
	}
	
	onSubmit = () => {
        this.props.doLoading();
        
        let params = {
            foodgardenid: this.state.foodgardenid,
			directorycategoryid: this.state.directorycategoryid,
			foodgardenlocation: this.state.foodgardenlocation,
			foodgardenname: this.state.foodgardenname,
            foodgardenphone: this.state.foodgardenphone,
            foodgardenshortdesc: this.state.foodgardenshortdesc,
            foodgardenfulldesc: this.state.foodgardenfulldesc,
			foodgardenpicture: this.state.foodgardenpicture,
            infoListFoods: this.state.infoListFoods,
            infoListDrinks: this.state.infoListDrinks,
            infoListOthers: this.state.infoListOthers,
            communityid: this.state.communityid,
            isavailable: this.state.isavailable ? 1:0,
            tags: this.state.tags,
        }

        console.log(params);

        axios.post(serverUrl+'foodgarden_insert_update.php', params, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                console.log(response);
				this.props.doLoading();
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listfoodgarden');
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
                            <td><Label for="directorycategoryname">{this.language.modalfieldname}</Label></td>
                            <td><Input type="text" name="directorycategoryname" id="directorycategoryname" value={this.state.directorycategoryname} placeholder="Directory Category" onChange = {(event) => this.setState({ directorycategoryname : event.target.value }) }/></td>
                        </tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.addCompanyCategory()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
    }
    
    renderInfoFoods=()=>{
		if(this.state.infoListFoods.length > 0){
			return (
				<div className="detail-info-list">
					<table>
						<tbody>
							{
								this.state.infoListFoods.map((item,i)=>
									<tr>
										<td className="td-field">
											{item.field}
										</td>
										<td className="td-doubledot">:</td>
										<td className="td-value">{item.value}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value">{item.desc}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value"> <img src={item.picture}></img></td>
										<td className="td-button"><Button color="warning" size="sm" onClick={()=>this.removeInfoFoods(item)} block>Remove</Button></td>
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
    
    renderInfoDrinks=()=>{
		if(this.state.infoListDrinks.length > 0){
			return (
				<div className="detail-info-list">
					<table>
						<tbody>
							{
								this.state.infoListDrinks.map((item,i)=> 
									<tr>
									<td className="td-field">
											{item.field}
										</td>
										<td className="td-doubledot">:</td>
										<td className="td-value">{item.value}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value">{item.desc}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value"> <img src={item.picture}></img></td>
										<td className="td-button"><Button color="warning" size="sm" onClick={()=>this.removeInfoDrinks(item)} block>Remove</Button></td>
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
    
    renderInfoOthers=()=>{
		if(this.state.infoListOthers.length > 0){
			return (
				<div className="detail-info-list">
					<table>
						<tbody>
							{
								this.state.infoListOthers.map((item,i)=>
									<tr>
                                    <td className="td-field">
											{item.field}
										</td>
										<td className="td-doubledot">:</td>
										<td className="td-value">{item.value}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value">{item.desc}</td>
                                        <td className="td-doubledot">:</td>
                                        <td className="td-value"> <img src={item.picture}></img></td>
										<td className="td-button"><Button color="warning" size="sm" onClick={()=>this.removeInfoOthers(item)} block>Remove</Button></td>
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
						<tbody>
						<tr>
                            <td><Label for="foodgardenname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="foodgardenname" id="foodgardenname" value={this.state.foodgardenname} placeholder={this.language.fieldname} onChange = {(event) => this.setState({ foodgardenname : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="directorycategoryid">{this.language.fieldcategory}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.directorycategoryid} valueColumn={'directorycategoryid'} showColumn={'directorycategoryname'} columns={['directorycategoryname']} data={this.state.directoryCategoryShow} onChange={this.changeDirectoryCategory} />&nbsp;&nbsp;
                                <Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="foodgardenlocation">{this.language.fieldaddress}</Label></td>
                            <td><Input type="textarea" name="foodgardenlocation" id="foodgardenlocation" value={this.state.foodgardenlocation} placeholder={this.language.fieldaddress} onChange = {(event) => this.setState({ foodgardenlocation : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="foodgardenphone">{this.language.fieldphone}</Label></td>
                            <td><Input type="text" name="foodgardenphone" id="foodgardenphone" placeholder="08xxxxxxx" value={this.state.foodgardenphone} onChange = {(event) => this.setState({ foodgardenphone : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.foodgardenpicture} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
                        <tr>
                            <td><Label for="foodgardenshortdesc">{this.language.fieldshortdesc}</Label></td>
                            <td><Input type="textarea" name="foodgardenshortdesc" id="foodgardenshortdesc" placeholder={this.language.fieldshortdesc} value={this.state.foodgardenshortdesc} onChange = {(event) => this.setState({ foodgardenshortdesc : event.target.value }) }/></td>
                        </tr>
                        <tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
                        <tr>
                            <td><Label for="foodgardenfulldesc">{this.language.fieldfulldesc}</Label></td>
                            <td><Input type="textarea" name="foodgardenfulldesc" id="foodgardenfulldesc" placeholder={this.language.fieldfulldesc} value={this.state.foodgardenfulldesc} onChange = {(event) => this.setState({ foodgardenfulldesc : event.target.value }) }/></td>
                            {/* <td>
								<CKEditor
									activeClass="p10"
									config={config}
									content={this.state.foodgardenfulldesc}
									onChange={this.onEditorChange}
								/>
							</td> */}
                        </tr>
                        <tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
                        <tr>
                            <td><Label for="tags">{this.language.fieldtags}</Label></td>
                            <TagSelector width={300} value={this.state.tags} data={this.state.tagShow} onChange={this.changeTabSelector} />
                        </tr>
                        <tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
						</tbody>
                    </table>
                    {this.renderModal()}
                    <br/>
                    <div className="form-detail">
						<div className="detail-title">List Info Foods</div>
						<div className="detail-info-input">
							<Row>
								<Col sm={6}>
									<Input type="text" name="infoFoodsField" id="infoFoodsField" placeholder="Input Name Food" value={this.state.infoFoodsField} onChange = {(event) => this.setState({ infoFoodsField : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<Input type="number" name="infoFoodsValue" id="infoFoodsValue" placeholder="Rp." value={this.state.infoFoodsValue} onChange = {(event) => this.setState({ infoFoodsValue : event.target.value }) }/>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Input  type="textarea" rows="8"  name="infoFoodsDesc" id="infoFoodsDesc" placeholder="Input Food Description" value={this.state.infoFoodsDesc} onChange = {(event) => this.setState({ infoFoodsDesc : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<PictureUploader onUpload={this.onUploadImageFoods} picList = {this.state.infoFoodspicture} picLimit={1}></PictureUploader>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Button color="success" block onClick={()=>this.addInfoFood()}>{this.globallang.add}</Button>
								</Col>
							</Row>
						</div>
						{this.renderInfoFoods()}
					</div>
                    <br/>
                    <div className="form-detail">
						<div className="detail-title">List Info Drinks</div>
						<div className="detail-info-input">
                        <Row>
								<Col sm={6}>
									<Input type="text" name="infoDrinksField" id="infoDrinksField" placeholder="Input Name Drink" value={this.state.infoDrinksField} onChange = {(event) => this.setState({ infoDrinksField : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<Input type="number" name="infoDrinksValue" id="infoDrinksValue" placeholder="Rp." value={this.state.infoDrinksValue} onChange = {(event) => this.setState({ infoDrinksValue : event.target.value }) }/>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Input  type="textarea" rows="8" name="infoDrinksDesc" id="infoDrinksDesc" placeholder="Input Drink Description" value={this.state.infoDrinksDesc} onChange = {(event) => this.setState({ infoDrinksDesc : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<PictureUploader onUpload={this.onUploadImageDrinks} picList = {this.state.infoDrinkspicture} picLimit={1}></PictureUploader>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Button color="success" block onClick={()=>this.addInfoDrink()}>{this.globallang.add}</Button>
								</Col>
							</Row>
						</div>
						{this.renderInfoDrinks()}
					</div>
                    <br/>
                    <div className="form-detail">
						<div className="detail-title">List Info Others</div>
						<div className="detail-info-input">
                        <Row>
								<Col sm={6}>
									<Input type="text" name="infoOthersField" id="infoOthersField" placeholder="Input Name Other" value={this.state.infoOthersField} onChange = {(event) => this.setState({ infoOthersField : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<Input type="number" name="infoOthersValue" id="infoOthersValue" placeholder="Rp." value={this.state.infoOthersValue} onChange = {(event) => this.setState({ infoOthersValue : event.target.value }) }/>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Input  type="textarea" rows="8" name="infoOthersDesc" id="infoOthersDesc" placeholder="Input Other Description" value={this.state.infoOthersDesc} onChange = {(event) => this.setState({ infoOthersDesc : event.target.value }) }/>
								</Col>
								<Col sm={6}>
								<PictureUploader onUpload={this.onUploadImageOthers} picList = {this.state.infoOtherspicture} picLimit={1}></PictureUploader>
								</Col>
							</Row>
                            &nbsp;
                            <Row>
								<Col sm={6}>
									<Button color="success" block onClick={()=>this.addInfoOther()}>{this.globallang.add}</Button>
								</Col>
							</Row>
						</div>
						{this.renderInfoOthers()}
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
export default InputFoodGarden;