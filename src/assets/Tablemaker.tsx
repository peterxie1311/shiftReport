import React, { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
interface TablemakerProps {
  rows: string[];
  keys: string[];
  inputValues: { [key: string]: string };
  columns: string[];
  targets: number[];
  title: string;
  subtitle: string;
  columnString: string[];
  targetString: string[];
  columnNames: string[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Tablemaker: FC<TablemakerProps> = ({
  columnNames,
  columns,
  keys,
  rows,
  inputValues,
  targets,
  columnString,
  targetString,
  handleChange,
  title,
  subtitle,
}) => {
  function getColor(target: number, input: number): string {
    if (target > input) {
      return "lightcoral";
    } else if (input >= target) {
      return "lightgreen";
    }
    return "";
  }
  function getCommentcolor(): string {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "white";
    }
    return "black";
  }

  return (
    <>
      <section style={{ width: "100%" }}>
        <h4>{title}</h4>
      </section>
      <section className="hourly" id="hourlyProduction">
        <p></p>
        <p>{subtitle}</p>
        {rows.map((stuff: string) => (
          <p key={stuff}>{stuff}</p>
        ))}

        {columnNames.map((stuff: string, index: number) => (
          <React.Fragment key={index}>
            <p>{stuff}</p>
            <p>{targets[index]}</p>

            {keys.map((stuff: string) => (
              <input
                key={columns[index] + stuff}
                type="number"
                name={columns[index] + stuff}
                value={inputValues[columns[index] + stuff] || ""}
                onChange={handleChange}
                style={{
                  color: "black",
                  backgroundColor: getColor(
                    targets[index],
                    Number(inputValues[columns[index] + stuff])
                  ),
                  borderColor: getColor(
                    targets[index],
                    Number(inputValues[columns[index] + stuff])
                  ),
                }}
              />
            ))}
          </React.Fragment>
        ))}

        {columnString.map((p: string, index: number) => (
          <React.Fragment key={index}>
            <p>{p}</p>
            <p>{targetString[index]}</p>

            {keys.map((stuff: string) => (
              <input
                key={`${columns[index + columnNames.length]}${stuff}`}
                type="string"
                name={`${columns[index + columnNames.length]}${stuff}`}
                value={
                  inputValues[
                    `${columns[index + columnNames.length]}${stuff}`
                  ] || ""
                }
                onChange={handleChange}
                style={{
                  color: getCommentcolor(),
                  backgroundColor: getColor(
                    parseFloat(targetString[index]),
                    Number(
                      inputValues[columns[index + columnNames.length] + stuff]
                    )
                  ),
                  borderColor: getColor(
                    parseFloat(targetString[index]),
                    Number(
                      inputValues[columns[index + columnNames.length] + stuff]
                    )
                  ),
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </section>
      <section style={{ width: "100%" }}>
        <br />
      </section>
    </>
  );
};

export default Tablemaker;
