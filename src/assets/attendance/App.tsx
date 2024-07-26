import React, { useState, ChangeEvent, useEffect } from "react";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import api, { Person } from "../api";
import BoxTooltipmulti from "../BoxTooltipdropdown1";
import BoxTooltip from "../BoxTooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dropdown from "../dropdown";

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

  const [addPerson, setaddPerson] = useState<{ [key: string]: string }>({});
  const [selectedCrew, selectCrew] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (
      selectedCrew["Select a Crew"] !== null &&
      selectedCrew["Select a Crew"] !== undefined
    ) {
      fetch();
      //  console.log(filterValue[0]);
      handleFilter(filterValue[0], inputValues, setInputValues);
    }
  }, [selectedCrew]);

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
    api
      .getNames(`nameslist ${selectedCrew["Select a Crew"]}.csv`)
      .then((data) => {
        setInputValues(data);
      });
  }

  const dropdowns: string[][] = [
    role,
    crew,
    shift,
    allocation,
    event,
    reason,
    commitFlag,
  ];

  function handleFilter(
    person: Person,
    _inputValues: Person[],
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
  function savePreview(inputarray: Person[]) {
    api.postModified(
      inputarray,
      "/api/processNames",
      `nameslist ${selectedCrew["Select a Crew"]}.csv`
    );
  }

  function commitAllocations(array: Person[]) {
    const commitAlloc = array.filter((person) => person.Commit === "Yes");
    api.postModified(
      commitAlloc,
      "/api/appendDB",
      "databaseAllocations.csv",
      selectedCrew["Select a Crew"]
    );

    const clearCommit = inputValues.map((person) => ({
      ...person,

      Commit: "No",
    }));
    setInputValues(clearCommit);
    savePreview(clearCommit);
  }

  function addCrew() {
    const newPerson: Person = {
      Name: addPerson["Name"], // Using the variable to initialize the Name property
      Position: "",
      Crew: "",
      Shift: "",
      Allocation: "",
      Event: "",
      Reason: "",
      Commit: "",
      Article: "",
    };

    setInputValues((prevValues) => [...prevValues, newPerson]);
  }
  function removeCrew() {
    setInputValues((prevValues) =>
      prevValues.filter((person) => person.Name !== addPerson["Name"])
    );
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
    const field = personField as keyof Person;

    const isCommit = {
      Commit: "Yes",
    };
    const newValues = {
      [field]: value,
      ...(field === "Allocation" && value != "Allocation" ? isCommit : {}), // if field is allocation and value isnt allocation then tick yes for commit :)
    };

    if (personName === "Filter") {
      setfilterValues((prevValues) => {
        const updatedFilterValues = prevValues.map(
          (person) =>
            person.Name === personName ? { ...person, ...newValues } : person // if person name is = person name in event then append newValues else return the person
        );
        handleFilter(updatedFilterValues[0], inputValues, setInputValues);

        return updatedFilterValues;
      });
    } else {
      setInputValues((prevValues) =>
        prevValues.map((person) =>
          person.Name === personName && person
            ? { ...person, ...newValues }
            : person
        )
      );
    }
    setInputValues((p) => [...p].sort((x, y) => x.Name.localeCompare(y.Name))); // sort names everytime an input is being done
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
          <div
            className="container entryField"
            style={{
              alignItems: "center",
            }}
          >
            {filterValue.map((person, index) => (
              <BoxTooltipmulti
                key={index} // Ensure each element has a unique key
                person={person} // Pass the current person from the array
                dropDowns={dropdowns}
                handleChange={handleChange}
              />
            ))}

            <Dropdown
              id={"Select a Crew"}
              selections={["Crew A", "Crew B", "Crew C"]}
              inputValues={selectedCrew}
              mouseChange={api.handleDropdownItemClick(
                "Select a Crew",
                selectCrew
              )}
            />
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
          <BoxTooltip
            input={[
              [
                "Name",
                "text",
                "Type The first and last name of the person you would like to add",
              ],
            ]}
            inputValues={addPerson}
            handleChange={function (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ): void {
              const { name, value } = event.target;
              setaddPerson({
                [name]: value,
              });
            }}
          />
          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={addCrew}
          >
            Add Person
          </button>

          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={removeCrew}
          >
            Remove Person
          </button>
          <p></p>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={() => savePreview(inputValues)}
          >
            Save
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={() => commitAllocations(inputValues)}
          >
            Commit Allocations
          </button>

          <section className="workspace"></section>
        </div>
      </main>
    </>
  );
};

export default App;
