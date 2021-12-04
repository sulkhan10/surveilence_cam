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

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listnewscategory");

    this.state = {
      tableData: [],
      filter: "",
    };

    this.tableColumns = [
      {
        Header: "Menu",
        headerStyle: { fontWeight: "bold" },
        accessor: "Menu",
        style: { textAlign: "center" },
      },
      {
        Header: "Status",
        headerStyle: { fontWeight: "bold" },
        accessor: "Status",
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
            {/* <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              <FontAwesomeIcon icon="times-circle" />
              &nbsp;{this.globallang.delete}
            </Button> */}
          </div>
        ),
      },
    ];
  }

  doRowEdit = (row) => {
    console.log(row);
    this.props.history.push("/panel/settingmenuedit/" + row.settingId);
  };

  doRowDelete = (row) => {
    console.log(row);
    confirmAlert({
      //title: 'Confirm to submit',
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (settingId) => {
            var settingId = row.settingId;
            console.log(settingId);
            this.deleteSettingId(settingId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/settingmenu");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "settings_list.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  deleteSettingId = (settingId) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "settings_delete.php",
        {
          settingId: settingId,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response.data);
        alert(this.language.deletesuccess);
        //window.location.reload()
        this.doSearch();
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  componentDidMount = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "settings_list.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "settings_list.php",
        {},

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        this.props.doLoading();
        console.log(response.data);
        var temp = this.state.tableData;
        temp = response.data.records;
        this.setState({ tableData: temp });
      })
      .catch((error) => {
        this.props.doLoading();
        console.log(error);
        alert(error);
      });
  };

  render() {
    return (
      <FormGroup>
        <br></br>
        <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
          Settings Menu
        </Label>
        <div className="contentDate">
          <Button color="success" onClick={() => this.reset()}>
            <FontAwesomeIcon icon="sync" />
            &nbsp;{this.globallang.reset}
          </Button>{" "}
          {/* &nbsp;&nbsp;&nbsp;
          <Button color="primary" onClick={() => this.addNew()}>
            <FontAwesomeIcon icon="plus-square" />
            &nbsp;{this.globallang.add}
          </Button> */}
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
            defaultPageSize={5}
          />
        </div>
      </FormGroup>
    );
  }
}
export default SettingsPage;
