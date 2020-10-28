import React, { Component } from "react";
import "./App.css";
import Login from "../src/components/Login";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Navbar, Nav, Container, ButtonGroup,Button } from "react-bootstrap";
import CustomHeaderButton from "./components/CustomHeaderButton";
import AddSamples from "./components/AddSamples";
import forgotpass from './components/forgotpass';
import resetpass from './components/resetpass';
//import Logout from './components/Logout';
import AddShipments from './components/AddShipments';

function App() {
  return (
    <div className="App">
      <Router basename=".">
        <Switch>
          <Route path="/" exact={true} component={Login} />
          <Route path="/login" exact={true} component={Login} />
          <Route path="/AddSamples" component={AddSamples} />
          <Route path="/forgot-pass" component={forgotpass} />
          <Route path="/reset-pass/:id" component={resetpass} />
          {/*<Route path="/logout" component={Logout}/>*/}
          {/* <Route path="/ViewSamples" component={ViewSamples} />
          <Route path="/Reports" component={Reports} />
          <Route path="/ViewShipments" component={ViewShipments} />*/}
          <Route path="/AddShipments" component={AddShipments} /> 
        </Switch>
      </Router>
    </div>
  );
}

export default App;