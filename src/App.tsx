import React, { useState, ChangeEvent, useEffect } from "react";

import "./App.css";
import Witron from "./assets/witron";
import SignatureUpdater from "./assets/dateCheck";
//import SideBar from "./assets/sideBar";
import LargeInput from "./assets/largeInput";
import BoxToolTip from "./assets/BoxTooltip";
import BoxTooltiplabel from "./assets/BoxTooltiplabel";
import Tablemaker from "./assets/Tablemaker";
import api, { Person, interfaceObject } from "./assets/api";
import Dropdown from "./assets/dropdown";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App: React.FC = () => {
  // to get the signature at the bottom
  SignatureUpdater();
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

  api.readFile();
  // Itialising variables ----------------------------------------------------------------------------------------
  const inputGeneric = [
    ["Report By", "text", "Which PTM"],
    ["Incidents", "number", "Amount of Incidents"],
  ];

  const calcFields = [
    ["COM Total", "number", "Sum"],
    ["Com Cases/Hour Average", "number", "Sum"],
    ["Depal Total", "number", "Sum"],
    ["Depal Cases Average", "number", "Sum"],
    ["Fault Duration (Mins)", "number", "(Fault Secs/60)"],
    ["Avg OPM Availability", "number", ""],
    ["Fault Rate (per 1000 cs)", "number", "PR04"],
  ];
  const inputSO01 = [
    ["Cases All", "number", "SO01"],
    ["Total Open COMs", "number", "SO01 - Start of your shift"],
    ["Total Open AIO", "number", "SO01 - Start of your shift"],
    ["Total Open CPS", "number", "SO01 - Start of your shift"],
    ["loc Occupied % (HBW)", "number", "SO01 Record at start of your shift"],
    ["Chnls Occupied % (HBW)", "number", "SO01 Record at start of your shift"],
    ["loc Occupied % (Tray WH)", "number", "SO01"],
    ["Chnls Occupied % (Tray WH)", "number", "SO01"],
    ["Pallets Received", "number", "So01 Record at end of shift"],
  ];
  const inputPR04 = [
    [
      "Fault Duration (Sec)",
      "number",
      "From the AVG Duration Col from PR04 grouped by SUM Area, prim, cnt | LAC",
    ],
    ["All #Failures", "number", "From ALL # Failures PR04"],
  ];

  const inputRE13 = [
    ["Prio 5 Pallets", "number", "RE13 - Strat Sub = COM & Interval to 1HR"],
    ["Prio 6 Pallets", "number", "RE13 - Strat Sub = COM & Interval to 1HR"],
  ];
  const inputMisc = [
    ["MDB Occupied %", "number", "IN12a"],
    ["AVG Cases/Pallet", "number", "OP50"],
    [
      "Scratched Cases",
      "number",
      "OM25d - Rsn Group add filter = User & STRAT SUB = COM",
    ],
    ["Missing Cases", "number", "WP02"],
    ["Inbound Rejected Pals", "number", "LMFC14"],
    ["Blocked Cases", "number", "IN01"],
    ["#Blocked Equipment", "number", "BL01"],
  ];

  const rowsDefault: string[] = [
    "Hour 1",
    "Hour 2",
    "Hour 3",
    "Hour 4",
    "Hour 5",
    "Hour 6",
    "Hour 7",
    "Hour 8",
    "Hour 9",
  ];
  const rowsMorning: string[] = [
    "5 - 6am",
    "6 - 7am",
    "7 - 8am",
    "8 - 9am",
    "9 - 10am",
    "10 - 11am",
    "11 - 12pm",
    "12 - 1pm",
    "1 - 2pm",
  ];
  const rowsEvening: string[] = [
    "2 - 3pm",
    "3 - 4pm",
    "4 - 5pm",
    "5 - 6pm",
    "6 - 7pm",
    "7 - 8pm",
    "8 - 9pm",
    "9 - 10pm",
    "10 - 11pm",
  ];
  const rowsNight: string[] = [
    "5 - 6pm",
    "6 - 7pm",
    "7 - 8pm",
    "8 - 9pm",
    "9 - 10pm",
    "10 - 11pm",
    "11 - 12pm",
    "12 - 1am",
    "1 - 2am",
  ];
  const columns: string[] = ["KPI1 ", "KPI2 ", "KPI3 ", "KPI4 ", "KPI5 "]; // this is for the handelling of the column names [FYI COLUMNS AND COLUMNNAMES MUST HAVE THE SAME LENGTH!!!!!!!!!]
  const columnNames: string[] = ["COMs", "Depal", "AIO", "Repack"]; //this is more for the email and display  [FYI COLUMNS AND COLUMNNAMES MUST HAVE THE SAME LENGTH!!!!!!!!!]
  const columnString: string[] = ["Comments"]; // make sure columnString and targetString have the same length of elements
  const columnValue: string[] = ["COMs", "Depal", "AIO", "Repack", "Comments"]; // we use this to get kpivalues
  const targetString: string[] = [""];
  const targets: number[] = [18250, 17500, 8000, 8000]; // please make sure this is the same as columns and the target position (e.g. coms = [1] 18250 =[1])

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [rows, setRows] = useState<string[]>(rowsDefault);
  const rowCols: string[][] = createRowCols(columns, rowsDefault); // this is to add the values together and to check everything is filled at the end

  const kpiValues = columns.map((column, index) => ({
    name: column.trim(),
    value: columnValue[index],
  }));

  const inputArray: interfaceObject[] = Object.keys(inputValues).map((key) => ({
    name: key as string,
    value: inputValues[key] as string, // using this for the database file
  }));

  const [isVisible, setIsVisible] = useState<boolean>(false);

  //-------------- Setting Rows ----------------------------------------------------------------------------------------
  useEffect(() => {
    if (inputValues.Shift === "Morning") {
      setRows(rowsMorning);
    } else if (inputValues.Shift === "Evening") {
      setRows(rowsEvening);
    } else if (inputValues.Shift === "Night") {
      setRows(rowsNight);
    } else {
      setRows(rowsDefault);
    }
  }, [inputValues]);

  // This is to create the tables for final Check  -------------------------------------------

  function createRowCols(columns: string[], rowMaker: string[]): string[][] {
    const rowCols: string[][] = [];
    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < rowMaker.length; j++) {
        rowCols.push([
          columns[i] + rowMaker[j],
        ]); /* this initialises the tablemaker check */
      }
    }
    return rowCols;
  }

  //-------------------------------------------------Post Data to backend --------------------------------------------------------------------------------
  const postData = () => {
    inputMisc.push(["Shift", ""]);
    inputMisc.push(["Crew", ""]);
    const notFilledinputGeneric = api.getnotFilled2d(inputGeneric, inputArray);
    const notFilledinputSO01 = api.getnotFilled2d(inputSO01, inputArray);
    const notFilledinputPR04 = api.getnotFilled2d(inputPR04, inputArray);
    const notFilledinputRE13 = api.getnotFilled2d(inputRE13, inputArray);
    const notFilledinputMisc = api.getnotFilled2d(inputMisc, inputArray);
    /* this is to check that all the data is filled */ // NEED TO CHANGE HOW WE APPEND THIS ARRAY excludeCheck is used to exclude checking a key
    const notFilledTable = api.getnotFilled2d(
      api.excludeCheck(rowCols, "KPI5"),
      inputArray
    );
    if (
      notFilledinputGeneric.length +
        notFilledinputSO01.length +
        notFilledinputPR04.length +
        notFilledinputRE13.length +
        notFilledinputMisc.length +
        notFilledTable.length ===
      0
    ) {
      inputArray.push(...kpiValues);
      inputArray.push({ name: "Report type", value: "Shift" });
      api.post(
        "/api/data",
        inputArray,
        true,
        inputValues,
        columns,
        columnValue,
        rowsDefault,
        rows
      );
    } else {
      alert(
        "You did not enter these values: " +
          notFilledinputGeneric.join(", ") +
          notFilledinputSO01.join(", ") +
          notFilledinputPR04.join(", ") +
          notFilledinputRE13.join(", ") +
          notFilledinputMisc.join(", ") +
          notFilledTable.join(", ")
      );
    }
  };

  // --------------- test function to add more functions to the submit button will remove later -------------------
  const convertObjectToArray = (obj: {
    [key: string]: string;
  }): { [key: string]: string }[] => {
    // Wrap the object in an array
    return [obj];
  };
  const saveChanges = () => {
    const crewValue = inputValues["Crew"];
    api.postModified(
      convertObjectToArray(inputValues),
      "/api/processNames",
      `shiftReport ${crewValue}.csv`
    );
  };

  const getLastSave = () => {
    const crewValue = inputValues["Crew"];
    api.getValues(
      `shiftReport ${crewValue}.csv`,
      "api/getNames",
      setInputValues
    );
    //  console.log("THIS IS THE INPUT ARRAY");
    console.log(inputValues);
  };
  const getLastReport = () => {
    setIsVisible(true);
    api.getValues(``, "api/getReport", setInputValues);
    setIsVisible(false);
  };
  const testSubmit = () => {
    //postData
    postData();

    // api.post(
    //   "api/data",
    //   inputArray,
    //   true,
    //   inputValues,
    //   columns,
    //   columnValue,
    //   rowsDefault,
    //   rows
    // );
  };

  //------------------ Handling event change of an HTML input area -------------------------------------
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };
      // console.log(rowCols);
      //---------------------Calculating the total values -------------------------------------------------
      let kpi1Total = 0;
      rowCols.forEach((things) => {
        //    console.log(things);
        if (things[0].includes(columns[0])) {
          // change these to kpi1 total for com
          // console.log(things[0]);
          kpi1Total += parseFloat(newValues[things[0]] || "0");
        }
      });
      newValues["COM Total"] = kpi1Total.toString();
      let kpi2Total = 0;
      rowCols.forEach((things) => {
        if (things[0].includes(columns[1])) {
          // kpi2 total for depal

          kpi2Total += parseFloat(newValues[things[0]] || "0");
        }
      });
      newValues["Depal Total"] = kpi2Total.toString();
      newValues["Depal Cases Average"] = (kpi2Total / 9).toString();
      newValues["Com Cases/Hour Average"] = (kpi1Total / 9).toString();
      const opmavail = (
        ((540 - parseFloat(newValues["Fault Duration (Mins)"])) / 540) *
        100
      ).toFixed(2); // to calculate opm availability
      newValues["Avg OPM Availability"] = opmavail.toString() + "%";
      newValues["Fault Duration (Mins)"] = (
        parseFloat(newValues["Fault Duration (Sec)"]) / 60
      ).toString();
      newValues["Fault Rate (per 1000 cs)"] = (
        (parseFloat(newValues["All #Failures"]) /
          parseFloat(newValues["Cases All"])) *
        1000
      ).toString();
      console.log(newValues);
      return newValues;
    });
  };

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
      {isVisible && (
        <img
          id="myGif"
          src="src/loading.gif"
          alt="Loading..."
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        />
      )}
      <main>
        <div className="main-content">
          <div className="container entryField">
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}
            >
              <Dropdown
                id={"Shift"}
                inputValues={inputValues}
                selections={["Morning", "Evening", "Night"]}
                mouseChange={api.handleDropdownItemClick(
                  "Shift",
                  setInputValues
                )}
              />

              <Dropdown
                id={"Crew"}
                inputValues={inputValues}
                selections={["Crew A", "Crew B", "Crew C"]}
                mouseChange={api.handleDropdownItemClick(
                  "Crew",
                  setInputValues
                )}
              />
            </div>
          </div>
          <LargeInput
            inputLabel="Shift Comments and General Information"
            rows={5}
            cols={120}
            inputValues={inputValues}
            handleChange={handleChange}
          />

          <div className="container entryField">
            <Tablemaker
              columnNames={columnNames}
              columns={columns}
              rows={rows}
              subtitle="Target"
              title="Production Per Hour (Cases - SO01):"
              keys={rowsDefault}
              inputValues={inputValues}
              targets={targets}
              handleChange={handleChange}
              columnString={columnString}
              targetString={targetString}
            />
          </div>
          <section>
            <BoxTooltiplabel
              input={calcFields}
              inputValues={inputValues}
              articleClass="container boxtool"
            />
            <BoxToolTip
              input={inputGeneric}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            <BoxToolTip
              input={inputSO01}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            <BoxToolTip
              input={inputPR04}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            <BoxToolTip
              input={inputRE13}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            <BoxToolTip
              input={inputMisc}
              inputValues={inputValues}
              handleChange={handleChange}
            />
            <LargeInput
              inputLabel="Blocked Equipment Comments"
              rows={5}
              cols={120}
              inputValues={inputValues}
              handleChange={handleChange}
            />
          </section>

          <section>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginRight: "0.5em" }}
              onClick={testSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginRight: "0.5em" }}
              onClick={saveChanges}
            >
              Save Changes
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginRight: "0.5em" }}
              onClick={getLastSave}
            >
              Get last save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginRight: "0.5em" }}
              onClick={getLastReport}
            >
              Get Report
            </button>
          </section>
        </div>
      </main>
      <footer className="footer">
        <p id="signature"></p>
      </footer>
    </>
  );
};

export default App;
