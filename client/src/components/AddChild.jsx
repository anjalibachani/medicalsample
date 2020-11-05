import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Header from './Header';
import CustomAlertBanner from "./CustomAlertBanner";
import { formatISO } from "date-fns";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const config = require('../config/config.json')

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
            alertVisibility: false,
            alertText: 'Please enter all required fields.',
            alertVariant: 'danger',
        }

    }
    static propTypes = {
        prop: PropTypes
    }

    createJson = () => {
        let child = {}
        for (const [key, value] of Object.entries(this.state)) {
            console.log(typeof value);
            if (key != 'alertVisibility' && key != 'alertText' && key != 'alertVariant') {
                child[key] = value
                // if (key === 'date') {
                //     // child[key] = formatISO(value, { representation: 'date' })
                //     child[key] = value
                // }
                // else if (key === 'pb') {
                //     child[key] = (parseFloat(value)).toFixed(1)
                // }
                // else if (key === 'hb') {
                //     child[key] = (parseFloat(value)).toFixed(1)
                // }
                // else if (key === 'density') {
                //     child[key] = (parseFloat(value)).toFixed(3)
                // }
                // else {
                //     child[key] = value
                // }
            }

        }
        console.log(child);
        return child
    }
    validateForms = async () => {
        const regex_pb_hb = /^[0-9]{1,2}(\.[0-9]{1})?$/;
        const regex_density = /^[0-9]{1}(\.[0-9]{3})?$/;
        var errorString = [];
        var errors = false;
        if (this.state.sample_id === '' || this.state.eval === '' || this.state.date === null || this.state.hb === '' || this.state.pb === '' || this.state.density === '') {
            errors = true;
            errorString.push("Please enter all required fields.\n");
        }
        if (await this.checkSampleIDAndEval(this.state.eval,this.state.sample_id)) {
            errors = true;
            errorString.push("ID and Eval combination already exists , please enter different ID and Eval values.\n");
        }
        
        // if (this.state.pb !== '' && (!this.state.pb.match(regex_pb_hb))) {
        //     // if (!this.state.pb[0] === pbBelowDetectable && (!this.state.pb.match(regex_pb_hb))) {
        //         errors = true;
        //         errorString.push("Please enter correct format for Pb .\n");
        //         // errorString.push("Please enter correct format for Pb (typically ranges from  <3.3 to 15).\n");
        //     // }
        // }
        if ((this.state.pb !== '' && !this.state.pb.match(regex_pb_hb)) || (this.state.pb !== '' && !(parseFloat(this.state.pb) >= 3.3 && parseFloat(this.state.pb) <= 15.0))) {
            errors = true;
            errorString.push('Please enter correct format for Pb (typically ranges from 3.3 - 15.0).');
        }    
        if ((this.state.hb !== '' && !this.state.hb.match(regex_pb_hb)) || (this.state.hb !== '' && !(parseFloat(this.state.hb) >= 7.0 && parseFloat(this.state.hb) <= 19.0))) {
                    errors = true;
                    errorString.push("Please enter a valid value for Hb (typcal range between 7.0 - 19.0).\n");
            }     
        if (this.state.density !== '' && (!this.state.density.match(regex_density))) {
            errors = true;
            errorString.push("Please enter correct format for Density (typcal range between 0.000 - 9.999).\n");
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
    saveAndExit = async () => {
        var errors = await this.validateForms();
        if (!errors) {
            this.send();
            this.props.history.push('/Home')
        }
    }
    saveAndAddAnother = async () => {
        var errors = await this.validateForms();
        if (!errors) {
            this.send();
            this.setState({
                sample_id: '',
                eval: '',
                hb: '',
                pb: '',
                density: '',
                alertVisibility: true,
            });
        }
    }
    checkSampleIDAndEval = async (evl,sample_id) => {
        const res = await axios.get(`http://${config.server.host}:${config.server.port}/samples/checkIDandEval`, { params: { sample_id: sample_id,eval:evl } })
        console.log(res.data.rows);
        if (res.data.rows===0) {
            return false;
        }
        return true;
    }
    send = async () => {
        const result = this.createJson();
        console.log(result)
        const res = await axios.post(`http://${config.server.host}:${config.server.port}/child/add`, result);
        console.log(res.data)
    }
    render() {
        return (
            <div>
                {(() => {
                    if (localStorage.getItem("user_id") !== null) {
                        return (<>
                            <Header />
                            {this.state.alertVisibility &&
                                <CustomAlertBanner variant={this.state.alertVariant} text={this.state.alertText} />
                            }
                            <Container fluid>
                                <Row> <Col className="custom-col" md="auto">
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>ID:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            id="sample_id"
                                            type="number"
                                            value={this.state.sample_id}
                                            onChange={e => this.setState({ sample_id: e.target.value })} />
                                    </InputGroup>
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
