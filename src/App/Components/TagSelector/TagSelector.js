import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './TagSelector.style.css';

class TagSelector extends Component {
    constructor(props) {
        super(props);

        let showValue = this.convertValueToShowValue(props.value, props.data);
        
        this.state={
            width: props.width === undefined ? 'inherit': props.width,
            isOptionsShow:false,
            justOpen:false,
            data: props.data === undefined ? [] : props.data,
            value: props.value,
            showValue:showValue,
        }
        this.elRef = null;
        this.opsRef = null;
    }

    convertValueToShowValue=(value, data)=>{
        let tmp = value.split(';');
        let stringTmp = "";
        tmp.map((item, i)=>{
            let isExist = false;
            for(let j=0;j<data.length;j++){
                if(item === data[j]){
                    isExist = true;
                    break;
                }
            }
            if(isExist){
                if(stringTmp !== "") stringTmp += ", ";
                stringTmp += item;
            }
        })
        return stringTmp;
    }

    componentWillReceiveProps(props){
        let showValue = this.convertValueToShowValue(props.value, props.data);
        this.setState({width:props.width, data: props.data, value: props.value, showValue: showValue});
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
    toogleShowOptions=()=>{
        let width = this.elRef.offsetWidth;
        this.setState({isOptionsShow:!this.state.isOptionsShow, justOpen:true, width: width});
    }

    updateTags=(tag, flag)=>{
        let tmp = this.state.value;
        let result = "";
        if(flag){
            if(tmp !== "") tmp+=";";
            tmp += tag;
            result = tmp;
        }else{
            let arr = tmp.split(';');
            arr.map((item, i)=>{
                if(item !==tag){
                    if(result !== "") result+=";";
                    result += item;
                }
            })
        }
        this.props.onChange(result);
    }

    renderCheckbox=(tag)=>{
        let tmp = this.state.value.split(';');
        let checked = false;
        tmp.map((item,i)=>{
            if(item === tag){
                checked = true;
            }
        });
        if(checked){
            return (
                <div className="tag-container">
                    <input type="checkbox" checked onChange={()=>this.updateTags(tag, false)}/> {tag}
                </div>
            )
        }else{
            return (
                <div className="tag-container">
                    <input type="checkbox" checked={false} onChange={()=>this.updateTags(tag, true)}/> {tag}
                </div>
            )
        }
    }
    
    renderOptions=()=>{
        if(this.state.isOptionsShow){
            return(
                <div className="tag-selector-options-container" style={{width: isNaN(this.state.width) ? this.state.width: this.state.width+'px'}}>
                    {this.state.data.map((dataContent, i) => 
                        <div key={i} className="tag-selector-tag" >
                            {this.renderCheckbox(dataContent)} 
                        </div>
                    )}
                </div>
            )
        }
    }

    renderPlaceholder=()=>{
        if(this.state.value === ''){
            return (
                <div className="tag-selector-placeholder">No Tags</div>
            )
        }else{
            return (
                <div className="tag-selector-value">{this.state.showValue}</div>
            )
        }
    }

    render() {
        return (
            <div className="tag-selector-container" style={{width: isNaN(this.state.width) ? this.state.width: this.state.width+'px'}}>
                <div ref={(ref) => this.elRef = ref} className="tag-selector-element"  onClick={()=>this.toogleShowOptions()}>
                    {this.renderPlaceholder()}
                    <div className="tag-selector-icon"><FontAwesomeIcon icon="caret-down" /></div>
                </div>
                {this.renderOptions()}
            </div>
        );
    }
}
export default TagSelector;