import React from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends React.Component{

    redirectToAddsamples = ()=>{
        this.props.history.push('/AddSamples')
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