// DateSelector.tsx

import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDateChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

interface DateSelectorProps {
  input: string[][];
  inputValues: { [key: string]: string };
  handleChange: (event: CustomDateChangeEvent) => void;
}

const DateSelector: FC<DateSelectorProps> = ({
  input,
  inputValues,
  handleChange,
}) => {
  const handleDateChange = (fieldName: string) => (date: Date | null) => {
    const event: CustomDateChangeEvent = {
      target: {
        name: fieldName,
        value: date ? date.toISOString().split("T")[0] : "",
      },
    };
    handleChange(event);
  };
  function createBlock(array: string[]): JSX.Element {
    console.log(inputValues);
    return (
      <article className="container" key={array[0]}>
        <label htmlFor={array[0]}>{array[0]}</label>
        <DatePicker
          selected={
            inputValues[array[0]] ? new Date(inputValues[array[0]]) : null
          }
          onChange={handleDateChange(array[0])}
          dateFormat="dd/MM/yyyy"
          isClearable
        />

        <span className="dotTooltip">
          ?<div className="tooltip">{array[2]}</div>
        </span>
      </article>
    );
  }

  return (
    <div className="container entryField">
      {input.map((array: string[]) => createBlock(array))}
    </div>
  );
};

export default DateSelector;
