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

class ListOrder extends Component {
    constructor(props) {
        super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listorder');
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
            Header: this.language.columnaddress,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'address',
            style: { textAlign: "center"}
        }, 
		{
            Header: this.language.columntotal,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'total',
            style: { textAlign: "center"}
        }, 						
		{
            Header: this.language.columnstatus,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
			Cell : e => (e.original.status === 0 ? this.globallang['pending'] : (e.original.status === 1 ? this.globallang['paid'] : this.globallang['cancelled']))
        }, 	
		{
            Header: this.language.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
					<Button color="primary" size="sm" onClick={() => this.doPay(e.original)}>{this.globallang.pay}</Button>&nbsp;
                    <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
                </div>
            )
        }]
    }
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editorder/'+row.orderid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (orderid) => {
					var orderid = row.orderid;
					this.deleteOrder(orderid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputorder');
	}
	
	doPay = (row) => {
		if(row.status == 1){
			alert(this.language.alertpaid);
		}
		
		else if(row.status == 2){
			alert(this.language.alertcancelled);
		}
		
		else {
			confirmAlert({
			  message: this.language.confirmpayment,
			  buttons: [
				{
					label: 'Yes',
					onClick: (orderid) => {
						var orderid = row.orderid;
						this.markPaid(orderid)					
				  }
				},
				{
				  label: 'No',
				  
				}
			  ]
			})
		}
    }
	
	markPaid = (orderid) => {
		axios.post(serverUrl+'order_paid.php', {
			orderid: orderid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                this.loadData();
				alert(this.language.paymentsuccess);
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'order_list.php', {
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
	
	deleteOrder = (orderid) => {
		this.props.doLoading();
		axios.post(serverUrl+'order_delete.php', {
            orderid: orderid
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
	
	loadData = () => {
		this.props.doLoading();
		axios.post(serverUrl+'order_list.php', {
			filter:'',
			communityid: this.state.communityid
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
	
	componentDidMount = () => {
		this.loadData();
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
export default ListOrder;