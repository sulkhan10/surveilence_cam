import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <BrowserRouter basename="/SmartSurveillanceSystem">
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
// registerServiceWorker();
