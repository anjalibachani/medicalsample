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

function App() {
  return (
    <div>
      <Navbar className="bg-light">
        <Navbar.Brand className="mr-auto">
          <h2>SAM Research Database</h2>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="/login">Log in</Nav.Link>
          <Nav.Link href="/help.html" target="_blank">
            Help
          </Nav.Link>
        </Nav>
      </Navbar>
      <Container fluid>
        <Router basename=".">
          <div>
            {(() => {
              if (localStorage.getItem("user_id") !== null) {
                return (
                  <ButtonGroup>
                    <CustomHeaderButton href="/AddSamples" text="Add Samples" />
                    <CustomHeaderButton
                      href="/ViewSamples"
                      text="Filter and Export"
                    />
                    <CustomHeaderButton href="/Reports" text="Reports" />
                    <CustomHeaderButton
                      href="/AddShipments"
                      text="Create a Shipment"
                    />
                    <CustomHeaderButton
                      href="/ViewShipments"
                      text="See Shipments"
                    />
                  </ButtonGroup>
                );
              }
            })()}
            <hr />
            <Switch>
              <Route path="/" exact={true} component={Login} />
              <Route path="/AddSamples" component={AddSamples} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-pass" component={forgotpass} />
              <Route path="/reset-pass/:id" component={resetpass} />
              {/* <Route path="/ViewSamples" component={ViewSamples} />
              <Route path="/Reports" component={Reports} />
              <Route path="/ViewShipments" component={ViewShipments} />
              <Route path="/AddShipments" component={AddShipments} />
              <Redirect to="/" /> */}
            </Switch>
          </div>
        </Router>
      </Container>
    </div>
  );
}

export default App;
