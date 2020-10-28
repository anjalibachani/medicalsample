import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import SaveModal from './SaveModal';


export default class FormFields extends Component {
    constructor(props) {
        super(props);
        var initialState = {
            show: false
        }
        this.state = initialState
        
    }
    static propTypes = {
        prop: PropTypes
    }
    clearFields = () => {
        this.props.clearFormFields();
        var initialState1 = {
            show: false
        }
        this.setState({ initialState1 });
    }
    handleClose = () => {
        this.setState({ show: false });
    }
    save = () => {
        this.setState({show:true});
    }
    render() {
        const { fields } = this.props;
        const { sampleType } = this.props;
        console.log("sampleType",sampleType);
        console.log("state in formfields: ", this.state);
        return (
            <div>
                <Container fluid>
                    <Row>
                {fields.map(item => {
                    if (item.fieldType === "text") {
                        return (<Col className ="custom-col" md="auto">
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id={item.fieldName}
                                value={this.state[item.fieldName]}
                                onChange={e => this.setState({ [item.fieldName]: e.target.value })} />
                            </InputGroup></Col>)
                    } else if (item.fieldType === "date") {
                        this.state[item.fieldName] = new Date()
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <DatePicker
                                className="form-control"
                                fixedHeight={false}
                                selected={this.state[item.fieldName]}
                                onChange={e => this.setState({ [item.fieldName]: e })}
                            />
                        </InputGroup></Col>)
                    } else if (item.fieldType === "select") {
                        this.state[item.fieldName] = item.values[0]
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                id={item.fieldName}
                                as="select"
                                value={this.state[item.fieldName]}
                                onChange={e => this.setState({ [item.fieldName]: e.target.value })}>
                                {item.values.map(e => <option>{e}</option>)}
                            </Form.Control>
                        </InputGroup></Col>)
                    } else if (item.fieldType === "checkbox") {
                        return (<Col className ="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Checkbox
                                    id={item.fieldName}
                                    checked={this.state[item.fieldName]}
                                    onChange={e => this.setState({ [item.fieldName]: e.target.checked })} />
                            </InputGroup.Prepend>
                            <Form.Control value={item.fieldName} />
                    </InputGroup></Col>)
                    } else if (item.fieldType === "multicheckbox") {
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            {item.values.map(item =>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Checkbox
                                            id={item}
                                            checked={this.state[item]}
                                            onChange={e => this.setState({ [item]: e.target.checked })} />
                                    </InputGroup.Prepend>
                                    <Form.Control value={item} />
                                </InputGroup>
                            )}
                </InputGroup></Col>)
                    }
                })}
                    </Row>
                </Container>
                <hr />
                {fields.length != 0 ?
                <>
                    <Button className="ml-2" variant="outline-dark" size="lg"  onClick={this.clearFields}> Clear</Button>
                    <Button className="ml-4" variant="primary" size="lg" disabled={false} onClick={this.save} > Save </Button>
                    <SaveModal handleClose={this.handleClose} data={this.state} />
                 </>
                :
                null}
            </div>
        )
    }
}
