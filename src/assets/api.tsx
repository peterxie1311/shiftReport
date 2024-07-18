import axios from "axios";
import { ChangeEvent } from "react";

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString(undefined, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

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
function excludeCheck(array: string[][], substring: string): string[][] {
  const returnArray = array.filter((subArray) =>
    subArray.every((value) => !value.includes(substring))
  );
  return returnArray;
}
function getKPI(
  kpi: string,
  columns: string[],
  columnValue: string[],
  rowsDefault: string[],
  rows: string[]
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

const downloadEmailDraftincident = async (inputValues: {
  [key: string]: string;
}) => {
  try {
    const response = await axios.get(
      "http://192.168.4.74:8080/api/download_email_draft",
      {
        params: {
          data: Object.keys(inputValues).map((key) => ({
            name: key,
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
//------------------------------ to fetch employees -----------------------------
async function getNames(): Promise<{ [key: string]: string }> {
  const array: { [key: string]: string } = {};
  try {
    const response = await axios.get<string>(
      "http://192.168.4.74:8080/api/getNames"
    );
    // Map each object in the response data to the Person interface
    JSON.parse(response.data).map((item: any) => [
      (array[item.Name + ":Name"] = item.Name),
      (array[item.Name + ":Position"] = item.Position),
      (array[item.Name + ":Crew"] = item.Crew),
      (array[item.Name + ":Shift"] = item.Shift),
      (array[item.Name + ":Allocation"] = item.Allocation),
      (array[item.Name + ":Event"] = item.Event),
      (array[item.Name + ":Reason"] = item.Reason),
      (array[item.Name + ":Commit"] = item.Commit),
    ]);

    return array;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {}; // Return an empty array if there's an error
  }
}

function getValuesWithKeyNameSubstring(
  obj: { [key: string]: string },
  substring: string
): string[][] {
  const values: string[][] = [];

  Object.keys(obj).forEach((key) => {
    if (key.toLowerCase().includes(substring.toLowerCase())) {
      values.push([obj[key]]);
    }
  });

  return values;
}

const downloadEmailDraft = async (
  inputValues: { [key: string]: string },
  columns: string[],
  columnValue: string[],
  rowsDefault: string[],
  rows: string[]
) => {
  try {
    const response = await axios.get(
      "http://192.168.4.74:8080/api/download_email_draft",
      {
        params: {
          data: Object.keys(inputValues).map((key) => ({
            name: getKPI(key, columns, columnValue, rowsDefault, rows),
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

//------------------- Handling change event

const handleChange = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  rowCols: string[][],
  columns: string[],
  setInputValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
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

//------------ Handling the button dropdowns :)

const handleDropdownItemClick =
  (
    id: string,
    setInputValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
  ) =>
  (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget as HTMLAnchorElement;
    const selected = target.innerText;

    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: selected,
    }));
  };

export default {
  getnotFilled2d,
  excludeCheck,
  downloadEmailDraft,
  downloadEmailDraftincident,
  handleDropdownItemClick,
  handleChange,
  getNames,
  getValuesWithKeyNameSubstring,
};
