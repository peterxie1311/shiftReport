import React, { useState, useEffect, ChangeEvent ,MouseEventHandler} from 'react';
import './App.css';

import Witron from './assets/witron';
import SignatureUpdater from './assets/dateCheck';
import SideBar from './assets/sideBar';
import LargeInput from './assets/largeInput';
import BoxToolTip from './assets/BoxTooltip';
import Production from './assets/Tablemaker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 


const App: React.FC = () => {
  SignatureUpdater();

  const rows: string[] = ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8', 'Hour 9'];


  const postData = () =>{
    axios.post<{ message: string }>('http://localhost:8080/api/data', inputArray)
      .then(response => {
        console.log('Response:', response.data);
        console.log(inputArray);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const inputArray = Object.keys(inputValues).map(key => ({
    name: key,
    value: inputValues[key]
  }));


  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [name]: value
      
    }));
  };
  const handleDropdownItemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    

    const target = event.currentTarget as HTMLAnchorElement;
    const selectedCrew = target.innerText;

    setInputValues(prevValues => ({
      ...prevValues,
      selectedCrew: selectedCrew
    }));

};

  return (
    <>
    <header>
        <Witron />
      </header>
      <main>
     
        <SideBar input1="Attendance"  />
       
        <div className="main-content">
       
          
          <Production rows={rows} columns={[]} inputValues={inputValues} handleChange={handleChange} crews={['Crew A','Crew B','Crew C']} mouseChange={handleDropdownItemClick}/>
          <section className="workspace">
            <BoxToolTip
              inputNum={[
              ['Com Cases/Hour Average' , 'Hour average'],['COM Total','Sum'],
              ['Depal Cases Average','Average Depal'],['Depal Total','Sum'],
              ['loc Occupied % (HBW)','SO01 Record at start of your shift'],['Chnls Occupied % (HBW)','SO01 Record at start of your shift'],
              ['Pallets Received','So01 Record at end of shift'],['Fault Duration (Mins)','PR04'],['Fault Rate (per 1000 cs)' , 'PR04'],['Avg OPM Availability','Ask Aiden'],
              ['Prio 6 Pallets','RE13'],['Prio 5 Pallets','RE13'],['MDB Occupied %','IN12a'],['AVG Cases/Pallet','OP50'],['Scratched Cases','OM25d'],['Missing Cases','WP02'],['Blocked Cases','IN01'],
              ['Inbound Rejected Pallets','LMFC14'],
              ['Incidents', 'Amount of Incidents'],['Attendance', 'Amount of people that attended']]}
              inputString={[['Report By', 'Which PTM'], ['Shift', 'What Shift'],['Blocked Equipment Comments','BL01']]}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          </section>

          <LargeInput inputLabel="Shift Comments and General Information" rows={5} cols={60} 
           inputValues={inputValues}
           handleChange={handleChange}/>


         

          <button className="btn btn-primary btn-sm" onClick={postData}>Submit</button>


        </div>

       

      </main>
      <footer className="footer">
        <p id="signature"></p>
      </footer>
    </>
  );
};

export default App;
