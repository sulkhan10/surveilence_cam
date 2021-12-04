import React, { Component } from "react";
//import logo from './logo.svg';
import "./App.css";
import { Route, Switch } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faTrash,
  faCaretDown,
  faFile,
  faPlus,
  faSearch,
  faPlusSquare,
  faSync,
  faRandom,
  faTimesCircle,
  faCheckSquare,
  faCheckCircle,
  faPenSquare,
  faFileExcel,
  faFileExport,
  faSave,
  faChevronCircleLeft,
  faPaperPlane,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

import Login from "./App/Pages/Login/Login";
import Default from "./App/Default";

library.add(
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faTrash,
  faCaretDown,
  faFile,
  faPlus,
  faSearch,
  faPlusSquare,
  faSync,
  faRandom,
  faTimesCircle,
  faCheckSquare,
  faCheckCircle,
  faPenSquare,
  faFileExcel,
  faFileExport,
  faSave,
  faChevronCircleLeft,
  faPaperPlane,
  faLink
);

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/panel" component={Default} />
        </Switch>
      </div>
    );
  }
}

export default App;
