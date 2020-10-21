import React from 'react';
import './Login.css';
import Axios from 'axios';
const config = require('../config/config.json')

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
                Axios.post(`http://${config.server.host}:${config.server.port}/api/reset-password/${this.state.resetid}`,{email_id:this.state.email_id}).then((response)=>{
                    if(response.status === 200){
                        console.log("received 200 OK");
                        
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
                    <div classname="diplay-alert">
                        {this.state.alertVisibility &&<p class="warning">{this.state.alertText}</p>}
                    </div>
                    <div id="field">
                        {/* <label>Email ID</label> */}
                        <input id = "input" type="password" placeholder="enter new password" value={this.state.handlePassword} onChange={this.handlePassword}/>
                    </div>
                    <div>
                    <input id = "input" type="password" placeholder="confirm password" value={this.state.handlePassword} onChange={this.handleConfirmPassword}/>
                    </div>
                    <input id = "forgotpass" type="submit" value="send reset link" onClick={this.handleReset}/>
                </div>
            </div>
        )
    }
}

export default resetpass;