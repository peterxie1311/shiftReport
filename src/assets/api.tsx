import axios from "axios";
import { ChangeEvent } from "react";

//------------------------INTERFACES!---------------------
export interface Person {
  Name: string;
  Position: string;
  Crew: string;
  Shift: string;
  Allocation: string;
  Event: string;
  Reason: string;
  OT: string;
  OTFrom: string;
  OTTo: string;
  Commit: string;
  Article: string;
}
let ipConnect: string = "";

function readFile() {
  const filePath = "/api/ip.txt"; // Adjust the path relative to the server root
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      ipConnect = data;
      console.log("IP Connected");
    })
    .catch((error) => {
      alert(`Failed to fetch IP ${error}`); // just incase we cannot grab ip
      console.error("Error fetching file:", error);
    });
}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString(undefined, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
export interface interfaceObject {
  name: string;
  value: string; // Use `string` instead of `any` if value is always a string
}

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

async function postModified(
  inputArray: unknown[],
  postDirectory: string,
  filename: string,
  crew?: string
) {
  try {
    const response = await axios.post<{ message: string }>(
      `${ipConnect}/${postDirectory}`,
      { array: inputArray, filename: filename, crew: crew }
    );
    const responseData = response.data.message;
    alert(responseData);
  } catch (error) {
    alert(`"Error Please screenshot and show Peter :)" ${error}`);
    console.error(`"Error Please screenshot and show Peter :)" ${error}`);
  }
}

const downloadEmailDraftincident = async (inputValues: {
  [key: string]: string;
}) => {
  try {
    const response = await axios.get(`${ipConnect}/api/download_email_draft`, {
      params: {
        data: Object.keys(inputValues).map((key) => ({
          name: key,
          value: inputValues[key], // grabbing final values
        })),
      },
      responseType: "blob", // Expecting blob data
    });

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
    alert(`"Error Please screenshot and show Peter :)" ${error}`);
    console.error("Error:", error);
  }
};

async function post(
  postDirectory: string,
  inputArray: interfaceObject[],
  email: boolean,
  inputValues: { [key: string]: string },
  columns: string[],
  columnValue: string[],
  rowsDefault: string[],
  rows: string[]
): Promise<string> {
  try {
    const response = await axios.post<{ message: string }>(
      `${ipConnect}/${postDirectory}`,
      inputArray
    );

    const responseData = response.data.message;
    alert(responseData);

    if (responseData === "success") {
      if (email === true) {
        await downloadEmailDraft(
          inputValues,
          columns,
          columnValue,
          rowsDefault,
          rows
        );
      }
    }

    return responseData; // Return the response message
  } catch (error) {
    console.error("Error:", error);
    return "Error"; // Return a default value in case of an error
  }
}

//---------------------------Find person in an array --------------------------
function findPerson(name: string, array: Person[]): Person {
  const emptyPerson: Person = {
    Name: "",
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

  const foundPerson = array.find((person) => person.Name === name);
  return foundPerson || emptyPerson;
}

//----------Generic Values Getter

const getValues = async (
  filename: string,
  postDirectory: string,
  setInputValues: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >
): Promise<void> => {
  try {
    const response = await axios.get<string>(`${ipConnect}/${postDirectory}`, {
      params: { data: filename },
    });

    const data = JSON.parse(response.data); // Data is already parsed as JSON
    const object = data[0]; // Because it is encapsulated in an array

    Object.keys(object).forEach((key) => {
      setInputValues((prevValues) => {
        const newValues = {
          ...prevValues,
          [key]: `${object[key]}`,
        };
        return newValues;
      });
    });
  } catch (error) {
    alert(`"Please select a Crew or there is no last save"`);
    console.error("Error fetching data:", error);
  }
};
function generateTimeIntervals(
  startTime: string,
  endTime: string,
  interval: number
): string[] {
  const times: string[] = [];
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (start <= end) {
    const hours = start.getUTCHours().toString().padStart(2, "0");
    const minutes = start.getUTCMinutes().toString().padStart(2, "0");
    times.push(`${hours}:${minutes}`);
    start.setMinutes(start.getUTCMinutes() + interval);
  }

  return times;
}

//------------------------------ to fetch employees -----------------------------
async function getNames(filename: string): Promise<Person[]> {
  try {
    console.log(ipConnect);
    const response = await axios.get<string>(`${ipConnect}/api/getNames`, {
      params: {
        data: filename,
      },
    });

    const data = JSON.parse(response.data);
    const array: Person[] = data.map((item: Person) => ({
      // ---- this was changed to definee the specific type of a person
      Name: item.Name,
      Position: item.Position,
      Crew: item.Crew,
      Shift: item.Shift,
      Allocation: item.Allocation,
      Event: item.Event,
      Reason: item.Reason,
      OT: item.OT,
      OTFrom: item.OTFrom,
      OTTO: item.OTTo,
      Commit: item.Commit,
      Article: "",
    }));

    // console.log(array);
    return array;
  } catch (error) {
    alert(`"Error Please screenshot and show Peter :)" ${error}`);
    console.error("Error fetching data:", error);
    return []; // Return an empty array if there's an error
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
    const response = await axios.get(`${ipConnect}/api/download_email_draft`, {
      params: {
        data: Object.keys(inputValues).map((key) => ({
          name: getKPI(key, columns, columnValue, rowsDefault, rows),
          value: inputValues[key], // grabbing final values
        })),
      },
      responseType: "blob", // Expecting blob data
    });

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
    alert(`"Error Please screenshot and show Peter :)" ${error}`);
    console.error("Error:", error);
  }
};

//------------------- Handling change event--------------------------------------------------------

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
  findPerson,
  post,
  postModified,
  getValues,
  readFile,
  generateTimeIntervals,
};
