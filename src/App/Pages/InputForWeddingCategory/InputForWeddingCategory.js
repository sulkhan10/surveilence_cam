import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class InputForWeddingCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputforweddingcategory');
		this.state = {
			forweddingcategoryid: 0,
			for_weddingcategoryname: '',
			usefor:'',
            icon: [],
            location:'',
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
		const {for_weddingcategoryname} = this.state;
		const {icon} = this.state;
		
		if(for_weddingcategoryname == null || for_weddingcategoryname == '' || icon == null || icon == ''){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'forweddingcategory_insert_update.php', {			
			forweddingcategoryid: this.state.forweddingcategoryid,
			for_weddingcategoryname: this.state.for_weddingcategoryname,
            icon: this.state.icon,
			location: this.state.location,
			usefor: this.state.usefor,
			isavailable: this.state.isavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listforweddingcategory');
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }

    handleStatusChange(e){
		this.setState({
		  location: e.target.value
		})
	}

	handleStatusUse(e){
		this.setState({
		  usefor: e.target.value
		})
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
                            <td><Label for="for_weddingcategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="for_weddingcategoryname" id="for_weddingcategoryname" value={this.state.for_weddingcategoryname} placeholder="Facilities Category" onChange = {(event) => this.setState({ for_weddingcategoryname : event.target.value }) }/></td>
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
                            <td><Label for="location">{this.language.fieldlocation}</Label></td>
							<td><select onChange = {this.handleStatusChange.bind(this)} value={this.state.location}>
									<option value="INDOOR">INDOOR</option>
									<option value="OUTDOR">OUTDOR</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="usefor">{this.language.fieldusefor}</Label></td>
							<td><select onChange = {this.handleStatusUse.bind(this)} value={this.state.usefor}>
									<option value="0">For Wedding</option>
									<option value="1">Non Wedding</option>
								</select>
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
export default InputForWeddingCategory;