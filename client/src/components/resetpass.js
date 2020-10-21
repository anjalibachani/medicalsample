import React from 'react';
import './Login.css';
import Axios from 'axios';

class resetpass extends React.Component{
    
    constructor(props){
        console.log(props.match.params.id);
        super(props)
        this.state={
            password: "",
            confirmPassword:"",
            error : "",
        }
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword= this.handleConfirmPassword.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handlePassword(e){
        this.setState({
            password:e.target.value,
        })
    }

    handleConfirmPassword(e){
        this.setState({
            confirmPassword:e.target.value,
        })
    }

    handleReset =async e=>{
        if(this.state.password && this.state.confirmPassword){
            e.preventDefault();
            if(this.state.password===this.state.confirmPassword){
                console.log(`before ${this.state.email_id}`);
                Axios.post('http://localhost:5000/api/forgot-password',{email_id:this.state.email_id}).then((response)=>{
                    if(response.data.code === 200){
                        console.log("received 200 OK");
                        alert("reset requested");
                        
                    }
                    else{
                        console.log("forgot pass request failed")
                    }
                });
            }else{
                console.log("passwords doesnt match")
            }
        }
        else{
            alert(`fill all the fields`)
            return this.setState({error: 'Enter valid email id'})
        }
    };

    render(){
        return(
            <div className="login">
                <div className="reset-form">
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