//import { response } from 'express';
import React from 'react';
//import reactDOM, { render } from 'react-dom';
import GoogleLogin from 'react-google-login';
import './Login.css';

function googleLogin(){

    const success_responseGoogle = (response)=>{
        console.log(response.data);
    }
    const error_responseGoogle = (response)=>{
        console.log(response.data);
    }
    return(
        <div className="loginWithGoogle">
            <GoogleLogin
                clientId="759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={success_responseGoogle}
                onFailure={error_responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default googleLogin;