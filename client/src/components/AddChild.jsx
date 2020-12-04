import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Header from './Header';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import CustomAlertBanner from './CustomAlertBanner';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

const columns = [
    {
        name: "Child ID",
        selector: "sample_id",
        sortable: true
    },
    {
        name: "Eval",
        selector: "eval",
        sortable: true
    },
    {
        name: "Hb",
        selector: "hb",
        sortable: true
    },
    {
        name: "Pb",
        selector: "pb",
        sortable: true
    },
    {
        name: "Density",
        selector: "density",
        sortable: true
    }
];
const customStyles = {
    headCells: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
    rows: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
        },
    },
};
const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  color: white;
  background: black;
  size="lg";
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (

    <>
        <TextField id="search" type="text" placeholder="Search Child" aria-label="Search Input" value={filterText} onChange={onFilter} />
        <ClearButton type="button" onClick={onClear}>X</ClearButton>
    </>
);
export default class AddChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sample_id: '',
            eval: '',
            date: new Date(),
            hb: '',
            pb: '',
            density: '',
            formErrors: {},
            data: [],
            filterText: '',
            alertVisibility: false,
            alertText: 'Child added successfully.',
            alertVariant: 'success',
        }

    }
    static propTypes = {
        prop: PropTypes
    }
    componentDidMount() {
        this.getChildData();
    }
    getChildData = () => {
        axios.get(`http://${config.server.host}:${config.server.port}/child/all`, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
            this.setState({
                data: response.data.results
            });
        })
    }
    getSubHeaderComponent = () => {
        return (
            <FilterComponent
                onFilter={(e) => {
                    let newFilterText = e.target.value;

                    this.filteredItems = this.state.data.filter(
                        (item) => {
                            item.sample_id &&
                                JSON.stringify(item).toLowerCase().includes(newFilterText.toLowerCase())
                        }

                    );
                    this.setState({ filterText: newFilterText });
                }}
                onClear={this.handleClear}
                filterText={this.state.filterText}
            />
        );
    };
    createJson = () => {
        let child = {}
        let { sample_id, date, hb, pb, density } = this.state;
        child.sample_id = sample_id;
        child.eval = this.state.eval;
        child.date = date;
        child.hb = hb;
        child.pb = pb;
        child.density = density;
        // for (const [key, value] of Object.entries(this.state)) {
        //     if (key !== 'formErrors' && key !== 'data' && key !== 'filterText') {
        //         child[key] = value
        //     }

        // }
        child.user_id = localStorage.getItem("user_id");
        return child
    }
    validateForms = async () => {
        const regex_pb_hb = /^[0-9]{1,2}(\.[0-9]{1})?$/;
        const regex_density = /^[0-9]{1}(\.[0-9]{3})?$/;
        let errorsObj = {};
        if (this.state.sample_id === '') {
            errorsObj.sample_id = "Please Enter ID"
        }
        if (this.state.eval === '') {
            errorsObj.eval = "Please Enter Eval"
        }
        if (this.state.date === null) {
            errorsObj.date = "Please Enter Date"
        }
        if (this.state.hb === '') {
            errorsObj.hb = "Please Enter Hb"
        }
        if (this.state.pb === '') {
            errorsObj.pb = "Please Enter Pb"
        }
        if (this.state.density === '') {
            errorsObj.density = "Please Enter Density"
        }
        if ((this.state.eval !== '' && !(parseInt(this.state.eval) > 0))) {
            errorsObj.eval = "Please Enter Valid Eval (typically > 0)";
        }
        if ((this.state.sample_id !== '' && !(parseInt(this.state.sample_id) > 0))) {
            errorsObj.sample_id = "Please Enter Valid ID (typically > 0)";
        }


        if (await this.checkSampleIDAndEval(this.state.eval, this.state.sample_id)) {
            errorsObj.id_eval = `Please enter different ID and Eval values OR Goto Add Samples for this child with ID: ${this.state.sample_id}`
        }
        if ((this.state.pb !== '' && !this.state.pb.match(regex_pb_hb)) || (this.state.pb !== '' && !(parseFloat(this.state.pb) >= 3.3 && parseFloat(this.state.pb) <= 15.0))) {
            errorsObj.pb = "Please Enter correct format for Pb (typically ranges from 3.3 - 15.0)";
        }
        if ((this.state.hb !== '' && !this.state.hb.match(regex_pb_hb)) || (this.state.hb !== '' && !(parseFloat(this.state.hb) >= 7.0 && parseFloat(this.state.hb) <= 19.0))) {
            errorsObj.hb = "Please Enter a valid value for Hb (typcal range between 7.0 - 19.0)";
        }
        if (this.state.density !== '' && (!this.state.density.match(regex_density))) {
            errorsObj.density = "Please Enter correct format for Density (typcal range between 0.000 - 9.999)";
        }
        return errorsObj;
    }
    saveAndExit = async () => {
        this.setState({ formErrors: await this.validateForms() })
        if (Object.keys(this.state.formErrors).length === 0) {
            this.send();
            setTimeout(() => {
                this.props.history.push('/Home');
            }, 5000)
        }
    }
    saveAndAddSamples = async () => {
        this.setState({ formErrors: await this.validateForms() })
        if (Object.keys(this.state.formErrors).length === 0) {
            this.send();
            setTimeout(() => {
                this.props.history.push({
                    pathname: '/AddSamples',
                    state: { "sample_id": this.state.sample_id, "eval": this.state.eval }
                });
            }, 5000)
        }
    }
    saveAndAddAnother = async () => {
        this.setState({ formErrors: await this.validateForms() })
        if (Object.keys(this.state.formErrors).length === 0) {
            this.send();
            this.setState({
                sample_id: '',
                eval: '',
                hb: '',
                pb: '',
                density: '',
                formErrors: {}
            });
        }
    }
    checkSampleIDAndEval = async (evl, sample_id) => {
        const res = await axios.get(`http://${config.server.host}:${config.server.port}/samples/checkIDandEval`, { params: { sample_id: sample_id, eval: evl } }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } })
        if (res.data.rows === 0) {
            return false;
        }
        return true;
    }
    send = async () => {
        const result = this.createJson();
        const res = await axios.post(`http://${config.server.host}:${config.server.port}/child/add`, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }, result);
        this.setState({
            alertVisibility: true,
        });
    }


    resestToken = () => {
        axios.post(`http://${config.server.host}:${config.server.port}/api/resettoken`, { user_id: localStorage.getItem("user_id") }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
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
        const { data, email_id, admin } = this.state;
        const filteredItems = data.filter(item => item.sample_id && JSON.stringify(item).toLowerCase().includes(this.state.filterText.toLowerCase()));
        {
            if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now() + 600000))
                this.resestToken()
        }
        return (
            <div>
                {(() => {
                    if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now())) {
                        return (<>
                            <Header />
                            {this.state.alertVisibility &&
                                <CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} />
                            }
                            <Container fluid>
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.id_eval}</Form.Text>
                                <Row> <Col className="custom-col" md="auto">
                                    <Form.Text as={Col} className="text-danger">{this.state.formErrors.sample_id}</Form.Text>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>ID:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            id="sample_id"
                                            type="number"
                                            min="0"
                                            value={this.state.sample_id}
                                            onChange={e => this.setState({ sample_id: e.target.value })} />
                                    </InputGroup>
                                    <Form.Text as={Col} className="text-danger">{this.state.formErrors.eval}</Form.Text>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Eval:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            id="eval"
                                            type="number"
                                            value={this.state.eval}
                                            onChange={e => this.setState({ eval: e.target.value })} />
                                    </InputGroup>
                                    <Form.Text as={Col} className="text-danger">{this.state.formErrors.date}</Form.Text>
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
                                </Col>
                                    <Col>
                                        <Form.Text as={Col} className="text-danger">{this.state.formErrors.pb}</Form.Text>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Pb:</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                id="pb"
                                                type="number"
                                                step="0.1"
                                                value={this.state.pb}
                                                onChange={e => this.setState({ pb: e.target.value })} />
                                        </InputGroup>
                                        <Form.Text as={Col} className="text-danger">{this.state.formErrors.hb}</Form.Text>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Hb:</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                id="hb"
                                                type="number"
                                                step="0.1"
                                                value={this.state.hb}
                                                onChange={e => this.setState({ hb: e.target.value })} />
                                        </InputGroup>
                                        <Form.Text as={Col} className="text-danger">{this.state.formErrors.density}</Form.Text>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Density:</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                id="density"
                                                type="number"
                                                step="0.001"
                                                value={this.state.density}
                                                onChange={e => this.setState({ density: e.target.value })} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <hr />
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.saveAndExit}> Save and Exit</Button>
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.saveAndAddAnother}> Save and add another</Button>
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.saveAndAddSamples}>Save and Add Samples</Button>

                                <DataTable className="block-example border border-dark rounded mb-0"
                                    columns={columns}
                                    data={filteredItems}
                                    keyField="samples_key"
                                    striped={true}
                                    highlightOnHover
                                    pointerOnHover
                                    pagination
                                    defaultSortField="sample_id"
                                    defaultSortAsc={true}
                                    customStyles={customStyles}
                                    onSelectedRowsChange={this.handleChange}
                                    subHeader
                                    persistTableHead
                                    subHeaderComponent={this.getSubHeaderComponent()}
                                />
                            </Container>
                        </>)
                    } else {
                        return (<Redirect to="/login" />)
                    }
                })()}
            </div>
        )
    }
}
