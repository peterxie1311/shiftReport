import React, { useState, ChangeEvent, useEffect } from "react";

import "./App.css";
import Witron from "./assets/witron";
import SignatureUpdater from "./assets/dateCheck";
//import SideBar from "./assets/sideBar";
import LargeInput from "./assets/largeInput";
import BoxToolTip from "./assets/BoxTooltip";
import BoxTooltiplabel from "./assets/BoxTooltiplabel";
import Tablemaker from "./assets/Tablemaker";
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
    ["Prio 5 Pallets", "number", "RE13"],
    ["Prio 6 Pallets", "number", "RE13"],
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
    ["Blocked Cases", "number", "IN01"],
    ["#Blocked Equipment", "number", "BL01"],
  ];

  function excludeCheck(array: string[][], substring: string): string[][] {
    const returnArray = array.filter((subArray) =>
      subArray.every((value) => !value.includes(substring))
    );
    return returnArray;
  }

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
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const kpiValues = columns.map((column, index) => ({
    name: column.trim(),
    value: columnValue[index],
  }));

  function getKPI(
    kpi: string,
    columns: string[],
    columnValue: string[]
  ): string {
    for (let i = 0; i < columns.length; i++) {
      if (kpi.includes(columns[i])) {
        const name = kpi.replace(columns[i], columnValue[i] + " ");
        for (let j = 0; j < rowsDefault.length; j++) {
          if (name.includes(rowsDefault[j])) {
            return name.replace(rowsDefault[j], rows[j]);
          }
        }
        return name;
      }
    }
    return kpi;
  }

  const inputArray = Object.keys(inputValues).map((key) => ({
    name: key,
    value: inputValues[key], // using this for the database file
  }));

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

  //  ----------------------------------Check that all the fields are filled-----------------------------------------------------------
  function getnotFilled2d(
    fields: string[][],
    inputProvided: { name: string; value: unknown }[]
  ): string[] {
    const notFilled: string[] = [];
    let check: boolean = false;
    for (let i = 0; i < fields.length; i++) {
      check = false;
      for (let j = 0; j < inputProvided.length; j++) {
        if (inputProvided[j].name === fields[i][0]) {
          /* We do a check that the values are in the input provided which is usually the input value */
          if (inputProvided[j].value !== "" && inputProvided[j].value !== " ") {
            check = true;
          }
        }
      }
      if (check === false) {
        notFilled.push(fields[i][0]);
      }
    }
    return notFilled;
  }
  // -----------------------------------------Download Email Draft from back end ----------------------------------------------------------------

  //-------------------------------------------------Post Data to backend --------------------------------------------------------------------------------
  let responseData: string = "failed";
  const postData = () => {
    //inputBox.push(["Shift", ""]);
    //  inputBox.push(["Crew", ""]);
    // const notFilledNum = getnotFilled2d(inputBox, inputArray);
    const notFilledNum: string[] = [];
    /* this is to check that all the data is filled */ // NEED TO CHANGE HOW WE APPEND THIS ARRAY
    const notFilledTable = getnotFilled2d(
      excludeCheck(rowCols, "KPI5"),
      inputArray
    );
    if (notFilledNum.length + notFilledTable.length === 0) {
      inputArray.push(...kpiValues);
      inputArray.push({ name: "Report type", value: "Shift" });
      axios
        .post<{ message: string }>("http://127.0.0.1:8080/api/data", inputArray)
        .then((response) => {
          responseData = response.data.message;

          if (responseData === "success") {
            downloadEmailDraft();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert(
        "You did not enter these values: " +
          notFilledNum.join(", ") +
          notFilledTable.join(", ")
      );
    }
  };

  const downloadEmailDraft = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8080/api/download_email_draft",
        {
          params: {
            data: Object.keys(inputValues).map((key) => ({
              name: getKPI(key, columns, columnValue),
              value: inputValues[key], // grabbing final values
            })),
          },
          responseType: "blob", // Expecting blob data
        }
      );

      // Create a Blob object from the response data
      const blob = new Blob([response.data]);

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create an <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formattedDate}${inputValues["Shift"]}.msg`; // Adjust filename as needed
      document.body.appendChild(a);
      a.click(); // Simulate click
      document.body.removeChild(a);

      // Clean up by revoking the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --------------- test function to add more functions to the submit button will remove later -------------------

  const testSubmit = () => {
    postData();
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
      return newValues;
    });
  };
  //--------------------------- Handling change of a mouse click ------------------------------------------------------
  const handleDropdownItemClick =
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const selected = target.innerText;

      setInputValues((prevValues) => ({
        ...prevValues,
        [id]: selected,
      }));
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
                mouseChange={handleDropdownItemClick("Shift")}
              />

              <Dropdown
                id={"Crew"}
                inputValues={inputValues}
                selections={["Crew A", "Crew B", "Crew C"]}
                mouseChange={handleDropdownItemClick("Crew")}
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
              keys={rowsDefault}
              inputValues={inputValues}
              targets={targets}
              handleChange={handleChange}
              columnString={columnString}
              targetString={targetString}
            />
          </div>
          <section>
            <BoxTooltiplabel input={calcFields} inputValues={inputValues} />
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
            <button className="btn btn-primary btn-sm" onClick={testSubmit}>
              Submit
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
