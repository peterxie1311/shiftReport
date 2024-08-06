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
  api.readFile();

  //---------------------------Constants---------------------------------------------------------------

  const [addPerson, setaddPerson] = useState<{ [key: string]: string }>({});
  const [selectedCrew, selectCrew] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (
      selectedCrew["Select a Crew"] !== null &&
      selectedCrew["Select a Crew"] !== undefined
    ) {
      fetch();
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
    "Sick",
    "Sick (Med Cert Requested)",
    "Annual Leave",
    "No Show No Call",
    "Carer's Leave",
    "Work Cover",
    "Unfit for work",
    "Travel",
    "NWR Injry",
    "Sick - Unable to Complete Shift",
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
  const isOvertime: string[] = ["OT", "Yes", "No"];
  const OvertimeFrom: string[] = ["OTFrom"].concat(
    api.generateTimeIntervals("00:00", "23:59", 5)
  );
  const OvertimeTo: string[] = ["OTTo"].concat(
    api.generateTimeIntervals("00:00", "23:59", 5)
  );

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
    OT: "",
    OTFrom: "",
    OTTo: "",
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
    OT: isOvertime[0],
    OTFrom: OvertimeFrom[0],
    OTTo: OvertimeTo[0],
  };
  const setAllPerson: Person = {
    Name: "Set All",
    Position: role[0],
    Crew: crew[0],
    Shift: shift[0],
    Allocation: allocation[0],
    Event: event[0],
    Reason: reason[0],
    Commit: commitFlag[0],
    Article: "",
    OT: isOvertime[0],
    OTFrom: OvertimeFrom[0],
    OTTo: OvertimeTo[0],
  };

  const [filterValue, setfilterValues] = useState<Person[]>([
    filterPerson,
    setAllPerson,
  ]);

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
    isOvertime,
    OvertimeFrom,
    OvertimeTo,
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
      let articleValue = ""; // initialise

      for (const key of Object.keys(person)) {
        const value = person[key as keyof typeof person];

        if (key !== value && key !== "Name" && key !== "Article") {
          // console.log(`THIS IS THE KEY: ${key} THIS IS THE VALUE: ${value}`);
          setInputValues((prevValues) =>
            prevValues.map((personMap) => {
              if (personMap.Article === "None") {
                articleValue = "None";
              } else {
                articleValue = "";
              }

              if (
                personMap[key as keyof Person] !== value
                //  &&
                // personMap[key as keyof Person] !== null &&
                // personMap[key as keyof Person] !== undefined
              ) {
                articleValue = "None";
              }

              // if (personMap)
              //   console.log(`filter key:${key} filterValue: ${value}`);

              // for (const personKey of Object.keys(personMap)) {
              //   if (personKey === "Name" || personKey !== key) {
              //     continue; // Skip the "Name" key
              //   }

              //   if(){

              //   }

              //    console.log(`${personKey}: PERSONKEY`);
              //    console.log(`${key}: FilterKey`);

              //   if (
              //     personMap[personKey as keyof Person] !==
              //     person[personKey as keyof Person] // if value of filter does not match value of person
              //   ) {
              //     if (
              //       person[personKey as keyof Person] !==
              //         personMap[personKey as keyof Person] &&
              //       personKey !== "Article"
              //     ) {
              //       console.log(personMap[personKey as keyof Person]);
              //       articleValue = "None"; // Set to "None" if values differ
              //       break; // Exit the loop once a difference is found
              //     }
              //   }
              // }
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

  function appendSetAll(
    setInputValues: React.Dispatch<React.SetStateAction<Person[]>>,
    person: Person
  ) {
    //Update state in a single batch
    setInputValues((prevValues) => {
      return prevValues.map((personMap) => {
        // Create a copy of the personMap and update dynamically
        const updatedPerson = { ...personMap };

        // Iterate over keys and set the value for the corresponding key if the condition is met
        for (const key of Object.keys(person)) {
          const value = person[key as keyof Person];
          if (key !== value && key !== "Name") {
            // Check if the Article field is empty and update the dynamic key
            if (personMap.Article === "") {
              console.log(value);
              updatedPerson[key as keyof Person] = value;
            }
          }
        }
        return updatedPerson;
      });
    });
  }
  function appendCommit( // this is the for appending commit
    setInputValues: React.Dispatch<React.SetStateAction<Person[]>>
  ) {
    setInputValues((prevValues) =>
      prevValues.map((person) =>
        person.Article === "" ? { ...person, Commit: "Yes" } : person
      )
    );
  }

  function download() {
    api.download(
      `nameslist ${selectedCrew["Select a Crew"]}.csv`,
      "html",
      "/api/getAllocations"
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
      OT: "",
      OTFrom: "",
      OTTo: "",
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
    let newValues = {
      [field]: value,
      // ...(field === "Allocation" && value != "Allocation" ? isCommit : {}), // if field is allocation and value isnt allocation then tick yes for commit :)
    };

    if (personName != "Filter" && personName != "Set All") {
      newValues = {
        [field]: value,
        ...(field === "Allocation" && value != "Allocation" ? isCommit : {}), // if field is allocation and value isnt allocation then tick yes for commit :)
      };
    }

    if (personName === "Filter") {
      setfilterValues((prevValues) => {
        const updatedFilterValues = prevValues.map(
          (person) =>
            person.Name === personName ? { ...person, ...newValues } : person // if person name is = person name in event then append newValues else return the person
        );
        handleFilter(updatedFilterValues[0], inputValues, setInputValues);
        return updatedFilterValues;
      });
    } else if (personName === "Set All") {
      setfilterValues((prevValues) => {
        const updatedSetAll = prevValues.map(
          (person) =>
            person.Name === personName ? { ...person, ...newValues } : person // if person name is = person name in event then append newValues else return the person
        );
        return updatedSetAll;
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
        <Witron />
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

            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}
            >
              <Dropdown
                id={"Select a Crew"}
                selections={["Crew A", "Crew B", "Crew C"]}
                inputValues={selectedCrew}
                mouseChange={api.handleDropdownItemClick(
                  "Select a Crew",
                  selectCrew
                )}
              />
              <button
                className="btn btn-secondary"
                // style={{ marginRight: "0.5em" }}
                onClick={() =>
                  appendSetAll(
                    setInputValues,
                    api.findPerson("Set All", filterValue)
                  )
                }
              >
                Confirm Set All
              </button>
              <button
                className="btn btn-secondary"
                // style={{ marginRight: "0.5em" }}
                onClick={() => fetch()}
              >
                Roll Back
              </button>
            </div>
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
            className="btn btn-secondary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={addCrew}
          >
            Add Person
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={removeCrew}
          >
            Remove Person
          </button>
          <p></p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={() => savePreview(inputValues)}
          >
            Save
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={() => commitAllocations(inputValues)}
          >
            Commit Allocations
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginRight: "0.5em" }}
            onClick={() => download()}
          >
            Download PDF
          </button>

          <section className="workspace"></section>
        </div>
      </main>
    </>
  );
};

export default App;
