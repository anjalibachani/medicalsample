import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Header from './Header';
import { formatISO } from "date-fns";
import axios from 'axios';

const child = require("../config/child.json");

export default class AddChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sample_id: '',
            eval: '',
            date: new Date(),
            hb: '',
            pb: '',
            density: ''
        }

    }
    static propTypes = {
        prop: PropTypes
    }
    createJson = () => {
        let child = {}
        for (const [key, value] of Object.entries(this.state)) {
            if (key === 'date') {
                child[key] = formatISO(value, { representation: 'date' })
            }
            else {
                child[key] = value
            }
        }
        return child
    }
    saveAndExit = async () => {
        const result = this.createJson();
        const res = await axios.post('http://localhost:5000/child/add', result);
        console.log(res.data.json)

    }
    saveAndAddAnother = () => {
        console.log(this.state);
    }
    render() {
        return (
            <div>
                <Header />
                <Container fluid>
                    <Row> <Col className="custom-col" md="auto">
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>ID:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id="sample_id"
                                value={this.state.sample_id}
                                onChange={e => this.setState({ sample_id: e.target.value })} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Eval:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id="eval"
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
                                    value={this.state.pb}
                                    onChange={e => this.setState({ pb: e.target.value })} />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Hb:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    id="hb"
                                    value={this.state.hb}
                                    onChange={e => this.setState({ hb: e.target.value })} />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Density:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    id="density"
                                    value={this.state.density}
                                    onChange={e => this.setState({ density: e.target.value })} />
                            </InputGroup>
                        </Col>
                    </Row>
                    <hr />
                    <Button className="ml-4" size="lg" onClick={this.saveAndExit}> Save and Exit</Button>
                    <Button className="ml-4" size="lg" onClick={this.saveAndAddAnother}> Save and add another</Button>
                    <Button className="ml-4" size="lg" href="/AddSamples"> Go to Add Samples</Button>
                </Container>
            </div>
        )
    }
}
