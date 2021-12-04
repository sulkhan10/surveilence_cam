import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class InputServiceCenterCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputservicecentercategory');
		this.state = {
			servicecentercategoryid: 0,
			servicecentercategoryname: '',
			icon: [],
			isavailable: false
		}
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	onUploadImage = (result) => {
        this.setState({ icon: result });
    }
	
	availableHandleChecked (isavailable) {
		this.setState({isavailable: !this.state.isavailable});
	}
	
	checkData = () => {
		const {servicecentercategoryname} = this.state;
		const {icon} = this.state;
		
		if(servicecentercategoryname == null || servicecentercategoryname == '' || icon == null || icon == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'servicecentercategory_insert_update.php', {			
			servicecentercategoryid: this.state.servicecentercategoryid,
			servicecentercategoryname: this.state.servicecentercategoryname,
			icon: this.state.icon,
			isavailable: this.state.isavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listservicecentercategory');
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
                            <td><Label for="servicecentercategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="servicecentercategoryname" id="servicecentercategoryname" value={this.state.servicecentercategoryname} placeholder="Service Center Category" onChange = {(event) => this.setState({ servicecentercategoryname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.icon} picLimit={1}></PictureUploader>
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
export default InputServiceCenterCategory;