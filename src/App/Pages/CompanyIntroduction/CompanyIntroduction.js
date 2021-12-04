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

class CompanyIntroduction extends Component {
    constructor(props) {
		super(props);

		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'companyintroduction');
		this.state = {
			id: 0,
			title: '',
			description: '',
			categoryid: 4,
			picture: [],
			communityid: this.props.community.communityid,
			communityShow: [],
			mainCommunity: this.props.community.communityid
		}
    }
	
	onUploadImage = (result) => {
        this.setState({ picture: result });
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
	
	componentDidMount = (communityShow) =>{
		this.selectCommunity(communityShow);
		this.props.doLoading();
		axios.post(serverUrl+'basicinfo_get_by_categoryid.php', {
            id: this.state.id,
			categoryid: this.state.categoryid,
			communityid : this.state.mainCommunity
		},
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, id, communityid) =>{
				this.props.doLoading();
				if(response.data.record.id !== undefined){
					let tmp = [];
					if(response.data.record.picture !== ""){
						tmp.push(response.data.record.picture);
					}
					this.setState({title : response.data.record.title, id: response.data.record.id});
					this.setState({description : response.data.record.description});
					this.setState({picture : tmp});
					this.setState({communityid : response.data.record.communityid});
				}
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	 
	checkData = () => {
		const {title} = this.state;
		const {description} = this.state;
		const {communityid} = this.state;
		
		if(title == null || description == null || communityid == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	doCancel = () => {
		window.location.reload();
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'basicinfo_insert_update.php', {	
			id: this.state.id,
			title: this.state.title,
			description: this.state.description,
			categoryid: this.state.categoryid,
			picture: this.state.picture,
			communityid: this.state.communityid,
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "ok"){
					alert('OK');
					this.props.history.push('/panel/companyintroduction');
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
	
render() {
        return (
            <div>
                <div className="page-header">
                    {this.language.title} {/*<span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>*/}
                </div>
                <div className="box-container">
				<Form>
					<table>
						<tbody>
						<tr>
                            <td><Label for="title">{this.language.fieldtitle}</Label></td>
                            <td><Input type="text" name="title" id="title" placeholder={this.language.fieldtitle} value={this.state.title} onChange = {(event) => this.setState({ title : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="description">{this.language.fielddescription}</Label></td>
                            <td><Input type="textarea" name="description" id="description" placeholder={this.language.fielddescription} value={this.state.description} onChange = {(event) => this.setState({ description : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.picture} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						</tbody>
                    </table>
					<br>
					</br>
					<div className="form-button-container">
						<Button color="primary" onClick={() => this.checkData()}>{this.globallang.submit}</Button> <Button color="secondary" onClick={() => this.doCancel()}>{this.globallang.cancel}</Button>
                    </div>
				</Form>
                </div>
					
            </div>
        );
    }
}
export default CompanyIntroduction;