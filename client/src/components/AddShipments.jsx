
import React, { Component } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';
import CustomAlertBanner from './CustomAlertBanner'
import Filter from './Filter';
import Select from 'react-select';
import Header from './Header';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DataTable from 'react-data-table-component';
import _ from 'lodash';
import SamplesFilter from './SamplesFilter';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');


class CreateShipments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			date: new Date(),
			from: '',
			storageconditions: '',
			shippingconditions: '',
			to: '',
			notes: '',
			samples: [],
			samplesvisible: [],
			samplesadded: [],
			tubes: [],
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
			filters: [<SamplesFilter key={1} number={1} returnVals={this.getFilterValues} />],
			returnedFilterValues: [],
			alertVisibility: false,
			alertText: 'Please enter all required fields.',
			alertVariant: 'danger',
			toggledClearRows: false
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
	processFilter() {
		for (var i = 1; i <= this.state.filters.length; i++) {

			if (this.state.returnedFilterValues.length) {
				console.log("filters exists")
				console.log(this.state.filters)
				//}
				//check to see if the filter's Type and Value aren't empty
				const [field, condition, value] = this.state.returnedFilterValues[i]
				console.log("in process filter filtercals", field, condition, value);
				const valuearray = value.map(item => item.value)
				//const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));
				try {
					//var filtereddata='';
					if (field === "ID") {
						if (condition === 'equals') {
							var filtereddata = this.state.data.filter(p => valuearray.includes(p.sample_id));
						}
						else if (condition === 'less than') {
							var filtereddata = this.state.data.filter(p => p.sample_id < valuearray[0]);
						}
						else if (condition === 'greater than') {
							var filtereddata = this.state.data.filter(p => p.sample_id > valuearray[0]);
						}
					} else if (field === "Eval") {
						if (condition === 'less than') {
							var filtereddata = this.state.data.filter(p => p.eval < valuearray[0]);
						}
						else if (condition === 'equals') {
							var filtereddata = this.state.data.filter(p => valuearray.includes(p.sample_id));
						}
						else if (condition === 'greater than') {
							var filtereddata = this.state.data.filter(p => p.eval > valuearray[0]);
						}
					} else if (field === "aliquots") {
						if (condition === 'less than') {
							var filtereddata = this.state.data.filter(p => p.eval < valuearray[0]);
						}
						else if (condition === 'equals') {
							var filtereddata = this.state.data.filter(p => valuearray.includes(p.sample_id));
						}
						else if (condition === 'greater than') {
							var filtereddata = this.state.data.filter(p => p.eval > valuearray[0]);
						}
					}
				} catch (err) {
					console.log("filter failed")
				}

				this.setState({ data: filtereddata })
				console.log(filtereddata)
				this.state.data.filter(item => item.field && (item.field < value))
				console.log(this.state.data)
			}
		}
	}
	clearFilters() {
		//window.location.reload(false)
		this.setState({ returnedFilterValues: [] })
		this.setState({ filters: [<SamplesFilter key={1} number={1} returnVals={this.getFilterValues} />] })
		this.getsampledata();
	}
	addFilter() {
		console.log("add filter called")
		var newFilterArray = this.state.filters.concat(<SamplesFilter key={this.state.filters.length + 1} number={this.state.filters.length + 1} returnVals={this.getFilterValues} />);
		this.setState({ filters: newFilterArray });
		console.log(`filters lenght is ${this.state.filters.length}`)
		console.log(this.state.filters)
	};

	getFilterValues = (type, equality, value, key) => {

		console.log("returned values", type, equality, value, key);
		var filterVals = this.state.returnedFilterValues;
		console.log("in get filter values filters", this.state.filters)
		console.log("");
		if (this.state.filters.length > 1) {
			for (let i = 1; i < this.state.filters.length; i++) {
				console.log("returned filter vals:", this.state.returnVals)
				console.log("filtervals vals:", filterVals)
				console.log(i, "th filterval is:", filterVals[i]);
				var addedfilters = this.state.filters
				delete addedfilters[i]
				if (type === filterVals[i][0]) {
					if (filterVals[i][0] === 'equals') {
						this.setState({
							showWarning: true,
							warningText: "ambigious filter, cannot add filters of same type",
							filters: addedfilters
						})
						return;
					} else if (equality === filterVals[i][1]) {
						this.setState({
							showWarning: true,
							warningText: "cannot add duplicate filters, please add unique filters",
							filters: addedfilters
						})
						return;
					}
				}
			}
		}

		filterVals[key] = [type, equality, value];

		this.setState({ returnedFilterValues: filterVals });
	};

	componentDidMount() {
		this.getLocations();
		this.getsampledata();
	}

	handleIDChange = selectedOption => {
		console.log("selected option ", selectedOption)
		this.setState({ selectedFromOption: selectedOption, from: selectedOption });
	}

	handleIDChange1 = selectedOption => {
		console.log("selected option ", selectedOption)
		this.setState({ selectedToOption: selectedOption, to: selectedOption });
	}

	handleAliquotNumberChange = (selectedOption, key) => {
		console.log("selected option ", selectedOption, key)
		let selectedRows = this.state.selectedRows;
		selectedRows[key].selectedAliquotValue = selectedOption;
		this.setState({ selectedAliquotNumber: selectedOption, selectedRows: selectedRows });
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

	handleCloseModal = () => {
		this.setState({ showModal: false });
	}
	handleOpenModal = () => {
		console.log("on modal open: ,", this.state.selectedRows);
		this.setState({ showModal: true });
	}

	handleChange = state => {
		console.log("selected rows", state.selectedRows)
		let selectedRows = state.selectedRows;
		selectedRows.forEach((element, key) => {
			selectedRows[key]["selectedAliquotValue"] = '';
		});
		console.log("selectedRows: ", selectedRows);
		this.setState({ selectedRows: selectedRows });

	};

	moveAliquotsToShipment = () => {
		let { selectedRows, data } = this.state;
		selectedRows.forEach(element => {
			element.selectedAliquotValue = element.selectedAliquotValue.value
			this.state.data.map((el) => {
				if (el.samples_key === element.samples_key) {
					console.log("el found", el);
					el.aliquot_count -= element.selectedAliquotValue
				}
			});
		});
		console.log("data after shipemnst", this.state.data)
		this.setState({ movedshipementsData: selectedRows, showModal: false })
		this.setState({ data: this.state.data })
		console.log("data after shipemnst 3", this.state.data)
	}

	removeFromShipment() {
		let { data, movedshipementsData } = this.state; 
		movedshipementsData.forEach(element => {
			data.forEach((el) => {
				if (el.samples_key === element.samples_key) {
					console.log("el found", el);
					el.aliquot_count += element.selectedAliquotValue
				}
			});
		});
		this.setState({ movedshipementsData: [], data: data })
	}
	createShipmentJson = async () => {
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
		console.log("shipment", shipment);
		return shipment;

	}
	createAliqoutJson = (shipment_id) => {
		let { date, shippingconditions, movedshipementsData, shippingcompany, notes } = this.state;
		let sample_keys = movedshipementsData.map(a => a.samples_key);
		console.log("sample_keys", sample_keys);
		let aliquots = {}
		aliquots.shipment_id = shipment_id;
		aliquots.status_id = 2;
		aliquots.aliquots_samples_key = sample_keys
		console.log("aliquots", aliquots);
		return aliquots;

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
	save = async () => {
		var errors = this.validateForms();

		if (!errors) {
			await this.send();
			this.setState({
				date: new Date(),
				from: '',
				to: '',
				storageconditions: '',
				shippingconditions: '',
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
		}
		return false;
	}
	send = async () => {
		const shipment = await  this.createShipmentJson();
		const res = await axios.post(`http://${config.server.host}:${config.server.port}/addshipment/create`, shipment);
		const aliquots = await this.createAliqoutJson(res.data.results.insertId);
		if (res.data.results.insertId) {
			this.setState({
				alertVariant: 'success',
				alertText: 'Success!',
				alertVisibility: true,
				movedshipementsData: [],
				toggledClearRows: !this.state.toggledClearRows,
				selectedFromOption: null,
				selectedToOption: null
			});
			const res = await axios.post(`http://${config.server.host}:${config.server.port}/addshipment/addshipmentId`, aliquots);
		}
	}
	render() {
		const { selectedFromOption, selectedRows, selectedAliquotNumber, movedshipementsData ,data} = this.state;
		console.log("srender data:", this.state.data);
		// console.log("movedshipementsData:", movedshipementsData);
		var shippingTableRowData = [];

		for (var i = 0; i < this.state.samplesadded.length; i++) {
			shippingTableRowData.push(this.state.samplesadded[i]);
		}

		if (shippingTableRowData.length < this.state.minimumRowsInTable) {
			while (shippingTableRowData.length < this.state.minimumRowsInTable) {
				shippingTableRowData.push('');
			}
		}

		this.state.samplesvisible.sort(function (a, b) {
			var keyA = a["key_internal"];
			var keyB = b["key_internal"];

			return keyB - keyA;
		});

		return (
			<div>
				<Header />
				{this.state.alertVisibility &&
					<CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} />
				}
				
				<h2 align="left">&nbsp;&nbsp;&nbsp;Create Shipments:</h2>
				<hr />
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
				<hr />
				<div>
					{this.state.filters}
					<Row>
						<Col md="auto" className="mt-4">
							<ButtonGroup>
								<Button variant="dark" size="lg" onClick={this.addFilter}>Add another filter</Button>
								<Button variant="dark" size="lg" onClick={this.processFilter}>Filter</Button>
								<Button variant="dark" size="lg" onClick={this.clearFilters}>Clear Filter</Button>
							</ButtonGroup>
						</Col>
						<hr />
					</Row>
					<hr />
					<Col align="right">
						{movedshipementsData.length} samples in shipment
            		    </Col>
				</div>
				<Row>
					<Col>
						<DataTable
							columns={this.columns}
							data={this.state.data}
							keyField="sample_key"
							selectableRows
							onSelectedRowsChange={this.handleChange}
							striped={true}
							highlightOnHover
							pagination
							clearSelectedRows={this.state.toggledClearRows}

						/>
					</Col>
					<Col md="auto">
						<div style={{ padding: 25 }}>
							<Button as="input" value=">>" variant="dark" onClick={this.handleOpenModal}></Button><p />
							<Button as="input" value="<<" variant="dark" onClick={this.removeFromShipment}></Button>
						</div>
					</Col>
					<Col>
						{movedshipementsData.length!==0 &&
							<Button variant="dark" size="lg" onClick={this.save}>Save</Button>
						}
						<DataTable
							columns={this.movedshipementscolumns}
							data={movedshipementsData}
							keyField="sample_key"
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

