import React, { Component } from "react";
import { Button, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";

class ListCommodity extends Component {
  constructor(props) {
    super(props);
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listcommodity");
    this.state = {
      tableData: [],
      filter: "",
    };

    this.tableColumns = [
      {
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "commodityname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columncategory,
        headerStyle: { fontWeight: "bold" },
        accessor: "commoditycategoryname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columntags,
        headerStyle: { fontWeight: "bold" },
        accessor: "tags",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnmerchant,
        headerStyle: { fontWeight: "bold" },
        accessor: "merchantname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnavailable,
        headerStyle: { fontWeight: "bold" },
        accessor: "isavailable",
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
              {this.globallang.edit}
            </Button>
            &nbsp;
            <Button
              color="danger"
              size="sm"
              onClick={() => this.doRowDelete(e.original)}
            >
              {this.globallang.delete}
            </Button>
          </div>
        ),
      },
    ];
  }

  doRowEdit = (row) => {
    this.props.history.push("/panel/editcommodity/" + row.commodityid);
  };

  doRowDelete = (row) => {
    confirmAlert({
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (commodityid) => {
            var commodityid = row.commodityid;
            console.log(commodityid);
            this.deleteCommodity(commodityid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  addNew = () => {
    this.props.history.push("/panel/inputcommodity");
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_list.php",
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

  deleteCommodity = (commodityid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "commodity_delete.php",
        {
          commodityid: commodityid,
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
        serverUrl + "commodity_list.php",
        {
          filter: "",
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
        <form>
          <fieldset className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder={this.globallang.search}
              onChange={(event) =>
                this.setState({ filter: event.target.value })
              }
            />
          </fieldset>
        </form>
        <Button color="primary" size="sm" onClick={() => this.doSearch()}>
          {this.globallang.search}
        </Button>
        <br></br>
        <br></br>
        <Button color="success" onClick={() => this.addNew()}>
          {this.globallang.add}
        </Button>
        <br></br>
        <br></br>
        <Label>{this.language.title}</Label>
        <ReactTable
          data={this.state.tableData}
          columns={this.tableColumns}
          defaultPageSize={10}
        />
      </FormGroup>
    );
  }
}
export default ListCommodity;
