import React, { Component } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CheckboxGroup.style.css';

class CheckboxGroup extends Component {
    constructor(props) {
        super(props);

        this.state={
            width: props.width === undefined ? 'inherit': props.width,
            data: props.data === undefined ? [] : props.data,
            showKey : props.showKey
        }
        this.elRef = null;
        this.opsRef = null;
    }

    componentWillReceiveProps(props){
        this.setState({width:props.width, data: props.data, showKey: props.showKey});
    }
    componentDidMount(){
        //document.addEventListener('click', this.eventDocumentClick)
    }
    componentWillUnmount() {
        //document.removeEventListener('click', this.eventDocumentClick);
    }
    /*eventDocumentClick=(event)=>{
        if(this.state.isOptionsShow){
            if(this.state.justOpen)
                this.setState({justOpen:false});
            else
                this.setState({isOptionsShow:false})
        }
            
    }*/

    checkedHandle=(data, event, idx)=>{
        let tmp = this.state.data;
        tmp[idx].checked = event.target.checked;
        this.setState({data: tmp});
        this.props.onChange(tmp);
    }

    renderCheckbox=()=>{
        if(this.state.data){
            return(
                <div>
                    {this.state.data.map((dataContent, i) => 
                        <div className="checkbox-container">
                            <input type="checkbox" checked={dataContent.checked} onChange={(event)=>this.checkedHandle(dataContent, event, i)}/> {dataContent[this.state.showKey]}
                        </div>
                    )}
                </div>
            )
        }
    }

    render() {
        return (
            <div className="checkbox-group-container" style={{width: isNaN(this.state.width) ? this.state.width : (this.state.width+'px')}}>
                {this.renderCheckbox()}
            </div>
        );
    }
}
export default CheckboxGroup;