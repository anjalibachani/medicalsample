import React, { Component } from 'react'
import { Navbar, Nav, Container, ButtonGroup, Row,Col } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";
import UsersTable from './UsersTable';
import LocationsTable from './LocationsTable';
import LogsTable from './LogsTable';

export default class Manage extends Component {
    render() {
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
                    <Row>
                        <Col>
                            <UsersTable />
                        </Col>
                        <Col>
                            <LocationsTable />
                        </Col>
                        <Col>
                            <LogsTable />
                        </Col>
                   </Row>
                </Container>
                <hr />
            </div>
        )
    }
}
