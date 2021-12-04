import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class EditServiceCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editservicecategory');
		this.state = {
			servicecategoryid: props.match.params.servicecategoryid,
			servicecategoryname: ''
		}
    }
	
	checkData = () => {
		const {servicecategoryname} = this.state;
		
		if(servicecategoryname == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		 this.props.doLoading();
		axios.post(serverUrl+'servicecategory_get_by_id.php', {
            servicecategoryid: this.state.servicecategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				this.setState({servicecategoryid : response.data.record.servicecategoryid});
				this.setState({servicecategoryname : response.data.record.servicecategoryname});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'servicecategory_insert_update.php', {			
			servicecategoryid: this.state.servicecategoryid,
			servicecategoryname: this.state.servicecategoryname
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listservicecategory');
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
                            <td><Label for="servicecategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="servicecategoryname" id="servicecategoryname" value={this.state.servicecategoryname} onChange = {(event) => this.setState({ servicecategoryname : event.target.value }) }/></td>
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
export default EditServiceCategory;