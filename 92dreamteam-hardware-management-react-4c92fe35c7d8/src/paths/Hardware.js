import React, {useRef, useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";

const Hardware = () => {

  const hwrequest=useRef('');
  const [hwSelected, setHwSelected] = useState("1");
  const [orderstatus, setOrderStatus] = useState();
  const {state} = useLocation();
  const {projectID} = state;
  const [hwSet1Capacity, sethwSet1Capacity] = useState();
  const [hwSet2Capacity, sethwSet2Capacity] = useState();
  const [hwSet1Availability, sethwSet1Availability] = useState();
  const [hwSet2Availability, sethwSet2Availability] = useState();


  const requestOptions = {
    method: 'GET',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://api.92dreamteam.net/resource/1", requestOptions)
      .then(res => res.json())
      .then((data) => {
        sethwSet1Capacity(data.capacity)
        sethwSet1Availability(data.availability)
      })

        fetch("https://api.92dreamteam.net/resource/2", requestOptions)
        .then(res => res.json())
        .then((data) => {
            sethwSet2Capacity(data.capacity)
            sethwSet2Availability(data.availability)
         })
    }

    const placeOrder = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    
        fetch('https://api.92dreamteam.net/order', requestOptions)
            .then((response) => {
                if(!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then((data) => {
                if (data.code) {
                    setOrderStatus(data.status);
                    console.log(data.code);
                    console.log("Request Success!");
                    fetchData();
                }
                else {
                    setOrderStatus(data.status);
                    console.log(data.code);
                    console.log("Request failed!");
                }
            })
            .catch((error) => {
                console.log('error: ' + error);
                setOrderStatus("Request failed!");
            });    
    }

  const handleSelectChange = e => {
    e.preventDefault();
    setHwSelected(e.target.value);
    console.log("HW selected is ")
    console.log(hwSelected)
  }
    
  const handleCheckOut = e => {
    e.preventDefault();
    let hwrequestno = parseInt(hwrequest.current.value, 10)
    const data = {
        project_id: projectID, resource_id: hwSelected, quantity: hwrequestno
    }
    console.log(data)
    placeOrder(data);
  }

  const handleCheckIn = e => {
    e.preventDefault();
    let hwrequestno = parseInt(hwrequest.current.value, 10)
    const data = {
        project_id: projectID, resource_id: hwSelected, quantity: -hwrequestno
    }
    console.log(data)
    placeOrder(data);
  }

  return (
    <div className='HardwarePage'>
        <div className="Logout">
            <button className="button-30">
                <Link to="/">
                    Logout
                </Link>
            </button>
        </div>
        <img src={process.env.PUBLIC_URL + '/grouplogo.png'} className="App-logo" alt="logo" />
        <ul className="responsive-table">
            <li className="table-header">
                <div className="col col-1">Hardware Set</div>
                <div className="col col-2">Capacity</div>
                <div className="col col-3">Availability</div>
            </li>
            <li className="table-row">
                <div className="col col-1" data-label="Hardware Set">HW Set 1</div>
                <div className="col col-2" data-label="Capacity">{hwSet1Capacity}</div> 
                <div className="col col-3" data-label="Availability">{hwSet1Availability}</div>
            </li>
            <li className="table-row">
                <div className="col col-1" data-label="Hardware Set">HW Set 2</div>
                <div className="col col-2" data-label="Capacity">{hwSet2Capacity}</div>
                <div className="col col-3" data-label="Availability">{hwSet2Availability}</div>
            </li>
        </ul>
        <div className="HardwareRequest">
            <select name="HwSetSelected" id="HwSet" onChange={handleSelectChange}>
                <option value="1">HW Set 1</option>
                <option value="2">HW Set 2</option>
            </select>
            <br></br>
            <input
                type="number"
                ref={hwrequest}
                placeholder="0"
                autoFocus
                autoComplete="false"
                required
                min="1"
            />
            <br></br>
            <button className="button-30" onClick={handleCheckOut}>Check out</button>
            <button className="button-30" onClick={handleCheckIn}>Check In</button>
            
        </div>
        <p>{orderstatus}</p>
    </div>
  )
}

export default Hardware;
