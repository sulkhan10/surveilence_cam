import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class InputProductCategory extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'inputproductcategory');
		this.state = {
			productcategoryid: 0,
			productcategoryname: ''
		}
    }
	 
	checkData = () => {
		const {productcategoryname} = this.state;
		
		if(productcategoryname == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'productcategory_insert_update.php', {			
			productcategoryid: this.state.productcategoryid,
			productcategoryname: this.state.productcategoryname
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listproductcategory');
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
                            <td><Label for="productcategoryname">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="productcategoryname" id="productcategoryname" value={this.state.productcategoryname} placeholder="Product Category" onChange = {(event) => this.setState({ productcategoryname : event.target.value }) }/></td>
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
export default InputProductCategory;