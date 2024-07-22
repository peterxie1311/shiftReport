import React, { useState, ChangeEvent, useEffect } from "react";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import api, { Person } from "../api";
import BoxTooltipmulti from "../BoxTooltipdropdown1";
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

  const event: string[] = [
    "Event",
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
    "Reason",
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
    "Allocation",
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
  const shift: string[] = ["Shift", "Morning", "Evening", "Night"];
  const role: string[] = [
    "Position",
    "EM",
    "OM",
    "LCC",
    "MTL",
    "2nd PTM",
    "PARTS",
    "PTM",
  ];
  const crew: string[] = ["Crew", "Crew A", "Crew B", "Crew C", "PM", "Night"];
  const commitFlag: string[] = ["Commit", "Yes", "No"];

  const emptyPerson: Person = {
    Name: "",
    Position: "",
    Crew: "",
    Shift: "",
    Allocation: "",
    Event: "",
    Reason: "",
    Commit: "",
    Article: "None",
  };
  const filterPerson: Person = {
    Name: "Filter",
    Position: role[0],
    Crew: crew[0],
    Shift: shift[0],
    Allocation: allocation[0],
    Event: event[0],
    Reason: reason[0],
    Commit: commitFlag[0],
    Article: "",
  };

  const [filterValue, setfilterValues] = useState<Person[]>([filterPerson]);

  const [inputValues, setInputValues] = useState<Person[]>([emptyPerson]);

  async function fetch() {
    api.getNames().then((data) => {
      setInputValues(data);
    });
  }
  useEffect(() => {
    if (Object.keys(inputValues).length === 1) {
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

  const testSubmit = () => {};

  function handleFilter(
    person: Person,
    inputValues: Person[],
    setInputValues: React.Dispatch<React.SetStateAction<Person[]>>
  ): void {
    if (person.Name === "Filter") {
      setInputValues((prevValues) =>
        prevValues.map((person) => ({
          ...person,
          Article: "", // Set the Article field to an empty string
        }))
      );

      for (const key of Object.keys(person)) {
        const value = person[key as keyof typeof person];
        if (key !== value) {
          setInputValues((prevValues) =>
            prevValues.map((personMap) => {
              // Determine the value for the `Article` field
              let articleValue = "";

              for (const key1 of Object.keys(personMap)) {
                if (key1 === "Name") {
                  continue; // Skip the "Name" key
                }

                if (
                  personMap[key1 as keyof Person] !==
                  person[key1 as keyof Person]
                ) {
                  if (
                    person[key1 as keyof Person] !== key1 &&
                    key1 !== "Article"
                  ) {
                    //console.log(key1);
                    articleValue = "None"; // Set to "None" if values differ
                    break; // Exit the loop once a difference is found
                  }
                }
              }
              return {
                ...personMap,
                Article: articleValue, // Apply the determined `Article` value
              };
            })
          );
        }
      }
    }
  }

  //----------------------------------------------------Handle Change -----------------------------------------------------
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    const personName = name.split(":")[0];
    const personField = name.split(":")[1];
    const combinedValues = [...filterValue, ...inputValues];
    // const person: Person = api.findPerson(personName, combinedValues);

    const field = personField as keyof Person;

    //const key = person[personField as keyof Person];

    const newValues = {
      [field]: value,
    };

    if (personName === "Filter") {
      // Update filter values and then handle the filtering
      setfilterValues((prevValues) => {
        const updatedFilterValues = prevValues.map((person) =>
          person.Name === personName ? { ...person, ...newValues } : person
        );

        handleFilter(updatedFilterValues[0], inputValues, setInputValues);

        return updatedFilterValues;
      });
    } else {
      setInputValues((prevValues) =>
        prevValues.map((person) =>
          person.Name === personName ? { ...person, ...newValues } : person
        )
      );
    }
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
          {/* <BoxTooltiplabel
            input={columns}
            inputValues={{}}
            articleClass="container label"
          /> */}
          <div className="container entryField">
            {filterValue.map((person, index) => (
              <BoxTooltipmulti
                key={index} // Ensure each element has a unique key
                person={person} // Pass the current person from the array
                dropDowns={dropdowns}
                handleChange={handleChange}
              />
            ))}
          </div>

          <div className="container entryField">
            {inputValues.map((person, index) => (
              <BoxTooltipmulti
                key={index} // Ensure each element has a unique key
                person={person} // Pass the current person from the array
                dropDowns={dropdowns}
                handleChange={handleChange}
              />
            ))}
          </div>

          {/* <BoxTooltiplabel
            input={[["Over Time"]]}
            inputValues={{}}
            articleClass="container head"
          /> */}
          <button className="btn btn-primary btn-sm" onClick={testSubmit}>
            Submit
          </button>

          <section className="workspace"></section>
        </div>
      </main>
    </>
  );
};

export default App;
