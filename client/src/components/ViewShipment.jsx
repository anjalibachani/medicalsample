import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';
import CustomTable from './CustomTable'; 
import CustomAlertBanner from './CustomAlertBanner';
import Header from './Header';
import Basic2Table from './Basic2Table';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomHeaderButton from "./CustomHeaderButton";
import Modal from 'react-modal';
import Axios from 'axios';
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

/* This is the 'See Shipments' page. */
class ViewShipments extends Component {
   	constructor(props) {
		super(props);
    	this.state = {

		}
	}
	render() {
        return (
            <div>
                <Header />
				{this.state.alertVisibility &&
				<CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText}/>
				}
					<h2 align="left">&nbsp;&nbsp;&nbsp;View Shipments</h2>
					<Row>
                    <Col align="left">
                        <ButtonGroup>
							&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="dark" size="lg" href="/AddShipments" text="Create a Shipment">Create a Shipment</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </ButtonGroup>
                    </Col>
                </Row>
				
				<hr />
				<Container >
				<Basic2Table/>
				</Container>
			</div>
        )                
    };
}

export default ViewShipments;
