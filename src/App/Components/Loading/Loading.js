import React, { Component } from "react";

import "./Loading.style.css";

class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: props.isShow,
    };
    this.elRef = null;
  }

  componentWillReceiveProps(props) {
    this.setState({ isShow: props.isShow });
  }
  componentDidMount() {
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

  render() {
    if (this.state.isShow) {
      return (
        <div className="loading-container">
          <div className="gif-container">
            <img src={require("../../../Assets/Images/loading.gif")} alt="" />
          </div>
        </div>
      );
    } else {
      return <div style={{ display: "none" }}></div>;
    }
  }
}
export default Loading;
