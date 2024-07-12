import React, { FC, ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
interface ProductionProps {
  rows: string[];
  keys: string[];
  inputValues: { [key: string]: string };
  columns: string[];
  columnNames :string[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Production: FC<ProductionProps> = ({ columnNames,columns,keys,rows, inputValues, handleChange}) => {
 // console.log(rows);

 function getColor(target:number , input:number): string{
    if (target > input){
      return 'lightcoral'
    } 
    else if (input > target){
      return 'lightgreen'
    }
    return 'white'

 }
  
  return (

    <>

      <section style={{ width: '100%' }}>
        <h4>Production Per Hour (UMS):</h4>
      </section>
      <section className="hourly" id="hourlyProduction">
        <p></p>
        <p>Target</p>

        {rows.map((stuff: string) => (
          <p key={stuff}>{stuff}</p>
        ))}

        <p>{columnNames[0]}</p>
        <p>18 250</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[0] + stuff  }
            type="number"
            name={columns[0] + stuff}
            value={inputValues[columns[0] + stuff]||''}
            onChange={handleChange}
            style={{ backgroundColor: getColor(8000,Number(inputValues[columns[0] + stuff])),borderColor:  getColor(8000,Number(inputValues[columns[0] + stuff])) }}
          />
        ))}

        <p>{columnNames[1]}</p>
        <p>17 500</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[1] + stuff }
            type="number"
            name={columns[1] + stuff}
            value={inputValues[columns[1] + stuff] || ''}
            onChange={handleChange}
            style={{ backgroundColor: getColor(8000,Number(inputValues[columns[1] + stuff])),borderColor:  getColor(8000,Number(inputValues[columns[1] + stuff])) }}
          />
        ))}

        <p>{columnNames[2]}</p>
        <p>8 000</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[2] + stuff  }
            type="number"
            name={columns[2] + stuff }
            value={inputValues[columns[2] + stuff ] || ''}
            onChange={handleChange}
            style={{ backgroundColor: getColor(8000,Number(inputValues[columns[2] + stuff])),borderColor:  getColor(8000,Number(inputValues[columns[2] + stuff])) }}
          />
        ))}

        <p>{columnNames[3]}</p>
        <p>8 000</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[3] + stuff  }
            type="number"
            name={columns[3] + stuff}
            value={inputValues[columns[3] + stuff] || ''}
            onChange={handleChange}
            style={{ backgroundColor: getColor(8000,Number(inputValues[columns[3] + stuff])),borderColor:  getColor(8000,Number(inputValues[columns[3] + stuff])) }}
          />
        ))}

        <p>{columnNames[4]}</p>
        <p> </p>
        {keys.map((stuff: string) => (
            <input
              key={columns[4] + stuff  }
              type="text"
              name={columns[4] + stuff }
              value={inputValues[columns[4] + stuff ] || ''}
              onChange={handleChange}
              style={{ borderColor:  'white' }}
            />
            ))}
      </section>
      <section style={{ width: '100%' }}>
        <br />
      </section>
      </>
    
  );
};

export default Production;
