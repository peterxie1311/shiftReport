import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BoxProps {
  input: string[][];
  inputValues: { [key: string]: string };
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const BoxTooltip: FC<BoxProps> = ({ input, inputValues, handleChange }) => {
  function createBlock(array: string[]): JSX.Element {
    return (
      <article className="container boxtool" key={array[0]}>
        <label htmlFor={array[0]} style={{ width: "20em" }}>
          {array[0] + ":"}
        </label>
        <input
          id={array[0]}
          type={array[1]}
          onChange={handleChange}
          name={array[0]}
          value={inputValues[array[0]] || ""}
        />

        <span className="dotTooltip">
          ?<div className="tooltip">{array[2]}</div>
        </span>
      </article>
    );
  }

  return (
    <div className="container entryField ">
      {input.map((array: string[]) => createBlock(array))}
    </div>
  );
};

export default BoxTooltip;
