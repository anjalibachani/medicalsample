//import { response } from 'express';
import React from 'react';
//import reactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import './Login.css';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
const config = require('../config/config.json')
const AddSamples = require('./AddSamples');

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email_id : "",
            password : "",
            error : "",
            alertVisibility: false,
            alertText: 'Please enter all required fields.',
            alertVariant: 'danger'
        }
        // const success_responseGoogle = (response)=>{
        //     console.log("login success")
        //     console.log(response.profileObj);
        //     alert(
        //         `Logged in successfully welcome ${response.profileObj.name} . \n See console for full profile object.`
        //     );
        //     Axios({
        //         method: "POST",
        //         uri: "http://localhost:5000/routes/googlelogin/",
        //         data: {tokenId: response.tokenId}
        //     }).then(response => {
        //         console.log(response);
        //     })
        // }
        // const error_responseGoogle = (response) =>{
        //     console.log("login failed")
        //     console.log(response)
        // }
        this.handleEmailchange = this.handleEmailchange.bind(this);
        this.handlePasswordChange= this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.success_responseGoogle = this.success_responseGoogle.bind(this);
        this.error_responseGoogle = this.error_responseGoogle.bind(this);
    }
    
    success_responseGoogle(response){
        console.log("login success")
        console.log(response.profileObj.email);
        console.log(response.tokenId)
        this.state.email_id=response.profileObj.email;
        alert(
            `Logged in successfully welcome ${response.profileObj.name} . \n See console for full profile object.`
        );
        Axios.post(`http://${config.server.host}:${config.server.port}/api/googlelogin`,{tokenId:response.tokenId}).then((response)=>{
                console.log("token id sent to server");
                if(response.status === 200){
                    console.log("received 200 OK");
                    alert("login successful");
                    console.log(response.data)
                    console.log(response.data.user_id,response.data.token);
                    localStorage.setItem('user_id',response.data.user_id);
                    localStorage.setItem('email_id',this.state.email_id);
                    localStorage.setItem('token',response.data.token);
                }
                else{
                    console.log("login failed")
                    alert(`Login failed with response ${response.data.message}`)
                }
            });
    }
    error_responseGoogle(response){
        alert(`Login failed`)
        console.log("login failed")
        console.log(response)
    }

    handleEmailchange(e){
        this.setState({
            email_id:e.target.value,
            alertVisibility: false,
        })
    }
    handlePasswordChange(e){
        this.setState({
            password:e.target.value,
            alertVisibility:false,
        })
    }
    handleLogin =async e=>{
        
        if(this.state.email_id && this.state.password){
            e.preventDefault();
            console.log(`before ${this.state.email_id} , ${this.state.password}`);
            const result = await fetch('http://localhost:5000/');
            console.log(result);
            Axios.post('http://localhost:5000/api/login',{email_id:this.state.email_id, password: this.state.password}).then((response)=>{
                console.log("login requested", response);
                //alert(`Login status code ${response.status}`)
                if(response.status === 200){
                    console.log("received 200 OK");
                    alert("login successful");
                    console.log(response.data)
                    console.log(response.data.user_id,response.data.token);
                    localStorage.setItem('user_id',response.data.user_id);
                    localStorage.setItem('email_id',this.state.email_id);
                    localStorage.setItem('token',response.data.token);
                    
                }
                else{
                    this.setState({
                        alertVisibility: true,
                        alertText: "Invalid Email or Password"
                    });
                    console.log("login failed")
                }
            });
        }
        else{
            this.setState({
                alertVisibility: true,
                alertText:"Invalid email or password"
            });
            return this.setState({error: 'Enter email id and password to login'})
        }
    };

    render(){
        return(
            <div className="login">
                <h1>Salud Ambiental Montevideo</h1>
                <h3>Understandig the Effects of Complex Exposures On Child Learnig and Behaviour</h3>
                <div className="login_form">
                    <div classname="diplay-alert">
                    {this.state.alertVisibility &&<p class="warning">{this.state.alertText}</p>}
                    </div>
                    <div id="field">
                        {/* <label>Email ID</label> */}
                        <input id = "input" type="email" placeholder="enter email id" value={this.state.email_id} onChange={this.handleEmailchange}/>
                    </div>
                    <div id="field">
                        {/* <label>Password</label> */}
                        <input id = "input" type="password" placeholder = "enter password" value = {this.state.password} onChange={this.handlePasswordChange}/>
                    </div>
                    <a href="./forgot-pass" style={{marginLeft:120, color:'white'}}>Forgot Password</a>
                    <input id = "loginbutton" type="submit" value="Login" onClick={this.handleLogin}/>

                    <div className="googlelogin">
                    {/* <button onClick={this.loginWithGoogle}>Login with Google</button> */}
                    <GoogleLogin className="google-btn" style = "height: '70px'"
                        clientId="759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com"
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} style={{color: '#FFFFFF', fontSize: 16, borderRadius:20, width:240, height: 30, marginLeft:30, backgroundColor:'#c02a31' }}>SignIn with Google</button>
                        )}
                        buttonText="Login with Google"
                        onSuccess={this.success_responseGoogle}
                        onFailure={this.error_responseGoogle}
                        //cookiePolicy={'single_host_origin'}
                        cookiePolicy={'http://localhost:3000'}
                    />
                    
                    <div/>
                </div>
                </div>
            </div>
        )
    }
}

export default Login;