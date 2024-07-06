import React, { useState, ChangeEvent, useEffect } from 'react';
import './App.css';
import Witron from './assets/witron';
import SignatureUpdater from './assets/dateCheck';
import SideBar from './assets/sideBar';
import LargeInput from './assets/largeInput';
import BoxToolTip from './assets/BoxTooltip';
import Production from './assets/Tablemaker';
import Dropdown from './assets/dropdown';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App: React.FC = () => {
  // to get the signature at the bottom 
  SignatureUpdater();
  // Itialising variables ----------------------------------------------------------------------------------------
  const inputNumber = [
    ['Com Cases/Hour Average' , 'Hour average'],['COM Total','Sum'],
    ['Depal Cases Average','Average Depal'],['Depal Total','Sum'],
    ['loc Occupied % (HBW)','SO01 Record at start of your shift'],['Chnls Occupied % (HBW)','SO01 Record at start of your shift'],
    ['Pallets Received','So01 Record at end of shift'],['Fault Duration (Mins)','PR04'],['Fault Rate (per 1000 cs)' , 'PR04'],
    ['Prio 6 Pallets','RE13'],['Prio 5 Pallets','RE13'],['MDB Occupied %','IN12a'],['AVG Cases/Pallet','OP50'],['Scratched Cases','OM25d'],['Missing Cases','WP02'],['Blocked Cases','IN01'],
    ['Inbound Rejected Pallets','LMFC14'],
    ['Incidents', 'Amount of Incidents'],['Attendance', 'Amount of people that attended']];

    const rowMaker: string[] = [];
    const rowsDefault: string[] = ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8', 'Hour 9'];
    const rowsMorning: string[] = [ '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm','2:00pm'];
    const rowsEvening: string[] = [ '2:15pm', '3:00pm','4:00pm','5:00pm','6:00pm','8:00pm','9:00pm','10:00pm','11:15pm'];
    const rowsNight: string[] = [ '5:00pm', '6:00pm','7:00pm','8:00pm','9:00pm','10:00pm','11:00pm','12:00am','1:00am'];
    const columns: string[] = ['Coms ','Depal ','Aio ','Repack '];
    const inputString = [['Report By', 'Which PTM'], ['Shift', 'What Shift'],['Blocked Equipment Comments','BL01'],['Avg OPM Availability','Ask Aiden']];
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [rows, setRows] = useState<string[]>(rowsDefault);

    const inputArray = Object.keys(inputValues).map(key => ({
      name: key,
      value: inputValues[key]   // grabbing final values
    }));
  //-------------- Setting Rows ----------------------------------------------------------------------------------------
    useEffect(()=>{
      if (inputValues.Shift === 'Morning') {
        setRows(rowsMorning);
      } else if (inputValues.Shift === 'Evening') {
        setRows(rowsEvening);
      } else if (inputValues.Shift === 'Night') {
        setRows(rowsNight);
      } else{
        setRows(rowsDefault);
      }
    },[inputValues])
  // This is to create the tables for final Check  -------------------------------------------
    let rowCols:string[][] = [];
    for (let i=0; i< columns.length;i++){
      for(let j=0; j<rowMaker.length;j++){
        rowCols.push([columns[i]+rowMaker[j]]) ; /* this initialises the tablemaker check */
      }
    };
  //  ----------------------------------Check that all the fields are filled-----------------------------------------------------------
  function getnotFilled2d(fields:string[][],inputProvided: { name: string, value: any }[]): string[]  {
    let notFilled:string[] = [];
    let check:boolean = false;
    for (let i=0; i< fields.length;i++){
      check = false;
      for(let j=0; j< inputProvided.length;j++){
        if(inputProvided[j].name === fields[i][0]){        /* We do a check that the values are in the input provided which is usually the input value */
          if(inputProvided[j].value !== '' && inputProvided[j].value !== ' '){
            check = true;
          }       
        }
      }
      if(check === false){
        notFilled.push(fields[i][0]);
      }
    }
    return notFilled;
  };
  // -----------------------------------------Download Email Draft from back end ----------------------------------------------------------------
  const downloadEmailDraft = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/download_email_draft', {
        params: {
          data: inputArray
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email_draft.msg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
    }
  };
//-------------------------------------------------Post Data to backend --------------------------------------------------------------------------------
  let responseData: string = 'failed' ;
  const postData = () =>{
    
    const notFilledNum = getnotFilled2d(inputNumber, inputArray);
   // inputString.push(['selectedCrew','']);
    const notFilledString = getnotFilled2d(inputString, inputArray); /* this is to check that all the data is filled */   // NEED TO CHANGE HOW WE APPEND THIS ARRAY 
    const notFilledTable = getnotFilled2d(rowCols, inputArray);
    console.log(inputArray)
    if(notFilledNum.length+notFilledString.length+notFilledTable.length===0){
    axios.post<{ message: string }>('http://127.0.0.1:8080/api/data', inputArray)
      .then(response => {
        responseData = response.data.message

        if (responseData === 'success') {
          downloadEmailDraft();
      }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    else{
      alert("You did not enter these values: " + notFilledNum.join(", ")+ notFilledString.join(", ") + notFilledTable.join(", ") );
    }
  };

  // --------------- test function to add more functions to the submit button will remove later -------------------

  const testSubmit = () => {
    postData();   
};

//------------------ Handling event change of an HTML input area -------------------------------------
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    // Update the inputValues state
    setInputValues(prevValues => {
        // Create a new state object with the updated value
        const newValues = {
            ...prevValues,
            [name]: value
        };
        //calculate com total
        let comTotal = 0;
        rowCols.forEach(things => {
            if(things[0].includes('Com')) {
                // Use the newValues object to ensure we are including the latest input value
                comTotal += parseFloat(newValues[things[0]] || '0');
            }
        });

        //updates comtotal
        newValues['COM Total'] = comTotal.toString();

        //calculate depal total 
        let depalTotal =0;
        rowCols.forEach(things => {
          if(things[0].includes('Depal')) {
              // Use the newValues object to ensure we are including the latest input value
              depalTotal += parseFloat(newValues[things[0]] || '0');
          }
      });
      newValues['Depal Total'] = depalTotal.toString();
      newValues['Depal Cases Average'] = (depalTotal/9).toString();
      newValues['Com Cases/Hour Average'] = (comTotal/9).toString();
      let opmavail = ((((540 - parseFloat(newValues['Fault Duration (Mins)']))/540)*100).toFixed(2) ); // to calculate opm availability
      newValues['Avg OPM Availability'] = opmavail.toString()+'%';
        // Return the newValues object to update the state
        return newValues;
    });
  };
  //--------------------------- Handling change of a mouse click ------------------------------------------------------
    const handleDropdownItemClick = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const selected = target.innerText;
      
      setInputValues(prevValues => ({
        ...prevValues,
        [id]: selected
      }));
      console.log(inputValues[id]);   
};

  return (
    <>
    <header>
        <Witron />
      </header>
      <main>
        <SideBar input1={['Attendance']} />
        <div className="main-content">

          <div className="container entryField">

            <div  style={{ display: 'flex', flexDirection: 'column'}}>
              <Dropdown id={'Shift'} inputValues={inputValues} selections={['Morning','Evening','Night']} mouseChange={handleDropdownItemClick('Shift')}/>
              <br/>
              <Dropdown id={'Crew'} inputValues={inputValues} selections={['Crew A','Crew B','Crew C']} mouseChange={handleDropdownItemClick('Crew')}/>
              <br/>
            </div>
            <Production rows={rows} inputValues={inputValues} handleChange={handleChange} />
          </div>
          

          <section className="workspace">
            <BoxToolTip
              inputNum={inputNumber}
              inputString={inputString}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          </section>

          <LargeInput inputLabel="Shift Comments and General Information" rows={5} cols={60} 
           inputValues={inputValues}
           handleChange={handleChange}/>
          <button className="btn btn-primary btn-sm" onClick={testSubmit}>Submit</button>
        </div>

      </main>
      <footer className="footer">
        <p id="signature"></p>
      </footer>
    </>
  );
};

export default App;
