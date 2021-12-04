import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class EditOnlineStoreCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editonlinestorecategory');
		this.state = {
			onlinestorecategoryid: props.match.params.onlinestorecategoryid,
			onlinestorecategoryname: '',
			icon: [],
			isavailable: false
		}
    }
	
	onUploadImage = (result) => {
        this.setState({ icon: result });
    }
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	checkData = () => {
		const {onlinestorecategoryname} = this.state;
		const {icon} = this.state;
		
		if(onlinestorecategoryname == null || onlinestorecategoryname == '' || icon == null || icon == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.props.doLoading();
		axios.post(serverUrl+'onlinestorecategory_get_by_id.php', {
            onlinestorecategoryid: this.state.onlinestorecategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.icon !== ""){
					tmp.push(response.data.record.icon);
				}
				
				this.setState({onlinestorecategoryid : response.data.record.onlinestorecategoryid});
				this.setState({onlinestorecategoryname : response.data.record.onlinestorecategoryname});
				this.setState({icon : tmp});
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
        axios.post(serverUrl+'onlinestorecategory_insert_update.php', {			
			onlinestorecategoryid: this.state.onlinestorecategoryid,
			onlinestorecategoryname: this.state.onlinestorecategoryname,
			icon: this.state.icon,
			isavailable: this.state.isavailable ? 1:0
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listonlinestorecategory');
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
                            <td><Label for="onlinestorecategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="onlinestorecategoryname" id="onlinestorecategoryname" value={this.state.onlinestorecategoryname} placeholder="Online Store Category" onChange = {(event) => this.setState({ onlinestorecategoryname : event.target.value }) }/></td>
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
                            <td><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
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
export default EditOnlineStoreCategory;