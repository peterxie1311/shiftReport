import React, { FC, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
interface TablemakerProps {
  rows: string[];
  keys: string[];
  inputValues: { [key: string]: string };
  columns: string[];
  targets: number[];
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
}) => {
  function getColor(target: number, input: number): string {
    if (target > input) {
      return "lightcoral";
    } else if (input >= target) {
      return "lightgreen";
    }
    return "";
  }

  return (
    <>
      <section style={{ width: "100%" }}>
        <h4>Production Per Hour (UMS):</h4>
      </section>
      <section className="hourly" id="hourlyProduction">
        <p></p>
        <p>Target</p>
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

        {columnString.map((columnNames: string, index: number) => (
          <React.Fragment key={index}>
            <p>{columnNames}</p>
            <p>{targetString[index]}</p>

            {keys.map((stuff: string) => (
              <input
                key={columns[index + columnNames.length] + stuff}
                type="string"
                name={columns[index + columnNames.length] + stuff}
                value={
                  inputValues[columns[index + columnNames.length] + stuff] || ""
                }
                onChange={handleChange}
                style={{
                  color: "white",
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

        {/* 
        <p>{columnNames[0]}</p>
        <p>{targets[0]}</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[0] + stuff}
            type="number"
            name={columns[0] + stuff}
            value={inputValues[columns[0] + stuff] || ""}
            onChange={handleChange}
            style={{
              color: "black",
              backgroundColor: getColor(
                8000,
                Number(inputValues[columns[0] + stuff])
              ),
              borderColor: getColor(
                8000,
                Number(inputValues[columns[0] + stuff])
              ),
            }}
          />
        ))}
        <p>{columnNames[1]}</p>
        <p>{targets[1]}</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[1] + stuff}
            type="number"
            name={columns[1] + stuff}
            value={inputValues[columns[1] + stuff] || ""}
            onChange={handleChange}
            style={{
              color: "black",
              backgroundColor: getColor(
                8000,
                Number(inputValues[columns[1] + stuff])
              ),
              borderColor: getColor(
                8000,
                Number(inputValues[columns[1] + stuff])
              ),
            }}
          />
        ))}
        <p>{columnNames[2]}</p>
        <p>8 000</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[2] + stuff}
            type="number"
            name={columns[2] + stuff}
            value={inputValues[columns[2] + stuff] || ""}
            onChange={handleChange}
            style={{
              color: "black",
              backgroundColor: getColor(
                8000,
                Number(inputValues[columns[2] + stuff])
              ),
              borderColor: getColor(
                8000,
                Number(inputValues[columns[2] + stuff])
              ),
            }}
          />
        ))}
        <p>{columnNames[3]}</p>
        <p>8 000</p>
        {keys.map((stuff: string) => (
          <input
            key={columns[3] + stuff}
            type="number"
            name={columns[3] + stuff}
            value={inputValues[columns[3] + stuff] || ""}
            onChange={handleChange}
            style={{
              color: "black",
              backgroundColor: getColor(
                8000,
                Number(inputValues[columns[3] + stuff])
              ),
              borderColor: getColor(
                8000,
                Number(inputValues[columns[3] + stuff])
              ),
            }}
          />
        ))}
        <p>{columnNames[4]}</p>
        <p> </p>
        {keys.map((stuff: string) => (
          <input
            key={columns[4] + stuff}
            type="text"
            name={columns[4] + stuff}
            value={inputValues[columns[4] + stuff] || ""}
            onChange={handleChange}
            style={{
              color: "white",
              borderColor: "inherit",
              backgroundColor: "inherit",
            }}
          />
        ))}
 */}
      </section>
      <section style={{ width: "100%" }}>
        <br />
      </section>
    </>
  );
};

export default Tablemaker;
