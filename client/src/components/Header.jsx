import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar, Nav, Container, ButtonGroup, Button } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";
export default class Header extends Component {
    static propTypes = {
        prop: PropTypes
    }
    render() {
        return (
            <div>
                <Navbar className="bg-light">
                    <Navbar.Brand className="mr-auto">
                        <h2>SAM Research Database</h2>
                    </Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/logout">Log Out</Nav.Link>
                        <Nav.Link href="/manage" target="_blank">Manage </Nav.Link>
                    </Nav>
                </Navbar>
                <Container fluid>
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
                    <hr />
                </Container>
            </div>
        )
    }
}
