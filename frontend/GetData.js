let state = {
  selection: {
    Company: 'Microsoft',
    Ticker: 'MSFT'
  },
  data: {
    Weekly: [],
    Daily: [],
    Intraday: []
  },
  tableTitle: {
    Weekly: 'Weekly Prices (open, high, low, close) and Volumes',
    Daily: 'Daily Time Series with Splits and Dividend Events',
    Intraday: 'Intraday (5min) open, high, low, close prices and volume'
  },
  singleInputType: {
    Weekly: 'date',
    Daily: 'date',
    Intraday: 'datetime-local'
  },
  inputValidation: {
    Weekly: d => {
      let dformat = new Date(`${d} GMT-05:00`);
      let day = dformat.getDay();
      let dayDiff = new Date(Date.now()).getDate() - dformat.getDate();
      if (day === 0) 
        dformat.setDate(dformat.getDate() - 2);
      else if (day === 6) 
        dformat.setDate(dformat.getDate() - 1);
      else if(!(dayDiff < 7)) 
        dformat.setDate(dformat.getDate() + (5 - day))
      
      return dformat;
    },
    Daily: d => {
      let dformat = new Date(`${d} GMT-05:00`);
      let day = dformat.getDay();
      if(day === 0)
        dformat.setDate(dformat.getDate() - 2);
      else if (day === 6) 
        dformat.setDate(dformat.getDate() - 1);

      return dformat;
    },
    Intraday: dt => {
      let dformat = new Date(`${dt} GMT-05:00`);
      let day = dformat.getDay();
      let hour = dformat.getHours();
      let minute = dformat.getMinutes();
      
      dformat.setMinutes(minute - (minute % 5))
      
      if(hour < 9 || (hour === 9 && minute < 35)) {
        dformat.setHours(16)
        dformat.setMinutes(0);
        dformat.setDate(dformat.getDate() - 1)
      } else if (hour > 16 || (hour === 16 && minute > 0)) {
        dformat.setHours(16);
        dformat.setMinutes(0);
      }
      
      if(day === 0)
        dformat.setDate(dformat.getDate() - 2);
      else if (day === 6) 
        dformat.setDate(dformat.getDate() - 1);

      return dformat;
    }
  }
}

// Renders

let renderHome = () => {
  let main = document.querySelector("#main");
  main.innerHTML = `<h1 id="parameter" class="text-center">Welcome to the MThree Stock Analysis Application</h1>`;
}

let renderAllTable = mode => {
  document.querySelector("#main").innerHTML = `
  <h1 id="parameter" class="text-center">${state.tableTitle[mode]}</h1>
  <table class="blueTable">
    <thead>
      <tr>
        <th>Date</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
        <th>Volume</th>
      </tr>
    </thead>
    <tbody id="results">
    ${state.data[mode].map(w => `
      <tr>
        <td>${w.date}</td>
        <td>${Number(w.open).toFixed(2)}</td>
        <td>${Number(w.high).toFixed(2)}</td>
        <td>${Number(w.low).toFixed(2)}</td>
        <td>${Number(w.close).toFixed(2)}</td>
        <td>${Number(w.volume).toLocaleString()}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
};

let renderSingleInputForm = async mode => {
  let inputType = state.singleInputType[mode]
  let data = state.data[mode];
  document.querySelector("#main").innerHTML =
  `<h1 id="parameter" class="text-center">${mode} - Please select your parameters:</h1>
  <div class="d-flex flex-column align-items-center">
  <form id="userinput">
    <input  type=${inputType}
            name="param"
            max=${data[0].date.replace(" ","T")}
            min=${data[data.length - 1].date.replace(" ","T")}>
    <input type="submit">
  </form>
  </div>`;
};

let renderSingleInputTable = (mode, data) => {
  document.querySelector("#main").innerHTML = `
  <h1 id="parameter" class="text-center">${state.tableTitle[mode]}</h1>
  <table class="blueTable">
  <thead>
    <tr>
      <th>Description</th>
      <th>Figures</th>
    </tr>
  </thead>
  <tbody id="results">
  ${Object.keys(data).map(d => `
    <tr>
      <td>${d.toUpperCase()}</td>
      ${d !== 'volume' ?
      `<td>${data[d]}</td>` : 
      `<td>${Number(data.volume).toLocaleString()}</td>`}
    </tr>`).join('')}
  </tbody>
</table>`;
}

// Form Methods

let armSubmit = mode => {
  let userinput = document.querySelector("#userinput");
  userinput.addEventListener('submit', e => {
    e.preventDefault();
    let input = mode !== 'Intraday' ? e.target.param.value : `${e.target.param.value.replace("T"," ")}:00`;
    let data = state.data[mode].find(w => w.date === input);
    renderSingleInputTable(mode, data);
  });
};

// Fetches

// let getSingleWeekly = week => {
//   fetch(`http://localhost:4567/getWeekly/${week}`)
//   .then(response => response.text())
//   .then(csv => displayTable(csv));
// };

// let getSingleDaily = day => {
//   fetch(`http://localhost:4567/getDaily/${day}`)
//   .then(response => response.text())
//   .then(csv => displayTable(csv));
// };

// let getSingleIntraday = minute => {
//   fetch(`http://localhost:4567/getIntraday/${minute}`)
//     .then(response => response.text())
//     .then(csv => displayTable(csv));
// };

let getAllDataCSV = () => {
  fetch("http://localhost:4567/getWeekly")
  .then(response => response.text())
  .then(csv => loadFromCSV(csv, 'Weekly'));

  fetch("http://localhost:4567/getDaily")
  .then(response => response.text())
  .then(csv => loadFromCSV(csv, 'Daily'));

  fetch("http://localhost:4567/getIntraday")
  .then(response => response.text())
  .then(csv => loadFromCSV(csv, 'Intraday'));
}

// State Modification

let loadFromCSV = (data, table) => {
  data.split('\n')
  .map(w => {
    let x = w.split(/,\s/);
    state.data[table].push({
      date: x[0],
      open: x[1],
      high: x[2],
      low: x[3],
      close: x[4],
      volume: x[5]
    })
  }
  );
  console.log(state)
}

// OnLoad

getAllDataCSV();


// GET JSON

// let getAllDaily = () => {
//   fetch("http://localhost:4567/getDaily")
//     .then(response => {
//       return response.json();
//     })
//     .then(myJson => {
//       return displayTable(myJson);
//     });
// };

// let jsonToTable = data => {
//   let resultTable = document.getElementById("results");
//   resultTable.innerHTML = Object.entries(data)
//     .map(w =>
//       `<tr key=${w[0]}>
//           <td>${w[0]}</td>
//           <td>${Number(w[1]["1. open"]).toFixed(2)}</td>
//           <td>${Number(w[1]["2. high"]).toFixed(2)}</td>
//           <td>${Number(w[1]["3. low"]).toFixed(2)}</td>
//           <td>${Number(w[1]["4. close"]).toFixed(2)}</td>
//           <td>${Number(w[1]["5. volume"]).toLocaleString()}</td>
//       </tr>`
//     ).join("");
// };

// DATETIME TESTS

console.log(state.inputValidation.Weekly("2020-01-21"));
console.log(state.inputValidation.Daily("2020-01-21"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-22"));
console.log(state.inputValidation.Daily("2020-01-22"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-23"));
console.log(state.inputValidation.Daily("2020-01-23"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-24"));
console.log(state.inputValidation.Daily("2020-01-24"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-25"));
console.log(state.inputValidation.Daily("2020-01-25"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-26"));
console.log(state.inputValidation.Daily("2020-01-26"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-27"));
console.log(state.inputValidation.Daily("2020-01-27"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-28"));
console.log(state.inputValidation.Daily("2020-01-28"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-29"));
console.log(state.inputValidation.Daily("2020-01-29"));
console.log(" --- ")
console.log(state.inputValidation.Weekly("2020-01-30"));
console.log(state.inputValidation.Daily("2020-01-30"));
console.log(" --- ")
console.log(state.inputValidation.Intraday("2020-02-12 16:00:00"));
console.log(state.inputValidation.Intraday("2020-02-11 16:03:00"));
console.log(state.inputValidation.Intraday("2020-02-10 20:45:00"));
console.log(state.inputValidation.Intraday("2020-02-09 12:00:00"));
console.log(state.inputValidation.Intraday("2020-02-08 04:00:00"));
console.log(state.inputValidation.Intraday("2020-02-07 12:00:00"));
console.log(state.inputValidation.Intraday("2020-02-06 03:00:00"));