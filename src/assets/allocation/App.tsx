import React from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Witron from "../witron";
import DummyTable from "../table"; // Make sure this path is correct and matches the filename

const App: React.FC = () => {
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
            <DummyTable /> {/* Integrating the DummyTable component here */}
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
