import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs } from 'react-bootstrap';
import FormFields from './FormFields';

const sampleTypes = require("../config/types.json");

export default class CustomTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: ''
        };
    }
    static propTypes = {
        prop: PropTypes
    }
    render() {
        const { tabs } = this.props;
        return (
            <div>
                <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={key => this.setState({ key })} >
                    {
                        tabs.map(item => {
                            return (<Tab eventKey={item.key.value} title={item.key.value}>
                                <FormFields fields={item.val} />
                            </Tab>)
                        })
                    }
                </Tabs>
            </div>
        )
    }
}
