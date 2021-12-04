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

class ListHomeBannerPage extends Component {
    constructor(props) {
        super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listhomebannerpage');
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
			Header: this.language.columnbannerpic,
			headerStyle: {fontWeight : 'bold'},
			accessor: 'bannerpic',
			style: { textAlign: "center"},
			Cell : e => (
                <div>
                    <img width={100} height={50} src={e.original.bannerpic}/>
                </div>
            )
		},
		{
			Header: this.language.columnposition,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'position',
            style: { textAlign: "center"},
			Cell : e => (e.original.position === 0 ? "TOP" : "BOTTOM")
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
		this.props.history.push('/panel/inputmarketplaceadvertisement');
	}
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editmarketplaceadvertisement/'+row.marketplaceadvertisementid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  //title: 'Confirm to submit',
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (marketplaceadvertisementid) => {
					var marketplaceadvertisementid = row.marketplaceadvertisementid;
					console.log(marketplaceadvertisementid);
					this.deleteMarketplaceAdvertisement(marketplaceadvertisementid)					
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
		axios.post(serverUrl+'marketplaceadvertisement_list.php', {
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
	
	deleteMarketplaceAdvertisement = (marketplaceadvertisementid) => {
		this.props.doLoading();
		axios.post(serverUrl+'marketplaceadvertisement_delete.php', {
            marketplaceadvertisementid: marketplaceadvertisementid
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
		axios.post(serverUrl+'marketplaceadvertisement_list.php', {
			filter:'',
			communityid : this.state.communityid
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
					<input type="text" className="form-control form-control-lg" placeholder="Search" onChange = {(event) => this.setState({ filter : event.target.value }) }/>
					</fieldset>
				</form> 
				<Button color="primary" size="sm" onClick={() => this.doSearch()}>{this.globallang.search}</Button>
				<br></br>
				<br></br>
				<Button color="success" onClick={() => this.addNew()}>{this.globallang.add}</Button>
				<br></br>
				<br></br>
				<Label>{this.language.title}</Label>
				<div className="box-container">
                	<ReactTable data={this.state.tableData} columns={this.tableColumns} defaultPageSize={10} />
				</div>
            </FormGroup>
        );
	}
}
export default ListHomeBannerPage;