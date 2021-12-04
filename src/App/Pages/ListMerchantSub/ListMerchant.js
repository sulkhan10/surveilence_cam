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

class ListMerchant extends Component {
    constructor(props) {
		super(props);
		
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listmerchant');
		
		this.state = {
			tableData: [],
			filter:'',
			mainCommunity : this.props.community.communityid
        }
		
        this.tableColumns = [ {
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'merchantname',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columncategory,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'merchantcategoryname',
            style: { textAlign: "center"}
        }, 	
		/*{
            Header: 'Short Description',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'shortdesc',
            style: { textAlign: "center"}
        }, 	
		{
            Header: 'Full Description',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'fulldesc',
            style: { textAlign: "center"}
        },
		{
            Header: 'Merchant Picture',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'merchantpic',
            style: { textAlign: "center"}
        },*/ 		
		{
            Header: this.language.columntags,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'tags',
            style: { textAlign: "center"}
        }, 		
		/*{
            Header: 'About',
			headerStyle: {fontWeight : 'bold'},
            accessor: 'about',
            style: { textAlign: "center"}
        },*/ 			
		{
            Header: this.language.columncommunity,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'communityname',
            style: { textAlign: "center"}
        }, 		
		{
            Header: this.language.columnavailable,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'isavailable',
            style: { textAlign: "center"},
			Cell : e => (e.original.isavailable === 0 ? this.globallang['hidden'] : this.globallang['show'])
        }, 	
		// {
        //     Header: this.language.columnaction,
		// 	headerStyle: {fontWeight : 'bold'},
        //     accessor: '',
		// 	style: { textAlign: "center"},
        //     Cell : e => (
        //         <div>
        //             <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
        //             <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
        //         </div>
        //     )
		// }
	]
    }
	
	addNew = () => {
		this.props.history.push('/panel/inputmerchant');
	}
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editmerchant/'+row.merchantid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  //title: 'Confirm to submit',
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (merchantid) => {
					var merchantid = row.merchantid;
					this.deleteMerchant(merchantid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'merchant_list.php', {
			filter: this.state.filter,
			communityid: this.state.mainCommunity
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
	
	deleteMerchant = (merchantid) => {
		this.props.doLoading();
		axios.post(serverUrl+'merchant_delete.php', {
            merchantid: merchantid
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
	
	componentDidMount = () => {
		//localStorage.clear();
		localStorage.removeItem('this_is_data');
		localStorage.removeItem('commodity_data');
		this.props.doLoading();
		axios.post(serverUrl+'merchant_list.php', {
			filter:'',
			communityid: this.state.mainCommunity
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
export default ListMerchant;