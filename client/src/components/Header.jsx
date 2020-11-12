import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar, Nav, Container, ButtonGroup } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";

export default class Header extends Component {
    static propTypes = {
        prop: PropTypes
    }
    render() {
        console.log("home: ", window.location.pathname);
        let location = window.location.pathname;
        return (
            <div>
                <Navbar className="bg-light">
                    <Navbar.Brand className="mr-auto">
                        <h2>SAM Sample Database</h2>
                    </Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/logout" >Log Out</Nav.Link>
                        <Nav.Link href="/manage" target="_blank">Manage </Nav.Link>
                    </Nav>
                </Navbar>
                <Container fluid>
                    <ButtonGroup>
                        {
                            location === "/AddChild" ?
                                <CustomHeaderButton href="/AddChild" text="Add Child" variant="dark" />
                                :
                                <CustomHeaderButton href="/AddChild" text="Add Child" variant="outline-dark" />
                        }
                        {
                            location === "/AddSamples" ?
                                <CustomHeaderButton href="/AddSamples" text="Add Samples" variant="dark" />
                                :
                                <CustomHeaderButton href="/AddSamples" text="Add Samples" variant="outline-dark" />
                        }
                        {
                            location === "/filterandExports" ?
                                <CustomHeaderButton href="/filterandExports" text="Samples Inventory" variant="dark" />
                                :
                                <CustomHeaderButton href="/filterandExports" text="Samples Inventory" variant="outline-dark" />
                        }
                        {/*<CustomHeaderButton href="/Reports" text="Reports" />*/}
                        {
                            location === "/AddShipments" ?
                                <CustomHeaderButton href="/AddShipments" text="Create a Shipment" variant="dark" />
                                :
                                <CustomHeaderButton href="/AddShipments" text="Create a Shipment" variant="outline-dark" />
                        }
                        {
                            location === "/ViewShipment" ?
                                <CustomHeaderButton href="/ViewShipment" text="See Shipments" variant="dark" />
                                :
                                <CustomHeaderButton href="/ViewShipment" text="See Shipments" variant="outline-dark" />
                        }
                    </ButtonGroup>
                </Container>
                <hr />
            </div>
        )
    }
}

