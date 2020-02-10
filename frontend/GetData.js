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
  // singleInputValidation: {
  //   Weekly: '',
  //   Daily: '',
  //   Intraday: dt => {
  //     if(Date.getHours(dt) )
  //   }
  // },
  // Create Validation
  mode: null
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
    console.log(input)
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