import { useState } from 'react';
import React from 'react';
import {Link, useNavigate} from "react-router-dom";


const Projects = () => {

    /*name holds user input and lastName handles output from server
    these values are maintained as stateful with setter methods to keep them updated

    */
    const [name, setName] = useState('');
    const [responseVar,setResponse] = useState('');
    const [description, setDescription] = useState('');
    const [id, setID] = useState('');

    /*error is the boolean value we use as flag to display either an error response or success response
    submitted is the boolean value we use to indicate if input was valid. It only works for empty string responses for now
    these are also stateful values with setter methods
    */
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);



    /*projectByID holds user input and lastprojectByID handles output from server
    these values are maintained as stateful with setter methods to keep them updated

    */
    const [projectByID, setprojectByID] = useState('')
    const [responseProjectVar,setProjectResponse] = useState('');


    /*projectByIDerror is the boolean value we use as flag to display either an projectByIDerror response or success response
    projectByIDsubmitted is the boolean value we use to indicate if input was valid. It only works for empty string responses for now
    these are also stateful values with setter methods
    */
    const [projectByIDsubmitted, setprojectByIDsubmitted] = useState(false);
    const [projectByIDerror, setprojectByIDerror] = useState(false);

    /*This method handles the change of input

    */
    const handleprojectByID = (e) => {
        setprojectByID(e.target.value);
        setprojectByIDsubmitted(false);
    };



    /*This method handles the change of input

    */
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
        setSubmitted(false);

    }

    const handleID = (e) =>
    {
        setID(e.target.value);
        setSubmitted(false);
    }






    /*This method triggers on submit. It calls the backend endpoint to get last name
    The backend only accepts one input in any other case it returns a 404 with a custom error message

    in case of a 200 we set seterror as false

    */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === '' ) {
            setError(true);
        } else {
            setSubmitted(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name,description: description,
                    id:id})
            };
            fetch('https://api.92dreamteam.net/new_project', requestOptions)
                .then((response) => response.text())
                //.then((data) => console.log(data))
                .then(function(data){
                    data=JSON.parse(data);

                    if(data.code===true)
                    {
                        setResponse(data.status)
                        setError(false);
                    }
                    else{
                        setError(true);
                        setResponse("new project creation has failed because: "  + data.status);
                    }
                })

        }
    };


    /*This method triggers on submit. It calls the backend endpoint to get last projectByID
    The backend only accepts one input in any other case it returns a 404 with a custom projectByIDerror message

    in case of a 200 we set setprojectByIDerror as false

    */
    const navigate = useNavigate();

    const projectByIDhandleSubmit = (e) => {
        e.preventDefault();
        if (projectByID === '' ) {
            setprojectByIDerror(true);
        } else {
            setprojectByIDsubmitted(true);
            const requestOptions = {
                method: 'GET'
            };
            const urlByID="https://api.92dreamteam.net/project/" + projectByID;
            fetch(urlByID, requestOptions)
                .then((response) => response.text())
                //.then((data) => console.log(data))
                .then(function(data){
                    data=JSON.parse(data);

                    if(data.code===true)
                    {
                        navigate('/Hardware', { state: { projectID: projectByID} })
                        setprojectByIDerror(false);
                    }
                    else{
                        setprojectByIDerror(true);
                        setProjectResponse("response code: " + data.code + " and message received: " + data.projectByIDerror);
                    }
                })

        }
    };

    /* We use this method when we get a 200 response


    */
    const projectByIDsuccessMessage = () => {
        return (
            <>
                <div
                    className="success"
                    style={{
                        display: projectByIDsubmitted ? '' : 'none',
                        fontSize: '15px',
                        width:'180px'
                    }}>
                    <data>Project Details: "{responseProjectVar}"</data>
                </div>
            </>
        );
    };

    /* we use this when we get a 404


    */
    const projectByIDerrorMessage = () => {
        return (
            <div
                className="projectByIDerror"
                style={{
                    display: projectByIDerror ? '' : 'none',
                    fontSize: '15px',
                    width:'100px'
                }}>
                <p >Please enter a valid project ID</p>
            </div>
        );
    };

    /* We use this method when we get a 200 response


    */
    const successMessage = () => {
        return (
            <>
                <div
                    className="success"
                    style={{
                        display: submitted ? '' : 'none',
                        fontSize: '15px',
                        width:'100px'
                    }}>
                    <p className="response">Response from backend: "{responseVar}"</p>
                </div>
            </>
        );
    };

    /* we use this when we get a 404


    */
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                    fontSize: '15px',
                    width:'100px'
                }}>
                <p>Please enter valid information</p>
            </div>
        );
    };

    return (
        <div className="ProjectPage">

            <div className="Logout">
                <button className="button-30">
                    <Link to="/">
                        Logout
                    </Link>
                </button>
            </div>



            <img src={process.env.PUBLIC_URL + '/grouplogo.png'} className="App-logo" alt="logo" />
            <br></br>
        <table><tbody><tr><td className="tdProj">
            <div >
            <p className="ProjectHeader">Create New Project</p>

            <form>
                {}
                <label id="lbl" className="label">Project Name: </label>
                <input id="inp" required onChange={handleName} className="input" value={name} type="text" />

                <label id="lbl" className="label">Description: </label>
                <input id="inp"  required onChange={handleDescription} className="input" value={description} type="text" />

                <label id="lbl" className="label">Project ID: </label>
                <input id="inp" required onChange={handleID} className="input" value={id} type="text" />





                <button onClick={handleSubmit} className="ProjectSubmit" type="submit" id="btn">
                    Submit
                </button>
            </form>
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>
            </div>
            <div className="parentClass">

            </div> </td>
            <td className="tdProj">
            <div >
                <p className="ProjectHeader">Get Existing Project</p>

                <form>
                    {}
                    <label id="lbl" className="label">Project ID: </label>
                    <input id="inp" required onChange={handleprojectByID} className="input" value={projectByID}
                           type="text"/>


                    <button onClick={projectByIDhandleSubmit} className="ProjectSubmit" type="submit" id="btn">
                        Submit
                    </button>
                </form>
                <div className="messages">
                    {projectByIDerrorMessage()}
                    {projectByIDsuccessMessage()}
                </div>
            </div>
            </td></tr></tbody></table>
            <div>

            </div>
        </div>
    );
}
export default Projects;