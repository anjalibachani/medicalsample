import React from 'react';
import './Login.css';
import Axios from 'axios';
const config = require('../config/config.json')

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

    handleforgotpass =async e=>{
        
        if(this.state.email_id){
            e.preventDefault();
            console.log(`before ${this.state.email_id}`);
            Axios.post(`http://${config.server.host}:${config.server.port}/api/forgot-password`,{email_id:this.state.email_id}).then((response)=>{
                console.log(response)
                if(response.status === 200){
                    console.log("received 200 OK");
                    alert("reset requested");
                    
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
            alert(`Enter email`)
            return this.setState({error: 'Enter valid email id'})
        }
    };

    render(){
        return(
            <div className="login">
                <div className="forgot-form">
                    <div classname="diplay-alert">
                        {this.state.alertVisibility &&<p class="warning">{this.state.alertText}</p>}
                    </div>
                    <div id="field">
                        {/* <label>Email ID</label> */}
                        <input id = "input" type="email" placeholder="enter email id" value={this.state.email_id} onChange={this.handleEmailchange}/>
                    </div>
                    <input id = "forgotpass" type="submit" value="send reset link" onClick={this.handleforgotpass}/>
                </div>
            </div>
        )
    }
}

export default forgotpass;