import React from 'react';
import './Login.css';
import Axios from 'axios';

class forgotpass extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email_id : "",
            error : "",
        }
        this.handleEmailchange = this.handleEmailchange.bind(this);
        this.handleforgotpass = this.handleforgotpass.bind(this);
    }

    handleEmailchange(e){
        this.setState({
            email_id:e.target.value,
        })
    }

    handleforgotpass =async e=>{
        
        if(this.state.email_id){
            e.preventDefault();
            console.log(`before ${this.state.email_id}`);
            Axios.post('http://localhost:5000/api/forgot-password',{email_id:this.state.email_id}).then((response)=>{
                console.log(response)
                if(response.data.code === 200){
                    console.log("received 200 OK");
                    alert("reset requested");
                    
                }
                else{
                    console.log("forgot pass request failed")
                }
            });
        }
        else{
            alert(`Enter email`)
            return this.setState({error: 'Enter valid email id'})
        }
    };

    render(){
        return(
            <div className="login">
                <div className="forgot-form">
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