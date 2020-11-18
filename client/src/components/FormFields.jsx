import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
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
        console.log();
    }
    render() {
        const { fields,data, index} = this.props;
        // console.log("data",data);
        // console.log("data state: ", this.state);
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
                                    value={data[item.fieldName]}
                                    onChange={e =>
                                        this.props.handleTextChange(e.target.value, item.fieldName, index)
                                    } />
                            </InputGroup></Col>)
                    } else if (item.fieldType === "number") {
                        return (<Col className="custom-col" md="auto">
                            <InputGroup className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    id={item.fieldName}
                                    value={data[item.fieldName]}
                                    type="number"
                                    onChange={e =>
                                        this.props.handleTextChange(e.target.value, item.fieldName, index)
                                    } />
                            </InputGroup>
                            <Form.Text as={Col} className="text-danger">{item.fieldError}</Form.Text>
                            </Col>)
                    }else if (item.fieldType === "date") {
                        // data[item.fieldName] = new Date()
                        // console.log(data[item.fieldName].toISOString().split('T')[0]);
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <DatePicker
                                className="form-control"
                                fixedHeight={false}
                                selected={data[item.fieldName]}
                                onChange={e => this.props.handleTextChange(e, item.fieldName, index) }
                            />
                        </InputGroup></Col>)
                    } else if (item.fieldType === "select") {
                        // this.state.data[item.fieldName] = item.values[0]
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                id={item.fieldName}
                                as="select"
                                value={data[item.fieldName]}
                                onChange={e => this.props.handleTextChange(e.target.value, item.fieldName, index)}>
                                {item.values.map((e, k) => <option key={k}>{e}</option>)}
                            </Form.Control>
                        </InputGroup></Col>)
                    } else if (item.fieldType === "checkbox") {
                        return (<Col className ="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Checkbox
                                    id={item.fieldName}
                                    checked={data[item.fieldName]}
                                    onChange={e => this.props.handleCheckBoxChange(e.target.checked, item.fieldName, index)} />
                            </InputGroup.Prepend>
                            <Form.Control value={item.fieldName} />
                    </InputGroup></Col>)
                    } else if (item.fieldType === "multicheckbox") {
                        return (<Col className="custom-col" md="auto"><InputGroup className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            {item.values.map((val, key) => {
                                // console.log("item", val);
                                return (
                                    <InputGroup key={key}>
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox
                                                id={val}
                                                checked={data[val]}
                                                onChange={e => this.props.handleCheckBoxChange(e.target.checked,val,index) } />
                                        </InputGroup.Prepend>
                                        <Form.Control value={val} />
                                    </InputGroup>
                                )
                            }
                                
                            )}
                </InputGroup></Col>)
                    }
                })}
                    </Row>
                </Container>
                <hr />
                {/* {flag ?
                <>
                    <Button className="ml-2" variant="outline-dark" size="lg"  onClick={this.clearFields}> Clear</Button>
                    <Button className="ml-4" variant="primary" size="lg" disabled={false} onClick={this.save} > Save </Button>
                 </>
                :
                null} */}
                 <SaveModal handleClose={this.handleClose} data={this.state.data} show={this.state.show} />
            </div>
        )
    }
}
