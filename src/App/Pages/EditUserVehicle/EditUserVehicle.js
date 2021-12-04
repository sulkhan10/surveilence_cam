import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class EditUserVehicle extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'edituservehicle');
		this.state = {
			uservehicleid: props.match.params.uservehicleid,
			userShow: [],
			phoneno: '',
			plateno: '',
			vehicletypeid: 0,
			vehicletypeShow: []
		}
    }

	selectUser = () =>{
		axios.post(serverUrl+'user_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ userShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	selectVehicleType = () =>{
		axios.post(serverUrl+'vehicletype_list.php',
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ vehicletypeShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	changeUser = (phoneno)=>{
        this.setState({phoneno: phoneno});
    }
	
	changeVehicleType = (vehicletypeid)=>{
        this.setState({vehicletypeid: vehicletypeid});
    }
	 
	checkData = () => {
		const {phoneno} = this.state;
		const {vehicletypeid} = this.state;
		const {plateno} = this.state;
		
		if(phoneno == '' || vehicletypeid == 0 || plateno == '' ){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	 
	 componentDidMount = () => {
		this.selectUser();
		this.selectVehicleType();
		this.props.doLoading();
		axios.post(serverUrl+'uservehicle_get_by_id.php', {
            uservehicleid: this.state.uservehicleid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, onlinestorecategoryid, communityid) =>{
				this.props.doLoading();
                console.log(response.data);
				
				this.setState({uservehicleid : response.data.record.uservehicleid});
				this.setState({phoneno : response.data.record.phoneno});
				this.setState({plateno : response.data.record.plateno});
				this.setState({vehicletypeid : response.data.record.vehicletypeid});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'uservehicle_insert_update.php', {			
			uservehicleid: this.state.uservehicleid,
			phoneno: this.state.phoneno,
			plateno: this.state.plateno,
			vehicletypeid: this.state.vehicletypeid
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				alert(this.language.savesuccess);
				this.props.history.goBack();
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
                            <td><Label for="phoneno">{this.language.fieldphoneno}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.phoneno} valueColumn={'phoneno'} showColumn={'name'} columns={['name']} data={this.state.userShow} onChange={this.changeUser} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="plateno">{this.language.fieldplate}</Label></td>
                            <td><Input type="text" name="plateno" id="plateno" placeholder="B XXXX XXX" value={this.state.plateno} onChange = {(event) => this.setState({ plateno : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="vehicletypeid">{this.language.fieldtype}</Label></td>
                            <td>
								<SelectMultiColumn width={200} value={this.state.vehicletypeid} valueColumn={'vehicletypeid'} showColumn={'vehicletypename'} columns={['vehicletypename']} data={this.state.vehicletypeShow} onChange={this.changeVehicleType} />
							</td>
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
export default EditUserVehicle;