import React, { FC, useState, ChangeEvent,MouseEventHandler } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
interface ProductionProps {
  columns: string[];
  rows: string[];
  crews:string[];
 
  inputValues: { [key: string]: string };
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  mouseChange: (event: React.MouseEvent<HTMLAnchorElement>)=> void;
}

const Production: FC<ProductionProps> = ({ columns, rows,crews, inputValues, handleChange,mouseChange }) => {
  

  

  return (
    <div className="container entryField">

      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false" >
      {inputValues.selectedCrew ? inputValues.selectedCrew : 'Crews'}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
        {crews.map((stuff:string, index:number)=>(
          <li key={index+stuff}><a className="dropdown-item" onClick={mouseChange}>{stuff}</a></li>
        ))}
      </ul>

      <br/>
      <br/>
      <br/>


      <section style={{ width: '100%' }}>
        <h4>Production Per Hour (UMS):</h4>
      </section>
      <section className="hourly" id="hourlyProduction">
        <p></p>
        <p>Target</p>

        {rows.map((stuff: string) => (
          <p key={stuff}>{stuff}</p>
        ))}

        <p>COMs</p>
        <p>18 250</p>
        {rows.map((stuff: string) => (
          <input
            key={'Coms ' + stuff  }
            type="number"
            name={'Coms ' + stuff}
            value={inputValues['Coms ' + stuff]||''}
            onChange={handleChange}
          />
        ))}

        <p>Depal</p>
        <p>17 500</p>
        {rows.map((stuff: string) => (
          <input
            key={'Depal '+stuff }
            type="number"
            name={'Depal '+stuff}
            value={inputValues['Depal '+stuff] || ''}
            onChange={handleChange}
          />
        ))}

        <p>AIO</p>
        <p>8 000</p>
        {rows.map((stuff: string) => (
          <input
            key={'Aio '+stuff  }
            type="number"
            name={'Aio '+stuff }
            value={inputValues['Aio '+stuff ] || ''}
            onChange={handleChange}
          />
        ))}

        <p>Repack</p>
        <p>8 000</p>
        {rows.map((stuff: string) => (
          <input
            key={'Repack '+stuff  }
            type="number"
            name={'Repack '+stuff}
            value={inputValues['Repack '+stuff] || ''}
            onChange={handleChange}
          />
        ))}
      </section>
      <section style={{ width: '100%' }}>
        <br />
      </section>
    </div>
  );
};

export default Production;
