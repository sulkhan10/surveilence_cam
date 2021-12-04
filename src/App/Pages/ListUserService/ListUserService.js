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
import { numberFormat } from '../../../global.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertToRupiah } from '../../../global.js';

class ListUserService extends Component {
    constructor(props) {
		super(props);
		this.reactTable = React.createRef();
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listuserservice');
		this.state = {
			tableData: [],
			filter:'',
			communityid: this.props.community.communityid
        }
		
        this.tableColumns = [
		{
            Header: this.language.columnrequestdate,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'requestdate',
            style: { textAlign: "center"}
		}, 	
		{
            Header: this.language.columnphone,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'phoneno',
            style: { textAlign: "center"}
        }, 
		{
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "center"}
        }, 
		{
            Header: this.language.columncategory,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'servicecentercategoryname',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columnprice,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'price',
			style: { textAlign: "center"},
			Cell : e => (convertToRupiah(e.original.price))
        },		
		{
            Header: this.language.columnstatuspay,
			headerStyle: {fontWeight : 'bold'},
            accessor:  'status_payment',
            style: { textAlign: "center"}
        },	
		{
            Header: this.language.columnstatus,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status_services',
            style: { textAlign: "center"},
			Cell : e => (e.original.status_services == 1 ? this.globallang['done'] : this.globallang['process'])
		}, 
		{
            Header: this.language.columnteknisi,
			headerStyle: {fontWeight : 'bold'},
            accessor:  'teknisiname',
            style: { textAlign: "center"}
        },	
		{
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
				<div>
					<Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}><FontAwesomeIcon icon="pen-square"/>&nbsp;{this.globallang.edit}</Button>&nbsp;
					<Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} ><FontAwesomeIcon icon="times-circle"/>&nbsp;{this.globallang.delete}</Button>
				</div>
            )
        }]
    }
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/edituserservice/'+row.userserviceid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (userserviceid) => {
					var userserviceid = row.userserviceid;
					this.deleteUserService(userserviceid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputuserservice');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'userservice_list.php', {
			filter: this.state.filter,
			communityid: this.state.communityid
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
	
	deleteUserService = (userserviceid) => {
		this.props.doLoading();
		axios.post(serverUrl+'userservice_delete.php', {
            userserviceid: userserviceid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				alert(this.language.deletesuccess)
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
		console.log("userservices");
		console.log(this.state.communityid);
		axios.post(serverUrl+'userservice_list.php', {
			filter:'',
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				console.log(response);
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

	reset=()=>{
		let data='';
		this.setState({ filter: data });
		this.props.doLoading();
		axios.post(serverUrl+'userservice_list.php', {
			filter:'',
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				console.log(response);
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
	
    render() {
        return (
            <FormGroup>
				<br></br>
				<Label style={{fontWeight:'bold', fontSize:20, color:'#000'}} >{this.language.title}</Label>
				<div className="contentDate">
					<Button color="success"  onClick={() => this.reset()}><FontAwesomeIcon icon="sync"/>&nbsp;{this.globallang.reset}</Button> &nbsp;&nbsp;&nbsp;<Button color="primary" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus-square"/>&nbsp;{this.globallang.add}</Button>
				</div>
				<br></br>
				<br></br>
				<div className="box-container">
					<ReactTable ref={(r) => this.reactTable = r}
                            data={this.state.tableData} columns={this.tableColumns} filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
                            defaultPageSize={5}
                    />
				</div>
            </FormGroup>
        );
	}
}
export default ListUserService;