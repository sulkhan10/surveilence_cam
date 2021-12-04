import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import { serverUrl } from "../../../config.js";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";
import SelectMultiColumn from "../../Components/SelectMultiColumn/SelectMultiColumn";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { Refresh, Edit, Delete, AddBox } from "@mui/icons-material";
const stylesListComent = {
  inline: {
    display: "inline",
  },
};

class ListMarketplaceAdvertisement extends Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.globallang = getLanguage(activeLanguage, "global");
    this.language = getLanguage(activeLanguage, "listmarketplaceadvertisement");
    this.state = {
      tableData: [],
      filter: "",
      communityid: this.props.community.communityid,
      positionId: "",
      positionShow: [
        { id: 0, display: "TOP" },
        { id: 1, display: "BOTTOM" },
      ],
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
        Header: this.language.columnname,
        headerStyle: { fontWeight: "bold" },
        accessor: "marketplaceadvname",
        style: { textAlign: "center" },
      },
      {
        Header: this.language.columnbannerpic,
        headerStyle: { fontWeight: "bold" },
        accessor: "bannerpic",
        style: { textAlign: "center" },
        Cell: (e) => (
          <div>
            <img
              alt="banner"
              width={100}
              height={50}
              src={e.original.bannerpic}
            />
          </div>
        ),
      },
      {
        Header: this.language.columnposition,
        headerStyle: { fontWeight: "bold" },
        accessor: "position",
        style: { textAlign: "center" },
        Cell: (e) => (e.original.position === 0 ? "TOP" : "BOTTOM"),
      },
      {
        Header: this.language.columnavailable,
        headerStyle: { fontWeight: "bold" },
        accessor: "isavailable",
        style: { textAlign: "center" },
        Cell: (e) =>
          e.original.isavailable === 0
            ? this.globallang["hidden"]
            : this.globallang["show"],
      },
      {
        Header: this.language.columnaction,
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

  componentWillReceiveProps = (props) => {};

  addNew = () => {
    this.props.history.push("/panel/inputmarketplaceadvertisement");
  };

  doRowEdit = (row) => {
    this.props.history.push(
      "/panel/editmarketplaceadvertisement/" + row.marketplaceadvertisementid
    );
  };

  doRowDelete = (row) => {
    confirmAlert({
      //title: 'Confirm to submit',
      message: this.language.confirmdelete,
      buttons: [
        {
          label: "Yes",
          onClick: (marketplaceadvertisementid) => {
            var marketplaceadvertisementid = row.marketplaceadvertisementid;
            console.log(marketplaceadvertisementid);
            this.deleteMarketplaceAdvertisement(marketplaceadvertisementid);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  doSearch = () => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "marketplaceadvertisement_list.php",
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
        console.log(response.data);
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

  deleteMarketplaceAdvertisement = (marketplaceadvertisementid) => {
    this.props.doLoading();
    axios
      .post(
        serverUrl + "marketplaceadvertisement_delete.php",
        {
          marketplaceadvertisementid: marketplaceadvertisementid,
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
        serverUrl + "marketplaceadvertisement_list.php",
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

  reset = () => {
    let data = "";
    this.setState({ filter: data });
    this.props.doLoading();
    axios
      .post(
        serverUrl + "marketplaceadvertisement_list.php",
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

  changePosition = (position) => {
    this.setState({
      positionId: position,
    });

    this.props.doLoading();
    axios
      .post(
        serverUrl + "marketplaceadvertisement_list.php",
        {
          filter: position,
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

  render() {
    return (
      // <FormGroup>
      //   <br></br>
      //   <Label style={{ fontWeight: "bold", fontSize: 20, color: "#000" }}>
      //     Advertisement
      //   </Label>
      //   <div className="contentDate">
      //     <div
      //       style={{
      //         marginRight: 10,
      //         justifyContent: "center",
      //         alignContent: "center",
      //         alignItems: "center",
      //         alignSelf: "center",
      //         color: "#000",
      //         fontWeight: "bold",
      //       }}
      //     >
      //       <span>Position:</span>
      //     </div>
      //     <div style={{ marginRight: 10 }}>
      //       <SelectMultiColumn
      //         width={200}
      //         value={this.state.positionId}
      //         valueColumn={"id"}
      //         showColumn={"display"}
      //         columns={["display"]}
      //         data={this.state.positionShow}
      //         onChange={this.changePosition}
      //       />
      //     </div>
      //     <div style={{ marginRight: 10 }}>
      //       <Button color="success" onClick={() => this.reset()}>
      //         <FontAwesomeIcon icon="sync" />
      //         &nbsp;{this.globallang.reset}
      //       </Button>
      //     </div>

      //     <div style={{ marginRight: 10 }}>
      //       <Button color="primary" onClick={() => this.addNew()}>
      //         <FontAwesomeIcon icon="plus-square" />
      //         &nbsp;{this.globallang.add}
      //       </Button>
      //     </div>
      //   </div>
      //   <br></br>
      //   <br></br>
      //   <div className="box-container">
      //     <ReactTable
      //       ref={(r) => (this.reactTable = r)}
      //       data={this.state.tableData}
      //       columns={this.tableColumns}
      //       filterable
      //       defaultFilterMethod={(filter, row) =>
      //         String(row[filter.id])
      //           .toLowerCase()
      //           .includes(filter.value.toLowerCase())
      //       }
      //       defaultPageSize={5}
      //     />
      //   </div>
      // </FormGroup>

      <Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                style={{
                  borderLeft: 6,
                  borderColor: "#2f55a2",
                  color: "#FFF",
                  maxHeight: 100,
                  padding: 16,
                  paddingBottom: 24,
                }}
              >
                <Typography
                  component="span"
                  variant="h1"
                  style={
                    (stylesListComent.inline,
                    {
                      fontSize: 20,
                      color: "#006432",
                      fontWeight: "bold",
                    })
                  }
                >
                  {this.language.title}
                </Typography>
                <br></br>
                <div className="contentDate">
                  <Typography
                    component="span"
                    variant="subtitle1"
                    style={
                      (stylesListComent.inline,
                      {
                        marginRight: 16,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        color: "#006432",
                        fontWeight: "bold",
                      })
                    }
                  >
                    Position:
                  </Typography>
                  <div style={{ marginRight: 16 }}>
                    <SelectMultiColumn
                      width={200}
                      value={this.state.positionId}
                      valueColumn={"id"}
                      showColumn={"display"}
                      columns={["display"]}
                      data={this.state.positionShow}
                      onChange={this.changePosition}
                    />
                  </div>
                  <div style={{ marginRight: 16 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#1273DE",
                      }}
                      startIcon={<Refresh />}
                      onClick={() => this.reset()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        {this.globallang.reset}
                      </Typography>
                    </Button>
                  </div>

                  <div style={{ marginRight: 0 }}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#008b02",
                      }}
                      startIcon={<AddBox />}
                      onClick={() => this.addNew()}
                    >
                      <Typography
                        variant="button"
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          textTransform: "capitalize",
                        }}
                      >
                        {this.globallang.add}
                      </Typography>
                    </Button>
                  </div>
                </div>
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <br></br>
        <div className="box-container">
          <ReactTable
            ref={(r) => (this.reactTable = r)}
            data={this.state.tableData}
            columns={this.tableColumns}
            style={{ backgroundColor: "#f2f2f2" }}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            }
            defaultPageSize={5}
          />
        </div>
      </Box>
    );
  }
}
export default ListMarketplaceAdvertisement;
