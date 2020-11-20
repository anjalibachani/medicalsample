import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Header from './Header';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
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
            formErrors: {}
        }

    }
    static propTypes = {
        prop: PropTypes
    }

    createJson = () => {
        let child = {}
        for (const [key, value] of Object.entries(this.state)) {
            console.log(typeof value);
            if (key !=='formErrors') {
                child[key] = value
            }

        }
        child['user_id'] = localStorage.getItem("user_id")
        // console.log(child);
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
        if (await this.checkSampleIDAndEval(this.state.eval,this.state.sample_id)) {
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
        // console.log(this.state.formErrors);
        if (Object.keys(this.state.formErrors).length === 0) {
            this.send();
            this.props.history.push('/Home')
        }
    }
    saveAndAddAnother = async () => {
        this.setState({ formErrors: await this.validateForms() })
        // console.log(this.state.formErrors);
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
    checkSampleIDAndEval = async (evl,sample_id) => {
        const res = await axios.get(`http://${config.server.host}:${config.server.port}/samples/checkIDandEval`, { params: { sample_id: sample_id,eval:evl } })
        // console.log(res.data.rows);
        if (res.data.rows===0) {
            return false;
        }
        return true;
    }
    send = async () => {
        const result = this.createJson();
        // console.log(result)
        const res = await axios.post(`http://${config.server.host}:${config.server.port}/child/add`, result);
        // console.log(res.data)
    }
    render() {
        return (
            <div>
                {(() => {
                    if (localStorage.getItem("user_id") !== null) {
                        return (<>
                            <Header />
                            <Container fluid>
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.id_eval}</Form.Text>
                                <Row> <Col className="custom-col" md="auto">
                                    <Form.Text as={Col}className="text-danger">{this.state.formErrors.sample_id}</Form.Text>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>ID:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            id="sample_id"
                                            type="number"
                                            min="0"
                                            oninput="validity.valid||(value='')"
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
                                <Button variant="dark" className="ml-4" size="lg" href="/AddSamples"> Go to Add Samples</Button>
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
