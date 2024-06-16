import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  const fetchData = async () => {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzVZ-sGlysONiCZd-Fb4_JAssWu1oZaWrZRx8mIoq1mcqBA8eKGKiLRYk20cnRlnIDvdQ/exec');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Response FE : ${JSON.stringify(data)}`);
      console.log(`We are Here`);
      setSubmittedData(data.map(([firstName, secondName]) => ({ firstName, secondName })));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    console.log(`Now Here`);
    event.preventDefault();
    console.log(`Submitting handleSubmit 1: ${firstName} ${secondName}`); 
    const response = await fetch('https://script.google.com/macros/s/AKfycbzVZ-sGlysONiCZd-Fb4_JAssWu1oZaWrZRx8mIoq1mcqBA8eKGKiLRYk20cnRlnIDvdQ/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `firstName=${encodeURIComponent(firstName)}&secondName=${encodeURIComponent(secondName)}`,
    });
    if (response.ok) {
      console.log('Data sent to the server');
      fetchData(); // Fetch the data again after submitting the form
    } else {
      console.log('Failed to send data');
    }
    setFirstName('');
    setSecondName('');
  };

  const handleSubmitByBE = async (event) => {
    event.preventDefault();
    const data = {
      firstName: firstName,
      lastName: secondName
    };
    console.log(`Submitting to BE: ${JSON.stringify(data)}`);
    const response = await fetch('http://localhost:3300/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: secondName
      })
    });
    if (response.ok) {
      fetchData(); // re-fetch the data after submitting
    }
    setFirstName('');
    setSecondName('');
  };

  const handleEditClick = async (index) => {
    const newData = prompt('Enter new first name and second name separated by a comma'); // replace this with your own edit UI
    const [newFirstName, newSecondName] = newData.split(',');

    // Update the local state
    setSubmittedData(prevData => {
      const newData = [...prevData];
      newData[index] = { firstName: newFirstName, secondName: newSecondName };
      return newData;
    });

    // Send a PUT request to the backend
    const response = await fetch('http://localhost:3300/data/api/rows/' + index, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: newFirstName, secondName: newSecondName }),
    });

    if (!response.ok) {
      console.error('Error updating data');
    }
  };

  return (
    <div className="App">
      <form>
        <label>
          First Name :&nbsp;
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </label>
        <label>
          Second Name :&nbsp;
          <input type="text" value={secondName} onChange={e => setSecondName(e.target.value)} />
        </label>
        <input type="submit" value="Submit" onClick={handleSubmit} />
        <input type="submit" value="SubmitByBE" onClick={handleSubmitByBE} />
      </form>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Modification</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              <td>{data.firstName}</td>
              <td>{data.secondName}</td>
              <td>
                <button onClick={() => handleEditClick(index)}>Edit</button>
             </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;