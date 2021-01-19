const parent = document.getElementById("select-container");
const graph = document.getElementById("graph");
console.log("working");

const fetchData = async (country, graphType) => {
  console.log("fetching data...");
  console.log(country);
  const result = await fetch(
    `https://api.covidtracking.com/v1/states/${country}/daily.json`
  );
  const json = await result.json();
  const values = Object.values(json).reverse();
  const data = await cleanData(values);
  plotData(data, country, graphType);
};

const cleanData = (rawData) => {
  const dates = new Array();
  const deathsDaily = new Array();
  const deathsTotal = new Array();
  const deathsAverage = new Array();
  const casesDaily = new Array();
  const casesTotal = new Array();
  const casesAverage = new Array();
  //going through each line of data
  for (let i = 0; i < rawData.length; i++) {
    const data = rawData[i];
    let dateNum = data["date"].toString().split("");
    let year = parseInt(dateNum.slice(0, 4).join(""), 10);
    let month = parseInt(dateNum.slice(4, 6).join(""), 10) - 1;
    let day = parseInt(dateNum.slice(6).join(""), 10);
    let date = new Date(year, month, day);
    console.log(year, month, day, date);

    let deathIncrease = data["deathIncrease"];
    let caseIncrease = data["positiveIncrease"];
    console.log([date, caseIncrease]);
    let totalDeaths = deathIncrease;
    let totalPositives = data["positiveIncrease"];
    let dayCount = 1;
    //cases

    for (let j = i - 6; j < i; j++) {
      if (j >= 0) {
        totalDeaths += deathsDaily[j];
        totalPositives += casesDaily[j];
        dayCount += 1;
      }
    }
    dates.push(date);
    deathsDaily.push(deathIncrease);
    deathsTotal.push(totalDeaths);
    deathsAverage.push(Math.floor(totalDeaths / dayCount));
    casesDaily.push(caseIncrease);
    casesTotal.push(totalPositives);
    casesAverage.push(totalPositives / dayCount);
  }
  // console.log(dates);
  return {
    dates,
    deathsDaily,
    deathsTotal,
    deathsAverage,
    casesDaily,
    casesTotal,
    casesAverage,
  };
};

const plotData = (data, country, graphType) => {
  console.log(data);
  const dailyDeathsPlot = {
    x: data["dates"],
    y: data["deathsDaily"],
    marker: {
      color: "#003f5c",
    },
    name: "Daily Deaths",
    type: "bar",
  };
  const averageDeathsPlot = {
    x: data["dates"],
    y: data["deathsAverage"],
    marker: {
      color: "#ff6361",
    },
    name: "Moving Average (7 Days)",
    type: "line",
  };

  const dailyCasesPlot = {
    x: data["dates"],
    y: data["casesDaily"],
    marker: {
      color: "#003f5c",
    },
    name: "Daily Cases",
    type: "bar",
  };
  const averageCasesPlot = {
    x: data["dates"],
    y: data["casesAverage"],
    marker: {
      color: "#ff6361",
    },
    name: "Moving Average (7 Days)",
    type: "line",
  };

  deathGraphData = [dailyDeathsPlot, averageDeathsPlot];
  caseGraphData = [dailyCasesPlot, averageCasesPlot];
  console.log(graphType);
  graphData = {
    cases: [dailyCasesPlot, averageCasesPlot],
    deaths: [dailyDeathsPlot, averageDeathsPlot],
  };
  const title = graphType.charAt(0).toUpperCase() + graphType.slice(1);

  layout = {
    title: `COVID ${title} in ${country}`,
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: "1 Month",
            step: "month",
            stepmode: "backward",
          },
          {
            count: 6,
            label: "6 months",
            step: "month",
            stepmode: "backward",
          },
          {
            step: "all",
          },
        ],
      },
    },
  };
  Plotly.newPlot(graph, graphData[graphType], layout, {
    displayModeBar: false,
    responsive: true,
  });
};

const array = [
  ["ALABAMA", "AL"],
  ["ALASKA", "AK"],
  ["AMERICAN SAMOA", "AS"],
  ["ARIZONA", "AZ"],
  ["ARKANSAS", "AR"],
  ["CALIFORNIA", "CA"],
  ["COLORADO", "CO"],
  ["CONNECTICUT", "CT"],
  ["DELAWARE", "DE"],
  ["DISTRICT OF COLUMBIA", "DC"],
  ["FLORIDA", "FL"],
  ["GEORGIA", "GA"],
  ["GUAM", "GU"],
  ["HAWAII", "HI"],
  ["IDAHO", "ID"],
  ["ILLINOIS", "IL"],
  ["INDIANA", "IN"],
  ["IOWA", "IA"],
  ["KANSAS", "KS"],
  ["KENTUCKY", "KY"],
  ["LOUISIANA", "LA"],
  ["MAINE", "ME"],
  ["MARYLAND", "MD"],
  ["MASSACHUSETTS", "MA"],
  ["MICHIGAN", "MI"],
  ["MINNESOTA", "MN"],
  ["MISSISSIPPI", "MS"],
  ["MISSOURI", "MO"],
  ["MONTANA", "MT"],
  ["NEBRASKA", "NE"],
  ["NEVADA", "NV"],
  ["NEW HAMPSHIRE", "NH"],
  ["NEW JERSEY", "NJ"],
  ["NEW MEXICO", "NM"],
  ["NEW YORK", "NY"],
  ["NORTH CAROLINA", "NC"],
  ["NORTH DAKOTA", "ND"],
  ["NORTHERN MARIANA IS", "MP"],
  ["OHIO", "OH"],
  ["OKLAHOMA", "OK"],
  ["OREGON", "OR"],
  ["PENNSYLVANIA", "PA"],
  ["PUERTO RICO", "PR"],
  ["RHODE ISLAND", "RI"],
  ["SOUTH CAROLINA", "SC"],
  ["SOUTH DAKOTA", "SD"],
  ["TENNESSEE", "TN"],
  ["TEXAS", "TX"],
  ["UTAH", "UT"],
  ["VERMONT", "VT"],
  ["VIRGINIA", "VA"],
  ["VIRGIN ISLANDS", "VI"],
  ["WASHINGTON", "WA"],
  ["WEST VIRGINIA", "WV"],
  ["WISCONSIN", "WI"],
  ["WYOMING", "WY"],
];

//country selector
let selectList = document.createElement("select");
selectList.id = "mySelect";
parent.appendChild(selectList);

for (let i = 0; i < array.length; i++) {
  let option = document.createElement("option");
  countryName = array[i][0];
  option.text = countryName.charAt(0) + countryName.slice(1).toLowerCase();
  option.value = array[i][1];
  selectList.appendChild(option);
}

selectList.selectedIndex = "5";

let graphTypeSelect = document.createElement("select");
graphTypeSelect.id = "graphSelect";
parent.appendChild(graphTypeSelect);

let caseType = document.createElement("option");
caseType.text = "Cases";
caseType.value = "cases";
graphTypeSelect.append(caseType);

let deathType = document.createElement("option");
deathType.text = "Deaths";
deathType.value = "deaths";
graphTypeSelect.append(deathType);

const refresh = () => {
  let country = selectList.value;
  let graphType = graphTypeSelect.value;
  fetchData(country, graphType);
};

fetchData("CA", "cases");
