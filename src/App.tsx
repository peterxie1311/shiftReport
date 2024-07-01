import React, { useState, ChangeEvent } from 'react';
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
  const columns: string[] = ['Coms ','Depal ','Aio ','Repack '];
  let rowCols:string[][] = [];

  for (let i=0; i< columns.length;i++){
    for(let j=0; j<rows.length;j++){
      rowCols.push([columns[i]+rows[j]]) ; /* this initialises the tablemaker check */
    }
  };


  function getnotFilled2d(fields:string[][],inputProvided: { name: string, value: any }[]): string[]  {
    let stuff:string[] = [];
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
        
        
        stuff.push(fields[i][0]);
      }
    }
    return stuff;
  };

  const downloadEmailDraft = async () => {
    try {
      const response = await axios.get('http://10.168.27.29:8080/download_email_draft', {
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

 
  let responseData: string = 'failed' ;







  const postData = () =>{
    
    const notFilledNum = getnotFilled2d(inputNumber, inputArray);
    inputString.push(['selectedCrew','']);
    const notFilledString = getnotFilled2d(inputString, inputArray); /* this is to check that all the data is filled */   // NEED TO CHANGE HOW WE APPEND THIS ARRAY 
    const notFilledTable = getnotFilled2d(rowCols, inputArray);

    

    

    if(notFilledNum.length+notFilledString.length+notFilledTable.length===0){
    
    axios.post<{ message: string }>('http://10.168.27.29:8080/api/data', inputArray)
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

  const testSubmit = () => {
    postData();
   
};

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const inputArray = Object.keys(inputValues).map(key => ({
    name: key,
    value: inputValues[key]
  }));




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

      //let opmavail = parseFloat(newValues['Fault Rate (per 1000 cs)']);

     // console.log(opmavail);





      newValues['Depal Total'] = depalTotal.toString();

    

      newValues['Depal Cases Average'] = (depalTotal/9).toString();
      newValues['Com Cases/Hour Average'] = (comTotal/9).toString();

      let opmavail = ((((540 - parseFloat(newValues['Fault Duration (Mins)']))/540)*100).toFixed(2) ); // to calculate opm availability
      newValues['Avg OPM Availability'] = opmavail.toString()+'%';


        // Return the newValues object to update the state
        return newValues;
    });


  };

  
  




 


  const inputNumber = [
    ['Com Cases/Hour Average' , 'Hour average'],['COM Total','Sum'],
    ['Depal Cases Average','Average Depal'],['Depal Total','Sum'],
    ['loc Occupied % (HBW)','SO01 Record at start of your shift'],['Chnls Occupied % (HBW)','SO01 Record at start of your shift'],
    ['Pallets Received','So01 Record at end of shift'],['Fault Duration (Mins)','PR04'],['Fault Rate (per 1000 cs)' , 'PR04'],
    ['Prio 6 Pallets','RE13'],['Prio 5 Pallets','RE13'],['MDB Occupied %','IN12a'],['AVG Cases/Pallet','OP50'],['Scratched Cases','OM25d'],['Missing Cases','WP02'],['Blocked Cases','IN01'],
    ['Inbound Rejected Pallets','LMFC14'],
    ['Incidents', 'Amount of Incidents'],['Attendance', 'Amount of people that attended']];

    const inputString = [['Report By', 'Which PTM'], ['Shift', 'What Shift'],['Blocked Equipment Comments','BL01'],['Avg OPM Availability','Ask Aiden']];


    const handleDropdownItemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const selected = target.innerText;
      setInputValues(prevValues => ({
        ...prevValues,
        selectedCrew: selected
      }));


      console.log(selected);
};

  return (
    <>
    <header>
        <Witron />
      </header>
      <main>
        <SideBar input1={['Attendance']} />
        <div className="main-content">
          <Production rows={rows} columns={[]} inputValues={inputValues} handleChange={handleChange} crews={['Crew A','Crew B','Crew C']} mouseChange={handleDropdownItemClick}/>
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
