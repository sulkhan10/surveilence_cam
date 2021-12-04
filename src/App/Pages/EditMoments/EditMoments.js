import React, { Component } from "react";
import { Input } from "reactstrap";
import axios from "axios";
import PictureUploader from "../../Components/PictureUploader/PictureUploader";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import "./EditMoments.style.css";
import Modal from "react-modal";
import matchSorter from "match-sorter";
import { confirmAlert } from "react-confirm-alert";
import ReactTable from "react-table";
import {
  ArrowBackIos,
  Cancel,
  Save,
  WarningAmber,
  Close,
  Edit,
  Delete,
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
  Checkbox,
} from "@mui/material";

const stylesListDialog = {
  inline: {
    display: "inline",
  },
};

const customStyles = {
  content: {
    top: "50%",
    left: "55%",
    right: "-20%",
    bottom: "-30%",
    transform: "translate(-50%, -50%)",
  },
};

class EditMoments extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.lang = getLanguage(activeLanguage, "listuser");
    this.language = getLanguage(activeLanguage, "editmoments");

    this.state = {
      momentid: props.match.params.momentid,
      phoneno: "",
      name: "",
      desc: "",
      momentpic: [],
      gallery: [],
      communityid: "",
      communityShow: [],
      isHidenShow: [
        { id: 1, display: "YES" },
        { id: 0, display: "NO" },
      ],
      ishidden: 0,
      modalIsOpen: false,
      filter: "",
      tableDataSearch: [],
      filtered: [],
      filterAll: "",
      tableCommenterDataSearch: [],
      filteredphoneno: [],
      filterPhoneno: "",
      filtercommenter: "",
      commentid: 0,
      commentphoneno: "",
      commentname: "",
      comment: "",
      commenthidden: false,
      tableComment: [],
      modalCommentIsOpen: false,
      modalCommentPhonenoIsOpen: false,
      messageError: "",
      setOpenValidation: false,
      openSuccess: false,
    };

    this.addNew = this.addNew.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.addNewPhonenoComment = this.addNewPhonenoComment.bind(this);
    this.closeCommentPhonenoModal = this.closeCommentPhonenoModal.bind(this);
    this.filterPhoneno = this.filterPhoneno.bind(this);

    this.tableColumnsSearch = [
      {
        Header: this.lang.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
        filterMethod: (filter, row) => {
          return row[filter.id].includes(filter.value);
        },
      },
      {
        Header: this.lang.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button color="success" onClick={() => this.addUser(e.original)}>
              Select
            </Button>
          </div>
        ),
      },
      {
        Header: "",
        id: "all",
        width: 0,
        resizable: false,
        sortable: false,
        Filter: () => {},
        getProps: () => {
          return {};
        },
        filterMethod: (filter, rows) => {
          const result = matchSorter(rows, filter.value, {
            keys: ["name"],
            threshold: matchSorter.rankings.CONTAINS,
          });
          return result;
        },
        filterAll: true,
      },
    ];

    this.tableColumnsPhonenoSearch = [
      {
        Header: this.lang.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "name",
        style: { textAlign: "center" },
        filterMethod: (filter, row) => {
          return row[filter.id].includes(filter.value);
        },
      },
      {
        Header: this.lang.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="success"
              onClick={() => this.addCommenter(e.original)}
            >
              Select
            </Button>
          </div>
        ),
      },
      {
        Header: "",
        id: "all",
        width: 0,
        resizable: false,
        sortable: false,
        Filter: () => {},
        getProps: () => {
          return {};
        },
        filterMethod: (filtercommenter, rows) => {
          const result = matchSorter(rows, filtercommenter.value, {
            keys: ["name"],
            threshold: matchSorter.rankings.CONTAINS,
          });
          return result;
        },
        filterPhoneno: true,
      },
    ];

    this.tableColumns = [
      {
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "commentname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncomment,
        headerStyle: { fontWeight: "bold" },
        accessor: "comment",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnhidden,
        headerStyle: { fontWeight: "bold" },
        accessor: "ishidden",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.ishidden === 0
            ? this.globallang["show"]
            : this.globallang["hidden"],
      },
      {
        Header: this.lang.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        width: 200,
        Cell: (e) => (
          <div>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#3f51b5",
              }}
              startIcon={<Edit />}
              onClick={() => this.doRowEdit(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.edit}
              </Typography>
            </Button>
            &nbsp;
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#ff0000",
              }}
              startIcon={<Delete />}
              onClick={() => this.doRowDelete(e.original)}
            >
              <Typography
                variant="button"
                style={{
                  fontSize: 14,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {this.globallang.delete}
              </Typography>
            </Button>
          </div>
        ),
      },
    ];
  }

  addComment = () => {
    const { comment } = this.state;
    const { commentphoneno } = this.state;

    if (
      comment === null ||
      comment === "" ||
      commentphoneno === null ||
      commentphoneno === ""
    ) {
      return false;
    } else {
      this.commentSave();
    }
  };

  commentSave = () => {
    axios
      .post(
        serverUrl + "comment_insert_update.php",
        {
          commentid: this.state.commentid,
          momentid: this.state.momentid,
          comment: this.state.comment,
          commentphoneno: this.state.commentphoneno,
          commenthidden: 0,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        alert(this.language.savesuccess);
        this.setState({ comment: "" });
        this.setState({ commentphoneno: "" });
        this.setState({ commentname: "" });
        this.setState({ commenthidden: false });
        this.loadComment();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  loadComment = () => {
    axios
      .post(
        serverUrl + "comment_list.php",
        {
          momentid: this.state.momentid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        var temp = this.state.tableComment;
        temp = response.data.records;
        this.setState({ tableComment: temp });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doRowDelete = (item) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (commentid) => {
            var commentid = item.commentid;
            this.deleteComment(commentid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  deleteComment = (commentid) => {
    axios
      .post(
        serverUrl + "comment_delete.php",
        {
          commentid: commentid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        alert(this.language.deletesuccess);
        this.loadComment();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doRowEdit = (row) => {
    // console.log(row);
    this.setState({ modalCommentIsOpen: true });
    this.setState({ commentid: row.commentid });
    this.setState({ comment: row.comment });
    this.setState({ commentphoneno: row.commentphoneno });
    this.setState({ commentname: row.commentname });
    this.setState({ commenthidden: row.commenthidden === 1 ? true : false });
  };

  doEditComment = (commentid) => {
    const { comment } = this.state;

    if (comment === null || comment === "") {
      alert(this.language.validation);
      return false;
    } else {
      axios
        .post(
          serverUrl + "comment_insert_update.php",
          {
            commentid: this.state.commentid,
            momentid: this.state.momentid,
            comment: this.state.comment,
            commentphoneno: this.state.commentphoneno,
            commenthidden: this.state.commenthidden ? 1 : 0,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        )
        .then((response) => {
          alert(this.language.savesuccess);
          this.closeEditModal();
          this.loadComment();
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };

  addUser = (user) => {
    this.setState({ phoneno: user.phoneno });
    this.setState({ name: user.name });
    this.closeModal();
  };

  addCommenter = (user) => {
    this.setState({ commentphoneno: user.phoneno });
    this.setState({ commentname: user.name });
    this.closeCommentPhonenoModal();
  };

  closeEditModal = () => {
    this.setState({ modalCommentIsOpen: false });
    this.setState({ comment: "" });
    this.setState({ commentphoneno: "" });
    this.setState({ commentname: "" });
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeCommentPhonenoModal() {
    this.setState({ modalCommentPhonenoIsOpen: false });
  }

  addNew = () => {
    this.setState({ modalIsOpen: true });
    this.doLoad();
  };

  addNewPhonenoComment = () => {
    this.setState({ modalCommentPhonenoIsOpen: true });
    this.doLoad();
  };

  filterAll = (e) => {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: "all", value: filterAll }];
    this.setState({ filterAll, filtered });
  };

  filterPhoneno = (e) => {
    const { value } = e.target;
    const filterPhoneno = value;
    const filteredphoneno = [{ id: "all", value: filterPhoneno }];
    this.setState({ filterPhoneno, filteredphoneno });
  };

  doLoad = () => {
    axios
      .post(
        serverUrl + "user_list.php",
        {
          filter: this.state.filter,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.setState({ tableDataSearch: response.data.records });
        this.setState({ tableCommenterDataSearch: response.data.records });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  onUploadImage = (result) => {
    this.setState({ momentpic: result });
  };

  onUploadGallery = (result) => {
    this.setState({ gallery: result });
  };

  isHiddenChecked(event) {
    let checked = event.target.checked;
    this.setState({ ishidden: checked });
  }

  isCommentHiddenChecked(event) {
    let checked = event.target.checked;
    this.setState({ commenthidden: checked });
  }

  selectCommunity = (communityShow) => {
    axios
      .post(
        serverUrl + "community_list.php",
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

  changeCommunity = (communityid) => {
    this.setState({ communityid: communityid });
  };

  checkData = () => {
    const { name } = this.state;
    const { communityid } = this.state;

    if (name == null || communityid == null) {
      alert(this.language.validation);
      return false;
    } else {
      this.onSubmit();
    }
  };

  componentDidMount = (communityShow) => {
    this.selectCommunity(communityShow);
    this.loadComment();
    this.props.doLoading();
    axios
      .post(
        serverUrl + "moment_get_by_id.php",
        {
          momentid: this.state.momentid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response, communityid) => {
        this.props.doLoading();
        console.log(response.data);
        let tmp = [];
        if (response.data.record.momentpic !== "") {
          tmp.push(response.data.record.momentpic);
        }
        this.setState({ momentid: response.data.record.momentid });
        this.setState({ phoneno: response.data.record.phoneno });
        this.setState({ name: response.data.record.name });
        this.setState({ desc: response.data.record.desc });
        this.setState({ momentpic: tmp });
        this.setState({ gallery: response.data.record.gallery });
        this.setState({ communityid: response.data.record.communityid });
        this.setState({
          ishidden: response.data.record.ishidden,
        });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  onSubmit = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "moment_update.php",
        {
          momentid: this.state.momentid,
          ishidden: this.state.ishidden,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();

        if (response.data.status === "ok") {
          alert(this.language.savesuccess);
          this.props.history.push("/panel/listmoments");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changehide = (hide) => {
    // console.log(hide);
    this.setState({ ishidden: hide });
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
      setTimeout(() => this.props.history.push("/panel/listmoments"), 1000);

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
                  onClick={() => this.props.history.push("/panel/listmoments")}
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

  renderModalEditComment() {
    return (
      <Modal
        isOpen={this.state.modalCommentIsOpen}
        onRequestClose={this.closeEditModal}
        style={customStyles}
      >
        <div className="page-header">
          <Typography
            component="span"
            variant="h2"
            style={{
              fontSize: 16,
              color: "#006432",
              fontWeight: "bold",
              textTransform: "capitalize",
              float: "left",
            }}
          >
            Edit Comment
          </Typography>{" "}
          <span className="dash">&nbsp;&nbsp;</span>{" "}
          <span className="parent-title"></span>
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
                  {this.language.fieldname}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="commentname"
                  id="commentname"
                  disabled="disabled"
                  value={this.state.commentname}
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
                  {this.language.modalfieldname}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="comment"
                  id="comment"
                  value={this.state.comment}
                  onChange={(event) =>
                    this.setState({ comment: event.target.value })
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
                  {this.language.modalfieldhidden}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Checkbox
                  checked={this.state.commenthidden}
                  onChange={(event) => this.isCommentHiddenChecked(event)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
        <div className="form-button-container">
          <br></br>
          <ButtonUI
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "#d0021b",
            }}
            startIcon={<Cancel />}
            onClick={() => this.closeEditModal()}
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
              {this.language.modalcancel}
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
            onClick={() => this.doEditComment()}
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
              {this.language.modalsubmit}
            </Typography>
          </ButtonUI>{" "}
        </div>
      </Modal>
    );
  }

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
            onClick={() => this.props.history.push("/panel/listmoments")}
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
            Edit Moment
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
                  {this.language.fieldname}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="text"
                  name="name"
                  id="name"
                  disabled="disabled"
                  value={this.state.name}
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
                  {this.language.fielddesc}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Input
                  autoComplete="off"
                  type="textarea"
                  name="desc"
                  id="desc"
                  placeholder={this.language.fielddesc}
                  value={this.state.desc}
                  onChange={(event) =>
                    this.setState({ desc: event.target.value })
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
                  Moment Picture
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <PictureUploader
                  onUpload={this.onUploadGallery}
                  picList={this.state.gallery}
                  picLimit={9}
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
                  {this.language.fieldhidden}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SelectMultiColumn
                  width={"100%"}
                  value={this.state.ishidden}
                  valueColumn={"id"}
                  showColumn={"display"}
                  columns={["display"]}
                  data={this.state.isHidenShow}
                  onChange={this.changehide}
                />
              </Grid>
            </Grid>
          </Box>
          <br></br>
          <br></br>
          <div className="detail-title">
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
              Comment
            </Typography>
          </div>
          <br></br>
          <br></br>
          <ReactTable
            data={this.state.tableComment}
            columns={this.tableColumns}
            defaultPageSize={5}
          />
          <br></br>
          <div className="form-button-container">
            <br></br>
            <ButtonUI
              variant="contained"
              size="medium"
              style={{
                backgroundColor: "#d0021b",
              }}
              startIcon={<Cancel />}
              onClick={() => this.props.history.push("/panel/listmoments")}
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
        {this.renderModalEditComment()}
        {this.renderDialogValidation()}
        {this.renderSuccess()}
      </div>
    );
  }
}
export default EditMoments;
