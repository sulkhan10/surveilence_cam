import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class InputProjectCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputprojectcategory');
		this.state = {
			projectcategoryid: 0,
			projectcategoryname: ''
		}
    }
	 
	checkData = () => {
		const {projectcategoryname} = this.state;
		
		if(projectcategoryname == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'projectcategory_insert_update.php', {			
			projectcategoryid: this.state.projectcategoryid,
			projectcategoryname: this.state.projectcategoryname
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listprojectcategory');
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
                            <td><Label for="projectcategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="projectcategoryname" id="projectcategoryname" value={this.state.projectcategoryname} placeholder="Project Category" onChange = {(event) => this.setState({ projectcategoryname : event.target.value }) }/></td>
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
export default InputProjectCategory;