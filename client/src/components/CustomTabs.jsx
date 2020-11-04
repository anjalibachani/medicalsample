import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Button } from 'react-bootstrap';
import FormFields from './FormFields';
import _ from 'lodash';


export default class CustomTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: 0,
            data: {}
        };
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
        
    }
    save = () => {
        
    }
    render() {
        const { tabs } = this.props;
        const { data } = this.state;
        console.log(data);
        var size = Object.keys(tabs).length;
        console.log("size", size);
        return (
            <Container fluid>
                {
                    tabs.map((item, index) => {
                        return (<><h4 className="text-dark">{item.key.value} Sample:</h4><br />
                             <FormFields fields={item.val} size={size} /></>
                            )
                    })
                }
                {size != 0 ?
                    <>
                        <Button className="ml-2" variant="outline-dark" size="lg" onClick={this.clearFields}> Clear</Button>
                        <Button className="ml-4" variant="primary" size="lg" disabled={false} onClick={this.save}> Save </Button>
                    </>
                    :
                    null}
            </Container>
        )
    }
}
