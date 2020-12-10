import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputGroup, FormControl, Row, Col, Container } from 'react-bootstrap';

import Select from 'react-select';
import axios from 'axios';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

export default class SamplesFilter extends Component {
    static propTypes = {
        prop: PropTypes
    }
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            multiValue: [],
            selectedIdOption: { value: '', label: '' },
            selectedeqOption: { value: '', label: '' },
            sampleIdOptions: [],
            setwarning: false,
            sampleEvalOptions: [{ value: '1', label: '1' }],
            sampleAliquotOptions: [{ value: '2', label: '2' }],
            sampleIdOptions: [],
        }
    }
    componentDidMount() {
        this.getsampleIdOptions();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.fromLocation !== prevProps.fromLocation) {
            this.getFilterOptsForShipment(this.props.fromLocation);
        }
    }
    async getFilterOptsForShipment(fromLocation) {
        const response = await axios.get(`http://${config.server.host}:${config.server.port}/addshipment/filterOpts`, { params: { fromLocation: fromLocation } }   )
        const idoptions = response.data.map(item => ({ value: item.sample_id, label: item.sample_id }))
        const evaloptions = response.data.map(item => ({ value: item.eval, label: item.eval }))
        const aliquotoptions = response.data.map(item => ({ value: item.aliquot_count, label: item.aliquot_count }))
        this.setState({
            sampleIdOptions: idoptions,
            sampleEvalOptions: evaloptions,
            sampleAliquotOptions: aliquotoptions
        });

    }
    async getsampleIdOptions() {
        axios.get(
            `http://${config.server.host}:${config.server.port}/api/getUniqueIds`, {
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        }
        ).then((response) => {
            //console.log("resp data in unique", response.data);
            let ids = Array.from(new Set(response.data.map(item => item.sample_id)))
            let evals = Array.from(new Set(response.data.map(item => item.eval)))
            let aliquots = Array.from(new Set(response.data.map(item => item.aliquot_count)))

            //console.log("ids", ids,"evals", evals, "aliquots", aliquots)

            const idoptions = ids.map(item => ({ value: item, label: item }))
            const evaloptions = evals.map(item => ({ value: item, label: item }))
            const aliquotoptions = aliquots.map(item => ({ value: item, label: item }))

            this.setState({
                sampleIdOptions: idoptions,
                sampleEvalOptions: evaloptions,
                sampleAliquotOptions: aliquotoptions
            });
        });

    }
    handleIDChange = selectedOption => {
        this.setState({ selectedIdOption: selectedOption })

    }

    handleeqChange = async selectedOption => {
        await this.setState({ selectedeqOption: selectedOption })
        //console.log("id selected:", this.state.selectedIdOption.value);
        //console.log("eq selected:", this.state.selectedeqOption);
        //console.log("option selected:",selectedOption);
        if (this.state.selectedIdOption.value === 'ID') {
            this.setState({ sampleOptions: this.state.sampleIdOptions })
        }
        else if (this.state.selectedIdOption.value === 'Eval') {
            this.setState({ sampleOptions: this.state.sampleEvalOptions })
        } else if (this.state.selectedIdOption.value === 'Aliquots') {
            this.setState({ sampleOptions: this.state.sampleAliquotOptions })
        }
        this.props.returnVals(this.state.selectedIdOption.value, this.state.selectedeqOption, this.state.multiValue, this.props.number);
    }
    handleValChange = async selectedOption => {
        if (isNaN(selectedOption.target.value)) {
            this.setState({ setwarning: true })
        } else if (parseInt(selectedOption.target.value, 10) < 0) {
            this.setState({ setwarning: true })
        } else {
            this.setState({ setwarning: false })
            var a = []
            const parsedint = parseInt(selectedOption.target.value, 10)
            a = [{ value: parsedint, label: parsedint }];
            await this.setState({ multiValue: a })
            //console.log("props in valchange",this.props)
            //console.log("this.state.selectedoption", parsedint)
            this.props.returnVals(this.state.selectedIdOption.value, this.state.selectedeqOption.value, this.state.multiValue, this.props.number);
        }

    }

    onChange = async (value, { action, removedValue }) => {
        //console.log("OnChange: ", value , action, removedValue, "@");
        await this.setState({ multiValue: value });
        this.props.returnVals(this.state.selectedIdOption.value, this.state.selectedeqOption.value, this.state.multiValue, this.props.number);
    }

    render() {
        const idoptions = [
            { value: 'ID', label: 'ID' },
            { value: 'Eval', label: 'Eval' },
            { value: 'Aliquots', label: 'Aliquots' }];
        const equalityoptions = [{ value: 'equals', label: 'equals' },
        { value: 'greater than', label: 'greater than' },
        { value: 'less than', label: 'less than' }]
        const { selectedIdOption, selectedeqOption } = this.state
        return (
            <div>
                <Container>
                    {this.state.setwarning === true && <p>enter valid positive integer</p>}
                    <Row className="mt-2">
                        {/* {this.props.fromLocation && */}
                        < Col md="4">
                            <Select
                                label="Filter Type"
                                placeholder="filter type"
                                isSearchable={true}
                                value={this.state.selectedIdOption}
                                onChange={this.handleIDChange}
                                options={idoptions}
                            />
                        </Col>
                        {/* } */}
                        {selectedIdOption.value === '' ? null :
                            <Col md="4">
                                <Select
                                    label="filter condition"
                                    placeholder="Select condition"
                                    isSearchable={true}
                                    value={this.state.selectedeqOption}
                                    onChange={this.handleeqChange}
                                    options={equalityoptions}
                                />
                            </Col>
                        }
                        {this.state.selectedeqOption.value === "equals" ?
                            <Col md="4">
                                <Select
                                    label="filter values"
                                    placeholder="filter values"
                                    isSearchable={true}
                                    isMulti
                                    value={this.state.multiValue}
                                    onChange={this.onChange}
                                    options={this.state.sampleOptions}
                                //options={this.state.selectedIdOption==='ID'?this.state.sampleIdOptions:(this.state.selectedIdOption==='Eval'?this.state.sampleEvalOptions:this.state.selectedIdOption)}	
                                />
                            </Col>
                            : null}
                        {this.state.selectedeqOption.value === 'greater than' || this.state.selectedeqOption.value === 'less than' ?
                            (
                                <Col md="4">
                                    <InputGroup>
                                        <FormControl
                                            label="filter values"
                                            placeholder="filter values"
                                            type="number"
                                            value={this.state.value}
                                            onChange={this.handleValChange}
                                        />
                                    </InputGroup>
                                </Col>
                            ) : null
                        }
                    </Row>
                </Container>
            </div >
        )
    }
}
