import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';
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
	componentDidMount() {
		const access_token = localStorage.getItem("token")
		Axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
	}

	resestToken = () => {
		Axios.post(`http://${config.server.host}:${config.server.port}/api/resettoken`, { user_id: localStorage.getItem("user_id") }).then((response) => {
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
		{
			if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") <= Date.now() + 600000))
				this.resestToken()
		}
		return (
			<div>
				{(() => {
					if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now())) {
						return (
							<>
								<Header />
								{this.state.alertVisibility &&
									<CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} />
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
									<Basic2Table />
								</Container>
							</>
						);
					} else {
						return (<Redirect to="/login" />)
					}
				})()}
			</div>
		)
	};
}

export default ViewShipments;
