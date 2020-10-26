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
		this.setState({ formFields: [] });
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
		console.log('firmfields: ', formFields);
		return (
			<div>
				{(() => {
					if (localStorage.getItem("user_id") !== null) {
						return (
							<>
								<Header />
								<Form.Row>
									<div>
										<Select 
										isSearchable={true}
										value={selectedOption}
										onChange={this.handleChange}
										options={types}
									/>
										<hr />
										<FormFields fields={formFields} clearFormFields={this.clearFormFields} />
									</div>	</Form.Row>
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

