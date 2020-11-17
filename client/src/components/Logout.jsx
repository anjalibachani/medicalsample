import React from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends React.Component{
    constructor(props){
        super(props)
        console.log(this.props)
    }
    redirectToAddsamples = ()=>{
        this.props.history.push('/login')
    }
    render(){
        return(
            <div className="logout">
                {localStorage.clear()}
                {<Redirect to='/login'/>}
            </div>
        )
    }
}

export default Logout;