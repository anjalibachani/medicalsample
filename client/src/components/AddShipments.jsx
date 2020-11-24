
import React, { Component } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';
import CustomAlertBanner from './CustomAlertBanner'
//import CustomTable from './CustomTable';
import Filter from './Filter';
import Select from 'react-select';
import Header from './Header';
/* Note: DatePicker is an additional dependency, NOT included in
 * react-bootstrap! Documentation can be found at https://reactdatepicker.com/
 */
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
//import DataTable from 'react-data-table-component';
import DataTable from 'react-data-table-component';

//import { getWeekWithOptions } from 'date-fns/fp';

import { getWeekWithOptions } from 'date-fns/fp';
// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const phpServerURL = null
const nodeserverURL = `http://${config.server.host}:${config.server.port}`
/* CreateShipments: this is the interface for entering a new shipment into the
 * database. This works very similarly to AddSamples.
 */

const sampleTypes = require("../config/types.json");

class CreateShipments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			/* Shipment data is tracked here, to be validated and sent to the
			 * database. They begin empty.
			 */
			date: new Date(),
			from: '',

			storageconditions: '',
			shippingconditions: '',
			/*othershippingconditions: '',*/
			to: '',
			notes: '',

			/* All samples retrieved from the database go here: */
			samples: [],

			/* This is the subset of all samples in the database that are
			 * available for a new shipment and meet any filter criteria. */
			samplesvisible: [],

			/* This is an array of all samples added to the current shipment.
			 */
			samplesadded: [],

			/* This is an array of every tube retrieved from the database. */
			tubes: [],

			/* This is every tube added to the current shipment. */
			tubesinshipments: [],
			locationoptions: [],
			locationoptions1: [],
			selectedOption: null,
			selectedFromOption: null,
			selectedToOption: null,
			selectedIdOption2: null,
			shippingcompany:null,
			selectedAliquotNumber: null,
			evaloptions: null,
			movedshipementsData: [],

			/* Set the default rows in tables, so the tables don't disappear
			 * when empty. */
			minimumRowsInTable: 16,
			selectedRows: [],
			aliquotSelectorsForModal: [],
			showModal: false,
			checkedRowsSamples: [],
			checkedRowsShipment: [],
			samplesToSelectAliquotsFrom: [],
			numberAliquotsSelectedForShipment: [],
			resetChecksSamples: false,
			resetChecksShipment: false,

			/* The array of filter components to be rendered */
			filters: [<Filter key={1} number={1} retVals={this.getFilterValues} />],

			/* This tracks callback information from the filter components (returned in getFilterValues()). */
			returnedFilterValues: [],

			/* Alert banner state */
			alertVisibility: false,
			alertText: 'Please enter all required fields.',
			alertVariant: 'danger',
		}
		this.save = this.save.bind(this);
		this.removeFromShipment = this.removeFromShipment.bind(this);
		this.addFilter = this.addFilter.bind(this);
		this.processFilter = this.processFilter.bind(this);
		this.clearFilters = this.clearFilters.bind(this);

		this.send = this.send.bind(this);
		this.handleIDChange = this.handleIDChange.bind(this);
	}

	columns = [
		{
			name: 'ID',
			selector: 'sample_id',
			sortable: true,
		},
		{
			name: 'Eval',
			selector: 'eval',
			sortable: true,
			right: true,
		},
		{
			name: 'Date',
			selector: 'date',
			sortable: true,
			right: true,
		},
		{
			name: 'Type',
			selector: 'type',
			sortable: true,
			right: true,
		},
		{
			name: 'Aliquots',
			selector: 'aliquot_count',
			sortable: true,
			right: true,
		},
	];

	movedshipementscolumns = [
		{
			name: 'ID',
			selector: 'sample_id',
			sortable: true,
		},
		{
			name: 'Eval',
			selector: 'eval',
			sortable: true,
			right: true,
		},
		{
			name: 'Date',
			selector: 'date',
			sortable: true,
			right: true,
		},
		{
			name: 'Type',
			selector: 'type',
			sortable: true,
			right: true,
		},
		{
			name: 'Aliquots',
			selector: 'selectedAliquotValue',
			sortable: true,
			right: true,
		},
	];

	/* Filter methods: */

	/* Render a new filter component (basically this.state.filters++) */
	addFilter() {
		console.log("add filter called")
		var newFilterArray = this.state.filters.concat(<Filter key={this.state.filters.length + 1} number={this.state.filters.length + 1} retVals={this.getFilterValues} />);
		this.setState({ filters: newFilterArray });
		console.log(`filters lenght is ${this.state.filters.length}`)
		console.log(this.state.filters)
	};

	// /* Create a GET array the request filtered sample list from database. */
	processFilter() {
		for (var i = 1; i <= this.state.filters.length; i++) {

			if (i !== 1) {
				console.log("filters exists")
			}

			//check to see if the filter's Type and Value aren't empty
			console.log(this.state.returnedFilterValues[i])
			let field = this.state.returnedFilterValues[i][0]

			let condition = this.state.returnedFilterValues[i][1]
			let value = this.state.returnedFilterValues[i][2]
			console.log(field, condition, value)
			console.log("sdhs")
			console.log("logging filed values ", this.state.data[0].field)
			console.log("logging filed values ", this.state.data[0].sample_id)
			//const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));
			try {
				if (field === "ID") {
					if (condition === '<')
						var filteredFriends = this.state.data.filter(p => p.sample_id < value);
					else if (condition === '===')
						var filteredFriends = this.state.data.filter(p => p.sample_id == value);
					else if (condition === '>')
						var filteredFriends = this.state.data.filter(p => p.sample_id > value);
				} else if (field === "Eval") {
					if (condition === '<')
						var filteredFriends = this.state.data.filter(p => p.eval < value);
					else if (condition === '===')
						var filteredFriends = this.state.data.filter(p => p.eval == value);
					else if (condition === '>')
						var filteredFriends = this.state.data.filter(p => p.eval > value);
				} else if (field === "aliquots") {
					if (condition === '<')
						var filteredFriends = this.state.data.filter(p => p.eval < value);
					else if (condition === '===')
						var filteredFriends = this.state.data.filter(p => p.eval == value);
					else if (condition === '>')
						var filteredFriends = this.state.data.filter(p => p.eval > value);
				}
			} catch (err) {
				console.log("filter failed")
			}

			this.setState({ data: filteredFriends })
			console.log(filteredFriends)
			this.state.data.filter(item => item.field && (item.field < value))
			console.log(this.state.data)

			// if (this.state.returnedFilterValues[i][0] !== '' && this.state.returnedFilterValues[i][1] !== ''){
			//   console.log(this.state.returnedFilterValues[i][0], this.state.returnedFilterValues[i][1])
			// }
		}
	}

	clearFilters() {
		this.setState({ filters: [<Filter key={1} number={1} retVals={this.getFilterValues} />] })
		this.getsampledata();
	}
	// /*Callback method for filter components that sends the contents of the
	// //filter to this.state.filterVals.
	// */
	getFilterValues = (type, equality, value, key) => {
		var filterVals = this.state.returnedFilterValues;

		if (type === "Date") {
			value = this.getDateFormat(value);
		}

		filterVals[key] = [type, equality, value];

		this.setState({ returnedFilterValues: filterVals });
	};

	/* On mounting the CreateShipments component, retrieve all the samples from
	 * the database, and then remove those that are unavailable because they
	 * are in other shipments. This happens in a few steps...
	 */
	componentDidMount() {
		this.getLocations();
		//this.getLocations1();
		this.getsampledata();


		//alert('helo') 
		var requestAllSamples;

	}

	handleIDChange = selectedOption => {
		console.log("selected option ", selectedOption)
		this.setState({ selectedFromOption: selectedOption, from: selectedOption });
		//this.getLocations(selectedOption.value);
	}

	handleIDChange1 = selectedOption => {
		console.log("selected option ", selectedOption)
		this.setState({ selectedToOption: selectedOption, to: selectedOption });
		//this.getLocations1(selectedOption.value);
	}

	handleAliquotNumberChange = (selectedOption, key) => {
		console.log("selected option ", selectedOption, key)
		let selectedRows = this.state.selectedRows;
		selectedRows[key].selectedAliquotValue = selectedOption;
		this.setState({ selectedAliquotNumber: selectedOption, selectedRows: selectedRows });
		// this.getaliquotOptions(selectedOption.value);
	}

	async getsampledata() {
		axios.get(`http://${config.server.host}:${config.server.port}/addshipment/select`).then((response) => {
			console.log(response.data)
			this.setState({
				data: response.data
			})
		});

	}


	async getLocations() {
		const id = await axios.get(`http://${config.server.host}:${config.server.port}/addshipment/fetchlocation`)
		this.setState({ locationoptions: id.data.options })
	}


	styles = {
		control: (base) => ({
			...base,
			minHeight: 32,
			width: 420,
		}),
		dropdownIndicator: (base) => ({
			...base,
			paddingTop: 0,
			paddingBottom: 0,
		}),
		clearIndicator: (base) => ({
			...base,
			paddingTop: 0,
			paddingBottom: 0,
		}),
	};

	/* Close the modal where the user specifies tubes to be added to shipment. */
	handleCloseModal = () => {
		this.setState({ showModal: false });
	}
	handleOpenModal = () => {
		console.log("on modal open: ,", this.state.selectedRows);
		this.setState({ showModal: true });
	}

	/* Table callback: tracks which rows in the table are checked in
	 * this.state.checkedRowsSamples. When it updates it also resets the checks
	 * using this.state.resetChecksSamples.
	 */
	getCheckedStateFromSamplesTable = (selectedRows) => {
		this.setState({
			checkedRowsSamples: selectedRows,
			resetChecksSamples: false,
		});
	}

	/* Same as above, only for the Shipments table. */
	getCheckedStateFromShipmentTable = (selectedRows) => {
		this.setState({
			checkedRowsShipment: selectedRows,
			resetChecksShipment: false,
		});
	}
	handleChange = state => {
		console.log("selected rows", state.selectedRows)
		let selectedRows = state.selectedRows;
		selectedRows.forEach((element, key) => {
			selectedRows[key]["selectedAliquotValue"] = '';
		});
		// state.selectedRows[state.selectedRows.length - 1]["selectedAliquotValue"] = '';
		console.log("selectedRows: ", selectedRows);
		this.setState({ selectedRows: selectedRows });

	};
	/* Modal callback that indicates how many tubes are going into the shipment. */
	numberOfAliquotsSelectedForShipment = (key, number) => {
		var numberAliquots = this.state.numberAliquotsSelectedForShipment;
		numberAliquots[key] = number;
		this.setState({ numberAliquotsSelectedForShipment: numberAliquots });
	}

	/* After the user selects the number of tubes from each sample for shipment
	 * in the modal, this method marks these tubes as being in the shipment so
	 * they no longer appear in the samples table.
	 */
	moveAliquotsToShipment = () => {
		let { selectedRows, data } = this.state;
		let newDate = []
		selectedRows.forEach(element => {
			element.selectedAliquotValue = element.selectedAliquotValue.value
			newDate = data.forEach((el) => {
				if (el.samples_key === element.samples_key) {
					console.log("el found", el);
					el.aliquot_count -= element.selectedAliquotValue
				}
				// newDate.push(el)
			});


		});
		
		
		this.setState({ movedshipementsData: selectedRows, showModal: false, data: data})
		console.log("moveAliquotsToShipment", selectedRows);
	}

	/* Takes samples out of the pending shipment, and adds them back to the
	 * samples table.
	 */
	removeFromShipment() {
		let { data, movedshipementsData } = this.state; 
		
		movedshipementsData.forEach(element => {
			
			// element.selectedAliquotValue = element.selectedAliquotValue.value
			// element.aliquots -= element.selectedAliquotValue;
			data.forEach((el) => {
				if (el.samples_key === element.samples_key) {
					console.log("el found", el);
					el.aliquot_count += element.selectedAliquotValue
				}
			});
			// delete element;
		});
		movedshipementsData.length = 0;
		console.log("data", data);
		console.log("movedshipmentsdata", movedshipementsData);
		

		this.setState({ movedshipementsData: [], data: data })
		
	}
	createJson = async () => {
		let { date, shippingconditions, movedshipementsData,shippingcompany,notes} = this.state;
		let shipment ={}
		let location_ids = await this.getLocationIDByName(this.state.selectedFromOption.value, this.state.selectedToOption.value);
		console.log(location_ids);
		shipment.from_location_id = location_ids.from_location_id;
		shipment.to_location_id = location_ids.to_location_id;
		shipment.shipment_date = date;
		shipment.reached = 2;
		shipment.shipping_conditions = shippingconditions;
		shipment.no_of_samples = movedshipementsData.length;
		shipment.shipping_company = shippingcompany;
		shipment.notes = notes;
		shipment.user_id = localStorage.getItem("user_id");
		console.log("shipment",shipment);

	}
	async getLocationIDByName(from_location, to_location) {
		let locations = []
		locations.push(from_location)
		locations.push(to_location)
		console.log(locations);
		const res = await axios.post(`http://${config.server.host}:${config.server.port}/addshipment/locationIdbyName`, locations)
		console.log("locationIdbyName: ", res.data.results);
		return res.data.results

	}
	save = () => {
		var errors = this.validateForms();

		if (!errors) {
			this.send();
			this.setState({
				date: new Date(),
				from: '',
				to: '',
				storageconditions: '',
				shippingconditions: '',
				//othershippingconditions: '',
				notes: '',
				samplesadded: [],
				alertVisibility: true,
			});
		}
	}

	/* Validate user entered data. */
	validateForms = () => {
		var errorString = '';
		var errors = false;
		console.log("from", this.state.selectedFromOption)
		console.log("to", this.state.selectedToOption)
		console.log("from", this.state.selectedFromOption === null)
		if (this.state.selectedFromOption === null) {
			//console.log("from",this.state.from)
			errors = true;
			errorString = "Please enter the shipment's recipient in the 'From:' field."
		}

		if (this.state.selectedToOption === null) {
			errors = true;
			errorString = "Please enter the shipment's recipient in the 'To:' field."
		}

		if (errors) {
			this.setState({
				alertVariant: 'danger',
				alertText: errorString,
				alertVisibility: true,
			});

			return true;
		} else {
			this.setState({
				alertVariant: 'success',
				alertText: 'Success!',
				alertVisibility: true,
			});

			return false;
		}
	}

	/* Send shipment to database. */
	send() {
		//add to shipment
		this.createJson();
		var sampleIDQuery = "";
		var numberSamplesQuery = "";

		for (var i = 0; i < this.state.samplesadded.length; i++) {
			sampleIDQuery = sampleIDQuery + "id" + (i + 1) + "=" + this.state.samplesadded[i]["key_internal"];

			numberSamplesQuery = numberSamplesQuery + "num" + (i + 1) + "=" + this.state.samplesadded[i]["aliquot_count"];

			if (i < (this.state.samplesadded.length - 1)) {
				sampleIDQuery = sampleIDQuery + "&";
				numberSamplesQuery = numberSamplesQuery + "&";
			}
		}

	};

	/* Converts Date object to a format that can be stored in the SQL database. */
	getDateFormat = (date) => {
		var formattedDate;
		var yyyy = date.getFullYear();
		var mm = String(date.getMonth() + 1).padStart(2, '0');
		var dd = String(date.getDate()).padStart(2, '0');
		formattedDate = yyyy + "-" + mm + "-" + dd;
		return formattedDate;
	}

	render() {
		const { selectedFromOption, selectedRows, selectedAliquotNumber, movedshipementsData ,data} = this.state;
		console.log("data:", data);
		console.log("movedshipementsData:", movedshipementsData);
		var shippingTableRowData = [];

		for (var i = 0; i < this.state.samplesadded.length; i++) {
			shippingTableRowData.push(this.state.samplesadded[i]);
		}

		if (shippingTableRowData.length < this.state.minimumRowsInTable) {
			while (shippingTableRowData.length < this.state.minimumRowsInTable) {
				shippingTableRowData.push('');
			}
		}

		/* This keeps the samples in the order in which they were entered. */
		this.state.samplesvisible.sort(function (a, b) {
			var keyA = a["key_internal"];
			var keyB = b["key_internal"];

			return keyB - keyA;
		});

		return (
			<div>
				{/* {console.log("locations in render ", this.state.locationoptions)} */}
				<Header />
				{this.state.alertVisibility &&
					<CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} />
				}
				<h2 align="left">&nbsp;&nbsp;&nbsp;Create Shipments:</h2>
				<Row>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Date:</InputGroup.Text>
							</InputGroup.Prepend>
							<DatePicker
								className="form-control"
								fixedHeight={false}
								selected={this.state.date}

								onChange={e => this.setState({ date: e })}
							/>
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>From:</InputGroup.Text>
							</InputGroup.Prepend>
							<Select

								label="from"
								placeholder="Select from"
								isSearchable={true}
								value={this.state.selectedFromOption}
								onChange={this.handleIDChange}
								options={this.state.locationoptions}
								styles={this.styles}
							/>
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Shipping Company:</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control
								id="shippingcompany"
								value={this.state.shippingcompany}
								onChange={e => this.setState({ shippingcompany: e.target.value })}>
							</Form.Control>
						</InputGroup>
						{/* <InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Storage conditions:</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control
								id="storageconditions"
								as="select"
								value={this.state.storageconditions}
								onChange={e => this.setState({ storageconditions: e.target.value })}>
								<option>Room</option>
								<option>4° C</option>
								<option>-20° C</option>
								<option>-80° C</option>
							</Form.Control>
						</InputGroup> */}
					</Col>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Shipping Conditions:</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control
								id="shippingconditions"
								as="select"
								value={this.state.shippingconditions}
								onChange={e => this.setState({ shippingconditions: e.target.value })}>
								<option>None</option>
								<option>Dry ice</option>
								<option>Ice packs</option>
							</Form.Control>
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>To:</InputGroup.Text>
							</InputGroup.Prepend>
							<Select

								label="To"
								placeholder="Select To"
								isSearchable={true}
								value={this.state.selectedToOption}
								onChange={this.handleIDChange1}
								options={this.state.locationoptions}
								styles={this.styles}
							/>
						</InputGroup>
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text>Notes:</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="textarea" id="notes"
								value={this.state.notes}
								onChange={e => this.setState({ notes: e.target.value })} />
						</InputGroup>
					</Col>
				</Row>

				<p />

				<div>
					<hr />
					{this.state.filters}
					<Row>
						<Col>
							<ButtonGroup>
								<Button variant="dark" size="lg" onClick={this.addFilter}>Add another filter</Button>
								<Button variant="dark" size="lg" onClick={this.processFilter}>Filter</Button>
								<Button variant="dark" size="lg" onClick={this.clearFilters}>Clear Filter</Button>
								<Button variant="dark" size="lg" onClick={this.save}>Save</Button>
							</ButtonGroup>
						</Col>
						<hr />
					</Row>
					<Col align="right">
						{movedshipementsData.length} samples in shipment
            		    </Col>
				</div>
				<Row>
					<Col>
						<DataTable
							columns={this.columns}
							data={data}
							keyField="sample_key"
							selectableRows
							onSelectedRowsChange={this.handleChange}
							striped={true}
							highlightOnHover
							pagination
						/>
					</Col>
					<Col md="auto">
						<div style={{ padding: 25 }}>
							<Button as="input" value=">>" variant="dark" onClick={this.handleOpenModal}></Button><p />
							<Button as="input" value="<<" variant="dark" onClick={this.removeFromShipment}></Button>
						</div>
					</Col>
					<Col>
						<DataTable
							columns={this.movedshipementscolumns}
							data={movedshipementsData}
							keyField="sample_key"
							selectableRows
							onSelectedRowsChange={this.handleChange}
							striped={true}
							highlightOnHover
							pagination
						/>
					</Col>
				</Row>
				<Modal size="lg" show={this.state.showModal}>

					<Modal.Header>
						<Modal.Title>Add samples to shipment</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Click 'Save' to add all aliquots for each sample you selected to your shipment. Or, specify the number of available aliquots to go to the shipment below.</p>
						{
							selectedRows.map((element, key) => {
								console.log("element,key", element, key);
								let rows = []
								for (let index = 0; index < element.aliquot_count; index++) {
									rows.push({ "value": index + 1, "label": index + 1 })
								}
								return (<>
									<Row>
										<Col><p>Select Number of Aliquots for {element.sample_id} of {element.type}</p></Col>
										<Col><Select
											label="Number of Aliquots"
											placeholder="Number of Aliquots"
											value={element.selectedAliquotValue}
											onChange={e => this.handleAliquotNumberChange(e, key)}
											options={rows}
										/></Col>
									</Row>
								</>)
							})
						}

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
						<Button variant="primary" onClick={this.moveAliquotsToShipment}>Save</Button>
					</Modal.Footer>
				</Modal>
			</div >

		);

	}

}

export default CreateShipments;

