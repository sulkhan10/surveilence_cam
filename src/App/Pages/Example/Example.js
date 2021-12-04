import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
//import { Link, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import ReactTable from "react-table";

import './Example.style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css';

import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

import PictureUploader from '../../Components/PictureUploader/PictureUploader';
import SelectMultiColumn from '../../Components/SelectMultiColumn/SelectMultiColumn';
import TagSelector from '../../Components/TagSelector/TagSelector';
import FileUploader from '../../Components/FileUploader/FileUploader';
import CheckboxGroup from '../../Components/CheckboxGroup/CheckboxGroup';

import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';

class Example extends Component {

    constructor(props) {
        super(props);
        
        this.language = getLanguage(activeLanguage, 'example');

        this.state = {
            title: '',
            introduction: '',
            imageLists: [],
            fileLists: [],
            date: moment(),
            tagSelectorValue: 'tags1;tags2',
			editorState: EditorState.createEmpty()
        }
        
        this.tableColumns = [{
            Header: 'Column1',
            accessor: 'col1',
        }, {
            Header: 'Column2',
            accessor: 'col2',
            style: { textAlign: "right"}
        }, {
            Header: 'Actions',
            accessor: '',
            Cell : e => (
                <div>
                    {this.renderButton(e.row)}
                    <Button color="danger" size="sm" onClick={() => this.doRowDelete(e.row)} >Delete</Button>
                </div>
            )
        }]

        this.tableData = [{
            col1: 'rusman',
            col2: '10'
        }, {
            col1: 'example',
            col2: '12'
        }]
		
		this.onChange = (editorState) => this.setState({editorState});
		this.handleKeyCommand = this.handleKeyCommand.bind(this);
		this.setEditor = (editor) => {
		  this.editor = editor;
		};
		this.focusEditor = () => {
		  if (this.editor) {
			this.editor.focus();
		  }
		};
    }

    renderButton = (row)=>{
        if(row.col1 === 'rusman'){
            return (<span><Button color="warning" size="sm" onClick={() => this.doRowEdit(row)}>Edit</Button>&nbsp;</span>)
        }
    }

    doRowEdit = (row) => {
        console.log(row);
    }
    doRowDelete = (row) => {
        console.log(row);
    }

    onUploadImage = (result) => {
        this.setState({ imageLists: result });
    }
    onUploadFile = (result) => {
        this.setState({ fileLists: result });
    }

    updateDate = (date) => {
        this.setState({ date: date });
    }

    changeSelectMultiColumn = (value, obj)=>{
        console.log(value);
        console.log(obj);
    }

    changeTabSelector = (data) =>{
        console.log(data)
        this.setState({tagSelectorValue: data});
    }

    onChangeCheckboxGroup = (result)=>{
        console.log(result);
    }

    doSubmit = () => {
        console.log(this.state);

        /*axios({
            method: 'post',
            url: 'http://localhost/basecpWebservice/saveForm.php',
            data: {
                title: this.state.title,
                introduction: this.state.introduction,
                imagelist: this.state.imageLists
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });*/
    }

    doCancel = () => {
        console.log('cancel');
    }
	
	/* onChange(e)
	{
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload=(e)=>{
			this.
			console.log("file data ",e.target.result);
			const url = '';
			const formData = {file: e.target.result};
			
			return post(url, formData)
				.then(response => console.log("result", response))
		}
		
		
		axios({
            method: 'post',
            //url: 'http://localhost/basecpWebservice/saveForm.php',
            data: {
                
				title: this.state.title,
                introduction: this.state.introduction,
                imagelist: this.state.imageLists
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
	} */

    componentDidMount=()=>{
        this.focusEditor();
        /*axios({
            method: 'post',
            url: 'http://192.168.64.2/webservice/returnImage.php',
            data: {
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                this.setState({imageLists:[response.data.image]});
                //console.log(this.state.imageLists);
            })
            .catch((error) => {
                console.log(error);
            });*/
    }

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
		  this.onChange(newState);
		  return 'handled';
		}
		return 'not-handled';
	  }

    render() {
        return (
            <div>
                <div className="page-header">
                    {this.language['title']} <span className="dash">&nbsp;-&nbsp;</span> <span className="parent-title">Park Information</span>
                </div>
                <div className="box-container">
                    <Form>
                        <FormGroup>
                            <Label for="title">Title :</Label>
                            <Input type="text" name="title" id="title" placeholder="Input title" value={this.state.title} onChange={(event) => this.setState({title : event.target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="introduction">Introduction :</Label>
                            <Input type="textarea" name="introduction" id="introduction" placeholder="Input introduction" value={this.state.introduction} onChange={(event) => this.setState({introduction : event.target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Date :</Label>
                            <DatePicker selected={this.state.date} onChange={this.updateDate} className="date-picker" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Images file :</Label>
                            <PictureUploader onUpload={this.onUploadImage} picLimit={3} picList={this.state.imageLists}></PictureUploader>
                        </FormGroup>
                        <FormGroup>
                            <Label>Table :</Label>
                            <ReactTable data={this.tableData} columns={this.tableColumns} defaultPageSize={10} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Loading :</Label>
                            <Button color="primary" onClick={() => this.props.doLoading()}>Loading</Button>
                        </FormGroup>
                        <FormGroup>
                            <Label>Select Multi Column :</Label>
                            <SelectMultiColumn width={200} value={2} valueColumn={'id'} showColumn={'name'} data={[{name: 'Rusman', phone:'0817282739', id:1},{name: 'Rusman1', phone:'081728232339', id:2},{name: 'asdd', phone:'081728232', id:3}]} columns={['name','phone']} onChange={this.changeSelectMultiColumn} />
                        </FormGroup>
						<FormGroup>
                            <Label>Upload File</Label>
                            <FileUploader onUpload={this.onUploadFile} fileLimit={3} fileList={this.state.fileLists}></FileUploader>
                        </FormGroup>
                        <FormGroup>
                            <Label>Upload File Excel</Label>
                            <FileUploader onUpload={this.onUploadFile} fileLimit={3} fileList={this.state.fileLists} fileType={'.csv|.xls|.xlsx'}></FileUploader>
                        </FormGroup>
                        <FormGroup>
                            <Label>Checkbox Group</Label>
                            <CheckboxGroup onChange={this.onChangeCheckboxGroup} width={'100%'} showKey={'name'} data={[{id: 1, name:'rusman', checked:false},{id:2, name:'coba', checked:true}]}></CheckboxGroup>
                        </FormGroup>
						<FormGroup>
                            <Label>Draft.js Editor</Label>
                            <Editor editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} ref={this.setEditor}/>
                        </FormGroup>
                        <div className="form-button-container">
                            <Button color="primary" onClick={() => this.doSubmit()}>Submit</Button> <Button color="secondary" onClick={() => this.doCancel()}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

export default Example;