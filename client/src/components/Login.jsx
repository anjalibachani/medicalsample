import React from 'react';
import GoogleLogin from 'react-google-login';
import './Login.css';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import CustomAlertBanner from "./CustomAlertBanner";
import { Button, Form } from 'react-bootstrap';

// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

class Login extends React.Component {

  constructor(props) {
    // console.log("login called")
    super(props)
    this.state = {
      email_id: "",
      password: "",
      error: "",
      alertVisibility: false,
      alertText: 'Please enter all required fields.',
      alertVariant: 'danger'
    }
    this.handleEmailchange = this.handleEmailchange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.success_responseGoogle = this.success_responseGoogle.bind(this);
    this.error_responseGoogle = this.error_responseGoogle.bind(this);
  }

  success_responseGoogle(response) {
    this.setState({
      email_id: response.profileObj.email
    })
    //this.state.email_id=response.profileObj.email;
    Axios.post(`http://${config.server.host}:${config.server.port}/api/googlelogin`, { tokenId: response.tokenId }).then(async (response) => {
      if (response.status === 200) {
        await localStorage.setItem('token', response.data.token);
        await localStorage.setItem('user_id', response.data.user_id);
        await localStorage.setItem('email_id', this.state.email_id);
        await localStorage.setItem("isLoggedIn", true);
        await localStorage.setItem("isAdmin", response.data.admin);
        await localStorage.setItem("expiresin", Date.now() + 6000000);
        //console.log("logging date",Date.now());
        this.redirectToHome();
      }
      else {
        this.setState({
          alertVisibility: true,
          alertText: "This email id doesn't exist",
        });
      }
    });
  }
  error_responseGoogle(response) {
    this.setState({
      alertVisibility: false,
      alertText: "This email doesn't exist",
    });
  }

  handleEmailchange(e) {
    this.setState({
      email_id: e.target.value,
      alertVisibility: false,
    })
  }
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      alertVisibility: false,
    })
  }

  redirectToHome = () => {
    this.props.history.push('/Home')
  }

  handleLogin = async e => {

    if (this.state.email_id && this.state.password) {
      e.preventDefault();
      let array1 = [1, 2, 3];
      Axios.post(`http://${config.server.host}:${config.server.port}/api/login`, { email_id: this.state.email_id, password: this.state.password, array1: array1 }).then(async (response) => {
        //console.log(response);
        if (response.status === 200) {
          await localStorage.setItem('token', response.data.token);
          await localStorage.setItem('user_id', response.data.user_id);
          await localStorage.setItem('email_id', this.state.email_id);
          await localStorage.setItem('isLoggedIn', true);
          await localStorage.setItem("isAdmin", response.data.admin);
          await localStorage.setItem("expiresin", Date.now() + 6000000);
          await console.log("logging date", Date.now());
          this.redirectToHome();
        }
        else {
          this.setState({
            alertVisibility: true,
            alertText: "Invalid Email or Password"
          });
        }
      });
    }
    else {
      this.setState({
        alertVisibility: true,
        alertText: "Invalid email or password"
      });
      return this.setState({ error: 'Enter email id and password to login' })
    }
  };

  render() {
    return (
      <div>
        {(() => {
          if (localStorage.getItem("user_id") === null) {
            return (
              <div className="login">
                <h1>Salud Ambiental Montevideo</h1>
                <h3>
                  Understanding the Effects of Complex Exposures On Child Learning
                  and Behaviour
                  </h3>
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

                    <Form.Group controlId="formBasicPassword">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicButton">
                      <Button
                        className="mr-5"
                        variant="secondary"
                        type="submit"
                        onClick={this.handleLogin}
                      >
                        Log In
                        </Button>
                      <Button className="ml-4" href="/forgot-pass">
                        Forgot Password?
                        </Button>
                    </Form.Group>
                    <GoogleLogin
                      clientId="759402856-mqu91hihug6s865np34bv3ssonr5ntgj.apps.googleusercontent.com"
                      styles={{ width: 500 }}
                      buttonText="SignIn with Google"
                      onSuccess={this.success_responseGoogle}
                      onFailure={this.error_responseGoogle}
                      cookiePolicy={"single_host_origin"}
                    />
                  </Form>
                </div>
              </div>
            );
          }
          else {
            return <Redirect to="/Home" />;
          }
        })()}
      </div>
    )
  }
}

export default Login;