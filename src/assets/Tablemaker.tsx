import React, { FC, ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
interface ProductionProps {
  rows: string[];
  inputValues: { [key: string]: string };
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  
}

const Production: FC<ProductionProps> = ({  rows, inputValues, handleChange}) => {
  console.log(rows);
  
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
      </>
    
  );
};

export default Production;
