import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import Select from 'react-select';
import FormFields from './FormFields';
import Header from './Header';

// import CommonFields from './CommonFields';

// import CustomAlertBanner from './CustomAlertBanner'

/* Note: DatePicker is an additional dependency, NOT included in
 * react-bootstrap! Documentation can be found at https://reactdatepicker.com/
 */
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
const sampleTypes = require("../config/types.json");
/* AddSamples: this is the interface for entering new sample information into
 * the database.
 */
const phpServerURL = ""
class AddSamples extends Component {
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
		this.state = {
			types: [],
			selectedOption: null,
			formFields: []
		}
	}
	componentDidMount() {
		let array = []
		sampleTypes.types.forEach(element => {
			array.push({ value: element.name, label: element.name });
		});
		this.setState({ types: array });
	}
	clearFormFields = () => {
		this.setState({ selectedOption: null, formFields: [] });
	}
	handleChange = selectedOption => {
		// this.setState({ selectedOption }, () => this.getMappingFiledsByType(selectedOption.value));
		// this.setState({ formFields: [] });
		this.setState({ selectedOption: null, formFields: [] }, () => this.setState({ selectedOption }, () => this.getMappingFiledsByType(selectedOption.value)));
	};
	getMappingFiledsByType = name => {
		sampleTypes.types.forEach(element => {
			if (element.name === name) {
				this.setState({ formFields: element.values });

			}
		});
	}
	render() {
		const { types, selectedOption, formFields } = this.state;
		// console.log((selectedOption));
		console.log('firmfields: ', formFields);
		return (
			<div>
				{(() => {
					if (localStorage.getItem("user_id") !== null) {
						return (
							<>
								<Header />
								<Container fluid>
								<Row>
									<Col md="auto">
										<h3 className="text-dark">Add samples:</h3>
										</Col>
										<Col md="auto">
											<h5 className="ml-5 mt-1 text-dark">Please Select Sample Type:</h5>
										</Col>
										<Col md="4">
											<Select
												label="Sample Type"
												placeholder="Select Sample Type"
												isSearchable={true}
												value={selectedOption}
												onChange={this.handleChange}
												options={types}
											/>
										</Col>
								</Row>
								</Container>
								<hr/>
								<FormFields fields={formFields} clearFormFields={this.clearFormFields} sampleType={selectedOption}/>
							</>
						);
					} else {
						return (<Redirect to="/login" />)
					}
				})()}
			</div>
		);
	}

}

export default AddSamples;

