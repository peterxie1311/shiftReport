import { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api, { Person } from "./api";

interface BoxProps {
  person: Person;
  dropDowns: string[][];
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const BoxTooltipmulti: FC<BoxProps> = ({ person, dropDowns, handleChange }) => {
  function createDropdown(dropdown: string[], person: Person, index: number) {
    const key = person[dropdown[0] as keyof Person] ?? dropdown[0];
    const uniqueKey = `${person.Name}:${dropdown[0]}`;
    return (
      <select
        key={uniqueKey}
        id={uniqueKey}
        name={uniqueKey}
        value={key} // we use key of to get the eg .Name dropdown[0] should always be an interface type
        onChange={handleChange}
      >
        {dropdown.map((options: string, index: number) => (
          <option key={index}>{options}</option>
        ))}
      </select>
    );
  }

  function createBlock(person: Person, dropdowns: string[][]): JSX.Element {
    return (
      <article
        className="head"
        key={person.Name}
        style={{
          padding: "0.5em",
          display: person.Article,
        }}
      >
        <label
          htmlFor={person.Name}
          style={{
            width: "auto",
            paddingRight: ".5em",
          }}
        >
          {person.Name + ":"}
        </label>
        {dropdowns.map((array: string[], index: number) =>
          createDropdown(array, person, index)
        )}

        <span className="dotTooltip">
          ?<div className="tooltip">{person.Name}</div>
        </span>
      </article>
    );
  }

  return <>{createBlock(person, dropDowns)}</>;
};

export default BoxTooltipmulti;
