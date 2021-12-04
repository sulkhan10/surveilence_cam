import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import ReactTable from "react-table";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css';
import { serverUrl } from '../../../config.js';
import { activeLanguage } from '../../../config';
import { convertToRupiah } from '../../../global.js';
import { getLanguage } from '../../../languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ReconsiliationPageList extends Component {

    constructor(props){
        super(props);
        this.globallang = getLanguage(activeLanguage, 'global');
        this.state = {
            summaryId:0,
            tableDataKosmo: [],
            tableDataXendit: [],
            tableDataModernland: [],
            filter:'',
            startDate: moment(),
            endDate:moment(),
            sumAmount:0,
            cardCount:0,
            bankCount:0,
            timeReport:'',
            infoSummaryList:[],
            xendit:'XENDIT',
            kosmo:'KOSMO',
            mdln:'MODERNLAND',
            statusrecon:0,
            showRecon:false,
			communityid: this.props.community.communityid
        }
        this.tableColumnsKosmo = [ 
        {
            Header: "KOSMO ID",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'transaksi_id',
            style: { textAlign: "left"}
        },
        {
            Header: "XENDIT ID",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'transaksi_id',
            style: { textAlign: "left"}
        },
        {
            Header: "Invoice Number",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'external_id',
            style: { textAlign: "left"}
        },
        {
            Header: "Payer Email",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'payeremail',
            style: { textAlign: "left"}
        },	
		{
            Header: "Debtor Account",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'debtor',
            style: { textAlign: "left"}
        }, 			
		{
            Header: "Amount Pay",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'amount',
            style: { textAlign: "center"},
            Cell : e => (convertToRupiah(e.original.amount))
        }, 				
		{
            Header: "Status Payment",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
            Cell : e => (e.original.status == "PAID" ? <span style={{color:'#0066ff'}} >PAID</span> :  <span style={{color:'#ff8d00'}} >PENDING</span>)
        }, 	
        {
            Header: "Paid Date",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paid_date',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Method",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentmethod',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Channel",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentchannel',
            style: { textAlign: "left"}
        },
        {
            Header: "Company Code",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companycode',
            style: { textAlign: "left"},
            Cell : e => (e.original.companycode === "MDL" ? "PT. Modernland Realty Tbk Site C" : (e.original.companycode === "MSS" ? "PT. Mitra Sukses Sundo" : "PT. Mitra Sukses Makmur"))
        }
    ]

    this.tableColumnsXendit = [ 
        {
            Header: "Transaction ID",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'transaksi_id',
            style: { textAlign: "left"}
        },
        {
            Header: "External ID",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'external_id',
            style: { textAlign: "left"}
        },
        {
            Header: "Payer Email",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'payeremail',
            style: { textAlign: "left"}
        },	
		{
            Header: "Paid Amount",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'amount',
            style: { textAlign: "center"},
            Cell : e => (convertToRupiah(e.original.amount))
        }, 				
		{
            Header: "Status Payment",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
            Cell : e => (e.original.status == "PAID" ? <span style={{color:'#0066ff'}} >PAID</span> :  <span style={{color:'#ff8d00'}} >PENDING</span>)
        }, 	
        {
            Header: "Paid at",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paid_date',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Method",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentmethod',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Channel",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentchannel',
            style: { textAlign: "left"}
        },
        {
            Header: "Merchant Name",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companycode',
            style: { textAlign: "left"},
            Cell : e => (e.original.companycode === "MDL" ? "PT. Modernland Realty Tbk Site C" : (e.original.companycode === "MSS" ? "PT. Mitra Sukses Sundo" : "PT. Mitra Sukses Makmur"))
        }
    ]
    
    this.tableColumnsModernland = [ 
        {
            Header: "Transaction ID",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'transaksi_id',
            style: { textAlign: "left"}
        },
        {
            Header: "Invoice Number",
            headerStyle: {fontWeight : 'bold'},
            accessor: 'external_id',
            style: { textAlign: "left"}
        },
        {
            Header: "Payer Email",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'payeremail',
            style: { textAlign: "left"}
        },	
		{
            Header: "Debtor Account",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'debtor',
            style: { textAlign: "left"}
        }, 			
		{
            Header: "Amount Pay",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'amount',
            style: { textAlign: "center"},
            Cell : e => (convertToRupiah(e.original.amount))
        }, 				
		{
            Header: "Status",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'status',
            style: { textAlign: "center"},
            Cell : e => (e.original.status == "PAID" ? <span style={{color:'#0066ff'}} >PAID</span> :  <span style={{color:'#ff8d00'}} >PENDING</span>)
        }, 	
        {
            Header: "Paid Date",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paid_date',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Method",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentmethod',
            style: { textAlign: "left"}
        }, 
        {
            Header: "Payment Channel",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'paymentchannel',
            style: { textAlign: "left"}
        },
        {
            Header: "Company Code",
			headerStyle: {fontWeight : 'bold'},
            accessor: 'companycode',
            style: { textAlign: "left"},
            Cell : e => (e.original.companycode === "MDL" ? "PT. Modernland Realty Tbk Site C" : (e.original.companycode === "MSS" ? "PT. Mitra Sukses Sundo" : "PT. Mitra Sukses Makmur"))
        }
    ]

    }

    doRowEdit = (row) => {
		this.props.history.push('/panel/detailbillingdebtor/'+row.billingid);
    }
    
    doSearch = () => {
		this.props.doLoading();
		axios.post(serverUrl+'reconsiliation_kosmo.php', {
			filter: this.state.filter,
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.props.doLoading();
                console.log(this.state);
				var temp = this.state.tableDataKosmo;
				temp = response.data.records;
				this.setState({tableDataKosmo : temp});
				
            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }
    
    setStartDate = (date) =>{
        this.setState({startDate: date})
        // this.setState({endDate: date})
		// console.log(this.state.startDate);
	}
    setEndDate = (date) =>{
        this.setState({endDate: date})
        // console.log(this.state.startDate);
    }

    doSeacrhBydate = () =>{
        this.setState({showRecon: true});
		this.getDataBydate();
	}
    
    getDataBydate =()=>{
        this.setState({infoSummaryList : []});
        this.props.doLoading();
		axios.post(serverUrl+'reconsiliation_list_bydate.php', {
			startDate: this.state.startDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
			endDate : this.state.endDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss")
		}, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                console.log(response);
				this.props.doLoading();
                var temp = this.state.tableDataKosmo;
                var temp2 = this.state.tableDataXendit;
                temp = response.data.records;
                temp2 = response.data.records;

                let amountTotal = response.data.records;
                let sumAmount = amountTotal.reduce(function(prev, current) {
                return prev + +current.amount
                }, 0);
                this.setState({sumAmount : sumAmount});

                
                let bankMethod = temp.filter(item => item.paymentmethod === 'BANK_TRANSFER')
                let bankMethodCount = bankMethod.length;
                this.setState({bankCount : bankMethodCount});

                let cardMethod = temp.filter(item => item.paymentmethod === 'CREDIT_CARD')
                let cardMethodCount = cardMethod.length;
                this.setState({cardCount : cardMethodCount});

                let dateReport = this.state.startDate.clone().startOf('day').format("YYYY-MM-DD")
                this.setState({timeReport : dateReport});

                this.setState({tableDataKosmo : temp});
                this.setState({tableDataXendit : temp2});

                let arr = this.state.infoSummaryList;
                arr.push({ transactionby: this.state.kosmo, totaltransaction: this.state.tableDataKosmo.length, totalamount:this.state.sumAmount, totalBank: this.state.bankCount, totalCard: this.state.cardCount});
                arr.push({ transactionby: this.state.xendit, totaltransaction: this.state.tableDataXendit.length, totalamount:this.state.sumAmount, totalBank: this.state.bankCount, totalCard: this.state.cardCount});
                // console.log(arr);
                this.setState({infoSummaryList : arr});
        

            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
	}

    componentDidMount = () => {
        this.loadKosmo();
        this.loadXendit();
    } 

    loadKosmo=()=>{
        this.props.doLoading();
		axios.post(serverUrl+'reconsiliation_kosmo.php', {
			filter:'',
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                console.log(response);
				this.props.doLoading();
				var temp = this.state.tableDataKosmo;
                temp = response.data.records;

                let amountTotal = response.data.records;
                let sumAmount = amountTotal.reduce(function(prev, current) {
                return prev + +current.amount
                }, 0);
                this.setState({sumAmount : sumAmount});
                this.setState({tableDataKosmo : temp});
                
                let bankMethod = temp.filter(item => item.paymentmethod === 'BANK_TRANSFER')
                let bankMethodCount = bankMethod.length;
                this.setState({bankCount : bankMethodCount});

                let cardMethod = temp.filter(item => item.paymentmethod === 'CREDIT_CARD')
                let cardMethodCount = cardMethod.length;
                this.setState({cardCount : cardMethodCount});


            })
            .catch((error) =>{
				this.props.doLoading();
                console.log(error);
				alert(error);
            });
    }

    loadXendit=()=>{
		axios.post(serverUrl+'reconsiliation_xendit.php', {
			filter:'',
			communityid: this.state.communityid
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                console.log(response);
				var temp = this.state.tableDataXendit;
				temp = response.data.records;
				this.setState({tableDataXendit : temp});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
    }

    CheckRecon=()=>{

        if(this.state.tableDataKosmo.length === 0){
            alert("There are no transactions on the date"+" "+moment(this.state.timeReport).format('LL'));
        }else{

            let bodyParams = {
                timeReport: this.state.timeReport
            }
    
            console.log(bodyParams)
            this.props.doLoading();
            axios.post(serverUrl+'recon_checkdate.php', bodyParams, 
            {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
                .then( (response) =>{
                    this.props.doLoading();
                    if(response.data.status === "OK"){
                        alert("The data has been reconciled based on the selected date"+" "+moment(this.state.timeReport).format('LL'));
                    }else{
                        this.pushDataRecon();
                    }
                    
                })
                .catch( (error) =>{
                    this.props.doLoading();
                    console.log(error);
                    alert(error);
                });
        }

    }



    pushDataRecon=()=>{

        let bodyParams = {
            summaryId: this.state.summaryId,
            timeReport: this.state.timeReport,
            statusrecon: this.state.statusrecon,
            datecreated: moment().format("YYYY-MM-DD hh:mm:ss"),
            infoSummaryList: this.state.infoSummaryList
        }

        console.log(bodyParams)
        this.props.doLoading();
        axios.post(serverUrl+'summary_payment.php', bodyParams, 
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) =>{
				this.props.doLoading();
				if(response.data.status === "OK"){
					alert("reconciliation data successfully saved base on the selected date"+" "+moment(this.state.timeReport).format('LL'));
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

    reset=()=>{
        this.setState({showRecon: false});
        this.setState({infoSummaryList : []});
        this.setState({timeReport : ''});
		this.loadKosmo();
        this.loadXendit();
    }
    
    timeReport=()=>{
        if(this.state.timeReport !== ''){
            return(
                <div>
                    <span style={{fontSize:20, fontWeight:'bold', color:'#000'}} >{moment(this.state.timeReport).format('LL')} - {moment(this.state.endDate).format('LL')} </span>
                </div>
            )
        }else{
            return null
        }
    }

    showButtonRecon=()=>{
        if(this.state.showRecon === true){
            return(
                <Button color="success"  onClick={() => this.CheckRecon()}><FontAwesomeIcon icon="paper-plane"/>&nbsp;Recon</Button>
            )
        }else{
            return null
        }
    }
    
    render() {
        return (
            <FormGroup>
				{/* <form>
					<fieldset className="form-group">
					<input type="text" className="form-control form-control-lg" placeholder={this.globallang.search} onChange = {(event) => this.setState({ filter : event.target.value }) }/>
					</fieldset>
				</form> 
				<Button color="primary" size="sm" onClick={() => this.doSearch()}>{this.globallang.search}</Button> */}
                <br></br>
				<Label style={{fontWeight:'bold', fontSize:20, color:'#000'}} >Summary of IPKL Bill Payment Reports <br></br>{this.timeReport()} </Label>
                <div className="contentDate">
					<div style={{alignSelf:'center'}} >Start Date:</div>&nbsp;&nbsp;
                    <DatePicker selected={this.state.startDate} onChange={date => this.setStartDate(date)} selectsStart startDate={this.state.startDate} endDate={this.state.endDate} className="datefilter"/> &nbsp;&nbsp;
					<div style={{alignSelf:'center'}}>End Date:</div>&nbsp;&nbsp;
                    <DatePicker selected={this.state.endDate} onChange={date => this.setEndDate(date)} selectsEnd startDate={this.state.startDate} endDate={this.state.endDate} minDate={this.state.startDate} className="datefilter"/>
					&nbsp;&nbsp;
                    <Button color="info"  onClick={() => this.doSeacrhBydate()}><FontAwesomeIcon icon="random"/>&nbsp;Get Data</Button>
                    &nbsp;&nbsp;
                    <Button color="primary"  onClick={() => this.reset()}><FontAwesomeIcon icon="sync"/>&nbsp;Reset</Button>
                </div>
                <br></br>
                <br></br>
                <div>
                    <Table bordered size="sm">
                        <thead>
                            <tr>
                                <th style={{textAlign:'center'}} >Transaction By</th>
                                <th style={{textAlign:'center'}} >Total Transaction</th>
                                <th style={{textAlign:'center'}} >Total Paid Amount</th>
                                <th style={{textAlign:'center'}} >Total Payment Method Credit Card</th>
                                <th style={{textAlign:'center'}} >Total Payment Method Bank Transfer</th>
                                <th style={{textAlign:'center'}} >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{textAlign:'center'}}>KOSMO</td>
                                <td style={{textAlign:'center'}}>{this.state.tableDataKosmo.length}</td>
                                <td style={{textAlign:'center'}}>{convertToRupiah(this.state.sumAmount)}</td>
                                <td style={{textAlign:'center'}}>{this.state.cardCount}</td>
                                <td style={{textAlign:'center'}}>{this.state.bankCount}</td>
                                <th style={{textAlign:'center', alignSelf:'center' }} rowspan="2">{this.showButtonRecon()}</th>
                            </tr>
                            <tr>
                                <td style={{textAlign:'center'}}>XENDIT</td>
                                <td style={{textAlign:'center'}}>{this.state.tableDataXendit.length}</td>
                                <td style={{textAlign:'center'}}>{convertToRupiah(this.state.sumAmount)}</td>
                                <td style={{textAlign:'center'}}>{this.state.cardCount}</td>
                                <td style={{textAlign:'center'}}>{this.state.bankCount}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                {/* <ReactTable data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} defaultPageSize={5} /> */}
                <br></br>
                <br></br>
				<Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >List Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} defaultPageSize={5} />
                <br></br>
				{/* <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >KOSMO Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataKosmo} columns={this.tableColumnsKosmo} defaultPageSize={5} />
                <br></br>
                <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >Xendit Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataXendit} columns={this.tableColumnsXendit} defaultPageSize={5} />
                <br></br> */}
                {/* <Label style={{fontWeight:'bold', fontSize:16, color:'#000'}} >Modernland Reconciliation Report</Label>
                <ReactTable data={this.state.tableDataModernland} columns={this.tableColumnsModernland} defaultPageSize={5} /> */}
            </FormGroup>
        );
    }

}
export default ReconsiliationPageList;