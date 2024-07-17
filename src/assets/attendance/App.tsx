import React, { useState, ChangeEvent, useEffect } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
interface CustomDateChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

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

  const allocations: string[][] = [
    ["Maint", "MTL"],
    ["DEP/DEF", "Area Lead"],
    ["OB/LOOP/CORE"],
    ["Floor Lead"],
    ["AIO Repack/Rlog"],
  ];

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

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
      return newValues;
    });
  };

  const handleDatechange = (event: CustomDateChangeEvent) => {
    const { name, value } = event.target;

    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };
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
          <section className="workspace"></section>
        </div>
      </main>
    </>
  );
};

export default App;
