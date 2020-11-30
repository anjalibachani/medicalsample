import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import { Button, Row, Col, Container, Form, Nav, Alert} from 'react-bootstrap';
import Select from 'react-select';
import FormFields from './FormFields';
import Header from './Header';
import axios from 'axios';
import _ from 'lodash';
import CustomAlertBanner from "./CustomAlertBanner";
import 'react-datepicker/dist/react-datepicker.css'

const sampleTypes = require("../config/types.json");
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
			tabsMapping: [],
			alertVisibility: false,
			isVisible:false,
			alertText: 'Want to delete already saved samples ?',
			alertVariant: 'info',
			fixedValues: [],
			formErrors: {}
		}
	}

	styles = {
		multiValue: (base, state) => {
			return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
		},
		multiValueLabel: (base, state) => {
			return state.data.isFixed
				? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
				: base;
		},
		multiValueRemove: (base, state) => {
			return state.data.isFixed ? { ...base, display: "none" } : base;
		}
	};

	async getsampleIdOptions() {
		const ids = await axios.get(`http://${config.server.host}:${config.server.port}/samples/getSampleIDs`)
		this.setState({ sampleIdOptions: ids.data.options })
	}
	async getSampleTypes(sample_id,eval_number) {
		const params = {
			sample_id: sample_id,
			eval: eval_number
		};
		const res = await axios.get(`http://${config.server.host}:${config.server.port}/samples/getSampleTypes`, { params })
		return res.data.results;
	}

	async getEvalOptions(sample_id) {
		const evals = await axios.get(`http://${config.server.host}:${config.server.port}/samples/getSampleEvals/${sample_id}`)
		this.setState({ evalOptions: evals.data.options })
	}
	 componentDidMount() {
		if (this.props.location.state !== undefined) {
			let sample_id = {"value":this.props.location.state.sample_id, "label":this.props.location.state.sample_id};
			let evl = { "value": this.props.location.state.eval, "label": this.props.location.state.eval };
			this.setState({ selectedIdOption: sample_id, selectedEvalOption: evl });
		}
		let array = []
		sampleTypes.types.forEach(element => {
			array.push({ value: element.name, label: element.name });
		});
		this.setState({ types: array });
		this.getsampleIdOptions();
	}
	handleIDChange = selectedOption => {
		this.setState({
			alertVisibility: false
		});
		this.setState({ selectedEvalOption: null, multiValue: [], tabsMapping:[], selectedIdOption: selectedOption });
		this.getEvalOptions(selectedOption.value);
	}
	handleEvalChange = async selectedOption => {
		this.setState({
			alertVisibility: false
		});
		this.setState({ selectedEvalOption: selectedOption });
		let temp = await this.getSampleTypes(this.state.selectedIdOption.value, selectedOption.value)
		let multiVal = temp.map((item, key) => { return { 'value': item.type, 'label': item.type, 'isFixed': true } });
		let fixedValues = multiVal.map(vals => vals.value);
		this.setState({ multiValue: multiVal, fixedValues:fixedValues }, () => this.generateTabsMapping(temp));
	}

	generateTabsMapping = (data) => {
		const { types } = this.state;
		let tabs = [];
		data.forEach((element) => {
			element = _.mapKeys(element, (value, key) => _.startCase(_.toLower(key)));
			let obj = {};
			obj.user_id = localStorage.getItem("user_id");
			obj["key"] = { "value": element.Type, "label": element.Type };
			let type = element.Type;
			let fields = sampleTypes.types.filter((val, key) => {
				if (val.name === type)
					return val.values
			});
			obj["fields"] = fields[0].values;
			let tempData = {};
			for (const [key, value] of Object.entries(obj["fields"])) {
				if (value.fieldName === "Date")
					tempData[value.fieldName] = new Date(element[value.fieldName]);
				else
					tempData[value.fieldName] = element[value.fieldName];
			}
			tempData["sample_id"] = element["Sample Id"]
			tempData["eval"] = element["Eval"]
			tempData["type"] = element["Type"]
			obj["data"] = tempData;
			tabs.push(obj);
		});
		this.setState({ tabsMapping: tabs });
	}

	onChange = (value, { action, removedValue }) => {
		this.setState({
			alertVisibility: false
		});
		let tabsMapping = this.state.tabsMapping;
		const { selectedIdOption, selectedEvalOption, multiValue, fixedValues } = this.state;
		switch (action) {
			case 'select-option':
				const ele = value[value.length - 1];
				var res = this.createTabsMppping(ele.value)
				tabsMapping.push({
					user_id: localStorage.getItem("user_id"),
					key:ele,
					fields: res[0], data: {
						type: ele.value, "sample_id": selectedIdOption.value,
						"eval": selectedEvalOption.value, "Date": new Date()
					}
				});
				value[value.length - 1]["isFixed"] = false;
				break;
			case "clear":
				let flag = true;
				value = multiValue.filter(function (obj) {
					if (obj.isFixed === false) flag = false;
					return obj.isFixed;
				});
				tabsMapping = tabsMapping.filter(function (obj) {
					return fixedValues.includes(obj.key.value);
				});
				this.setState({
					alertVisibility: flag
				});
			default:
				if (removedValue !== undefined) {
					if (removedValue.isFixed == true)
						return;
					tabsMapping = tabsMapping.filter(function (obj) {
						return obj.key.value !== removedValue.value;
					});
				}
				break;
		}

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
		this.setState({
			alertVisibility: false
		});
		let tabsMapping = this.state.tabsMapping
		tabsMapping[index].data[fieldName] = value
		this.setState({ tabsMapping: tabsMapping })
	}
	handleCheckBoxChange = (value, fieldName, index) => {
		this.setState({
			alertVisibility: false
		});
		let tabsMapping = this.state.tabsMapping
		value = value === true ? 1 : 0
		tabsMapping[index].data[fieldName] = value
		this.setState({ tabsMapping: tabsMapping })
	}
	validateForms = () => {
		let errorsObj = {};
		let tabsMapping = this.state.tabsMapping;
		let fixedValues = this.state.fixedValues;
		console.log("tabsMapping", tabsMapping);
		console.log("fixedValues", fixedValues);
		tabsMapping.forEach(element => {
			console.log("element",element);
			let index = element.fields.findIndex((key) => {
				return (key.fieldName === "Aliquots" && !fixedValues.includes(element.key.value)) 
					
				
			});
			console.log("index",index);
			if (index !== -1) {
				let aliquots = (element.data.Aliquots);
				console.log("aliquots", typeof aliquots);
				console.log("aliquots", aliquots);
				// if (typeof aliquots==="number") {
				// 	break;
				// }
				// if (typeof aliquots !== 'number') {
				// 	if (aliquots === undefined) {
				// 		errorsObj.aliquots = "Please Enter Eval"
				// 	}
				// 	if ((aliquots !== undefined || aliquots !== '') && !(parseInt(aliquots) >= 0)) {
				// 		errorsObj.aliquots = "Please Enter Valid Eval (typically > 0)"
				// 	}
				// } 
			}
		})
		return errorsObj;
	}
	createJson = () => {
		let tabsMapping = this.state.tabsMapping;
		tabsMapping.forEach((element) => {
			element.data = _.mapKeys(element.data, (value, key) => _.snakeCase(key));
		});
		return tabsMapping;
	}
	send = async () => {
		console.log("Sending..")
		let result = this.createJson();
		// result.user_id = localStorage.getItem("user_id");
		console.log("result", result);
		const res = await axios.post(`http://${config.server.host}:${config.server.port}/samples/add`, result);
	}
	save = () => {
		// this.setState({ formErrors: this.validateForms() },()=> {
		// 	if (Object.keys(this.state.formErrors).length === 0) {
		// 		console.log("AAA");
		// 	this.send();
		// 	}
		// });
		this.send();
		this.setState({
			isVisible: true
		});
		setTimeout(() => {
			this.props.history.push('/Home');
		}, 5000)
		
	}
	render() {
		const { types, selectedIdOption, selectedEvalOption, multiValue, fixedValues, tabsMapping, formErrors } = this.state;
		const size = Object.keys(tabsMapping).length;
		return (
			<div>
				{(() => {
					if (localStorage.getItem("user_id") !== null) {
						return (
							<>
								<Header />
								{this.state.alertVisibility && (
									<Col><CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} href="filterandExports"
										hrefText=" Goto Samples Inventory"
									/>

									</Col>
								)}
								{this.state.isVisible && 
									<Alert variant='success'>
										<Alert.Heading>Successfully Saved Samples.</Alert.Heading>
									</Alert>
								}
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
													styles={this.styles}
													value={multiValue}
													defaultValue={types}
													onChange={this.onChange}
													options={types}
													isMulti
													isClearable={multiValue!==null && multiValue.some(v => v.isFixed)}
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
												fixedValues={fixedValues}
												handleTextChange={this.handleTextChange}
												handleCheckBoxChange={this.handleCheckBoxChange}
												formErrors={formErrors}
											/>
										</>
										)
									})
								}
								{size !== 0 ?
									<>
										<Button variant="dark" size="lg" disabled={false} onClick={this.save}>Save</Button>
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

