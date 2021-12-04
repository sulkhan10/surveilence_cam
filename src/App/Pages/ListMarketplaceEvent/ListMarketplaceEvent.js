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

class ListMarketplaceEvent extends Component {
    constructor(props) {
        super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listmarketplaceevent');
		this.state = {
			tableData: [],
			filter:'',
			communityid: this.props.community.communityid
        }
		
        this.tableColumns = [ {
            Header: this.language.columntitle,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'title',
            style: { textAlign: "center"}
        }, 	
		{
            Header: this.language.columndescription,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'description',
            style: { textAlign: "center"}
        },	
		{
            Header: this.language.columnstartdate,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'startdate',
            style: { textAlign: "center"}
        },	
		{
            Header: this.language.columnenddate,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'enddate',
            style: { textAlign: "center"}
        },			
		{
            Header: this.language.columnstarttime,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'starttime',
            style: { textAlign: "center"}
        }, 		
		{
            Header: this.language.columnendtime,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'endtime',
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
	
	componentWillReceiveProps=(props)=>{
		
	}
	
	addNew = () => {
		this.props.history.push('/panel/inputmarketplaceevent');
	}
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editmarketplaceevent/'+row.marketplaceeventid);
    }
	
    doRowDelete = (row) => {
        console.log(row);
		confirmAlert({
		  //title: 'Confirm to submit',
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (marketplaceeventid) => {
					var marketplaceeventid = row.marketplaceeventid;
					console.log(marketplaceeventid);
					this.deleteMarketplaceEvent(marketplaceeventid)					
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
		axios.post(serverUrl+'marketplaceevent_list.php', {
			filter: this.state.filter,
			communityid : this.state.communityid
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
	
	deleteMarketplaceEvent = (marketplaceeventid) => {
		this.props.doLoading();
		axios.post(serverUrl+'marketplaceevent_delete.php', {
            marketplaceeventid: marketplaceeventid
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
		axios.post(serverUrl+'marketplaceevent_list.php', {
			filter:'',
			communityid : this.state.communityid
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
export default ListMarketplaceEvent;