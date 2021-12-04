import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';

class EditCallCovidCenter extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'editcallcenter');
		this.state = {
			id: props.match.params.id,
			name: '',
			phone: '',
			position: '',
			picture: [],
			communityid: 0,
			communityShow: [],
			isavailable: false
		}
		this.availableHandleChecked = this.availableHandleChecked.bind(this);
    }
	
	onUploadImage = (result) => {
        this.setState({ picture: result });
    }
	
	availableHandleChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
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
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	
	checkData = () => {
		const {name} = this.state;
		const {phone} = this.state;
		const {community} = this.state;
		
		if(name == null || name == '' || phone == null || phone == '' || community == 0){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.selectCommunity();
		this.props.doLoading();
		axios.post(serverUrl+'callcovidcenter_get_by_id.php', {
            id: this.state.id
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				let tmp = [];
				if(response.data.record.picture !== ""){
					tmp.push(response.data.record.picture);
				}
				this.setState({id : response.data.record.id});
				this.setState({name : response.data.record.name});
				this.setState({phone : response.data.record.phone});
				this.setState({position : response.data.record.position});
				this.setState({picture : tmp});
				this.setState({communityid : response.data.record.communityid});
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
        axios.post(serverUrl+'callcovidcenter_insert_update.php', {			
			id: this.state.id,
			name: this.state.name,
			phone: this.state.phone,
			position: this.state.position,
			picture: this.state.picture,
			communityid: this.state.communityid,
			isavailable: this.state.isavailable ? 1:0
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
                console.log(response);
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listcallcovidcenter');
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
                            <td><Label for="name">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="name" id="name" value={this.state.name} placeholder="Name" onChange = {(event) => this.setState({ name : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="phone">{this.language.fieldphone}</Label></td>
                            <td><Input type="text" name="phone" id="phone" value={this.state.phone} placeholder="021xxxxxxx" onChange = {(event) => this.setState({ phone : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="position">{this.language.fieldposition}</Label></td>
                            <td><Input type="text" name="position" id="position" value={this.state.position} placeholder="Position" onChange = {(event) => this.setState({ position : event.target.value }) }/></td>
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
export default EditCallCovidCenter;