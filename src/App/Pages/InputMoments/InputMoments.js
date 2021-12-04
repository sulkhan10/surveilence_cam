import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col,Row } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';
import './InputMoments.style.css';
import Modal from 'react-modal';
import matchSorter from 'match-sorter';
import { confirmAlert } from 'react-confirm-alert'; 
import ReactTable from "react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class InputMoments extends Component {
    constructor(props) {
		super(props);
		this.globallang = getLanguage(activeLanguage, 'global');
		this.lang = getLanguage(activeLanguage, 'listuser');
		this.language = getLanguage(activeLanguage, 'inputmoments');

		this.state = {
			momentid: 0,
			phoneno: '',
			name: '',
			desc: '', 
			gallery: [],
			communityid: '',
			communityShow: [],
			ishidden: false,
			modalIsOpen: false,
			filter: '',
			tableDataSearch: [],
			filtered: [],
			filterAll: ''
		}
		
		this.addNew = this.addNew.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.filterAll = this.filterAll.bind(this);
		
		this.tableColumnsSearch = [ {
            Header: this.lang.columnname,
			headerStyle: {fontWeight : 'bold'},
            accessor: 'name',
            style: { textAlign: "center"},
			filterMethod: (filter, row) => {
                    return row[filter.id].includes(filter.value);
                  }
        },
		{
            Header: this.lang.columnaction,
			headerStyle: {fontWeight : 'bold'},
            accessor: '',
			style: { textAlign: "center"},
            Cell : e => (
                <div>
					<Button color="success" onClick={()=>this.addUser(e.original)}>Select</Button>
                </div>
            )
        },
		{
              // NOTE - this is a "filter all" DUMMY column
              // you can't HIDE it because then it wont FILTER
              // but it has a size of ZERO with no RESIZE and the
              // FILTER component is NULL (it adds a little to the front)
              // You culd possibly move it to the end
              Header: "",
              id: 'all',
              width: 0,
              resizable: false,
              sortable: false,
              Filter: () => { },
              getProps: () => {
                return {
                  
                }
              },
              filterMethod: (filter, rows) => {
                const result = matchSorter(rows, filter.value, {
                  keys: [
                    "name"
                  ], threshold: matchSorter.rankings.CONTAINS
                });
                return result;
              },
              filterAll: true,
		}
		]
    }
	
	addUser = (user) =>{
		this.setState({phoneno: user.phoneno});
		this.setState({name: user.name});
		this.closeModal();
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	addNew = () => {
		this.setState({modalIsOpen: true});
		this.doLoad();
	}
	
	filterAll = (e) =>{
		const { value } = e.target;
		const filterAll = value;
		const filtered = [{ id: 'all', value: filterAll }];
		this.setState({ filterAll, filtered });
	}
	
	doLoad = () => {
		axios.post(serverUrl+'user_list.php', {
			filter: this.state.filter
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.setState({tableDataSearch : response.data.records});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }
	
	isHiddenChecked (event) {
		let checked = event.target.checked;
		this.setState({ishidden: checked});
	}
	
	selectCommunity = () =>{
		axios.post(serverUrl+'community_list.php', {filter: ''},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
                this.setState({ communityShow: response.data.records});
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
	}
	
	componentDidMount = () =>{
		this.selectCommunity();
	}
	
	changeCommunity = (communityid)=>{
        this.setState({communityid: communityid});
    }
	 
	checkData = () => {
		const {name} = this.state;
		const {desc} = this.state;
		const {gallery} = this.state;
		const {communityid} = this.state;
		
		if(name == null || gallery == null || gallery == '' || desc == null || communityid == null){
			alert(this.language.validation);
			return false;
		}
			
		else{
			this.onSubmit();
		}
	}
	
	onSubmit = () => {
		this.props.doLoading();
        axios.post(serverUrl+'moment_insert_update.php', {			
			momentid: this.state.momentid,
			phoneno: this.state.phoneno,
			desc: this.state.desc,
			gallery: this.state.gallery,
			communityid: this.state.communityid,
			ishidden: this.state.ishidden
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				
				if(response.data.status === "ok"){
					alert(this.language.savesuccess);
					this.props.history.push('/panel/listmoments');
				}else{
					alert(response.data.message);
				}
				
            })
            .catch( (error) =>{
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
			<FormGroup>
				Filter User: <input value={this.state.filterAll} onChange={this.filterAll} />
				<br></br>
				<br></br>
				<ReactTable data={this.state.tableDataSearch} columns={this.tableColumnsSearch} defaultPageSize={10} 
				filtered={this.state.filtered}
				ref={r => this.selectTable = r}
				defaultFilterMethod={(filter, row) =>
				String(row[filter.id]) === filter.value}
				/>
			</FormGroup>
			</Modal>
		);
	}
	
	render() {
        return (
            <div>
                <div className="page-header">
                    {this.language.title} <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
                <div className="box-container">
					<table>
						<tr>
                            <td><Label for="name">{this.language.fieldname}</Label></td>
                            <td><Input type="text" name="name" id="name" disabled="disabled" value={this.state.name} /></td>&nbsp;&nbsp;
							<Button style={{verticalAlign:'top'}} color="success" onClick={() => this.addNew()}><FontAwesomeIcon icon="plus"/></Button>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="desc">{this.language.fielddesc}</Label></td>
                            <td><Input type="textarea" name="desc" id="desc" placeholder={this.language.fielddesc} value={this.state.desc} onChange = {(event) => this.setState({ desc : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>{this.globallang.gallery}</Label></td>
							<td>
							<PictureUploader onUpload={this.onUploadGallery} picList = {this.state.gallery} picLimit={9}></PictureUploader>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="communityid">{this.language.fieldcommunity}</Label></td>
                            <td><SelectMultiColumn width={200} value={this.state.communityid} valueColumn={'communityid'} showColumn={'communityname'} columns={['communityname']} data={this.state.communityShow} onChange={this.changeCommunity} /></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="ishidden">{this.language.fieldhidden}</Label></td>
                            <td style={{verticalAlign:'top'}}><Input type="checkbox" name="ishidden" id="ishidden" checked={this.state.ishidden} onChange={(event)=>this.isHiddenChecked(event)}/></td>
                        </tr>
						<br></br>		
						{this.renderModal()}
                    </table>
					<div className="form-button-container">
						<Button color="primary" 
						onClick={()=>this.checkData()}>{this.globallang.submit}</Button>
                    </div>
                </div>
					
            </div>
        );
    }
}
export default InputMoments;