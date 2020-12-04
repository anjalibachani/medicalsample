import React, { Component } from 'react'
import { Navbar, Nav, Container, ButtonGroup, Row, Col } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";
import UsersTable from './UsersTable';
import LocationsTable from './LocationsTable';
import LogsTable from './LogsTable';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');


export default class Manage extends Component {
    resestToken = () => {
        Axios.post(`http://${config.server.host}:${config.server.port}/api/resettoken`, { user_id: localStorage.getItem("user_id") }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
            //console.log("status is :",response.status)
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem("expiresin", Date.now() + 6000000);
            } else {
                localStorage.clear();
            }

        });
    }

    render() {
        let location = window.location.pathname;
        {
            if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now() + 600000))
                this.resestToken()
        }
        return (
            <div>
                {(() => {
                    if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now())) {
                        return (
                            <>
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
                            </>
                        );
                    } else {
                        return (<Redirect to="/login" />)
                    }
                })()}
            </div>
        )
    }
}
