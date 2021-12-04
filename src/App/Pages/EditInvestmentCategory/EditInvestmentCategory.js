import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class EditInvestmentCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editinvestmentcategory');
		this.state = {
			investmentcategoryid: props.match.params.investmentcategoryid,
			investmentcategoryname: ''
		}
    }
	
	checkData = () => {
		const {investmentcategoryname} = this.state;
		
		if(investmentcategoryname == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.props.doLoading();
		axios.post(serverUrl+'investmentcategory_get_by_id.php', {
            investmentcategoryid: this.state.investmentcategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
				this.setState({investmentcategoryid : response.data.record.investmentcategoryid});
				this.setState({investmentcategoryname : response.data.record.investmentcategoryname});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'investmentcategory_insert_update.php', {			
			investmentcategoryid: this.state.investmentcategoryid,
			investmentcategoryname: this.state.investmentcategoryname
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listinvestmentcategory');
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
                            <td><Label for="investmentcategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="investmentcategoryname" id="investmentcategoryname" value={this.state.investmentcategoryname} onChange = {(event) => this.setState({ investmentcategoryname : event.target.value }) }/></td>
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
export default EditInvestmentCategory;