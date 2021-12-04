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

class InputBusinessCase extends Component {
    constructor(props) {
		super(props);
		
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputbusinesscase');

		this.state = {
			id: 0,
			title: '',
			description: '',
			categoryid: 1,
			picture: [],
			communityid: '',
			communityShow: []
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
	}
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	doCancel = () => {
		this.props.history.push('/panel/businesscase');
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
	
	onSubmit = () => {
        axios.post(serverUrl+'businesscase_insert_update.php', {	
			id: this.state.id,
			title: this.state.title,
			description: this.state.description,
			categoryid: this.state.categoryid,
			picture: this.state.picture,
			communityid: this.state.communityid,
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/businesscase');
				}else{
					alert(response.data.message);
				}
				
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
render() {
        return (
            <div>
                <div className="page-header">
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
				<Form>
					<table>
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
export default InputBusinessCase;