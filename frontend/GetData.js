// State
let state = {
  selection: null,
  data: {
    weekly: [],
    daily: [],
    intraday: []
  }
}

// OnLoad



// Renders

let displayTable = data => {
  console.log(data);
  if(typeof data === 'string'){
    console.log("csv path")
    csvToTable(data)
  } else {
    console.log("json path")
    let mainDataKey = Object.keys(data)[1];
    jsonToTable(data[mainDataKey]);
    changeTitle(data["Meta Data"]["1. Information"]);
  }
};

let changeTitle = title => {
  document.getElementById("parameter").innerText = title;
};

let jsonToTable = data => {
  let resultTable = document.getElementById("results");
  resultTable.innerHTML = Object.entries(data)
    .map(w =>
      `<tr key=${w[0]}>
          <td>${w[0]}</td>
          <td>${Number(w[1]["1. open"]).toFixed(2)}</td>
          <td>${Number(w[1]["2. high"]).toFixed(2)}</td>
          <td>${Number(w[1]["3. low"]).toFixed(2)}</td>
          <td>${Number(w[1]["4. close"]).toFixed(2)}</td>
          <td>${Number(w[1]["5. volume"]).toLocaleString()}</td>
      </tr>`
    ).join("");
};

let csvToTable = data => {
  let resultTable = document.getElementById("results");
  resultTable.innerHTML = data.split('\n')
    .map(w => {
        let x = w.split(/,\s/);
        return `<tr key=${x[0]}>
            <td>${x[0]}</td>
            <td>${Number(x[1]).toFixed(2)}</td>
            <td>${Number(x[2]).toFixed(2)}</td>
            <td>${Number(x[3]).toFixed(2)}</td>
            <td>${Number(x[4]).toFixed(2)}</td>
            <td>${Number(x[5]).toLocaleString()}</td>
        </tr>`;
      }
    ).join("");
  };

let renderDateInput = datetype => {
  let userinput = document.querySelector("#userinput")
  userinput.innerHTML =
  `Day Of Stock:
  <input type="date" name="selectedDate">
  <input type="submit">`;
  // Create min/max
  userinput.addEventListener('submit', e => {
    e.preventDefault();
    if(datetype === "weekly") {
      getSingleWeekly(e.target.selectedDate.value);
    } else if (datetype === 'daily') {
      getSingleDaily(e.target.selectedDate.value);
    }
  });
};

let renderDateTimeInput = () => {
  let userinput = document.querySelector("#userinput")
  userinput.innerHTML =
  `Day Of Stock:
  <input type="datetime-local" name="selectedDateTime">
  <input type="submit">`;
    // Create min/max
  userinput.addEventListener('submit', e => {
    e.preventDefault();
    getSingleIntraday(`${e.target.selectedDateTime.value.replace("T"," ")}:00`);
  });
};


// Fetches
let getAllWeekly = () => {
  fetch("http://localhost:4567/getWeekly")
  .then(response => response.text())
  .then(csv => displayTable(csv));
};

let getSingleWeekly = week => {
  fetch(`http://localhost:4567/getWeekly/${week}`)
  .then(response => response.text())
  .then(csv => displayTable(csv));
};

let getAllDaily = () => {
  fetch("http://localhost:4567/getDaily")
    .then(response => {
      return response.text();
    })
    .then(csv => {
      return displayTable(csv);
    });
};

let getSingleDaily = day => {
  fetch(`http://localhost:4567/getDaily/${day}`)
  .then(response => response.text())
  .then(csv => displayTable(csv));
};

let getAllIntraday = () => {
  fetch("http://localhost:4567/getIntraday")
  .then(response => response.text())
  .then(csv => displayTable(csv));
};

let getSingleIntraday = minute => {
  fetch(`http://localhost:4567/getIntraday/${minute}`)
    .then(response => response.text())
    .then(csv => displayTable(csv));
};

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
        // return `<tr key=${x[0]}>
        //     <td>${x[0]}</td>
        //     <td>${Number(x[1]).toFixed(2)}</td>
        //     <td>${Number(x[2]).toFixed(2)}</td>
        //     <td>${Number(x[3]).toFixed(2)}</td>
        //     <td>${Number(x[4]).toFixed(2)}</td>
        //     <td>${Number(x[5]).toLocaleString()}</td>
        // </tr>`;
      }
    )
}


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