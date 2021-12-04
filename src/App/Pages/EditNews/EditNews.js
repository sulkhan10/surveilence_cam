import React, { Component } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Input,
} from "reactstrap";
import classnames from "classnames";
// import CKEditor from "ckeditor4-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import VideoUploader from "../../Components/VideoUploader/VideoUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
//import TagSelector from '../../Components/TagSelector/TagSelector';
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
// import Modal from 'react-modal';
// import matchSorter from 'match-sorter';
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  ArrowBackIos,
  Cancel,
  Save,
  // Edit,
  // Delete,
  WarningAmber,
  Close,
  // AddBox,
} from "@mui/icons-material";
import ButtonUI from "@mui/material/Button";
import {
  Typography,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
  Alert,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
// import Select from 'react-select';

// const Style = {
//   control: (provided) => ({ ...provided, width: "100%" }),
//   container: (provided) => ({ ...provided, width: "100%" }),
// };

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "55%",
//     right: "-20%",
//     bottom: "-30%",
//     transform: "translate(-50%, -50%)",
//   },
// };
const config = {
  toolbarGroups: [
    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
    { name: "document", groups: ["document", "doctools"] },
    {
      name: "editing",
      groups: ["find", "selection", "spellchecker", "editing"],
    },
    { name: "forms", groups: ["forms"] },
    {
      name: "paragraph",
      groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
    },
    { name: "links", groups: ["links"] },
    { name: "insert", groups: ["insert"] },
    { name: "styles", groups: ["styles"] },
    { name: "colors", groups: ["colors"] },
    { name: "tools", groups: ["tools"] },
    { name: "clipboard", groups: ["clipboard", "undo"] },
    { name: "others", groups: ["others"] },
  ],

  fontSize_sizes: "16/16px;24/24px;48/48px;",
  font_names:
    "Arial/Arial, Helvetica, sans-serif;" +
    "Times New Roman/Times New Roman, Times, serif;" +
    "Verdana",
  allowedContent: true,
  height: 200,
  // disableNativeSpellChecker: false
  // skin: "moono",
  // plugins:
  //   "dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,notification,button,toolbar,clipboard,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,copyformatting,div,resize,elementspath,enterkey,entities,popup,filetools,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,tableselection,undo,lineutils,widgetselection,widget,notificationaggregator,uploadwidget,uploadimage,wsc"
};

class EditNews extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "editnews");
    this.state = {
      newsid: props.match.params.newsid,
      title: "",
      newscategoryid: "",
      headline: "",
      subtitle: "",
      fulldesc: "",
      newspic: [],
      bignewspic: [],
      thumbnail: [],
      communityid: "",
      expireddate: moment(),
      createDate: moment(),
      isavailable: false,
      newsCategoryShow: [],
      communityShow: [],
      modalIsOpen: false,
      newscategoryname: "",
      startDate: moment(),
      endDate: moment(),
      activeTab: "1",
      setActiveTab: 1,
      companyShow: [],
      companyid: null,
      company: null,
      previewmode: "0",
      status: "1",
      stickystatus: "1",
      videourl: [],
      tabaction: 0,
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };
    this.addNew = this.addNew.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  addNew = () => {
    this.setState({ modalIsOpen: true });
  };

  addNewsCategory = (newscategoryid) => {
    const { newscategoryname } = this.state;

    if (newscategoryname === null || newscategoryname === "") {
      alert(this.language.validation);
      return false;
    } else {
      axios
        .post(
          serverUrl + "newscategory_insert_update.php",
          {
            newscategoryid: this.state.newscategoryid,
            newscategoryname: this.state.newscategoryname,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        )
        .then((response) => {
          this.closeModal();
          this.setState({ newscategoryid: response.data.record });
          this.selectNewsCategory();
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };

  onUploadImage = (result) => {
    this.setState({ newspic: result });
  };

  selectNewsCategory = () => {
    axios
      .post(
        serverUrl + "newscategory_list.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ newsCategoryShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  selectCommunity = (companyShow) => {
    axios
      .post(
        serverUrl + "cp_community_list_available.php",
        { filter: "" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ communityShow: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.selectCommunity();
    this.selectNewsCategory();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "news_get_by_id2.php",
        {
          newsid: this.state.newsid,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response);
        this.props.doLoading();
        let tmp = [];
        if (response.data.record.newspic !== "") {
          tmp.push(response.data.record.newspic);
        }

        let video = [];
        if (response.data.record.videourl !== "") {
          this.setState({ tabaction: 1 });
          video.push(response.data.record.videourl);
        }

        if (response.data.record.fulldesc !== "") {
          this.setState({ tabaction: 1 });
        }

        let expired = moment(response.data.record.expireddate);
        let createDate = moment(response.data.record.currentdatetime);
        console.log(createDate);

        this.setState({
          headline: response.data.record.title,
          newscategoryid: response.data.record.newscategoryid,
          subtitle: response.data.record.shortdesc,
          fulldesc: response.data.record.fulldesc,
          bignewspic: tmp,
          videourl: video,
          communityid: response.data.record.communityid,
          status: response.data.record.isavailable,
          stickystatus: response.data.record.stickystatus,
          previewmode: response.data.record.previewmode,
          expireddate: expired,
          createDate: createDate,
        });
        this.setState({ thumbnail: response.data.record.thumbnailList });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  onEditorChange(evt) {
    this.setState({
      fulldesc: evt.editor.getData(),
    });

    this.setState({ tabaction: 1 });

    console.log(this.state.fulldesc);
  }

  changeCommunity = (communityid) => {
    this.setState({ communityid: communityid });
  };

  changeNewsCategory = (newscategoryid) => {
    this.setState({ newscategoryid: newscategoryid });
  };

  onUploadVideoUrl = (result) => {
    this.setState({ videourl: result });
    this.setState({
      tabaction: 1,
    });
  };

  updateDate = (date) => {
    this.setState({ expireddate: date });
  };

  isAvailableChecked(event) {
    let checked = event.target.checked;
    this.setState({ isavailable: checked });
  }

  handleStatusChangePreviewMode = (e) => {
    this.setState({
      previewmode: e.target.value,
    });
    // console.log(this.state.previewmode);
  };

  handleStatus = (e) => {
    this.setState({
      status: e.target.value,
    });
    // console.log(this.state.status);
  };

  handleStickyStatus = (e) => {
    this.setState({
      stickystatus: e.target.value,
    });
    // console.log(this.state.stickystatus);
  };

  onUploadImageBignewspic = (result) => {
    this.setState({ bignewspic: result });
  };

  onUploadImagethumbnail = (result) => {
    this.setState({ thumbnail: result });
  };

  onUploadImageIcon = (result) => {
    this.setState({ icon: result });
  };

  setStartDate = (date) => {
    this.setState({ startDate: date });
    console.log(this.state.startDate);
  };
  setEndDate = (date) => {
    this.setState({ endDate: date });
    console.log(this.state.endDate);
  };

  toggle = (tab) => {
    this.setState({ activeTab: tab });
  };

  createDate = (date) => {
    this.setState({ createDate: date });
    console.log(this.state.createDate);
  };

  checkData = () => {
    const { headline } = this.state;
    const { newscategoryid } = this.state;
    const { communityid } = this.state;
    const { previewmode } = this.state;

    if (headline === "") {
      this.setState({
        messageError: "Enter title news.",
        setOpenValidation: true,
      });
    } else if (newscategoryid === "") {
      this.setState({
        messageError: "Select news category.",
        setOpenValidation: true,
      });
    } else if (communityid === "") {
      this.setState({
        messageError: "Select community.",
        setOpenValidation: true,
      });
    } else if (previewmode === 0) {
      this.setState({
        messageError: "Select preview mode news.",
        setOpenValidation: true,
      });
    } else {
      this.onSubmit();
    }
  };

  onSubmit = () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date + " " + time;

    let body = {
      newsid: this.state.newsid,
      title: this.state.headline,
      newscategoryid: this.state.newscategoryid,
      shortdesc: this.state.subtitle,
      fulldesc: this.state.fulldesc,
      newspic: this.state.bignewspic,
      communityid: this.state.communityid,
      currentdatetime: this.state.createDate.format("YYYY-MM-DD HH:mm:ss"),
      videourl: this.state.videourl,
      thumbnail: this.state.thumbnail,
      previewmode: this.state.previewmode,
      status: this.state.status,
      stickystatus: this.state.stickystatus,
      startDate: this.state.startDate.format("YYYY-MM-DD"),
      expireddate: this.state.expireddate.format("YYYY-MM-DD"),
    };
    console.log(body);
    this.props.doLoading();
    axios
      .post(serverUrl + "news_insert_update2.php", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
      .then((response) => {
        this.props.doLoading();
        this.setState({
          openSuccess: true,
        });
        // alert(this.language.savesuccess);
        // this.props.history.push("/panel/news");
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  cancel = () => {
    this.props.history.push("/panel/news");
  };

  handleCloseValid = () => {
    this.setState({
      setOpenValidation: false,
      error: "",
    });
  };

  renderDialogValidation = () => {
    return (
      <Dialog
        open={this.state.setOpenValidation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        titleStyle={{ textAlign: "center" }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: "#006432", paddingBottom: 35 }}
        >
          <div style={{ position: "absolute", right: "42%", top: "5%" }}>
            <WarningAmber style={{ color: "#fff", width: 40, height: 40 }} />
          </div>
        </DialogTitle>
        <DialogContent style={{ minWidth: 250, width: 300, marginTop: 10 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              component="span"
              variant="body2"
              style={(stylesListDialog.inline, { fontSize: 14, color: "#333" })}
            >
              {this.state.messageError}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleCloseValid}
            color="primary"
            variant="outlined"
            size="small"
          >
            <Typography
              component="span"
              variant="body2"
              style={
                (stylesListDialog.inline,
                { fontSize: 14, fontWeight: "bold", color: "#2e6da4" })
              }
            >
              OK
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderSuccess = () => {
    if (this.state.openSuccess === true) {
      setTimeout(() => this.props.history.push("/panel/news"), 1000);

      return (
        <div style={{ margin: 10 }}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert
              variant="filled"
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => this.props.history.push("/panel/news")}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {this.language.savesuccess}
            </Alert>
          </Stack>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <ButtonUI
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#006432",
            }}
            startIcon={<ArrowBackIos />}
            onClick={() => this.props.history.push("/panel/news")}
          >
            <Typography
              variant="button"
              style={{
                fontSize: 12,
                color: "#fff",
                textTransform: "capitalize",
                marginLeft: -10,
              }}
            >
              Back
            </Typography>
          </ButtonUI>{" "}
          <Typography
            component="span"
            variant="h2"
            style={{
              fontSize: 16,
              color: "#006432",
              fontWeight: "bold",
              textTransform: "capitalize",
              float: "right",
            }}
          >
            Add News
          </Typography>
          <span className="dash">&nbsp;&nbsp;</span>
        </div>
        <div className="box-container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.typeofinformation}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.newscategoryid}
                  valueColumn={"newscategoryid"}
                  showColumn={"newscategoryname"}
                  columns={["newscategoryname"]}
                  data={this.state.newsCategoryShow}
                  onChange={this.changeNewsCategory}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.headline}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  rows={4}
                  name="headline"
                  id="title"
                  placeholder="Title news"
                  value={this.state.headline}
                  onChange={(event) =>
                    this.setState({ headline: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.subtitle}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  rows={4}
                  name="subtitle"
                  id="subtitle"
                  placeholder={this.language.fieldshortdesc}
                  value={this.state.subtitle}
                  onChange={(event) =>
                    this.setState({ subtitle: event.target.value })
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.bigpicture}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImageBignewspic}
                  picList={this.state.bignewspic}
                  picLimit={1}
                ></PictureUploader>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.details}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1",
                      })}
                      onClick={() => this.toggle("1")}
                    >
                      Type of information
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2",
                      })}
                      onClick={() => this.toggle("2")}
                    >
                      Movie type
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        {/* <CKEditor
                          activeClass="p10"
                          config={config}
                          data={this.state.fulldesc}
                          content={this.state.fulldesc}
                          onChange={this.onEditorChange}
                        /> */}
                        <CKEditor
                          editor={ClassicEditor}
                          config={config}
                          data={this.state.fulldesc}
                          onReady={(editor) => {
                            // You can store the "editor" and use when it is needed.
                            console.log("Editor is ready to use!", editor);
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            this.setState({
                              fulldesc: data,
                            });
                            // console.log({ event, editor, data });
                          }}
                          onBlur={(event, editor) => {
                            // console.log("Blur.", editor);
                          }}
                          onFocus={(event, editor) => {
                            // console.log("Focus.", editor);
                          }}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <VideoUploader
                          onUpload={this.onUploadVideoUrl}
                          picList={this.state.videourl}
                          picLimit={1}
                        ></VideoUploader>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.thumbnail}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadImagethumbnail}
                  picList={this.state.thumbnail}
                  picLimit={3}
                ></PictureUploader>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.previewmode}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <RadioGroup
                  row
                  name="row-radio-buttons-group"
                  value={this.state.previewmode}
                  onChange={(event) =>
                    this.handleStatusChangePreviewMode(event)
                  }
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Three-picture mode"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Single image mode"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Text mode"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="Big Picture Mode"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label="Large video mode"
                  />
                  <FormControlLabel
                    value="6"
                    control={<Radio />}
                    label="Small video mode"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Community
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.communityid}
                  valueColumn={"communityid"}
                  showColumn={"communityname"}
                  columns={["communityname"]}
                  data={this.state.communityShow}
                  onChange={this.changeCommunity}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.status}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <RadioGroup
                  row
                  name="row-radio-buttons-group"
                  value={this.state.status}
                  onChange={(event) => this.handleStatus(event)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Show"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Hidden"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={2}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  style={{
                    // fontSize: 16,
                    float: "left",
                    marginTop: 6,
                    color: "#006432",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {this.language.stickystatus}{" "}
                  <span style={{ color: "#FF0000" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <RadioGroup
                  row
                  name="row-radio-buttons-group"
                  value={this.state.stickystatus}
                  onChange={(event) => this.handleStickyStatus(event)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Default"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Permanent sticking (no time)"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Stick to top by time period (no time)"
                  />
                </RadioGroup>
              </Grid>

              {this.state.stickystatus === "3" ? (
                <>
                  {" "}
                  <Grid item xs={2}></Grid>
                  <Grid item xs={10}>
                    <div style={{ float: "left", display: "inline-flex" }}>
                      <DatePicker
                        selected={this.state.startDate}
                        disabled={this.state.stickystatus !== "3"}
                        onChange={(date) => this.setStartDate(date)}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        className=""
                      />
                      &nbsp;
                      <Typography
                        component="span"
                        variant="subtitle1"
                        style={{
                          // fontSize: 16,
                          float: "left",
                          marginTop: 6,
                          color: "#006432",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        To
                      </Typography>
                      &nbsp;
                      <DatePicker
                        selected={this.state.endDate}
                        disabled={this.state.stickystatus !== "3"}
                        onChange={(date) => this.setEndDate(date)}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        minDate={this.state.startDate}
                        className=""
                      />
                    </div>
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Box>
          <br />

          <div className="form-button-container">
            <br></br>
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#d0021b",
              }}
              startIcon={<Cancel />}
              onClick={() => this.props.history.push("/panel/news")}
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
                Cancel
              </Typography>
            </ButtonUI>{" "}
            &nbsp;&nbsp;
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#004dcf",
              }}
              startIcon={<Save />}
              onClick={() => this.checkData()}
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
                Submit
              </Typography>
            </ButtonUI>{" "}
          </div>
        </div>
        {this.renderDialogValidation()}
        {this.renderSuccess()}
      </div>
    );
  }
}
export default EditNews;
