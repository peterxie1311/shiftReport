import React from "react";
import { useTable, Column } from "react-table";

// Define the type for your data
interface Data {
  col1: string;
  col2: string;
}

// Define the columns for your table
const columns: Column<Data>[] = [
  {
    Header: "Column 1",
    accessor: "col1", // accessor is the key in the data
  },
  {
    Header: "Column 2",
    accessor: "col2",
  },
];

// Define the data for your table
const data: Data[] = [
  {
    col1: "Hello",
    col2: "World",
  },
];

const DummyTable: React.FC = () => {
  // Create an instance of the table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table
      {...getTableProps()}
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DummyTable;
