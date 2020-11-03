import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import SaveModal from './SaveModal';
import _ from 'lodash';

export default class FormFields extends Component {
    constructor(props) {
        super(props);
        var initialState = {
            show: false,
             data: {}
        }
        this.state = initialState
        
    }
    static propTypes = {
        prop: PropTypes
    }
    clearFields = () => {
        const state = {
            data: _.omit(this.state.data, Object.keys(this.state.data))
          };
          
          this.setState(state, () => {
            this.props.clearFormFields();
          });
    }
    handleClose = () => {
        this.setState({ show: false });
    }
    save = () => {
        this.setState({show:true});
    }
    render() {
        const { fields } = this.props;
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
                                value={this.state.data[item.fieldName]}
                                onChange={e => {
                                    let data = this.state.data;
                                    data[item.fieldName] = e.target.value
                                    this.setState({ data: data })}
                                    } />
                            </InputGroup></Col>)
                    } else if (item.fieldType === "date") {
                        this.state.data[item.fieldName] = new Date()
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <DatePicker
                                className="form-control"
                                fixedHeight={false}
                                selected={this.state.data[item.fieldName]}
                                onChange={e => {
                                    let data = this.state.data;
                                    data[item.fieldName] = e
                                    this.setState({ data: data })}
                                    }
                            />
                        </InputGroup></Col>)
                    } else if (item.fieldType === "select") {
                        this.state.data[item.fieldName] = item.values[0]
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                id={item.fieldName}
                                as="select"
                                value={this.state.data[item.fieldName]}
                                onChange={e => {
                                    let data = this.state.data;
                                    data[item.fieldName] = e.target.value
                                    this.setState({ data: data })}
                                    }>
                                {item.values.map(e => <option>{e}</option>)}
                            </Form.Control>
                        </InputGroup></Col>)
                    } else if (item.fieldType === "checkbox") {
                        return (<Col className ="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Checkbox
                                    id={item.fieldName}
                                    checked={this.state.data[item.fieldName]}
                                    onChange={e => {
                                        let data = this.state.data;
                                        data[item.fieldName] = e.target.checked
                                        this.setState({ data: data })}
                                        } />
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
                                            checked={this.state.data[item]}
                                            onChange={e => {
                                                let data = this.state.data;
                                                data[item.fieldName] = e.target.checked
                                                this.setState({ data: data })}
                                                } />
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
                 </>
                :
                null}
                 <SaveModal handleClose={this.handleClose} data={this.state.data} show={this.state.show} />
            </div>
        )
    }
}
