import React from 'react'
import Papa from 'papaparse';
import VirtualScroller from "./VirtualScroller";

const SETTINGS = {
  itemHeight: 20,
  amount: 35,
  tolerance: 5,
  minIndex: 1,
  maxIndex: 2000,
  startIndex: 1,
};

const getData = (offset, limit, rows) => {

  const start = Math.max(SETTINGS.minIndex, offset)
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex)
  const data = (start <= end) ? rows.slice(start, end + 1) : rows
  return data
}

export default function App() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(async () => {
    await Papa.parse("/acho_export_virtual_scroll.csv", {
      download: true,
      header: true,
      complete: data => {
        // console.log(data.meta['fields'])
        setRows(data.data);
        // update data length
        SETTINGS.maxIndex = data.data.length;
      }
    });
  }, []);

  const columns = [];
  const colLen = 1107;
  for(let i = 1; i <= colLen; i++){
    columns.push(`field_${i}`);
  }

  const rowTemplate = item => (
    <tr className="item_row">
      {
        Object.entries(item).map(([key, value], index) => (
          <td className="item_col" key={index}>{value}</td>
        ))
      }

    </tr>
    // <tr className="item_row" key={item.index}>
    //   {
    //     item.text.map((t, i) => (
    //       <td className="item_col" key={i}>{t}</td>
    //     ))
    //   }
    // </tr>
  )

  return (
    <div className="App">
      <h1>
        <center>React Table Demo</center>
      </h1>
      <VirtualScroller
        className="viewport"
        get={getData}
        settings={SETTINGS}
        row={rowTemplate}
        rows={rows}
        columns={columns}
      />
    </div>
  )
};
