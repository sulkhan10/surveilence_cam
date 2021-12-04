import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, Label, Button, Input} from 'reactstrap';
import classnames from 'classnames';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import VideoUploader from '../../Components/VideoUploader/VideoUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
//import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import Modal from 'react-modal';
import matchSorter from 'match-sorter';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';


const Style = {
	control: provided => ({ ...provided, width: '100%' }),
	container: provided => ({ ...provided, width: '100%' }),
}

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
	// disableNativeSpellChecker: false
	// skin: "moono",
	// plugins:
	//   "dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,notification,button,toolbar,clipboard,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,copyformatting,div,resize,elementspath,enterkey,entities,popup,filetools,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,tableselection,undo,lineutils,widgetselection,widget,notificationaggregator,uploadwidget,uploadimage,wsc"
  };

class EditNewsCovid extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editnews');
		this.state = {
			newsid: props.match.params.newsid,
			title: '',
			newscategoryid: '', 
			headline:'',
			subtitle: '', 
			fulldesc: '', 
			newspic: [],
			bignewspic:[],
			thumbnail:[],
            communityid: '',
            expireddate: moment(),
            isavailable: false,
			newsCategoryShow: [],
            communityShow:[],
			modalIsOpen: false,
			newscategoryname: '',
			startDate: moment(),
			endDate:moment(),
			activeTab:'1',
			setActiveTab:1,
			companyShow: [],
			companyid: null,
			company: null,
			previewmode:'0',
			status:'1',
			stickystatus:'1',
			videourl:[],
			tabaction:0

		}
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);
    }
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
	}
	
	addNewsCategory = (newscategoryid) => {
		const {newscategoryname} = this.state;
		
		if(newscategoryname == null || newscategoryname == ''){
			alert(this.language.validation);
			return false;
		}
		
		else {
			axios.post(serverUrl+'newscategory_insert_update.php', {			
				newscategoryid: this.state.newscategoryid,
				newscategoryname: this.state.newscategoryname
			}, 
			{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
				.then( (response) =>{
					
					this.closeModal();
					this.setState({newscategoryid: response.data.record});
					this.selectNewsCategory();
					
				})
				.catch( (error) =>{
					console.log(error);
					alert(error);
				});
		}
	}
	
	onUploadImage = (result) => {
        this.setState({ newspic: result });
    }
	
	selectNewsCategory = () =>{
		axios.post(serverUrl+'newscategory_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ newsCategoryShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectCommunity = (companyShow) =>{
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
	
	componentDidMount = () =>{
        this.selectCommunity();
        this.selectNewsCategory();
        this.props.doLoading();
		axios.post(serverUrl+'news_covid19_get_by_id.php', {
            newsid: this.state.newsid
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				console.log(response);
				this.props.doLoading();
                let tmp = [];
				if(response.data.record.newspic !== ""){
					tmp.push(response.data.record.newspic);
				}
				
				let video = [];
				if(response.data.record.videourl !== ""){
					this.setState( {tabaction: 1});
					video.push(response.data.record.videourl);
				}

				if(response.data.record.fulldesc !== ""){
					this.setState( {tabaction: 1});
				}

                let expired = moment(response.data.record.expireddate);
				this.setState({
                    headline : response.data.record.title,
					newscategoryid : response.data.record.newscategoryid,
                    subtitle : response.data.record.shortdesc,
                    fulldesc : response.data.record.fulldesc,
					bignewspic : tmp,
					videourl : video,
					communityid : response.data.record.communityid,
					status : response.data.record.isavailable,
					stickystatus : response.data.record.stickystatus,
					previewmode : response.data.record.previewmode,
                    expireddate : expired
				});
				this.setState({thumbnail : response.data.record.thumbnailList});

            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
	onEditorChange( evt ) {
		
		this.setState({
			fulldesc: evt.editor.getData()
		});
		
		this.setState( {tabaction: 1});

		console.log(this.state.fulldesc);
		
    }
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	changeNewsCategory = (newscategoryid)=>{
        this.setState({newscategoryid: newscategoryid});
	}
	
	onUploadVideoUrl = (result) => {
		this.setState({ videourl: result });
		this.setState( {
			tabaction: 1});
	}

    updateDate = (date) => {
        this.setState({ expireddate: date });
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}


	handleStatusChangePreviewMode(e){
		this.setState({
			previewmode: e.target.value
		})
		console.log(this.state.previewmode);
	}

	
	handleStatus(e){
		this.setState({
			status: e.target.value
		})
		console.log(this.state.status);
	}

	handleStickyStatus(e){
		this.setState({
			stickystatus: e.target.value
		})
		console.log(this.state.stickystatus);
	}

	onUploadImageBignewspic = (result) => {
        this.setState({ bignewspic: result });
	}
	
	onUploadImagethumbnail = (result) => {
        this.setState({ thumbnail: result });
    }
	 
	onUploadImageIcon = (result) => {
        this.setState({ icon: result });
	}

	setStartDate = (date) =>{
		this.setState({startDate: date})
		console.log(this.state.startDate);
	}
	setEndDate = (date) =>{
		this.setState({endDate: date})
		console.log(this.state.endDate);
	}

	toggle = (tab) => {
		this.setState({activeTab: tab});
	}

	 
	checkData = () => {
		const {headline} = this.state;
		const {newscategoryid} = this.state;
		const {communityid} = this.state;
		const {previewmode} = this.state;
		const {status} = this.state;
		const {stickystatus} = this.state;
		const {fulldesc} = this.state;
		const {videourl} = this.state;
		const {tabaction} = this.state;
		
		if(headline === null || headline === '' || newscategoryid === null || newscategoryid === 0  || communityid === null || communityid === 0 || previewmode === null || status === null || stickystatus === null || previewmode === '' || status === '' || stickystatus === '' || tabaction === 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

		let body ={
			newsid: this.state.newsid,
			title: this.state.headline,
			newscategoryid: this.state.newscategoryid,
			shortdesc: this.state.subtitle,
			fulldesc: this.state.fulldesc,
			newspic: this.state.bignewspic,
			communityid: this.state.communityid,
			currentdatetime: dateTime,
			videourl: this.state.videourl,
			thumbnail: this.state.thumbnail,
			previewmode: this.state.previewmode,
			status: this.state.status,
			stickystatus: this.state.stickystatus,
			startDate: this.state.startDate.format('YYYY-MM-DD'),
            expireddate : this.state.expireddate.format('YYYY-MM-DD')
		}
		console.log(body);
		this.props.doLoading();
        axios.post(serverUrl+'news_covid19_insert_update.php', body, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listnewscovid19');
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }
	
	cancel=()=>{
		this.props.history.push('/panel/listnewscovid19');
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
                            <td width={160} ><Label for="newscategoryid">{this.language.typeofinformation} <span style={{color:'#FF0000'}} >*</span> </Label></td>
                            <td>
								<SelectMultiColumn width={'100%'} value={this.state.newscategoryid} valueColumn={'newscategoryid'} showColumn={'newscategoryname'} columns={['newscategoryname']} data={this.state.newsCategoryShow} onChange={this.changeNewsCategory} />
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="headline">{this.language.headline} <span style={{color:'#FF0000'}} >*</span></Label></td>
                            <td><Input type="textarea" rows={4} name="headline" id="title" placeholder="please fill in" value={this.state.headline} onChange = {(event) => this.setState({ headline : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="title">{this.language.subtitle}</Label></td>
                            <td><Input type="textarea" rows={4} name="subtitle" id="subtitle" placeholder={this.language.fieldshortdesc} value={this.state.subtitle} onChange = {(event) => this.setState({ subtitle : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.language.bigpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImageBignewspic} picList = {this.state.bignewspic} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="locatedinthepark">{this.language.locatedinthepark}</Label></td>
                            <td><SelectMultiColumn width={'100%'} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="fulldesc">{this.language.details} <span style={{color:'#FF0000'}} >*</span></Label></td>
							<td>
								<Nav tabs>
									<NavItem>
										<NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={()=>this.toggle('1')}>Type of information</NavLink>
									</NavItem>
									<NavItem>
										<NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() =>this.toggle('2')}>Movie type</NavLink>
									</NavItem>
								</Nav>
								<TabContent activeTab={this.state.activeTab}>
									<TabPane tabId="1">
										<Row>
											<Col sm="12">
												<CKEditor
													activeClass="p10"
													config={config}
													data={this.state.fulldesc}
													content={this.state.fulldesc}
													onChange={this.onEditorChange}
												/>
											</Col>
										</Row>
									</TabPane>
									<TabPane tabId="2">
										<Row>
											<Col sm="12">
												<VideoUploader onUpload={this.onUploadVideoUrl} picList = {this.state.videourl} picLimit={1}></VideoUploader>
											</Col>
										</Row>
									</TabPane>
								</TabContent>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.language.thumbnail}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImagethumbnail} picList = {this.state.thumbnail} picLimit={3}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">{this.language.previewmode} <span style={{color:'#FF0000'}} >*</span></Label></td>
							<tr>
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='1' checked={this.state.previewmode === '1'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Three-picture mode</span></Label>
								</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='2' checked={this.state.previewmode === '2'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Single image mode</span></Label>
                        		</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='3' checked={this.state.previewmode === '3'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Text mode</span></Label>
                        		</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='4' checked={this.state.previewmode === '4'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Big Picture Mode</span></Label>
                        		</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='5' checked={this.state.previewmode === '5'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Large video mode</span></Label>
                        		</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='6' checked={this.state.previewmode === '6'}  onChange={this.handleStatusChangePreviewMode.bind(this)} />Small video mode</span></Label>
                        		</td>
							</tr>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">{this.language.status} <span style={{color:'#FF0000'}} >*</span></Label></td>
							<tr>
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='1' checked={this.state.status === '1'}  onChange={this.handleStatus.bind(this)} />Show</span></Label>
								</td>
								&nbsp;&nbsp;&nbsp;
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='2' checked={this.state.status === '2'}  onChange={this.handleStatus.bind(this)} />Hidden</span></Label>
                        		</td>
							</tr>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="status">{this.language.stickystatus} <span style={{color:'#FF0000'}} >*</span></Label></td>
							<tr>
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='1' checked={this.state.stickystatus === '1'}  onChange={this.handleStickyStatus.bind(this)} />Default</span></Label>
								</td>
							</tr>
							<tr>
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='2' checked={this.state.stickystatus === '2'}  onChange={this.handleStickyStatus.bind(this)} />Permanent sticking (no time)</span></Label>
                        		</td>
							</tr>
							<tr>
								<td>
									<Label><span style={{fontSize:16}}><input type="radio" value='3' checked={this.state.stickystatus === '3'}  onChange={this.handleStickyStatus.bind(this)} />Stick to top by time period (no time)</span></Label> &nbsp; 
									<div className="contentDate">
										<DatePicker selected={this.state.startDate} disabled={this.state.stickystatus !== '3'} onChange={date => this.setStartDate(date)} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} className=""/>&nbsp;<span>TO</span>&nbsp;
										<DatePicker selected={this.state.endDate} disabled={this.state.stickystatus !== '3'} onChange={date => this.setEndDate(date)} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate} minDate={this.state.startDate} className=""/>
									</div>
                        		</td>
							</tr>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                    </table>
                </div>
					<div className="form-button-container">
						<Button color="secondary" 
						onClick={()=>this.cancel()}><FontAwesomeIcon icon="chevron-circle-left"/>&nbsp;{this.globallang.cancel}</Button>&nbsp;&nbsp;
						<Button color="primary" 
						onClick={()=>this.checkData()}><FontAwesomeIcon icon="save"/>&nbsp;{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditNewsCovid;