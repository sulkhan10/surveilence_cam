import React, { Component } from "react";
//import axios from 'axios';
import { Container, Row, Col, Button } from "reactstrap";
//import { serverUrl } from '../../../config.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./VideoUploader.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import ButtonUI from "@mui/material/Button";
import { Typography } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

class VideoUploader extends Component {
  constructor(props) {
    super(props);

    this.language = getLanguage(activeLanguage, "PictureUploader");

    this.state = {
      lists: this.removeInvalidImage(props.picList),
      onUpload: false,
      uploadPercent: 0,
      picLimit: props.picLimit,
      warning: "",
    };
    this.chooseFileInput = null;
    //console.log(this.props.picList);
  }
  componentWillReceiveProps(props) {
    //console.log(props.picList);
    this.setState({ lists: this.removeInvalidImage(props.picList) });
  }

  removeInvalidImage = (list) => {
    if (list === undefined || list === null || list === "") list = [];
    let newList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] === null || list[i] === undefined || list[i] === "") continue;
      newList.push(list[i]);
    }
    return newList;
  };

  chooseFile = () => {
    this.chooseFileInput.click();
  };
  getFile = (e) => {
    console.log(e.target.files[0].size);
    let upfile = e.target.files[0].size;

    if (upfile.size > 1024000) {
      alert("Hahahah epapaa");
    }

    e.stopPropagation();
    e.preventDefault();

    if (e.target.files) {
      //const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        if (this.state.lists.length >= this.state.picLimit) {
          this.setState({ warning: this.language.reachlimit });
          setTimeout(() => {
            this.setState({ warning: "" });
          }, 3000);
          break;
        }

        let file = e.target.files[i];

        console.log(file);

        this.getImage(file);
      }
      setTimeout(() => {
        if (this.props.onUpload !== null && this.props.onUpload !== undefined)
          this.props.onUpload(this.state.lists);
        this.chooseFileInput.value = "";
      }, 300);

      //formData.append('total', event.dataTransfer.items.length);
      //this.uploadImage(formData);
    }
  };

  removeDropItems = (event) => {
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  };

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
        if (event.dataTransfer.items[i].kind === "file") {
          if (
            event.dataTransfer.items[i].type === "video/mp4" ||
            event.dataTransfer.items[i].type === "video/mp4" ||
            event.dataTransfer.items[i].type === "video/mp4"
          ) {
            if (this.state.lists.length >= this.state.picLimit) {
              this.setState({ warning: this.language.reachlimit });
              setTimeout(() => {
                this.setState({ warning: "" });
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
        this.chooseFileInput.value = "";
      }, 300);

      //formData.append('total', event.dataTransfer.items.length);
      //this.uploadImage(formData);
    }
    this.removeDropItems(event);
  };

  getImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      if (this.state.lists.length >= this.state.picLimit) {
        this.setState({ warning: this.language["reachlimit"] });
        setTimeout(() => {
          this.setState({ warning: "" });
        }, 3000);
        return false;
      }
      let lists = this.state.lists;
      lists.push(e.target.result);

      console.log(lists);
      this.setState({ lists: lists });
    };
    reader.readAsDataURL(file);
  };

  onDragOver = (event) => {
    //event.stopPropagation();
    event.preventDefault();
  };

  removePicture = (idx) => {
    let lists = this.state.lists;
    lists.splice(idx, 1);
    this.setState({ lists: lists });
    if (this.props.onUpload !== null && this.props.onUpload !== undefined)
      this.props.onUpload(lists);
  };

  renderOnUpload = () => {
    if (this.state.onUpload) {
      return (
        <div className="pictureuploader-onupload">
          <div className="loading-container">
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: this.state.uploadPercent + "%" }}
              ></div>
            </div>
            <div className="upload-text">
              Upload : {this.state.uploadPercent} %
            </div>
          </div>
        </div>
      );
    }
  };

  renderPicture() {
    if (this.state.lists.length === 0) {
      return <div className="drag-caption">{this.language["placeholder"]}</div>;
    } else {
      return (
        <Container>
          <Row>
            {this.state.lists.map((video, i) => (
              <Col xs="6" sm="4" md="3" className="pic-col" key={i}>
                {/* <img src={img} alt="uploadpic" /> */}
                <video width="400" wi controls>
                  <source src={video} type="video/mp4" />
                </video>
                <div className="delete-video">
                  <FontAwesomeIcon
                    icon="trash"
                    onClick={() => this.removePicture(i)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      );
    }
  }

  render() {
    return (
      <div className="pictureuploader-container">
        <div
          className="pictureuploader-droparea"
          onDrop={this.onDropHandler}
          onDragOver={this.onDragOver}
        >
          <div className="pictureuploader-button-container">
            <input
              type="file"
              multiple="multiple"
              accept="video/*"
              ref={(ref) => (this.chooseFileInput = ref)}
              style={{ display: "none" }}
              onChange={(e) => this.getFile(e)}
            />
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#0d47a1",
              }}
              startIcon={<UploadFile />}
              onClick={() => this.chooseFile()}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 12,
                  color: "#fff",
                  textTransform: "capitalize",
                  marginLeft: -6,
                }}
              >
                {this.language["choosefile"]}
              </Typography>
            </ButtonUI>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              Only MP4 and other video format files can be uploaded, only one
            </span>
          </div>
          {this.renderPicture()}
          {this.renderOnUpload()}
        </div>
        <div className="pictureuploader-info-container">
          <div className="warning-info">{this.state.warning}</div>
          <div className="max-file-info">
            {this.language["maxfile"]} : {this.state.picLimit} Video(s)
          </div>
        </div>
      </div>
    );
  }
}
export default VideoUploader;
