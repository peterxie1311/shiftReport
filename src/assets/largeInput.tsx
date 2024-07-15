import { FC, ChangeEvent } from "react";

interface LargeInputProps {
  inputLabel: string;
  rows: number;
  cols: number;
  inputValues: { [key: string]: string };
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const LargeInput: FC<LargeInputProps> = ({
  inputLabel,
  handleChange,
  inputValues,
  rows,
  cols,
}) => {
  return (
    <div className="container entryField">
      <section style={{ width: "100%" }}>
        <h4>{inputLabel}</h4>
      </section>
      <textarea
        onChange={handleChange}
        key={inputLabel}
        name={inputLabel}
        value={inputValues[inputLabel]}
        rows={rows}
        cols={cols}
      ></textarea>
    </div>
  );
};

export default LargeInput;
