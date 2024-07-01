import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

interface WitronProps {



}

const head: FC<WitronProps> = ({  }) => {
  return (
    <header style={{width: '100%'}}>
                <div className="d-flex justify-content-center">
                    <img id="logo" src= 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Witron_Logo.svg' height="90"/>
                </div>
        
                <b>
                    <div id="dateContainer" className="d-flex align-self-start"></div>
                </b>
            </header>
  );
};

export default head;
