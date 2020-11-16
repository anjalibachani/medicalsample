import React from 'react';
import './Login.css';
import Axios from 'axios';
import CustomAlertBanner from "./CustomAlertBanner";

import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl,Modal } from 'react-bootstrap';
// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');


class forgotpass extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email_id : "",
            error : "",
            alertVisibility: false,
            alertText: 'Please enter all required fields.',
            alertVariant: 'danger',
        }
        this.handleEmailchange = this.handleEmailchange.bind(this);
        this.handleforgotpass = this.handleforgotpass.bind(this);
    }

    handleEmailchange(e){
        this.setState({
            email_id:e.target.value,
            alertVisibility:false
        })
    }

    redirectToLogin = ()=>{
        console.log("in redirect in forgot pass")
        this.props.history.push('/login')
    }

    handleforgotpass =async e=>{
        
        if(this.state.email_id){
            e.preventDefault();
            console.log(`before ${this.state.email_id}`);
            Axios.post(`http://${config.server.host}:${config.server.port}/api/forgot-password`,{email_id:this.state.email_id}).then((response)=>{
                console.log(response)
                if(response.status === 200){
                    console.log("received 200 OK");
                    this.redirectToLogin()
                    
                }
                else{
                    this.setState({
                        alertVisibility:true,
                        alertText:response.data.message
                    })
                    console.log("forgot pass request failed")
                }
            });
        }
        else{
            this.setState({
                alertVisibility:true,
                alertText:"Invalid email Id"
            })
            return this.setState({error: 'Enter valid email id'})
        }
    };

    render(){
        return(
            <div className="login">
                <div className="forgot-form">
                <h1>Salud Ambiental Montevideo</h1>
                <div className="login_form">
                    {this.state.alertVisibility && (
                        <CustomAlertBanner
                        variant={this.state.alertVariant}
                        text={this.state.alertText}
                        />
                    )}
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={this.state.email_id}
                            onChange={this.handleEmailchange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicButton">
                            <Button
                                className="mr-1"
                                type="submit"
                                onClick={this.handleforgotpass}
                            >
                            Send Reset Link
                            </Button>
                        </Form.Group>
                    </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default forgotpass;