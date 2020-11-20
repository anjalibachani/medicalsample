import React, { Component } from 'react'
import { Navbar, Nav, Container, ButtonGroup, Row,Col } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";
import UsersTable from './UsersTable';
import LocationsTable from './LocationsTable';
import LogsTable from './LogsTable';

export default class Manage extends Component {
    render() {
        let location = window.location.pathname;
        return (
            <div>
                <Navbar className="bg-light">
                    <Navbar.Brand className="mr-auto">
                        <h2>SAM Sample Database</h2>
                    </Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/Home" target="_blank" className="text-primary">Home</Nav.Link>
                        <Nav.Link href="/logout" className="text-primary">Log Out</Nav.Link>
                    </Nav>
                </Navbar>
                <Container fluid>
                    <ButtonGroup>
                        {
                            location === "/users" ?
                                <CustomHeaderButton href="/users" text="Manage Users" variant="dark" />
                                :
                                <CustomHeaderButton href="/users" text="Manage Users" variant="outline-dark" />
                        }
                        {
                            location === "/locations" ?
                                <CustomHeaderButton href="/locations" text="Manage Locations" variant="dark" />
                                :
                                <CustomHeaderButton href="/locations" text="Manage Locations" variant="outline-dark" />
                        }
                        {
                            location === "/logs" ?
                                <CustomHeaderButton href="/logs" text="View Logs" variant="dark" />
                                :
                                <CustomHeaderButton href="/logs" text="View Logs" variant="outline-dark" />
                        }
                    </ButtonGroup>
                </Container>
                <hr />
            </div>
        )
    }
}
