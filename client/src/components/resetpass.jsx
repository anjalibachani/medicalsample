import React from 'react';
import './Login.css';
import Axios from 'axios';
import CustomAlertBanner from "./CustomAlertBanner";
import { Button,Form} from 'react-bootstrap';
// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

class resetpass extends React.Component{
    
    constructor(props){
        console.log(props.match.params.id);
        super(props)
        this.state={
            password: "",
            confirmPassword:"",
            error : "",
            resetid:props.match.params.id,
            alertVisibility: false,
            alertText: 'Please enter all required fields.',
            alertVariant: 'danger',
        }
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword= this.handleConfirmPassword.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handlePassword(e){
        this.setState({
            password:e.target.value,
            alertVisibility:false,
        })
    }

    redirectToLogin = ()=>{
        console.log("in redirect in forgot pass")
        this.props.history.push('/login')
    }

    handleConfirmPassword(e){
        this.setState({
            confirmPassword:e.target.value,
            alertVisibility:false
        })
    }

    handleReset =async e=>{
        if(this.state.password && this.state.confirmPassword){
            e.preventDefault();
            if(this.state.password===this.state.confirmPassword){
                console.log(`before ${this.state.email_id}`);
                console.log(this.resetid)
                Axios.post(`http://${config.server.host}:${config.server.port}/api/reset-password/${this.state.resetid}`,{password:this.state.password}).then((response)=>{
                    console.log(response)
                    if(response.status === 200){
                        console.log("received 200 OK");
                        this.redirectToLogin()
                    }
                    else if(response.status === 401){
                        this.setState({
                            alertVisibility:true,
                            alertText: response.data.message
                        })
                    }
                    else{
                        this.setState({
                            alertVisibility:true,
                            alertText: response.data.message
                        })
                        console.log("forgot pass request failed")
                    }
                });
            }else{
                this.setState({
                    alertVisibility:true,
                    alertText:"passwords doesn't match"
                })
                console.log("passwords doesnt match")
            }
        }
        else{
            this.setState({
                alertVisibility:true,
            })
            alert(`fill all the fields`)
            return this.setState({error: 'Enter valid email id'})
        }
    };

    render(){
        return(
            <div className="login">
                <div className="reset-form">
                <h1>Salud Ambiental Montevideo</h1>
                <div className="login_form">
                {this.state.alertVisibility && (
                        <CustomAlertBanner
                        variant={this.state.alertVariant}
                        text={this.state.alertText}
                        />
                    )}
                    <Form>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handlePassword}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="confirm Password"
                                value={this.state.confirmPassword}
                                onChange={this.handleConfirmPassword}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicButton">
                            <Button
                                className="mr-1"
                                type="submit"
                                onClick={this.handleReset}
                            >
                            Reset Password
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
                </div>
            </div>
        )
    }
}

export default resetpass;