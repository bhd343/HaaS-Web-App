import React, {useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';


const SignUp = () => {
    const navigate = useNavigate();

    const usernameRef = useRef();
    const passwordRef = useRef();
    const [loginstatus, setLoginStatus] = useState();

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            email: usernameRef.current.value,
            password: passwordRef.current.value
        };

        console.log(data);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: usernameRef.current.value, password: passwordRef.current.value})
        };

        fetch('https://api.92dreamteam.net/new_account', requestOptions)
            .then((response) => {
                if(!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then((data) => {
                if (data.code) {
                    setLoginStatus(data.status);
                    console.log(data.code);
                    console.log("Request Success!");
                    navigate('/Projects');
                }
                else {
                    setLoginStatus(data.status);
                    console.log(data.code);
                    console.log("Request failed!");
                }
            })
            .catch((error) => {
                console.log('error: ' + error);
                setLoginStatus("Request failed!");
            });
    };

    return (
        <div className="SignUp">
            <img src={process.env.PUBLIC_URL + '/grouplogo.png'} className="App-logo" alt="logo" />
            <br></br>
            <form onSubmit={handleSubmit} id="FormStuff">
                <input
                        type="email"
                        ref={usernameRef}
                        placeholder="username@gmail.com"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        autoFocus
                        autoComplete="false"
                        required
                />
                <br></br>
                <input
                        type="password"
                        ref={passwordRef}
                        placeholder="Password"
                        required
                /> 
                <button className='Signing-button' type="submit"> 
                    Sign up
                </button> 
            </form>
            <p>{loginstatus}</p>
        </div>
    );
};

export default SignUp;