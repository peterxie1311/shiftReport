import  { FC, ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface BoxProps {
  inputString: string[][];
  inputNum: string[][];
  inputValues: { [key: string]: string };
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BoxTooltip: FC<BoxProps> = ({ inputString, inputNum, inputValues, handleChange }) => {
  return (
    <div className="container entryField">
      {inputString.map((stuff) => (
        <article className="container" key={stuff[0]}>
          <label htmlFor={stuff[0]}>{stuff[0]}</label>
          <input
            id={stuff[0]}
            type="text"
            onChange={handleChange}
            name={stuff[0]}
            value={inputValues[stuff[0]] || ''}
          />
          {stuff.length === 2 && (
            <span className="dotTooltip">
              ?
              <div className="tooltip">{stuff[1]}</div>
            </span>
          )}
        </article>
      ))}

      {inputNum.map((stuff) => (
        <article className="container" key={stuff[0]}>
          <label htmlFor={stuff[0]}>{stuff[0]}</label>
          <input
            id={stuff[0]}
            type="number"
            onChange={handleChange}
            name={stuff[0]}
            value={inputValues[stuff[0]] || ''}
          />
          {stuff.length === 2 && (
            <span className="dotTooltip">
              ?
              <div className="tooltip">{stuff[1]}</div>
            </span>
          )}
        </article>
      ))}
    </div>
  );
};

export default BoxTooltip;
