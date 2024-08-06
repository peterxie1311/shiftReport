import React, { useState, ChangeEvent, useEffect } from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import LargeInput from "../largeInput";
import BoxToolTip from "../BoxTooltip";
import api from "../api";
import axios from "axios";

const App: React.FC = () => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  let responseData: string = "failed";

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    console.log(inputValues);
  };

  api.readFile(); // need to get IP FROM TXT

  const inputArray = Object.keys(inputValues).map((key) => ({
    name: key,
    value: inputValues[key], // using this for the database file
  }));

  const postData = () => {
    inputArray.push({ name: "Report type", value: "Incident" });
    axios
      .post<{ message: string }>(
        "http://10.137.223.232:8080/api/data",
        inputArray
      )
      .then((response) => {
        responseData = response.data.message;

        if (responseData === "success") {
          api.downloadEmailDraftincident(inputValues);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Standard practice to set a message, even though modern browsers may ignore it
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const stops: string[][] = [
    ["Partial Stop", "number", ""],
    ["Full Stop", "number", ""],
    ["Partial Inbound", "number", ""],
    ["Full Inbound", "number", ""],
    ["Partial Depal", "number", ""],
    ["Full Depal", "number", ""],
    ["Partial COM", "number", ""],
    ["Full COM", "number", ""],
    ["Partial Outbound", "number", ""],
    ["Full Outbound", "number", ""],
    ["Partial CPS", "number", ""],
    ["Full CPS", "number", ""],
    ["Partial AIO", "number", ""],
    ["Full AIO", "number", ""],
    ["Partial ALP", "number", ""],
    ["Full ALP", "number", ""],
  ];

  const headers: string[][] = [
    ["Date", "date", "What was the date"],
    ["Shift", "text", ""],
    ["Time", "time", ""],
  ];

  const descriptions: string[][] = [
    ["Sub-System", "text", ""],
    ["Area/GC", "text", ""],
    ["LAC", "number", ""],
    ["Element", "number", ""],
    ["Admin", "text", ""],
    ["Asset", "text", ""],
    ["Issue", "text", ""],
  ];
  const identifiers: string[][] = [["Product"], ["Description"], ["TU #"]];

  const [troubleshooting, setTroubleshooting] = useState<string[]>([
    "Step taken #1",
  ]);

  const addTroubleshoot = () => {
    setTroubleshooting((prevTroubleshoot) => [
      ...prevTroubleshoot,
      `Step taken #${troubleshooting.length + 1}:`,
    ]);
  };

  const [looper, setLooper] = useState<string[]>([""]);

  const addLooper = () => {
    setLooper((prevLooper) => [...prevLooper, ""]);
  };

  const [scratched, setScratched] = useState<string[][]>([
    ["Scratched Cases:"],
    ["Product Ident:"],
  ]);

  const addScratched = () => {
    setScratched((prevScratched) => [...prevScratched, ["Product Ident:"]]);
  };

  const [lateRoutes, setLateRoutes] = useState<string[][]>([
    ["Number of late routes:"],
    ["Route Number:"],
  ]);

  /*
  const handleDatechange = (event: CustomDateChangeEvent) => {
    const { name, value } = event.target;

    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };
      return newValues;
    });
  };*/

  const addLateroute = () => {
    setLateRoutes((prevRoute) => [...prevRoute, ["Route Number:"]]);
  };

  const [witness, setWitness] = useState<string[][]>([["Witness 1:"]]);

  const addWitness = () => {
    setWitness((prevWitness) => [
      ...prevWitness,
      [`Witness ${witness.length + 1}:`],
    ]);
  };

  return (
    <>
      <header>
        <Witron />
      </header>
      <main>
        <div className="main-content">
          <section>
            <BoxToolTip
              input={headers}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          </section>

          <section>
            <BoxToolTip
              input={descriptions}
              inputValues={inputValues}
              handleChange={handleChange}
            />

            <LargeInput
              inputLabel="Description:"
              rows={5}
              cols={300}
              inputValues={inputValues}
              handleChange={handleChange}
            />

            {looper.map((item, index) => (
              <BoxToolTip
                input={identifiers}
                inputValues={inputValues}
                handleChange={handleChange}
              />
            ))}
            <button className="btn btn-primary btn-sm" onClick={addLooper}>
              Add Details
            </button>
          </section>

          {troubleshooting.map((titles: string, index: number) => (
            <LargeInput
              key={index}
              inputLabel={`${titles}`}
              rows={5}
              cols={300}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          ))}
          <button className="btn btn-primary btn-sm" onClick={addTroubleshoot}>
            Add Step
          </button>

          <BoxToolTip
            input={[["Help Desk Ticket#"], ["WiTool Number"]]}
            inputValues={inputValues}
            handleChange={handleChange}
          />

          <LargeInput
            inputLabel={"Corrections & Conclusions"}
            rows={5}
            cols={300}
            inputValues={inputValues}
            handleChange={handleChange}
          />

          <BoxToolTip
            input={stops}
            inputValues={inputValues}
            handleChange={handleChange}
          />

          <BoxToolTip
            input={scratched}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addScratched}>
            Add Product Ident
          </button>

          <BoxToolTip
            input={lateRoutes}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addLateroute}>
            Add Late route
          </button>

          <BoxToolTip
            input={witness}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addWitness}>
            Add Witness
          </button>
          <button className="btn btn-primary btn-sm" onClick={postData}>
            Post Incident Report
          </button>
        </div>
      </main>
    </>
  );
};

export default App;
