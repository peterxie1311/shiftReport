import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { title } from "process";

interface BoxProps {
  inputString: string[][];
  inputNum: string[][];
  title: string;
  inputValues: { [key: string]: string };
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const BoxTooltip: FC<BoxProps> = ({
  title,
  inputString,
  inputNum,
  inputValues,
  handleChange,
}) => {
  return (
    <div className="container entryField">
      {inputString.map((labels) => (
        <article className="container" key={labels[0]}>
          <label htmlFor={labels[0]}>{labels[0]}</label>
          <input
            id={labels[0]}
            type="text"
            onChange={handleChange}
            name={labels[0]}
            value={inputValues[labels[0]] || ""}
          />
          {labels.length === 2 && (
            <span className="dotTooltip">
              ?<div className="tooltip">{labels[1]}</div>
            </span>
          )}
        </article>
      ))}
      {inputNum.map((labels) => (
        <article className="container" key={labels[0]}>
          <label htmlFor={labels[0]}>{labels[0]}</label>
          <input
            id={labels[0]}
            type="number"
            onChange={handleChange}
            name={labels[0]}
            value={inputValues[labels[0]] || ""}
          />
          {labels.length === 2 && (
            <span className="dotTooltip">
              ?<div className="tooltip">{labels[1]}</div>
            </span>
          )}
        </article>
      ))}
    </div>
  );
};

export default BoxTooltip;
