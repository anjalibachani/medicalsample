import React, { Component } from 'react';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import FormFields from './FormFields';

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

 const phpServerURL =""
class AddSamples extends Component {
	constructor(props) {
    	super(props);
        this.state = {
			types: [],
			selectedOption: null,
			formFields:[]
		}
    }
	componentDidMount() {
		let array=[]
		sampleTypes.types.forEach(element => {
			array.push( { value: element.name, label: element.name });
		});	
		this.setState({ types: array });
	}
	handleChange = selectedOption => {
    this.setState({ selectedOption }, () => this.getMappingFiledsByType(selectedOption.value));
	console.log(`Option selected:`, selectedOption);
	
	};
	getMappingFiledsByType = name => {	
		sampleTypes.types.forEach(element => {
			if (element.name === name) {
				this.setState({formFields:element.values});
			}
		});
	}
	render() { 
		const {types, selectedOption,formFields} = this.state ;
		return (
			<Form.Row><div>
				<Select
					isSearchable={true}
					value={selectedOption}
					onChange={this.handleChange}
					options={types}
				/>
				<hr />
				<FormFields fields={formFields} />
			</div>
			</Form.Row>
           );
	}
	
}

export default AddSamples;

