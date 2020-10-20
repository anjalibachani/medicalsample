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

function App() {
  return (
    <div>
      {/* <Login/> */}
      <Navbar className="bg-light">
        <Navbar.Brand className="mr-auto">
          <h2>SAM Research Database</h2>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link href="/login">Log in</Nav.Link>
          {/* <Button variant="outline-dark" size="lg" onClick={<Login />}>
            Login
          </Button> */}
          <Nav.Link href="/help.html" target="_blank">
            Help
          </Nav.Link>
        </Nav>
      </Navbar>
      <Container fluid>
        <Router basename=".">
          <div>
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
              <CustomHeaderButton href="/ViewShipments" text="See Shipments" />
            </ButtonGroup>

            <hr />

            <Switch>
              <Route path="/" exact={true} component={AddSamples} />
              {/* <Route path="/AddSamples" component={AddSamples} /> */}
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
