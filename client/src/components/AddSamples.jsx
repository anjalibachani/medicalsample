import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import Select from 'react-select';
import FormFields from './FormFields';
import Header from './Header';
import axios from 'axios';
import _ from 'lodash';
import 'react-datepicker/dist/react-datepicker.css'



const sampleTypes = require("../config/types.json");
// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

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
		// console.log('evals.data.options', evals.data.options);
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
	handleIDChange = selectedOption => {
		this.setState({ selectedIdOption: selectedOption });
		this.getEvalOptions(selectedOption.value);
	}
	handleEvalChange = selectedOption => {
		this.setState({ selectedEvalOption: selectedOption });
	}
	handleMultiChange = selectedOption => {
		let array = []
			(() => {
				if (selectedOption) {
					selectedOption.map((ele) => {
						var res = this.createTabsMppping(ele.value)
						array.push({ key: ele, fields: res[0], data:{}});
					})
				}
				this.setState({ multiValue: selectedOption });
				this.setState({ tabsMapping: array });
			})()
	}
	onChange = (value, { action, removedValue }) => {
		console.log("$ " + value + " " + action + " " + removedValue + " $");
		let tabsMapping = this.state.tabsMapping;
		const { selectedIdOption, selectedEvalOption } = this.state;
		switch (action) {
			case 'select-option':
				const ele = value[value.length - 1];
				var res = this.createTabsMppping(ele.value)
				tabsMapping.push({
					key:ele,
					fields: res[0], data: {
						type: ele.value, "sample_id": selectedIdOption.value,
						"eval": selectedEvalOption.value, "Date": new Date()
					}
				});
				break;
			default:
				tabsMapping = tabsMapping.filter(function (obj) {
					console.log("obj.key", obj.key);
					return obj.key !== removedValue;
				});
				console.log("tabsMapping filter: ", tabsMapping);
				break;
		}

		console.log("onChange: ", tabsMapping);
		this.setState({ multiValue: value, tabsMapping: tabsMapping });
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

	handleTextChange = (value, fieldName, index) => {
		let tabsMapping = this.state.tabsMapping
		tabsMapping[index].data[fieldName] = value
		this.setState({ tabsMapping: tabsMapping })
	}
	handleCheckBoxChange = (value, fieldName, index) => {
		let tabsMapping = this.state.tabsMapping
		value = value === true ? 1 : 0
		tabsMapping[index].data[fieldName] = value
		this.setState({ tabsMapping: tabsMapping })
	}
	validateForm = () => {
		let tabsMapping = this.state.tabsMapping;
		let flag = false
		tabsMapping.forEach(element => {
		let index = element.fields.findIndex(key => key.fieldName === "Aliquots")
			if (index !== -1) {
				let aliquots = element.data.Aliquots;
				console.log("aliquots", aliquots);
				if (aliquots === undefined || aliquots.length === 0) {
					console.log("element", element.fields[index]);
					element.fields[index]["fieldError"] = "Please enter a valid value"
					flag = true
				}
			}
			
		})
		this.setState({ tabsMapping: tabsMapping });
		return flag;

	}
	createJson = () => {
		let tabsMapping = this.state.tabsMapping;
		let tableData = [];

		console.log("inside createJson function");
		tabsMapping.forEach((element) => {
			// let temp = {};
			element.data = _.mapKeys(element.data, (value, key) => _.snakeCase(key));
			// temp["values"] = Object.values(element.data);

			// temp["columns"] = Object.keys(_.mapKeys(element.data, (value, key) => _.snakeCase(key)));
			// temp["values"] = Object.values(element.data);

			// tableData.push(temp);
		});
		console.log("after loadash: ", tabsMapping);
		return tabsMapping;
	}
	send = async () => {
		const result = this.createJson();
		console.log("converted json",result)
		const res = await axios.post(`http://${config.server.host}:${config.server.port}/samples/add`, result);
		console.log(res.data)
	}
	save = () => {
		if (!this.validateForm()) {		
			this.send();
			this.props.history.push('/Home')
		}
	}
	render() {
		const { types, selectedIdOption, selectedEvalOption, multiValue, tabsMapping } = this.state;
		console.log("tabsmapping ", tabsMapping);
		const size = Object.keys(tabsMapping).length;
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
											<h5 className="text-dark">Please Select ID</h5>
											<Select
												label="Sample ID's"
												placeholder="Select ID"
												isSearchable={true}
												value={selectedIdOption}
												onChange={this.handleIDChange}
												options={this.state.sampleIdOptions}
											/>
										</Col>
										{selectedIdOption === null ? null :
										<Col md="4">
											<h5 className="text-dark">Please Select Eval</h5>
											<Select
												label="Sample Eval"
												placeholder="Select Eval"
												isSearchable={true}
												value={selectedEvalOption}
												onChange={this.handleEvalChange}
												options={this.state.evalOptions}
											/>
										</Col>
										}
										{selectedEvalOption === null? null :
											<Col md="4">
												<h5 className="text-dark">Please Select Sample Type</h5>
												<Select
													label="Sample Type"
													placeholder="Select Sample Type"
													isSearchable={true}
													value={multiValue}
													onChange={this.onChange}
													options={types}
													isMulti
												/>
											</Col>
										}
									</Row>
								</Container>
								<hr />
								{
									tabsMapping.map((item, index) => {
										let flag = false;
										if (index === size - 1)
											flag = true;
										return (<><h4 className="text-dark">{item.data.type} Sample</h4><br />
											<FormFields
												fields={item.fields} flag={flag}
												data={item.data}
												index={index}
												handleTextChange={this.handleTextChange}
												handleCheckBoxChange={this.handleCheckBoxChange}
											/>
										</>
										)
									})
								}
								{size !== 0 ?
									<>
										<Button className="ml-2" variant="outline-dark" size="lg" onClick={this.clearFields}> Clear</Button>
										<Button className="ml-4" variant="primary" size="lg" disabled={false} onClick={this.save}> Save </Button>
									</>
									:
									null}
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

