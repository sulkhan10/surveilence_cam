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
import Modal from 'react-modal';
import FileUploader from '../../Components/FileUploader/FileUploader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class ListCompany extends Component {
    constructor(props) {
		super(props);
		this.reactTable = React.createRef();
		this.globallang = getLanguage(activeLanguage, 'global');
		this.language = getLanguage(activeLanguage, 'listcompany');
		
		this.state = {
			tableData: [],
			filter:'',
			mainCommunity: this.props.community.communityid,
			modalIsOpen: false,
			file: []
        }
		
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		
        this.tableColumns = [ {
            Header: this.language.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companyname',
            style: { textAlign: "center"}
        },
		{
            Header: this.language.columncategory,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companycategoryname',
            style: { textAlign: "center"}
        }, 		
		{
            Header: this.language.columnshortdesc,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'shortdesc',
            style: { textAlign: "center"}
        }, 				
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
	
	closeModal() {
		this.setState({modalIsOpen: false});
		this.setState({file: null});
	}
	
	openModal = () => {
		this.setState({modalIsOpen: true});
	}
	
	doRowEdit = (row) => {
		this.props.history.push('/panel/editcompany/'+row.companyid);
    }
	
    doRowDelete = (row) => {
		confirmAlert({
		  message: this.language.confirmdelete,
		  buttons: [
			{
				label: 'Yes',
				onClick: (companyid) => {
					var companyid = row.companyid;
					this.deleteCompany(companyid)					
			  }
			},
			{
			  label: 'No',
			  
			}
		  ]
		})
    }
	
	onUploadFile = (result) => {
        this.setState({ file: result });
    }
	
	uploadFile = () => {
		const {file} = this.state;
		
		if(file == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
		axios.post(serverUrl+'filecompany_insert_update.php', {
			filelist: this.state.file
		},  
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				this.closeModal();
				alert(this.language.savesuccess);
				this.props.history.push('/panel/listcompany');
            })
            .catch( (error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}
	
	addNew = () => {
		this.props.history.push('/panel/inputcompany');
	}
	
	doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'company_list.php', {
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
	
	deleteCompany = (companyid) => {
		this.props.doLoading();
		axios.post(serverUrl+'company_delete.php', {
            companyid: companyid
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
		axios.post(serverUrl+'company_list.php', {
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
	
	renderModal() {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles}
			>
			<div className="page-header">
                    {this.language.modaltitle} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
							<td><Label>Upload File</Label></td>
                            <td><FileUploader onUpload={this.onUploadFile} fileLimit={1} fileList={this.state.file} fileType={".xls|.xlsx|.csv"}></FileUploader></td>
						</tr>
                    </table>
                </div>
			<div className="form-button-container">
				<Button color="secondary" 
				onClick={()=>this.closeModal()}>{this.language.modalcancel}</Button>&nbsp;&nbsp;
				<Button color="primary" 
				onClick={()=>this.uploadFile()}>{this.language.modalsubmit}</Button>
            </div>
			</Modal>
		);
	}

	reset=()=>{
		let data='';
		this.setState({ filter: data });
		this.props.doLoading();
		axios.post(serverUrl+'company_list.php', {
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
export default ListCompany;