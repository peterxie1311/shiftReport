import React, { useState, ChangeEvent, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import SignatureUpdater from "../dateCheck";
import LargeInput from "../largeInput";
import BoxToolTip from "../BoxTooltip";
import Tablemaker from "../Tablemaker";
import Dropdown from "../dropdown";
import axios from "axios";

const App: React.FC = () => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
    ["Partial Stop"],
    ["Full Stop"],
    ["Partial Inbound"],
    ["Partial Depal"],
    ["Partial COM"],
    ["Partial Outbound"],
    ["Partial CPS"],
    ["Partial AIO"],
    ["Partial ALP"],
    ["Full Inbound"],
    ["Full Depal"],
    ["Full COM"],
    ["Full Outbound"],
    ["Full CPS"],
    ["Full AIO"],
    ["Full ALP"],
  ];

  const headers: string[][] = [
    ["Site", ""],
    ["Department", ""],
    ["Document"],
    ["Date"],
    ["Shift"],
    ["Time"],
  ];

  const descriptions: string[][] = [
    ["Sub-System"],
    ["Area/GC"],
    ["LAC"],
    ["Element"],
    ["Admin"],
    ["Asset"],
    ["Issue"],
  ];

  const [troubleshooting, setTroubleshooting] = useState<string[]>([
    "Step taken",
  ]);

  const addTroubleshoot = () => {
    setTroubleshooting((prevTroubleshoot) => [
      ...prevTroubleshoot,
      "Step taken",
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

  const identifiers: string[][] = [["Product"], ["Description"], ["TU #"]];

  return (
    <>
      <header>
        <Witron
          navItems={["Incident Report", "Attendance", "Shift Report"]}
          links={[
            "/src/assets/incident/index.html",
            "/src/assets/attendance/index.html",
            "/index.html",
          ]}
        />
      </header>
      <main>
        <div className="main-content">
          <section>
            <BoxToolTip
              title="Incident Details"
              inputNum={[]}
              inputString={headers}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          </section>

          <section>
            <BoxToolTip
              title=""
              inputNum={[]}
              inputString={descriptions}
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
                key={index}
                title=""
                inputNum={[]}
                inputString={identifiers}
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
              inputLabel={`${titles} ${index + 1}`}
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
            title=""
            inputNum={[]}
            inputString={[["Help Desk Ticket#"], ["WiTool Number"]]}
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
            title=""
            inputNum={stops}
            inputString={[]}
            inputValues={inputValues}
            handleChange={handleChange}
          />

          <BoxToolTip
            title=""
            inputNum={scratched}
            inputString={[]}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addScratched}>
            Add Product Ident
          </button>

          <BoxToolTip
            title=""
            inputNum={lateRoutes}
            inputString={[]}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addLateroute}>
            Add Late route
          </button>

          <BoxToolTip
            title=""
            inputNum={witness}
            inputString={[]}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <button className="btn btn-primary btn-sm" onClick={addWitness}>
            Add Witness
          </button>
        </div>
      </main>
    </>
  );
};

export default App;
