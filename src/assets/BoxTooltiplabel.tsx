import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BoxProps {
  input: string[][];
  inputValues: { [key: string]: string };
  articleClass: string;
}

const BoxTooltiplabel: FC<BoxProps> = ({
  input,
  inputValues,
  articleClass,
}) => {
  function createBlock(array: string[], articleClass: string): JSX.Element {
    return (
      <article className={articleClass} key={array[0]}>
        <label
          htmlFor={array[0]}
          style={{
            margin: ".3em",
          }}
        >
          {array[0]}
        </label>
        <label id={array[0]}>{inputValues[array[0]]}</label>
        <span className="dotTooltip">
          ?<div className="tooltip">{array[2]}</div>
        </span>
      </article>
    );
  }
  return (
    <div className="container entryField">
      {input.map((array: string[]) => createBlock(array, articleClass))}
    </div>
  );
};

export default BoxTooltiplabel;
