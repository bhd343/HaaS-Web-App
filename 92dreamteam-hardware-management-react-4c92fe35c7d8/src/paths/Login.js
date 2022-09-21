import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={process.env.PUBLIC_URL + '/grouplogo.png'} className="App-logo" alt="logo" />
                <p className='Welcome-message'> Welcome, please login for more details </p>
                <button className='Loging-button'> 
                    <Link to="/SignUp">
                        Sign up 
                    </Link>
                </button>
        
                <button className='Loging-button'> 
                    <Link to="/SignIn">
                        Sign in 
                    </Link>
                </button>
            </header>
       </div>
    );
};

export default Login;