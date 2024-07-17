import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BoxProps {
  input: string[][];
  inputValues: { [key: string]: string };
}

const BoxTooltiplabel: FC<BoxProps> = ({ input, inputValues }) => {
  function createBlock(array: string[]): JSX.Element {
    return (
      <article className="container" key={array[0]}>
        <label htmlFor={array[0]}>{array[0]}</label>
        <label
          id={array[0]}
          style={{
            margin: ".3em",
          }}
        >
          {inputValues[array[0]]}
        </label>
        <span className="dotTooltip">
          ?<div className="tooltip">{array[2]}</div>
        </span>
      </article>
    );
  }
  return (
    <div className="container entryField">
      {input.map((array: string[]) => createBlock(array))}
    </div>
  );
};

export default BoxTooltiplabel;
