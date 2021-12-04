import React, { Component } from 'react';
//import axios from 'axios';
import { Container, Row, Col, Button } from 'reactstrap';
//import { serverUrl } from '../../../config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './FileUploader.style.css';
import { activeLanguage } from '../../../config';
import { getLanguage } from '../../../languages';

class FileUploader extends Component {
    constructor(props) {
        super(props);

        this.language = getLanguage(activeLanguage, 'FileUploader');

        


        this.state = {
            lists: this.removeInvalidFile(props.fileList),
            onUpload: false,
            uploadPercent: 0,
            fileLimit: props.fileLimit,
            warning: '',
            fileType: this.checkAcceptFile(props.fileType),
            fileTypeRaw : props.fileType === undefined ? '.pdf' : props.fileType
        }
        this.chooseFileInput = null;
    }
    componentWillReceiveProps(props){
        this.setState({ lists: this.removeInvalidFile(props.fileList), fileLimit: props.fileLimit, fileType: this.checkAcceptFile(props.fileType) });
    }

    checkAcceptFile=(fileType)=>{
        let acceptFile = '.pdf';
        if(fileType !== undefined){
            let tmp = fileType.split("|");
            if(tmp.length > 0) acceptFile = '';
            tmp.map((type)=>{
                if(acceptFile !== '') acceptFile += ", ";
                switch(type){
                    case ".pdf": acceptFile += '.pdf'; break;
                    case ".csv": acceptFile += '.csv'; break;
                    case ".xls": acceptFile += 'application/vnd.ms-excel'; break;
                    case ".xlsx": acceptFile += 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
                }
            });
        }
        return acceptFile;
    }

    removeInvalidFile = (list) => {
        if(list === undefined || list === null || list === "") list = [];
        let newList = [];
        for(let i=0;i< list.length;i++){
            if(list[i] === null || list[i] === undefined || list[i] === "" ) continue;
            newList.push(list[i]);
        }
        return newList;
    }

    chooseFile= () => {
        this.chooseFileInput.click();
    }
    getFile =(e) =>{
        
        e.stopPropagation();
        e.preventDefault();
        if (e.target.files) {
        
            for (let i = 0; i < e.target.files.length; i++) {
                
                
                if (this.state.lists.length >= this.state.fileLimit) {
                    this.setState({ warning: this.language.reachlimit });
                    setTimeout(() => {
                        this.setState({ warning: '' });
                    }, 3000);
                    break;
                }

                let file = e.target.files[i];

                this.getImage(file);
                    
            }
            setTimeout(() => {
                if (this.props.onUpload !== null && this.props.onUpload !== undefined)
                    this.props.onUpload(this.state.lists);
                    this.chooseFileInput.value='';
            }, 300);

            //formData.append('total', event.dataTransfer.items.length);
            //this.uploadImage(formData);
        }
    }

    removeDropItems = (event) => {
        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            event.dataTransfer.items.clear();
        } else {
            // Use DataTransfer interface to remove the drag data
            event.dataTransfer.clearData();
        }
    }

    //upload image user formdata
    /*uploadImage = (formData) => {
        axios({
            method: 'post',
            url: 'http://localhost/basecpWebservice/uploadImage.php',
            data: formData,
            onUploadProgress: progressEvent => {
                //console.log('progress : ' + (progressEvent.loaded / progressEvent.total));
                let percent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
                this.setState({ onUpload: true, uploadPercent: percent });
            }
        })
            .then(response => {
                //console.log(response);
                let result = response.data;

                if (result.status == "ok") {
                    let lists = this.state.lists;
                    lists = lists.concat(result.records);
                    this.setState({ lists: lists, onUpload: false, uploadPercent: 0 });

                    if (this.props.onUpload != null && this.props.onUpload != undefined)
                        this.props.onUpload('hahahaha');
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ onUpload: false, uploadPercent: 0 });
            });
    }*/

    onDropHandler = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.dataTransfer.items) {
            //const formData = new FormData();
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (event.dataTransfer.items[i].kind === 'file') {
                    
                    if ((event.dataTransfer.items[i].type === 'application/pdf' && this.state.fileTypeRaw.includes('.pdf')) 
                        || (event.dataTransfer.items[i].type === 'application/csv' && this.state.fileTypeRaw.includes('.csv')) 
                        || (event.dataTransfer.items[i].type === 'application/vnd.ms-excel' && this.state.fileTypeRaw.includes('.xls')) 
                        || (event.dataTransfer.items[i].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && this.state.fileTypeRaw.includes('.xlsx'))  ) {
                        if (this.state.lists.length >= this.state.fileLimit) {
                            this.setState({ warning: 'Already reach limit file' });
                            setTimeout(() => {
                                this.setState({ warning: '' });
                            }, 3000);
                            break;
                        }

                        let file = event.dataTransfer.items[i].getAsFile();
                        //formData.append('file' + i, file, file.name);        
                        this.getImage(file);
                    }
                }
            }
            setTimeout(() => {
                if (this.props.onUpload !== null && this.props.onUpload !== undefined)
                    this.props.onUpload(this.state.lists);
            }, 300);

            //formData.append('total', event.dataTransfer.items.length);
            //this.uploadImage(formData);
        }
        this.removeDropItems(event);
    }

    getImage = (file) => {

        let reader = new FileReader();
        reader.onload = (e) => {
            if (this.state.lists.length >= this.state.fileLimit) {
                this.setState({ warning: this.language['reachlimit'] });
                setTimeout(() => {
                    this.setState({ warning: '' });
                }, 3000);
                return false;
            }
            let lists = this.state.lists;
            let obj = { name: file.name, base64: e.target.result }
            lists.push(obj);
            this.setState({ lists: lists });
        }
        reader.readAsDataURL(file);
        
    }

    onDragOver = (event) => {
        //event.stopPropagation();
        event.preventDefault();
    }

    removeFile = (idx) => {
        let lists = this.state.lists;
        lists.splice(idx, 1);
        this.setState({ lists: lists });
    }

    renderOnUpload = () => {
        if (this.state.onUpload) {
            return (
                <div className="fileuploader-onupload">
                    <div className="loading-container">
                        <div className="bar-container">
                            <div className="bar" style={{ width: (this.state.uploadPercent + '%') }} ></div>
                        </div>
                        <div className="upload-text">Upload : {this.state.uploadPercent} %</div>
                    </div>
                </div >
            )
        }
    }

    renderFile() {
        if (this.state.lists.length === 0) {
            return (
                <div className="drag-caption">{this.language['placeholder']}</div>
            )
        } else {
            return (
                <Container>
                    <Row>
                        {this.state.lists.map((file, i) => 
                            <Col xs="6" sm="4" md="3" className="pic-col" key={i}>
                                <FontAwesomeIcon icon="file" className="icon-file"/>
                                <div className="pic-name">{file.name}</div>
                                <div className="delete">
                                    <FontAwesomeIcon icon="trash" onClick={() => this.removeFile(i)} />
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            )
        }
    }

    render() {
        return (
            <div className="fileuploader-container">
                <div className="fileuploader-droparea" onDrop={this.onDropHandler} onDragOver={this.onDragOver}>
                    <div className="fileuploader-button-container">
                        <input type="file" multiple="multiple" accept={this.state.fileType} ref={(ref)=> this.chooseFileInput = ref} style={{display:'none'}} onChange={(e)=> this.getFile(e)} />
                        <Button color="primary" size="sm" onClick={()=>this.chooseFile()}>{this.language['choosefile']}</Button>
                    </div>
                    {this.renderFile()}
                    {this.renderOnUpload()}
                </div>
                <div className="fileuploader-info-container">
                    <div className="warning-info">{this.state.warning}</div>
                    <div className="max-file-info">{this.language['maxfile']} : {this.state.fileLimit} {this.language['pictures']}</div>
                </div>
            </div>
        );
    }
}
export default FileUploader;