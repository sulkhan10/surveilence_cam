import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import CheckboxGroup from '../../Components/CheckboxGroup/CheckboxGroup';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTable from "react-table";
import Modal from 'react-modal';
import matchSorter from 'match-sorter';
import { confirmAlert } from 'react-confirm-alert';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const { compose, withProps, withHandlers } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, Marker,} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class EditMarketplaceEvent extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.lang = getLanguage(activeLanguage, 'listcommodity');
		this.language = getLanguage(activeLanguage, 'editmarketplaceevent');
		this.state = {
			marketplaceeventid: props.match.params.marketplaceeventid,
			latitude: -6.1772007,
			longitude: 106.9569963,
			address: '',
			title: '',
			description: '',
			startdate: moment(),
			enddate: moment(),
			hourin: 7,
			minutein: 0,
			hourout: 7,
			minuteout: 0,
			picture: [],
			type: '',
			communityid: '',
			isavailable: false,
			tableData: [],
			tableDataSearch: [],
			modalIsOpen: false,
			filter: '',
			selectedcommodity: false,
			filtered: [],
			filterAll: '',
			datechanged: false
		}
		
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.filterAll = this.filterAll.bind(this);
		
		this.tableColumns = [ {
            Header: this.lang.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'commodityname',
            style: { textAlign: "center"}
        },
		{
            Header: this.lang.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)}>Remove</Button>&nbsp;
                </div>
            )
        }]
		
		this.tableColumnsSearch = [ {
            Header: this.lang.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'commodityname',
            style: { textAlign: "center"},
			filterMethod: (filter, row) => {
                    return row[filter.id].includes(filter.value);
                  }
        },
		{
            Header: this.lang.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
					<Input type="checkbox" className="custom-checkbox" name="selectedcommodity" id="selectedcommodity" checked={e.original.selectedcommodity} onChange={(event)=>this.selectCommodityChecked(e.original, event)}/>
                </div>
            )
        },
		{
              // NOTE - this is a "filter all" DUMMY column
              // you can't HIDE it because then it wont FILTER
              // but it has a size of ZERO with no RESIZE and the
              // FILTER component is NULL (it adds a little to the front)
              // You culd possibly move it to the end
              Header: "",
              id: 'all',
              width: 0,
              resizable: false,
              sortable: false,
              Filter: () => { },
              getProps: () => {
                return {
                  
                }
              },
              filterMethod: (filter, rows) => {
                const result = matchSorter(rows, filter.value, {
                  keys: [
                    "commodityname"
                  ], threshold: matchSorter.rankings.CONTAINS
                });
                return result;
              },
              filterAll: true,
		}
		]
    }
	
	selectCommodityChecked (commodity, event) {
		let checked = event.target.checked;
		let tmp = this.state.tableDataSearch;
		var i = 0;
		for(i = 0; i < tmp.length; i++){
			if(tmp[i].commodityid == commodity.commodityid)
				tmp[i].selectedcommodity = checked;
		}
		this.setState({tableDataSearch: tmp});
	}
	
	selectCommunity = (companyShow) =>{
		axios.post(serverUrl+'cp_community_list_available.php', {filter: ''},
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
	 
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
		this.doLoad();
		
	}
	
	addCommodity = () => {	
		let tmp = this.state.tableDataSearch;
		var selected = [];
		var i = 0;
		for(i = 0; i < tmp.length; i++){
			if(tmp[i].selectedcommodity == true)
				selected.push(tmp[i]);
		}
		window.localStorage.setItem('commodity_selected', JSON.stringify(selected));
		this.loadCommodityData();
    }
	
	loadCommodityData = () => {
		var com = window.localStorage.getItem('commodity_selected');
		var commodity = JSON.parse(com);
		console.log(commodity);
		if(commodity === null || commodity === "null") return false;
		this.setState({tableData : commodity});
		this.closeModal();
	}
	
	doRowDelete = (row) => {   
		confirmAlert({
		  message: this.lang.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: () => {
					var items = JSON.parse(localStorage.getItem('commodity_selected'));
					for (var i = 0; i < items.length; i++) {
						if (items[i].commodityid == row.commodityid) {
							items.splice(i, 1);
							break;
						}
					}
					
					localStorage.setItem('commodity_selected', JSON.stringify(items));
					this.setState({tableData: items});
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	filterAll = (e) =>{
		const { value } = e.target;
		const filterAll = value;
		const filtered = [{ id: 'all', value: filterAll }];
		this.setState({ filterAll, filtered });
	}
	
	doLoad = () => {
		axios.post(serverUrl+'commodity_list.php', {
			filter: this.state.filter
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				var com = window.localStorage.getItem('commodity_selected');
				var commodity = JSON.parse(com);
				
				if(commodity == undefined){
					commodity = [];
				}
				
				var temp = this.state.tableDataSearch;
				temp = response.data.records;
				
				var i = 0;
				var j = 0;
				
				var numrows = temp.length;
				for(i = 0; i < numrows; i++){
					temp[i].selectedcommodity = false;
					for (j = 0; j<commodity.length; j++){
						if(commodity[j].commodityid == temp[i].commodityid)
							temp[i].selectedcommodity = true;
					}
				}
				console.log(temp);
				console.log(commodity);
				this.setState({tableDataSearch : temp});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	 
	onUploadImage = (result) => {
        this.setState({ picture: result });
    }
	
	updateStartDate = (startdate) => {
        this.setState({ startdate: startdate });
		this.setState({ datechanged: true });
    }
	
	updateEndDate = (enddate) => {
        this.setState({ enddate: enddate });
		this.setState({ datechanged: true });
    }
	
	handleHourInChange(e){
		this.setState({
		  hourin: e.target.value
		})
	}
	
	handleHourOutChange(e){
		this.setState({
		  hourout: e.target.value
		})
	}
	
	handleMinuteInChange(e){
		this.setState({
		  minutein: e.target.value
		})
	}
	
	handleMinuteOutChange(e){
		this.setState({
		  minuteout: e.target.value
		})
	}
	
	isAvailableChecked (event) {
		let checked = event.target.checked;
		this.setState({isavailable: checked});
	}
	
	checkData = () => {
		const {title} = this.state;
		const {description} = this.state;
		const {picture} = this.state;
		const {type} = this.state;
		
		if(title == null || description == null || picture == null || type == null){
			alert(this.language.validation);
			return false;
		}
		
		else{
			if(this.state.datechanged == true){
				this.validate();
			}
			else{
				this.validateWithoutChange();
			}
		}
	}
	
	validate=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.startdate);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.enddate);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+monthin+"-"+datein;
		checkout = yearout+"-"+monthout+"-"+dateout;
		
		if(checkout >= checkin){
			if(checkin == checkout){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}
				
				else{
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					else{
						this.onSubmit();
					}
				}
			}
			
			else{
				this.onSubmit();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	
	validateWithoutChange=()=>{
		var starttime = this.state.hourin+':'+this.state.minutein;
		var endtime = this.state.hourout+':'+this.state.minuteout;
		
		if(this.state.enddate >= this.state.startdate){
			if(this.state.enddate == this.state.startdate){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}
				
				else{
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					else{
						this.onSubmit();
					}
				}
			}
			
			else{
				this.onSubmit();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	 
	 componentDidMount = () => {
		var starttime;
		var endtime;
		
		this.selectCommunity();
		this.props.doLoading();
		localStorage.clear();
		axios.post(serverUrl+'marketplaceevent_by_id.php', {
            marketplaceeventid: this.state.marketplaceeventid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response, logintype) =>{
				this.props.doLoading();
				let tmp = [];
				if(response.data.record.picture !== ""){
					tmp.push(response.data.record.picture);
				}
				this.setState({marketplaceeventid : response.data.record.marketplaceeventid});
				this.setState({latitude : response.data.record.latitude});
				this.setState({longitude : response.data.record.longitude});
				this.setState({address : response.data.record.address});
				this.setState({title : response.data.record.title});
				this.setState({description : response.data.record.description});
				this.setState({startdate : response.data.record.startdate});
				this.setState({enddate : response.data.record.enddate});
				this.setState({starttime : response.data.record.starttime});
				this.setState({endtime : response.data.record.endtime});
				this.setState({picture : tmp});
				this.setState({type : response.data.record.type});
				this.setState({communityid : response.data.record.communityid});
				this.setState({isavailable : response.data.record.isavailable===1?true:false});
				
				starttime=this.state.starttime.split(':');
				this.setState({hourin: starttime[0]});
				this.setState({minutein: starttime[1]});
				
				endtime=this.state.endtime.split(':');
				this.setState({hourout: endtime[0]});
				this.setState({minuteout: endtime[1]});
				
				let tableData = response.data.record.commodity;
				this.setState({tableData : tableData});
				window.localStorage.setItem('commodity_selected', JSON.stringify(tableData));
            })
            .catch((error) =>{
				this.props.doLoading();
				alert(error);
            });
	} 

	onSubmit = (param) => {
		var starttime = this.state.hourin+':'+this.state.minutein;
		var endtime = this.state.hourout+':'+this.state.minuteout;
		
		this.props.doLoading();
        axios.post(serverUrl+'marketplaceevent_insert_update.php', {			
			marketplaceeventid: this.state.marketplaceeventid,
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			address: this.state.address,
			title: this.state.title,
			description: this.state.description,
			startdate: this.state.startdate,
			enddate: this.state.enddate,
			starttime: starttime,
			endtime: endtime,
			picture: this.state.picture,
			type: this.state.type,
			communityid: this.state.communityid,
			isavailable: this.state.isavailable,
			commodity: this.state.tableData
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listmarketplaceevent');
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }
	
	onMarkerMove=(param)=>{
		axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+param.latLng.lat()+','+param.latLng.lng()+'&key=AIzaSyAdm6TmweM5bzGr1Fry_737Bbcd4T0WxfY')
            .then( (response) =>{
				this.state.latitude = param.latLng.lat();
				this.state.longitude = param.latLng.lng();
				this.state.address = response.data.results[0].formatted_address;
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	renderCommodity=()=> {
        return (
		<div className="form-detail">
			<div className="detail-title">Selected Commodity</div>
			<div className="detail-info-input">
				<FormGroup>
					<Button color="success" onClick={() => this.addNew()}>Select Commodity</Button>
					<br></br>
					<br></br>
					<ReactTable data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} />
				</FormGroup>
			</div>
		</div>
        );
	}
	
	renderModal() {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles}
			>
			<FormGroup>
				Filter Commodity: <input value={this.state.filterAll} onChange={this.filterAll} />
				<br></br>
				<br></br>
				<ReactTable data={this.state.tableDataSearch} columns={this.tableColumnsSearch} defaultPageSize={10} 
				filtered={this.state.filtered}
				ref={r => this.selectTable = r}
				defaultFilterMethod={(filter, row) =>
				String(row[filter.id]) === filter.value}
				/>
			</FormGroup>
			<div className="form-button-container">
				<Button color="primary" 
				onClick={()=>this.addCommodity()}>Add Commodity</Button>
            </div>
			</Modal>
		);
	}

    render() {
		const MyMapComponent = withScriptjs(withGoogleMap((props) =>
		<GoogleMap
			defaultZoom={17}
			defaultCenter={{ lat: this.state.latitude, lng: this.state.longitude }}
		>
			{props.isMarkerShown && <Marker position={{ lat: this.state.latitude, lng: this.state.longitude }} draggable={true} onDragEnd={(e)=>this.onMarkerMove(e)} />}
		</GoogleMap>
		))
	
        return (
            <div>
                <div className="page-header">
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tbody>
						<tr>
                            <td><Label for="location">{this.language.fieldlocation}</Label></td>
                            <td>
							<MyMapComponent
								isMarkerShown={true}
								googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAdm6TmweM5bzGr1Fry_737Bbcd4T0WxfY"
								loadingElement={<div style={{ height: `100%` }} />}
								containerElement={<div style={{ height: `400px` }} />}
								mapElement={<div style={{ height: `100%` }} />}
							/>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="title">{this.language.fieldtitle}</Label></td>
                            <td><Input type="text" name="title" id="title" value={this.state.title} placeholder={this.language.fieldtitle} onChange = {(event) => this.setState({ title : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="description">{this.language.fielddescription}</Label></td>
                            <td><Input type="textarea" name="description" id="description" value={this.state.description} placeholder={this.language.fielddescription} onChange = {(event) => this.setState({ description : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="startdate">{this.language.fieldstartdate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.startdate)} onChange={this.updateStartDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
							<td colSpan="2">
							&nbsp;
							</td>
						</tr>
						<tr>
                            <td><Label for="enddate">{this.language.fieldenddate}</Label></td>
							<td>
							<DatePicker selected={moment.utc(this.state.enddate)} onChange={this.updateEndDate} className="date-picker" />
							</td>
                        </tr>
						<tr>
							<td colSpan="2">
							&nbsp;
							</td>
						</tr>
						<tr>
                            <td><Label for="starttime">{this.language.fieldstarttime}</Label></td>
							<td>
								<select onChange = {this.handleHourInChange.bind(this)} value={this.state.hourin}>
									<option value="07">07</option>
									<option value="08">08</option>
									<option value="09">09</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
									<option value="13">13</option>
									<option value="14">14</option>
									<option value="15">15</option>
									<option value="16">16</option>
									<option value="17">17</option>
									<option value="18">18</option>
									<option value="19">19</option>
									<option value="20">20</option>
									<option value="21">21</option>
								</select>
								&nbsp;:&nbsp;
								<select onChange = {this.handleMinuteInChange.bind(this)} value={this.state.minutein}>
									<option value="00">00</option>
									<option value="30">30</option>
								</select>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">
							&nbsp;
							</td>
						</tr>
						<tr>
                            <td><Label for="endtime">{this.language.fieldendtime}</Label></td>
							<td>
								<select onChange = {this.handleHourOutChange.bind(this)} value={this.state.hourout}>
									<option value="07">07</option>
									<option value="08">08</option>
									<option value="09">09</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
									<option value="13">13</option>
									<option value="14">14</option>
									<option value="15">15</option>
									<option value="16">16</option>
									<option value="17">17</option>
									<option value="18">18</option>
									<option value="19">19</option>
									<option value="20">20</option>
									<option value="21">21</option>
								</select>
								&nbsp;:&nbsp;
								<select onChange = {this.handleMinuteOutChange.bind(this)} value={this.state.minuteout}>
									<option value="00">00</option>
									<option value="30">30</option>
								</select>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">
							&nbsp;
							</td>
						</tr>
						<tr>
                            <td><Label>{this.globallang.uploadpicture}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadImage} picList = {this.state.picture} picLimit={1}></PictureUploader>
							</td>
                        </tr>
						<tr>
							<td colSpan="2">
							&nbsp;
							</td>
						</tr>
						<tr>
                            <td><Label for="type">{this.language.fieldtype}</Label></td>
                            <td><Input type="number" name="type" id="type" placeholder="Temporary Type" value={this.state.type} onChange = {(event) => this.setState({ type : event.target.value }) }/></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
							<td colSpan="2">&nbsp;</td>
						</tr>
						<tr>
                            <td><Label for="isavailable">{this.language.fieldisavailable}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="isavailable" id="isavailable" checked={this.state.isavailable} onChange={(event)=>this.isAvailableChecked(event)}/></td>
                        </tr>
						</tbody>
                    </table>
					{this.renderCommodity()}
					<br></br>
					{this.renderModal()}
                </div>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
            </div>
        );
    }
}
export default EditMarketplaceEvent;