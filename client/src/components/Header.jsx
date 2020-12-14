import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar, Nav, Container, ButtonGroup, Jumbotron, Button } from "react-bootstrap";
import CustomHeaderButton from "./CustomHeaderButton";

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        prop: PropTypes
    }
    render() {
        // console.log("props in header: ", this.props);
        // console.log("home: ", window.location.pathname);
        let location = window.location.pathname;
        return (
            <div>
                <Navbar className="bg-light">
                    <Navbar.Brand className="mr-auto">
                        <h2>SAM Sample Database</h2>
                    </Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/logout" className="text-primary">Log Out</Nav.Link>
                        <Nav.Link href="/manage" target="_blank" className="text-primary">Manage </Nav.Link>
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
                        {
                            location === "/ViewShipment" ?
                                <CustomHeaderButton href="/ViewShipment" text="Shipments" variant="dark" />
                                :
                                <CustomHeaderButton href="/ViewShipment" text="Shipments" variant="outline-dark" />
                        }
                    </ButtonGroup>
                </Container>
                <hr />
                {
                    location === "/Home" || location === "/home" ?
                        <Container >
                            <div class="card border-dark mb-3" >
                                <div class="card-header"><h2 className="text-dark">Welcome to Medical Sample Database!</h2></div>
                                <div class="card-body text-justify text-dark">
                                    <p><span class="badge badge-primary">Add Samples</span> - Creating Samples have never been easier! Select type of your Sample, enter data and Save. It's all dynamic, so You can see your updates anytime.</p>
                                    <p><span class="badge badge-primary">Samples Inventory</span> - You can search for any Sample or Shipment, by any piece of Information you have of them. Making this Database quite efficient. </p>
                                    <p><span class="badge badge-primary">Shipments</span> - Track all the records related to shipments, under 1 Tab. Create, filter and View shipment Details all just 1 click away!</p>

                                </div>
                            </div>
                            <hr />
                            <div class="text-justify">
                                <h4>INSTRUCTIONS:</h4>
                                <ul >
                                    <li>To Add a New Profile Information, click on "Add Child" Tab on the top of the page.</li>
                                    <li>To Add more samples of an existing profile, click on "Add Samples" Tab.</li>
                                    <li>To look for a specific Sample, use "Samples Inventory" Tab.</li>
                                    <li>To look for shipment or creation of shipment, select "Shipments" Tab.</li>
                                </ul>

                            </div>
                        </Container>
                        :
                        <></>
                }

            </div>
        )
    }
}

