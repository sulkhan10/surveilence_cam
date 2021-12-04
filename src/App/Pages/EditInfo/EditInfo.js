import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';

class EditInfo extends Component {
    constructor(props) {
        super(props);
		this.state = {
			infoid: props.match.params.infoid,
			info: '',
			categoryid: 1,
			isavailable: false
		}
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	availableHandleChecked (isavailable) {
		this.setState({isavailable: !this.state.isavailable});
	}
	
	handleChange(e){
		this.setState({
		  categoryid: e.target.value
		})
	 }
	 
	checkData = () => {
		const {infoid} = this.state;
		const {info} = this.state;
		const {categoryid} = this.state;
		const {isavailable} = this.state;
		
		if(info == null){
			alert('Lengkapi isian!');
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.props.doLoading();
		axios.post(serverUrl+'info_get_by_id.php', {
            infoid: this.state.infoid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				this.setState({infoid : response.data.record.infoid});
				this.setState({info : response.data.record.info});
				this.setState({categoryid : response.data.record.categoryid});
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
        axios.post(serverUrl+'info_insert_update.php', {			
			infoid: this.state.infoid,
			info: this.state.info,
			categoryid: this.state.categoryid,
			isavailable: this.state.isavailable ? 1:0
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert('Info berhasil diubah');
				this.props.history.push('/panel/info');
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
                    Edit Info <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="info">Info</Label></td>
                            <td><Input type="text" name="info" id="info" value={this.state.info} onChange = {(event) => this.setState({ info : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="categoryid">Category Info</Label></td>
								<td><select onChange = {this.handleChange.bind(this)} value={this.state.categoryid} >
									<option value="1">Company</option>
									<option value="2">Product</option>
									<option value="3">Service</option>
								</select></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isavailable">Is Available</Label></td>
                            <td><Input type="checkbox" className="custom-checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={this.availableHandleChecked}/></td>
                        </tr>
					</table>
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>Submit</Button>
                    </div>
            </div>
        );
    }
}
export default EditInfo;