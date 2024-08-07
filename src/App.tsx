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
    ['Total Open COMs','Open picks for COMs'],['Total Open AIO','Open picks for AIO'],['Total Open CPS','Open picks for CPS'],
    ['loc Occupied % (HBW)','SO01 Record at start of your shift'],['Chnls Occupied % (HBW)','SO01 Record at start of your shift'],
    ['Pallets Received','So01 Record at end of shift'],['Fault Duration (Mins)','PR04'],['Fault Rate (per 1000 cs)' , 'PR04'],
    ['Prio 6 Pallets','RE13'],['Prio 5 Pallets','RE13'],['MDB Occupied %','IN12a'],['AVG Cases/Pallet','OP50'],['Scratched Cases','OM25d'],['Missing Cases','WP02'],['Blocked Cases','IN01'],
    ['Inbound Rejected Pallets','LMFC14'],
    ['Incidents', 'Amount of Incidents']];

   const inputCalc = [
    ['COM Total','Sum'],['Com Cases/Hour Average' , 'Hour average'],['Depal Total','Sum'],['Depal Cases Average','Average Depal'],['Avg OPM Availability','Ask Aiden']] 

    
    const rowsDefault: string[] = ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8', 'Hour 9'];
    const rowsMorning: string[] = [ '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm','2:00pm'];
    const rowsEvening: string[] = [ '2:15pm', '3:00pm','4:00pm','5:00pm','6:00pm','8:00pm','9:00pm','10:00pm','11:15pm'];
    const rowsNight: string[] = [ '5:00pm', '6:00pm','7:00pm','8:00pm','9:00pm','10:00pm','11:00pm','12:00am','1:00am'];
    const columns: string[] = ['KPI1 ','KPI2 ','KPI3 ','KPI4 ','KPI5']; // this is for the handelling of the column names [FYI COLUMNS AND COLUMNNAMES MUST HAVE THE SAME LENGTH!!!!!!!!!]
    const columnNames: string[] = ['COMs','Depal','AIO','Repack','Comments'] //this is more for the email and display  [FYI COLUMNS AND COLUMNNAMES MUST HAVE THE SAME LENGTH!!!!!!!!!]
    const inputString = [['Report By', 'Which PTM'], ['Blocked Equipment Comments','BL01']];
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [rows, setRows] = useState<string[]>(rowsDefault);
    let rowCols: string[][] = createRowCols(columns,rowsDefault); // this is to add the values together and to check everything is filled at the end
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(undefined, { year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric' });

    const kpiValues = columns.map((column, index) => ({
      name: column.trim(),
      value: columnNames[index]
    }));

    function getKPI(kpi:string , columns:string[],columnNames:string[]): string{
      for (let i=0; i<columns.length;i++){
        if(kpi.includes(columns[i])){
          let name = kpi.replace(columns[i],columnNames[i]+ ' ');
          for (let j=0; j<rowsDefault.length;j++){
            if(name.includes(rowsDefault[j])){
              return name.replace(rowsDefault[j],rows[j]);
            }
          }
          return name;
        }
      }
      return kpi;
    } 

    const inputArray = Object.keys(inputValues).map(key => ({
      name: key,
      value: inputValues[key]   // using this for the database file
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
    
    function createRowCols(columns:string[],rowMaker:string[]):string[][]{
      let rowCols:string[][] = [];
      for (let i=0; i< columns.length;i++){
        for(let j=0; j<rowMaker.length;j++){
          rowCols.push([columns[i]+rowMaker[j]]) ; /* this initialises the tablemaker check */
        }
      };
      return rowCols;
    }
    
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
          data:  Object.keys(inputValues).map(key => ({
            name: getKPI(key,columns,columnNames),
            value: inputValues[key]   // grabbing final values
          }))
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = formattedDate + inputValues['Shift']+'.msg';
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
    inputString.push(['Shift','']);
    const notFilledString = getnotFilled2d(inputString, inputArray); /* this is to check that all the data is filled */   // NEED TO CHANGE HOW WE APPEND THIS ARRAY 
    const notFilledTable = getnotFilled2d(rowCols, inputArray);
    if(notFilledNum.length+notFilledString.length+notFilledTable.length===0){
      inputArray.push(...kpiValues);
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
    setInputValues(prevValues => {
        const newValues = {
            ...prevValues,
            [name]: value
        };
        console.log(rowCols);
//---------------------Calculating the total values -------------------------------------------------
        let kpi1Total = 0;
        rowCols.forEach(things => {
          console.log(things);
            if(things[0].includes(columns[0])) { // change these to kpi1 total for com
              console.log(things[0]);
              kpi1Total += parseFloat(newValues[things[0]] || '0');

            }
        });
        newValues['COM Total'] = kpi1Total.toString();
        let kpi2Total = 0;
        rowCols.forEach(things => {
          
          if(things[0].includes(columns[1])) { // kpi2 total for depal

              kpi2Total += parseFloat(newValues[things[0]] || '0');
          }
      });
      newValues['Depal Total'] = kpi2Total.toString();
      newValues['Depal Cases Average'] = (kpi2Total/9).toString();
      newValues['Com Cases/Hour Average'] = (kpi1Total/9).toString();
      let opmavail = ((((540 - parseFloat(newValues['Fault Duration (Mins)']))/540)*100).toFixed(2) ); // to calculate opm availability
      newValues['Avg OPM Availability'] = opmavail.toString()+'%';
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
            <Production columnNames ={columnNames} columns={columns} rows={rows} keys={rowsDefault} inputValues={inputValues} handleChange={handleChange} />
          </div>
          <section className="workspace">
          <BoxToolTip
              inputNum={inputCalc}
              inputString={[]}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            </section>
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
