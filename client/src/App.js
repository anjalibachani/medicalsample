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
import AddChild from './components/AddChild';
import ViewShipment from './components/ViewShipment';
import Logout from './components/Logout'
import filterandExports from './components/filterandExports';
import Header from "./components/Header";
import Manage from "./components/Manage"
import UsersTable from "./components/UsersTable";
import LocationsTable from "./components/LocationsTable";
import LogsTable from "./components/LogsTable";

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('./config/deploy_config.json') : require('./config/local_config.json');
function App() {
 console.log(`Environment: ${process.env.REACT_APP_MED_DEPLOY_ENV}`);
  return (
    <div className="App">
      <Router basename=".">
        <Switch>
          <Route path="/" exact={true} component={Login} />
          <Route path="/login" exact={true} component={Login} />
          <Route path="/Home" exact={true} component={Header} />
          <Route path="/AddChild" component={AddChild} />
          <Route path="/AddSamples" component={AddSamples} />
          <Route path="/forgot-pass" component={forgotpass} />
          <Route path="/reset-pass/:id" component={resetpass} />
          <Route path="/logout" component={Logout} />
          <Route path="/filterandExports" component={filterandExports} />
          <Route path="/manage" component={Manage} />
          <Route path="/users" component={UsersTable} />
          <Route path="/locations" component={LocationsTable} />
          <Route path="/logs" component={LogsTable} />

          {/* <Route path="/ViewSamples" component={ViewSamples} />
          <Route path="/Reports" component={Reports} />*/}
          <Route path="/ViewShipment" component={ViewShipment} />
          <Route path="/AddShipments" component={AddShipments} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;