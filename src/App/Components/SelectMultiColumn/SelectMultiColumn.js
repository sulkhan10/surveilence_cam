import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SelectMultiColumn.style.css";
import { activeLanguage } from "../../../config";
import { getLanguage } from "../../../languages";

class SelectMultiProfile extends Component {
  constructor(props) {
    super(props);

    this.language = getLanguage(activeLanguage, "selectmulticolumn");
    let showValue = this.getCurrentShowValue(
      props.value,
      props.valueColumn,
      props.showColumn,
      props.data
    );
    /*if(props.value !== ''){
            for(let i=0; i< props.data.length;i++){
                let col = props.valueColumn !== '' ? props.valueColumn : 0;
                
                if(props.data[i][col] == props.value){
                    showValue = props.data[i][props.showColumn === '' ? col : props.showColumn];
                    break;
                }
            }
        }*/

    this.state = {
      width: props.width === undefined ? "inherit" : props.width,
      isOptionsShow: false,
      justOpen: false,
      value: props.value === undefined ? "" : props.value,
      showValue: showValue,
      data: props.data === undefined ? [] : props.data,
      columns: props.columns === undefined ? [] : props.columns,
      valueColumn: props.valueColumn === undefined ? "" : props.valueColumn,
      showColumn:
        props.showColumn === undefined ? props.valueColumn : props.showColumn,
    };
    this.elRef = null;
    this.opsRef = null;
  }

  getCurrentShowValue = (value, valueColumn, showColumn, data) => {
    let showValue = "";
    if (value !== "" && data !== undefined) {
      for (let i = 0; i < data.length; i++) {
        let col = valueColumn !== "" ? valueColumn : 0;

        if (data[i][col] === value) {
          showValue = data[i][showColumn === "" ? col : showColumn];
          break;
        }
      }
    }
    return showValue;
  };

  componentWillReceiveProps(props) {
    let showValue = this.getCurrentShowValue(
      props.value,
      props.valueColumn,
      props.showColumn,
      props.data
    );
    this.setState({
      width: props.width,
      value: props.value,
      data: props.data,
      column: props.column,
      valueColumn: props.valueColumn,
      showColumn: props.showColumn,
      showValue: showValue,
    });
  }
  componentDidMount() {
    document.addEventListener("click", this.eventDocumentClick);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.eventDocumentClick);
  }
  eventDocumentClick = (event) => {
    //console.log(this.elRef.offsetWidth);
    if (this.state.isOptionsShow) {
      if (this.state.justOpen) this.setState({ justOpen: false });
      else this.setState({ isOptionsShow: false });
    }
  };
  toogleShowOptions = () => {
    let width = this.elRef.offsetWidth;

    //console.log(window.innerHeight);
    //console.log(this.elRef.getBoundingClientRect().top);
    /*if(this.elRef.getBoundingClientRect().top + 200 > window.innerHeight){
            this.setState({top:'auto', bottom: 0});
        }*/

    this.setState({
      isOptionsShow: !this.state.isOptionsShow,
      justOpen: true,
      width: width,
    });
  };

  chooseOption = (option) => {
    let col = this.state.valueColumn === "" ? 0 : this.state.valueColumn;
    this.setState({
      value: option[col],
      showValue:
        option[this.state.showColumn === "" ? col : this.state.showColumn],
    });
    this.props.onChange(option[col], option);
  };

  renderOptions = () => {
    if (this.state.isOptionsShow && this.state.data !== undefined) {
      return (
        <div
          className="select-multi-column-options-container"
          style={{
            width: isNaN(this.state.width)
              ? this.state.width
              : this.state.width + "px",
          }}
        >
          <table>
            <tbody>
              {this.state.data.map((dataContent, i) => (
                <tr
                  key={i}
                  className="select-multi-column-options"
                  onClick={() => this.chooseOption(dataContent)}
                >
                  {this.state.columns.map((col, j) => (
                    <td key={j}>{dataContent[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  render() {
    return (
      <div
        className="select-multi-column-container"
        style={{
          width: isNaN(this.state.width)
            ? this.state.width
            : this.state.width + "px",
        }}
      >
        <div
          ref={(ref) => (this.elRef = ref)}
          className="select-multi-column-element"
          onClick={() => this.toogleShowOptions()}
        >
          <div className="select-multi-column-value">
            {this.state.showValue === ""
              ? this.language.placeholder
              : this.state.showValue}
          </div>
          <div className="select-multi-column-icon">
            <FontAwesomeIcon icon="caret-down" />
          </div>
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
export default SelectMultiProfile;
