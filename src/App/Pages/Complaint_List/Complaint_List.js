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

class ComplaintList extends Component {
    constructor(props){
        super(props);
        this.globallang = getLanguage(activeLanguage, 'global');
        this.language = getLanguage(activeLanguage, 'listcomplaintform');
        this.state = {
			tableData: [],
			filter:'',
			communityid: this.props.community.communityid
        }
        this.tableColumns = [ 
        {
            Header: this.language.phonenumber,
            headerStyle: {fontWeight : 'bold'},
            accessor: 'phonenumber',
            style: { textAlign: "left"}
        },
        {
            Header: this.language.nama,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "left"}
        },	
		{
            Header: this.language.complaintname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'complaintname',
            style: { textAlign: "left"}
        }, 			
		{
            Header: this.language.complaintdesc,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'complaintdesc',
            style: { textAlign: "center"}
        }, 				
		{
            Header: this.language.tanggalcomplaint,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'date',
            style: { textAlign: "center"}
        }, 	
        {
            Header: this.language.statuscomplaint,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
            Cell : e => (e.original.status === 0 ? "PENDING" : "DONE")
        }, 
        {
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
					<Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} ><FontAwesomeIcon icon="times-circle"/>&nbsp;{this.globallang.delete}</Button>
				</div>
            )
        }
    ]
    }

    doRowEdit = (row) => {
		this.props.history.push('/panel/detailcomplaint/'+row.complaintid);
    }

    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (complaintid) => {
					var complaintid = row.complaintid;
					this.deleteComplaint(complaintid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }


    deleteComplaint = (complaintid) => {
		this.props.doLoading();
		axios.post(serverUrl+'complaint_delete.php', {
            complaintid: complaintid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
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
    
    doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'complaint_list.php', {
			filter: this.state.filter,
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(this.state);
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

    componentDidMount = () => {
		this.props.doLoading();
		// console.log(this.state.communityid);
		axios.post(serverUrl+'complaint_list.php', {
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
		axios.post(serverUrl+'complaint_list.php', {
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
					<Button color="success"  onClick={() => this.reset()}><FontAwesomeIcon icon="sync"/>&nbsp;{this.globallang.reset}</Button>
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
export default ComplaintList;