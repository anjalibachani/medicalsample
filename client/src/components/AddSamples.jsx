import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import Select from 'react-select';
import FormFields from './FormFields';
import Header from './Header';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTabs from './CustomTabs';


const sampleTypes = require("../config/types.json");
const config = require('../config/config.json')

class AddSamples extends Component {
	constructor(props) {
		super(props);
		this.state = {
			types: [],
			selectedOption: null,
			selectedIdOption: null,
			selectedEvalOption: null,
			formFields: [],
			sampleIdOptions: [],
			evalOptions: [],
			multiValue: [],
			tabsMapping: []
		}
	}
	async getsampleIdOptions() {
		const ids = await axios.get(`http://${config.server.host}:${config.server.port}/samples/getSampleIDs`)
		this.setState({ sampleIdOptions: ids.data.options })
	}
	async getEvalOptions(sample_id) {
		const evals = await axios.get(`http://${config.server.host}:${config.server.port}/samples/getSampleEvals/${sample_id}`)
		console.log('evals.data.options', evals.data.options);
		this.setState({ evalOptions: evals.data.options })
	}
	componentDidMount() {
		let array = []
		sampleTypes.types.forEach(element => {
			array.push({ value: element.name, label: element.name });
		});
		this.setState({ types: array });
		this.getsampleIdOptions();
	}
	clearFormFields = () => {
		this.setState({ selectedOption: null, formFields: [] });
	}
	// handleChange = selectedOption => {
	// 	this.setState({ selectedOption: null, formFields: [] }, () => this.setState({ selectedOption }, () => this.getMappingFiledsByType(selectedOption.value)));
	// };
	handleIDChange = selectedOption => {
		this.setState({ selectedIdOption: selectedOption });
		this.getEvalOptions(selectedOption.value);
		console.log("selectedIdOption", selectedOption);
	}
	handleEvalChange = selectedOption => {
		this.setState({ selectedEvalOption: selectedOption });
	}
	handleMultiChange = selectedOption => {
		let array = []
		{
			(() => {
				if (selectedOption) {
					selectedOption.map((ele) => {
						var res = this.createTabsMppping(ele.value)
						array.push({ key: ele, val: res[0] });
					})
				}
				this.setState({ multiValue: selectedOption });
				this.setState({ tabsMapping: array });
			})()
		}
	}
	createTabsMppping = name => {
		let array = []
		sampleTypes.types.forEach(element => {
			if (element.name === name) {
				array.push(element.values)
				this.setState({ formFields: element.values });
				return element.values
			}
		});
		return array
	}
	// getMappingFiledsByType = name => {
	// 	sampleTypes.types.forEach(element => {
	// 		if (element.name === name) {
	// 			this.setState({ formFields: element.values });
	// 		}
	// 	});
	// }
	render() {
		const { types, selectedOption, formFields, selectedIdOption, selectedEvalOption, multiValue, tabsMapping } = this.state;
		return (
			<div>
				{(() => {
					if (localStorage.getItem("user_id") !== null) {
						return (
							<>
								<Header />
								<Container>
									<Row>
										<Col md="4">
											<Select
												label="Sample ID's"
												placeholder="Select Sample ID"
												isSearchable={true}
												value={selectedIdOption}
												onChange={this.handleIDChange}
												options={this.state.sampleIdOptions}
											/>
										</Col>
										<Col md="4">
											<Select
												label="Sample Eval"
												placeholder="Select Eval"
												isSearchable={true}
												value={selectedEvalOption}
												onChange={this.handleEvalChange}
												options={this.state.evalOptions}
											/>
										</Col>
										<Col md="4">
											<Select
												label="Sample Type"
												placeholder="Select Sample Type"
												isSearchable={true}
												value={multiValue}
												onChange={this.handleMultiChange}
												options={types}
												isMulti
											/>
										</Col>
									</Row>
								</Container>
								<hr />
								{/* <CustomTabs tabs={multiValue} fields={formFields}/> */}
								<CustomTabs tabs={tabsMapping} />
								{/* <FormFields fields={formFields} clearFormFields={this.clearFormFields} sampleType={selectedOption}/> */}
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

