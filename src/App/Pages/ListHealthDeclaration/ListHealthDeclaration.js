import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import ReactTable from "react-table";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ListHealthDeclaration extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listhealthdeclaration');
		
		this.state = {
			tableData: [],
			filter: '',
			startDate: moment(),
			endDate:moment(),
			dataToDownload: []
		}
		
		
        this.tableColumns = [ 
		{
			Header: this.language.date,
			headerStyle: {fontWeight : 'bold'},
			accessor: 'date',
			style: { textAlign: "center"},
			//Cell : e => (e.original.isavailable === 0 ? this.globallang['hidden'] : this.globallang['show'])
		},
		{
            Header: this.language.name,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "center"}
        },		
		
        {
            Header: this.language.phonenumber,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'phonenumber',
            style: { textAlign: "center"},
		},
		{
            Header: this.language.cluster,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'cluster',
            style: { textAlign: "center"},
        },		
        {
            Header: this.language.city,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'city',
            style: { textAlign: "center"},
        },
        {
            Header: this.language.combo1,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'combo1',
            style: { textAlign: "center"},
        },
        {
            Header: this.language.combo2,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'combo2',
            style: { textAlign: "center"},
        },
        {
            Header: this.language.combo3,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'combo3',
            style: { textAlign: "center"},
        },
        {
            Header: this.language.combo4,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'combo4',
            style: { textAlign: "center"},
        },
        {
            Header: this.language.note,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'note',
            style: { textAlign: "center"},
        },
		/*{
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
                    <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
                </div>
            )
        }*/]
    }
	
	doRowEdit = (row) => {
        console.log(row);
		this.props.history.push('/panel/edithomecategory/'+row.homecategoryid);
	}
	setStartDate = (date) =>{
		this.setState({startDate: date})
		console.log(this.state.startDate);
	}
	setEndDate = (date) =>{
		this.setState({endDate: date})
	}
	doSeacrhBydate = () =>{
		console.log(this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss")+"&"+this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss"));
		this.getDataBydate();
	}
	getDataBydate =()=>{
        this.props.doLoading();
		axios.post(serverUrl+'dailydeclaration_list_bydate.php', {
			communityid : this.state.communityid,
			startDate: this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
			endDate : this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss")
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
				var temp = this.state.tableData;
				temp = response.data.records;
				this.setState({tableData : temp});
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
    doRowDelete = (row) => {
        console.log(row);
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (homecategoryid) => {
					var homecategoryid = row.homecategoryid;
					console.log(homecategoryid);
					this.deleteHomeCategory(homecategoryid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputhomecategory');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'dailydeclaration_list.php', {
			filter: this.state.filter
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                //console.log(response.data);
				var temp = this.state.tableData;
				temp = response.data.records;
				this.setState({tableData : temp});
				
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	doExport=()=>{
		console.log(this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss")+"&"+this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss"));
        window.open(serverUrl+'dailydeclaration_export.php?filter='+this.state.filter+'&startDate='+this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss")+'&endDate='+this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss"), '_blank');
	}
	doExportBydate=()=>{
		//alert(this.state.startDate.clone().startOf('day').add(1, 'day').format("YYYY-MM-DD HH:mm:ss")+"&"+this.state.endDate.clone().endOf('day').add(1, 'day').format("YYYY-MM-DD HH:mm:ss"))
         window.open(serverUrl+'dailydeclaration_export_bydate.php?startDate='+this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss")+'&endDate='+this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss"), '_blank');
	
		}
	
	deleteHomeCategory = (homecategoryid) => {
		this.props.doLoading();
		axios.post(serverUrl+'homecategory_delete.php', {
            homecategoryid: homecategoryid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				alert(this.language.deletesuccess);
				//window.location.reload()
				this.doSearch();
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
	componentDidMount = () => {
		this.props.doLoading();
		axios.post(serverUrl+'dailydeclaration_list.php', {
			filter:''
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				var temp = this.state.tableData;
				temp = response.data.records;
				this.setState({tableData : temp});
				
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	} 


	changeQuery = event => {
        this.setState({ filter: event.target.value});
	};
	
	reset=()=>{
		let data='';
		this.setState({ filter: data });
		this.props.doLoading();
		axios.post(serverUrl+'dailydeclaration_list.php', {
			filter:''
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                //console.log(response.data);
				var temp = this.state.tableData;
				temp = response.data.records;
				this.setState({tableData : temp});
				
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}

	
	onKeyDown = (event) => {
		// 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
		if (event.key === 'Enter') {
		  event.preventDefault();
		  event.stopPropagation();
		  this.doSearch();
		}
	}
	
    render() {
        return (
            <FormGroup>
				<form>
					<fieldset className="form-group">
					<input type="text" className="form-control form-control-lg" onKeyDown={this.onKeyDown} placeholder={this.globallang.search} value={this.state.filter} onChange={this.changeQuery}/>
					</fieldset>
				</form>
				<Button color="info" onClick={() => this.doSearch()}> <FontAwesomeIcon icon="search"/>&nbsp;{this.globallang.search}</Button> &nbsp;&nbsp;&nbsp;<Button color="success"  onClick={() => this.reset()}><FontAwesomeIcon icon="sync"/>&nbsp;{this.globallang.reset}</Button> &nbsp;&nbsp;&nbsp;
				<div className="contentDate">
					<DatePicker selected={this.state.startDate} onChange={date => this.setStartDate(date)} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} className="datefilter"/>&nbsp;&nbsp;
					<DatePicker selected={this.state.endDate} onChange={date => this.setEndDate(date)} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate} minDate={this.state.startDate} className="datefilter"/>
					&nbsp;&nbsp;
					<Button color="success"  onClick={() => this.doSeacrhBydate()}><FontAwesomeIcon icon="random"/>&nbsp;{this.globallang.searchbydate}</Button>
					&nbsp;&nbsp;
				</div>
				<br></br>
				<br></br>
				<Label>{this.language.title}</Label>
                <ReactTable ref={(r) => this.reactTable = r} data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} filterabledefaultFilterMethod={(filter, row) => String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}/>
            </FormGroup>
        );
	}
	
}
export default ListHealthDeclaration;