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

class ListBilling extends Component {
    constructor(props) {
        super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listbilling');
		this.state = {
			tableData: [],
			filter:'',
			communityid: this.props.community.communityid
        }
		
        this.tableColumns = [ {
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columncategory,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'billingcategoryname',
            style: { textAlign: "center"}
        }, 		
		{
            Header: this.language.columnmonth,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'month',
            style: { textAlign: "center"}
        }, 			
		{
            Header: this.language.columnyear,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'year',
            style: { textAlign: "center"}
        }, 				
		{
            Header: this.language.columncustomerid,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'customerid',
            style: { textAlign: "center"}
        }, 		
		{
            Header: this.language.columnbillingamount,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'billingamount',
            style: { textAlign: "center"}
        }, 	
		{
            Header: this.language.columnbillingstatus,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'billingstatus',
            style: { textAlign: "center"},
			Cell : e => (e.original.billingstatus === 0 ? this.globallang['pending'] : this.globallang['paid'])
        }, 	
		{
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
        }]
    }
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editbilling/'+row.userbillingid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (userbillingid) => {
					var userbillingid = row.userbillingid;
					this.deleteBilling(userbillingid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputbilling');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'billing_list.php', {
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
	
	deleteBilling = (userbillingid) => {
		this.props.doLoading();
		axios.post(serverUrl+'billing_delete.php', {
            userbillingid: userbillingid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(response.data);
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
		console.log("didMount");
		this.props.doLoading();
		console.log(this.state.communityid);
		axios.post(serverUrl+'billing_list.php', {
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
				<form>
					<fieldset className="form-group">
					<input type="text" className="form-control form-control-lg" placeholder={this.globallang.search} onChange = {(event) => this.setState({ filter : event.target.value }) }/>
					</fieldset>
				</form> 
				<Button color="primary" size="sm" onClick={() => this.doSearch()}>{this.globallang.search}</Button>
				<br></br>
				<br></br>
				<Button color="success" onClick={() => this.addNew()}>{this.globallang.add}</Button>
                <br></br>
				<br></br>
				<Label>{this.language.title}</Label>
                <ReactTable data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} />
            </FormGroup>
        );
	}
}
export default ListBilling;