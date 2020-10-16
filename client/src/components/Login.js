//import { response } from 'express';
import React from 'react';
//import reactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import './Login.css';
import Axios from 'axios';


class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email_id : "",
            password : "",
            error : "",
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
        //this.loginWithGoogle = this.loginWithGoogle.bind(this);
    }
    
    success_responseGoogle(response){
        console.log("login success")
        console.log(response.profileObj);
        console.log(response.tokenId)
        alert(
            `Logged in successfully welcome ${response.profileObj.name} . \n See console for full profile object.`
        );
        // Axios({
        //     method: "POST",
        //     uri: "http://localhost:5000/routes/googlelogin/",
        //     data: {tokenId: response.tokenId},
        // }).then(response => {
        //     console.log(response);
        // })
        Axios.post('http://localhost:5000/api/googlelogin',{tokenId:response.tokenId}).then(()=>{
                console.log("token id sent to server");
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
        })
    }
    handlePasswordChange(e){
        this.setState({
            password:e.target.value,
        })
    }
    handleLogin =async e=>{
        
        if(this.state.email_id && this.state.password){
            e.preventDefault();
            console.log(`before ${this.state.email_id} , ${this.state.password}`);
            const result = await fetch('http://localhost:5000/');
            console.log(result);
            Axios.post('http://localhost:5000/api/login',{email_id:this.state.email_id, password: this.state.password}).then((response)=>{
                console.log("login requested", response.data.code);
                //alert(`Login status code ${response.status}`)
                if(response.data.code === 200){
                    console.log("received 200 OK");
                    alert("login successful");
                    
                }
                else{
                    console.log("login failed")
                    alert(`Login failed with response ${response.data.success ? response.data.success:response.data.failed}`)
                }
            });
        }
        else{
            alert(`Enter email and password to login`)
            return this.setState({error: 'Enter email id and password to login'})
        }
    };

    render(){
        return(
            <div className="login">
                <h1>Salud Ambiental Montevideo</h1>
                <h3>Understandig the Effects of Complex Exposures On Child Learnig and Behaviour</h3>
                <div className="login_form">
                    <div id="field">
                        <label>Email ID</label>
                        <input id = "input" type="email" placeholder="enter email id" value={this.state.email_id} onChange={this.handleEmailchange}/>
                    </div>
                    <div id="field">
                        <label>Password</label>
                        <input id = "input" type="password" placeholder = "enter password" value = {this.state.password} onChange={this.handlePasswordChange}/>
                    </div>

                    <input id = "loginbutton" type="submit" value="Login" width="70px" onClick={this.handleLogin}/>

                    <div className="googlelogin">
                    {/* <button onClick={this.loginWithGoogle}>Login with Google</button> */}
                    <GoogleLogin
                        clientId="759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com"
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