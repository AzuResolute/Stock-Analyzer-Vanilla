let displayTable = data => {
  console.log(data);
  
  if(data instanceof Object){
    let mainDataKey = Object.keys(data)[1];
    jsonToTable(data[mainDataKey]);
    changeTitle(data["Meta Data"]["1. Information"]);
  } else {

  }
};

let changeTitle = title => {
  document.getElementById("parameter").innerText = title;
};

let jsonToTable = data => {
  let resultTable = document.getElementById("results");
  resultTable.innerHTML = Object.entries(data)
    .map(
      w =>
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

let renderDateInput = datetype => {
  let userinput = document.querySelector("#userinput")
  userinput.innerHTML =
  `Day Of Stock:
  <input type="date" name="week">
  <input type="submit">`;
  userinput.addEventListener('submit', e => {
    e.preventDefault();
    if(datetype === "weekly") {
      console.log(e.target.children[0].value);
    }
  });
};

let renderDateTimeInput = () => {
  document.querySelector("#userinput").innerHTML =
  `Day Of Stock:
  <input type="datetime-local" name="input">
  <input type="submit">`;

};


let getAllDaily = () => {
  fetch("http://localhost:4567/getDaily")
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      return displayTable(myJson);
    });
};

let getAllWeekly = () => {
  fetch("http://localhost:4567/getWeekly")
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      return displayTable(myJson);
    });
};

let getSingleWeekly = weekly => {
  fetch(`http://localhost:4567/getWeekly/${weekly}`)
    .then(response => {
      return response;
    })
    .then(response => {
      console.log(response);
    });
};

let getAllIntraday = () => {
  fetch("http://localhost:4567/getIntraday")
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      return displayTable(myJson);
    });
};

let getSingleIntraday = minute => {
  fetch(`http://localhost:4567/getIntraday/${minute}`)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      return displayTable(myJson);
    });
};
