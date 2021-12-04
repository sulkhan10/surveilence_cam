import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NewsWFH extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listwfh");
    this.state = {
      tableData: [],
      filter: "",
      communityid: this.props.community.communityid,
    };

    this.tableColumns = [
      {
        Header: "No",
        headerStyle: { fontWeight: "bold" },
        accessor: "id",
        style: { textAlign: "center" },
        width: 100,
      },
      {
        Header: this.language.columntitle,
        headerStyle: { fontWeight: "bold" },
        accessor: "title",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.newscategory,
        headerStyle: { fontWeight: "bold" },
        accessor: "newscategory",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncommunity,
        headerStyle: { fontWeight: "bold" },
        accessor: "communityname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.pinned,
        headerStyle: { fontWeight: "bold" },
        accessor: "pinned",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.pinned === "1"
            ? "default"
            : e.original.pinned === "2"
            ? "Permanent sticking (no time)"
            : "Stick to top by time period (no time)",
      },
      {
        Header: this.language.displaystate,
        headerStyle: { fontWeight: "bold" },
        accessor: "displaystate",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.isavailable === 2
            ? this.globallang["hidden"]
            : this.globallang["show"],
      },
      {
        Header: this.language.reading,
        headerStyle: { fontWeight: "bold" },
        accessor: "reading",
        style: { textAlign: "center" },
        Cell: (e) => "0",
      },
      {
        Header: this.language.time,
        headerStyle: { fontWeight: "bold" },
        accessor: "releasetime",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnaction,
        headerStyle: { fontWeight: "bold" },
        accessor: "",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <Button
              color="warning"
              size="sm"
              onClick={() => this.doRowEdit(e.original)}
            >
              <FontAwesomeIcon icon="pen-square" />
              &nbsp;{this.globallang.edit}
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              <FontAwesomeIcon icon="times-circle" />
              &nbsp;{this.globallang.delete}
            </Button>
          </div>
        ),
      },
    ];
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillReceiveProps = (props) => {};

  doRowEdit = (row) => {
    this.props.history.push("/panel/editnewswfh/" + row.newsid);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteNews(row.newsid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputnewswfh");
  };

  doSearch = () => {
    this.getData();
  };

  deleteNews = (newsid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "news_wfh_delete.php",
        {
          newsid: newsid,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        alert(this.language.deletesuccess);
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  getData = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "news_wfh_list.php",
        {
          filter: this.state.filter,
          communityid: this.state.communityid,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  changeQuery = (event) => {
    this.setState({ filter: event.target.value });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "news_wfh_list.php",
        {
          filter: "",
          communityid: this.state.communityid,
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
        var temp = this.state.tableData;
        temp = response.data.records;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  handleKeyPress(e) {
    if (e.key === "Enter") {
      //   alert('Enter pressed')
      this.doSearch();
    }
  }

  onKeyDown = (event) => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.doSearch();
    }
  };

  render() {
    return (
      <FormGroup>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          WFH(Work From Home)
        </Label>
        <div className="contentDate">
          <div style={{ marginRight: 10 }}>
            <Button color="success" onClick={() => this.reset()}>
              <FontAwesomeIcon icon="sync" />
              &nbsp;{this.globallang.reset}
            </Button>
          </div>
          <div style={{ marginRight: 10 }}>
            <Button color="primary" onClick={() => this.addNew()}>
              <FontAwesomeIcon icon="plus-square" />
              &nbsp;{this.globallang.add}
            </Button>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={10}
          />
        </div>
      </FormGroup>
    );
  }
}
export default NewsWFH;
