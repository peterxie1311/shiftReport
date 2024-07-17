import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BoxProps {
  inputString: string[][];
  options: string[][];
  inputValues: { [key: string]: string };
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const BoxTooltipdropdown: FC<BoxProps> = ({
  inputString,
  options,
  inputValues,
  handleChange,
}) => {
  return (
    <div className="container entryField">
      {inputString.map((labels: string[], index: number) => (
        <article className="container" key={labels[0]}>
          <label htmlFor={labels[0]}>{labels[0]}</label>
          <select
            id={labels[0]}
            name={labels[0]}
            value={inputValues[labels[0]] || ""}
            onChange={handleChange}
          >
            {options[index].map((options: string) => (
              <option>{options}</option>
            ))}
          </select>
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

export default BoxTooltipdropdown;
