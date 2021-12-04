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

class Info extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
			tableData: [
			{
				col1: '',
				col2: '',
				col3: '',
				col4: ''
			}
			],
        }
		
        this.tableColumns = [ {
            Header: 'Information',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'info',
            style: { textAlign: "center"}
        },	
		{
			Header: 'Category',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'categoryname',
            style: { textAlign: "center"}
        },
		{
			Header: 'Is Available',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'isavailable',
            style: { textAlign: "center"}
        },			
		{
            Header: 'Action',
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
                    <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>Edit</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >Delete</Button>
                </div>
            )
        }]
    }
	
	doRowEdit = (row) => {
        console.log(row);
		this.props.history.push('/panel/editinfo/'+row.infoid);
    }
	
    doRowDelete = (row) => {
        console.log(row);
		confirmAlert({
		  //title: 'Confirm to submit',
		  message: 'Delete info?',
		  buttons: [
			{
				label: 'Yes',
				onClick: (infoid) => {
					var infoid = row.infoid;
					console.log(infoid);
					this.deleteInfo(infoid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputinfo');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'info_list.php', {
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
	
	deleteInfo = (infoid) => {
		this.props.doLoading();
		axios.post(serverUrl+'info_delete.php', {
            infoid: infoid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
				alert('Info berhasil dihapus!')
				window.location.reload()
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
	componentDidMount = () => {
		this.props.doLoading();
		axios.post(serverUrl+'info_list.php', {
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
				<form>
					<fieldset className="form-group">
					<input type="text" className="form-control form-control-lg" placeholder="Search" onChange = {(event) => this.setState({ filter : event.target.value }) }/>
					</fieldset>
				</form> 
				<Button color="primary" size="sm" onClick={() => this.doSearch()}>Search</Button>
				<br></br>
				<br></br>
				<Button color="warning" onClick={() => this.addNew()}>Add New</Button>
				<br></br>
				<br></br>
				<Label>List Info</Label>
				<div className="box-container">
                	<ReactTable data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} />
				</div>
            </FormGroup>
        );
	}
}
export default Info;