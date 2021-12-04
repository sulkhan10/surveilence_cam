import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactTable from "react-table";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-table/react-table.css';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class ListVoucher extends Component {
    constructor(props) {
		super(props);
		
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listvoucher');
		
		this.state = {
			tableData: [],
			filter:'',
			mainCommunity: this.props.community.communityid,
			modalIsOpen: false,
			file: []
        }
		
        this.tableColumns = [ {
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'vouchername',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columnvaliddatein,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'validdatein',
            style: { textAlign: "center"}
		}, 	
		{
            Header: this.language.columnvaliddateout,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'validdateout',
            style: { textAlign: "center"}
        }, 			
		{
            Header: this.language.columndiscount,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'voucherdiscount',
            style: { textAlign: "center"}
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
                    <Button color="warning" size="sm" onClick={() => this.doRowEdit(e.original)}>{this.globallang.edit}</Button>&nbsp;
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.original)} >{this.globallang.delete}</Button>
                </div>
            )
        }]
    }
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editvoucher/'+row.voucherid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (voucherid) => {
					var voucherid = row.voucherid;
					this.deleteRoom(voucherid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	
	addNew = () => {
		this.props.history.push('/panel/inputvoucher');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'voucher_list.php', {
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
	
	deleteRoom = (voucherid) => {
		this.props.doLoading();
		axios.post(serverUrl+'voucher_delete.php', {
            voucherid: voucherid
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
		this.props.doLoading();
		axios.post(serverUrl+'voucher_list.php', {
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
export default ListVoucher;