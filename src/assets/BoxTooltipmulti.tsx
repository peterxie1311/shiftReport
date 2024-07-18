import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BoxProps {
  namesandtool: string[][];
  dropDowns: string[][];
  columns: string[][];
  inputValues: { [key: string]: string };
  articleClassname: string;
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const BoxTooltipmulti: FC<BoxProps> = ({
  namesandtool,
  dropDowns,
  inputValues,
  handleChange,
  articleClassname,
  columns,
}) => {
  function createDropdown(
    dropdown: string[],
    iteration: number,
    name: string,
    columns: string[][]
  ) {
    return (
      <select
        key={name + ":" + columns[iteration][0]}
        id={name + ":" + columns[iteration][0]}
        name={name + ":" + columns[iteration][0]}
        value={inputValues[name + ":" + columns[iteration][0]] || ""}
        onChange={handleChange}
      >
        {dropdown.map((options: string, index: number) => (
          <option key={index}>{options}</option>
        ))}
      </select>
    );
  }

  function createBlock(
    name: string[],
    dropdowns: string[][],
    articleClassname: string,
    columns: string[][]
  ): JSX.Element {
    return (
      <article className={articleClassname} key={name[0]}>
        <label
          htmlFor={name[0]}
          style={{
            width: "auto",
            padding: ".5em",
          }}
        >
          {name[0] + ":"}
        </label>
        {dropdowns.map((array: string[], index: number) =>
          createDropdown(array, index, name[0], columns)
        )}
        <span className="dotTooltip">
          !<div className="tooltip">{name[1]}</div>
        </span>
      </article>
    );
  }

  return (
    <div className="container entryField ">
      {namesandtool.map((name: string[]) =>
        createBlock(name, dropDowns, articleClassname, columns)
      )}
    </div>
  );
};

export default BoxTooltipmulti;
