import React, { useState, ChangeEvent, useEffect } from "react";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import api from "../api";
import BoxTooltipmulti from "../BoxTooltipmulti";
import BoxTooltiplabel from "../BoxTooltiplabel";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App: React.FC = () => {
  // to get the signature at the bottom
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

  //---------------------------Constants---------------------------------------------------------------

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const event: string[] = [
    "Absence",
    "Lateness",
    "Early Depart",
    "Overtime",
    "Leave",
    "Offsite",
    "Vacation",
    "Training",
  ];
  const reason: string[] = [
    "Sick / NWR Injury",
    "Work-Related Injury",
    "Bereavement",
    "Other Excused",
    "Unexcused Absence",
    "Disciplinary / Susp",
    "Car / Commute Issue",
    "Personal / Family",
    "Traffic / Bad Weather",
    "Woke-up late",
    "Personal / Family ",
    "Sick / NWR Injury",
    "Work-Related Injury",
    "Low Volume",
    "Other",
    "Short (absences)",
    "Special Projects",
    "Customer",
    "Parental",
    "Support",
    "Training",
    "Other",
  ];
  const allocation: string[] = [
    "AIO",
    "COMS",
    "Defoil",
    "Depal",
    "HighBay",
    "HighBay Loop",
    "Inbound",
    "Outbound",
    "TrayCrane Upper",
    "TrayCrane Lower",
    "LCC",
    "Masterdata",
    "Maintenance",
    "Training",
    "Absence",
    "COMs & TCRNs",
    "Depal, HBW, Inbound",
    "AIO & Outbound",
    "Other",
    "Absence",
  ];
  const shift: string[] = ["Morning", "Evening", "Night"];
  const role: string[] = ["EM", "OM", "LCC", "MTL", "2nd PTM", "PARTS", "PTM"];
  const crew: string[] = ["Crew A", "Crew B", "Crew C", "PM", "Night"];
  const commitFlag: string[] = ["Yes", "No"];

  async function fetch() {
    api.getNames().then((data) => {
      setInputValues(data);
    });
    console.log(inputValues);
  }
  useEffect(() => {
    if (Object.keys(inputValues).length === 0) {
      fetch(); // Fetch data only if inputValues is empty
    }
  }, []);

  const dropdowns: string[][] = [
    role,
    crew,
    shift,
    allocation,
    event,
    reason,
    commitFlag,
  ];
  const nameandtool: string[][] = api.getValuesWithKeyNameSubstring(
    inputValues,
    ":Name"
  );
  const columns: string[][] = [
    ["Name"],
    ["Position"],
    ["Crew"],
    ["Shift"],
    ["Allocation"],
    ["Event"],
    ["Reason"],
    ["Commit Flag"],
  ];

  //----------------------------------------------------Handle Change -----------------------------------------------------
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };
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
      <main>
        <div className="main-content">
          <BoxTooltiplabel
            input={columns}
            inputValues={{}}
            articleClass="container label"
          />
          <BoxTooltipmulti
            articleClassname="container multiselect"
            namesandtool={nameandtool}
            columns={columns.slice(1)}
            dropDowns={dropdowns}
            inputValues={inputValues}
            handleChange={handleChange}
          />
          <BoxTooltiplabel
            input={[["Over Time"]]}
            inputValues={{}}
            articleClass="container head"
          />

          <section className="workspace"></section>
        </div>
      </main>
    </>
  );
};

export default App;
