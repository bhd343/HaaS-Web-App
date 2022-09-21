import './App.css';
import { BrowserRouter as  Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Login from './paths/Login';
import SignUp from './paths/SignUp';
import SignIn from './paths/SignIn';
import Hardware from './paths/Hardware';
import Projects from "./paths/Projects";

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/SignIn" element={<SignIn/>}/>
          <Route path="/Hardware" element={<Hardware/>}/>
          <Route path='/Projects' element={<Projects/>}/>
      </Routes>
    </Router>
  );
}

export default App;
