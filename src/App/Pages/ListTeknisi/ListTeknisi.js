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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class ListTeknisi extends Component{
    constructor(props){
		super(props);
		this.reactTable = React.createRef();
        this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listteknisi');
		this.state = {
			tableData: [],
			filter:''
        }

        this.tableColumns = [ {
            Header: this.language.columnphone,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'phonenumber',
            style: { textAlign: "left"}
        },
		{
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "left"}
		},	
		{
            Header: this.language.columncompany,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companyname',
            style: { textAlign: "left"}
        },
        {
            Header: this.language.columnposition,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'jobdesc',
            style: { textAlign: "center"}
		},
		{
            Header: this.language.columnstatus,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
			Cell : e => (e.original.status === 0 ? this.globallang['ready'] : this.globallang['working'])
        }, 
		{
            Header: this.language.columnavailable,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'isavailable',
            style: { textAlign: "center"},
			Cell : e => (e.original.isavailable === 0 ? this.globallang['hidden'] : this.globallang['show'])
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
		this.props.history.push('/panel/editteknisi/'+row.teknisiid);
    }

    doRowDelete = (row) => {
        console.log(row);
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (teknisiid) => {
					var teknisiid = row.teknisiid;
					console.log(teknisiid);
					this.deleteTeknisi(teknisiid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }

    addNew = () => {
		this.props.history.push('/panel/inputteknisi');
    }
    
    doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'teknisi_list.php', {
			filter: this.state.filter
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
    
    deleteTeknisi = (teknisiid) => {
		this.props.doLoading();
		axios.post(serverUrl+'teknisi_delete.php', {
            teknisiid: teknisiid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
				alert(this.language.deletesuccess)
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
		axios.post(serverUrl+'teknisi_list.php', {
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
	

	reset=()=>{
		let data='';
		this.setState({ filter: data });
		this.props.doLoading();
		axios.post(serverUrl+'teknisi_list.php', {
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
export default ListTeknisi;
