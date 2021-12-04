import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class InputEntertainment extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputentertainment');
		this.state = {
			entertainmentid: 0,
			link: '',
			image: [],
			isavailable: false
		}
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	onUploadImage = (result) => {
        this.setState({ image: result });
    }
	
	availableHandleChecked (isavailable) {
		this.setState({isavailable: !this.state.isavailable});
	}
	
	checkData = () => {
		const {link} = this.state;
		const {image} = this.state;
		
		if(link == '' || image == null || image == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'entertainment_insert_update.php', {			
			entertainmentid: this.state.entertainmentid,
			link: this.state.link,
			image: this.state.image,
			isavailable: this.state.isavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listentertainment');
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
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="link">{this.language.fieldlink}</Label></td>
                            <td><Input type="text" name="link" id="link" value={this.state.link} placeholder="https://www.facebook.com/" onChange = {(event) => this.setState({ link : event.target.value }) }/></td>
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
                            <td><Label for="isavailable">{this.language.fieldavailable}</Label></td>
                            <td><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={this.availableHandleChecked}/></td>
                        </tr>
                    </table>
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default InputEntertainment;