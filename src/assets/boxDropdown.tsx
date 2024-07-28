import React, { FC, ChangeEvent, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-select/dist/css/bootstrap-select.min.css";
import $ from "jquery";
import "bootstrap-select";

$(document).ready(function () {
  $.fn.selectpicker.Constructor.BootstrapVersion = "5"; // Specify Bootstrap version
  $(".selectpicker").selectpicker(); // Initialize Bootstrap-select
});

interface BoxProps {
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const MyComponent: FC<BoxProps> = ({ handleChange }) => {
  useEffect(() => {
    // Initialize Bootstrap-select
    $(".selectpicker").selectpicker();
  }, []);

  return (
    <div className="container">
      <label htmlFor="mySelect">Select Box:</label>
      <select id="mySelect" className="selectpicker" onChange={handleChange}>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
    </div>
  );
};

export default MyComponent;
