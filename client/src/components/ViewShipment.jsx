import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import CustomTable from './CustomTable'; 
import CustomAlertBanner from './CustomAlertBanner';
import Header from './Header';
import Basic2Table from './Basic2Table';

import { Redirect } from 'react-router-dom';
//import { Text } from 'react-native-elements';
//import AddShipments from './AddShipments'

import { Link } from 'react-router-dom';
import CustomHeaderButton from "./CustomHeaderButton";
import Modal from 'react-modal';
//import { Text } from 'react-native-elements';
import Axios from 'axios';
// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

/* This is the 'See Shipments' page. */
class ViewShipments extends Component {
   	constructor(props) {
		super(props);
    	this.state = {
			/* Shipment information from database: */
			shipments: [],
			
			/* Table states: */
			headers: ['Date','From','To','Samples','Received Status'],
			resetChecksShipment: false,
			checkedRowsShipment: [],
			
			/* Alert states: */	
			alertVisibility: false,
			alertText: 'This text should not be visible. If it is, contact your system administrator.',
			alertVariant: 'danger',

			showModal: false,

			data: [],

		}
		this.markShipmentsReceived = this.markShipmentsReceived.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
    	this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	/* When the component mounts, retrieve all shipments from the database and 
	 * filter out any of those that have been marked received. */
	handleOpenModal () {
		this.setState({ showModal: true });
	}
	  
	handleCloseModal () {
		this.setState({ showModal: false });
	}
	
	// componentDidMount() {
	// 	var request;

	// 	request = new XMLHttpRequest();
	// 	request.open(
	// 		"GET",
	// 		"http://localhost:5000/shipment/viewshipments",
	// 		true
	// 	);
	// 	request.onload = function (e) {
	// 		if (request.readyState === 4 && request.status === 200) {
	// 			this.setState({ 
	// 				shipments: JSON.parse(request.responseText),
	// 			});

	// 			//Remove any of the shipments that have already been received
	// 			var pending_shipments = this.state.shipments;
	// 			var indices_of_shipments_to_splice = [];
				
	// 			for (var i = 0; i < pending_shipments.length; i++) {
	// 				if (pending_shipments[i]["received"] === 1) {
	// 					indices_of_shipments_to_splice.push(i);
	// 				}
	// 			}

	// 			for (var j = (indices_of_shipments_to_splice.length - 1); j > -1; j--) {
	// 				pending_shipments.splice(indices_of_shipments_to_splice[j], 1);
	// 			}	

	// 			this.setState({ shipments: pending_shipments});

	// 		} else {
	// 			console.error(request.statusText);
	// 		}
	// 	}.bind(this);

	// 	//request.send();	
		
	// }

	componentDidMount(){
		Axios.get(`http://${config.server.host}:${config.server.port}/shipment/viewshipments`).then((response)=>{
			console.log(response.data)
			this.setState({
				data : response.data
			});
		})
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

							{/* <Button variant="dark" size="lg" href="/AddShipments">Create a Shipment</Button> */}

                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="dark" size="lg" onClick={this.markShipmentsReceived}>Mark received</Button>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<Button variant="dark" size="lg" onClick={this.handleOpenModal}>View Shipment Details</Button>
							<Modal isOpen={this.state.showModal} contentLabel="Minimal Modal Example" className="Modal" overlayClassName="Overlay">
							<p>Shipping Details:</p>
							<Col>
								<div>ID: <span>{this.state.data.shipment_id}</span></div>
								<div>Received Status: <span>{this.state.data.reached}</span></div>
								<div>Shipping Company: <span>{this.state.data.shipping_company}</span></div>
								<div>From: <span>{this.state.data.from_location_id}</span></div>
								<div>To: <span>{this.state.data.to_location_id}</span></div>
								<div>Shipping Date: <span>{this.state.data.shipping_date}</span></div>
								<div>Shipping Condition: <span>{this.state.data.shipment_condition}</span></div>
								<div>Number of Samples: <span>{this.state.data.no_of_samples}</span></div>
								<div>Notes: <span>{this.state.data.notes}</span></div>
								<div>User ID: <span>{this.state.data.user_id}</span></div>
    						</Col>
							<button onClick={this.handleCloseModal}>Close</button>
							</Modal>
                        </ButtonGroup>
                    </Col>
                </Row>

				<hr />
                
				<Basic2Table/>
            
			</div>
        )                
    };

	/* This is a placeholder function so the table component doesn't 
	 * throw an error when there is no function for the getRows prop. 
	 * In a later refactoring, this should go away and instead the 
	 * CustomTable component should set an empty function by default.
	 */
	getRowsDefault = () => {
	}

	/* This method is called when the user selects the 'Mark received' 
	 * button. It gets every shipment in the table that has been checked 
	 * and runs the script that marks it received in the database, which 
	 * it turn filters it out of view when the component refreshes. */
	markShipmentsReceived() 
	{
		var areChecks = false;
		for (var checked in this.state.checkedRowsShipment) {
			if (checked) {
				areChecks = true;
			}
		}

		if (areChecks) {

			var shipments_to_mark_received = [];
			//get shipment id from shipment in table
			for (var i = 0; i < this.state.shipments.length; i++) {
				if (this.state.checkedRowsShipment[i]) {
					shipments_to_mark_received.push(this.state.shipments[i]["key_internal"])
				}
			}

			//send a GET request to mark it received in the db

			var mark_received_request;
			var getQuery;

			for (var j = 0; j < shipments_to_mark_received.length; j++) {
				getQuery = getQuery + "id" + (j+1) + "=" + shipments_to_mark_received[j];

				if (j < (shipments_to_mark_received.length - 1)) {
					getQuery = getQuery + "&";
				}
			}

			mark_received_request = new XMLHttpRequest();
			mark_received_request.open(
				"GET",
				"http://localhost:5000/shipment/viewshipments" + getQuery,
				true
			);
			
			mark_received_request.onload = function (e) {
				if (mark_received_request.readyState === 4 && mark_received_request.status === 200) {

					//REFACTOR: this might be neater inline below
					var plural = '';
					if (shipments_to_mark_received.length > 1) {
						plural = 's';
					}

					this.setState({ 
						last_shipments_marked_received: shipments_to_mark_received,
						alertText: shipments_to_mark_received.length + " shipment" + plural + " marked received.",
						alertVariant: 'success',
						alertVisibility: true,
					});
				} else {
					console.error(mark_received_request.statusText);
					
					this.setState({
						alertText: 'There was an error connecting to the database: ' + mark_received_request.statusText,
						alertVisibility: true,
					});
				}
			}.bind(this);

			mark_received_request.send();	

		}
	}


    /* Table callback: tracks which rows in the table are checked in
     * this.state.checkedRowsShipment. When it updates it also resets the checks
     * using this.state.resetChecksSamples.
     */
	getCheckedStateFromShipmentTable = (checkedRows) => {
		this.setState({ 
			checkedRowsShipment: checkedRows,
			resetChecksShipment: false,
		});
	}
}

export default ViewShipments;
