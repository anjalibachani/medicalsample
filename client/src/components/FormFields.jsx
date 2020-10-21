import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl,Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import SaveModal from './SaveModal';

const initialState = {
};
export default class FormFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    static propTypes = {
        prop: PropTypes
    }
    clearFields = () => {
        this.props.clearFormFields();   
    }
    handleClose = () => {
        this.setState({ show: false });
    }
    save = () => {
        this.setState({show:true});
    }
    render() {
        const { fields } = this.props;
        const { show } = this.state;
        console.log(this.state);
        return (
            <div>
                {fields.map(item => {
                    if (item.fieldType === "text") {
                        return (
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id={item.fieldName}
                                value={this.state[item.fieldName]}
                                onChange={e => this.setState({ [item.fieldName]: e.target.value })} />
                        </InputGroup>)
                    } else if (item.fieldType === "date") {
                        return (<InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <DatePicker
                                className="form-control"
                                fixedHeight={false}
                                selected={this.state[item.fieldName]}
                                onChange={e => this.setState({ [item.fieldName]: e })}
                            />
                        </InputGroup>)
                    } else if (item.fieldType === "select") {
                        return (<InputGroup className="mb-3">
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
                        </InputGroup>)
                    } else if (item.fieldType === "checkbox") {
                        return (<InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Checkbox
                                    id={item.fieldName}
                                    checked={this.state[item.fieldName]}
                                    onChange={e => this.setState({ [item.fieldName]: e.target.checked })} />
                            </InputGroup.Prepend>
                            <Form.Control value={item.fieldName} />
                        </InputGroup>)
                    } else if (item.fieldType === "multicheckbox") {
                        return (<InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>{item.fieldName}</InputGroup.Text>
                            </InputGroup.Prepend>
                            {item.values.map(item =>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Checkbox
                                            id={item}
                                            checked={this.state[item.fieldName[item]]}
                                            onChange={e => this.setState({
                                                [item.fieldName]:{
                                                    [item]: e.target.checked 
                                                }
                                            })} />
                                    </InputGroup.Prepend>
                                    <Form.Control value={item} />
                                </InputGroup>
                            )}
                        </InputGroup>)
                    }
                })}
                <hr />
                <div>
                    <Button variant="outline-dark" size="lg" onClick={this.clearFields}> Clear</Button>
                    <Button variant="primary" size="lg" onClick={this.save} >
                        Save
                    </Button>
                    <SaveModal handleClose={this.handleClose} data={this.state}/> 
                </div>
            </div>
        )
    }
}
