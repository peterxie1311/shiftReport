import React, { FC} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface DropdownProps {
  id : string;
  selections: string[];
  inputValues: { [key: string]: string };
  mouseChange: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Dropdown: FC<DropdownProps> = ({ id,selections, inputValues, mouseChange }) => {
  
  return (
    <>
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
        {inputValues[id] ? inputValues[id] : [id]}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
        {selections.map((select: string, index: number) => (
          
          <li key={index + select}>
            <a className="dropdown-item" onClick={mouseChange}>{select}</a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dropdown;
