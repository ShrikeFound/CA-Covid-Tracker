console.log("working");


const fetchData = async () => {
  console.log("fetching data...");
  const result = await fetch('https://api.covidtracking.com/v1/states/ca/daily.json')
  const json = await result.json();
  const values = Object.values(json).reverse();
  const data = await cleanData(values);
  plotData(data);
}

const cleanData = (rawData) => {
  const dates = new Array();
  const deathsDaily = new Array();
  const deathsTotal = new Array();
  const deathsAverage = new Array();
  //going through each line of data
  for (let i = 0; i < rawData.length; i++) {
    const data = rawData[i];
    let dateNum = data["date"].toString().split("");
    let year = parseInt(dateNum.slice(0, 4).join(""),10)
    let month = parseInt(dateNum.slice(4, 6).join(""), 10) - 1
    let day = parseInt(dateNum.slice(6).join(""),10)
    let date = new Date(year, month, day)
    console.log(year,month,day,date)
    dates.push(date)
    let deathIncrease = data['deathIncrease']
    deathsDaily.push(deathIncrease);
    let totalDeaths = deathIncrease 
    let dayCount = 1
    for (let j = i - 6; j < i; j++){
      if (j >= 0) {
        totalDeaths += deathsDaily[j]
        dayCount += 1
      }
    }
    deathsTotal.push(totalDeaths);
    deathsAverage.push(Math.floor(totalDeaths / dayCount));
  }
  // console.log(dates);
  return {
    dates,deathsDaily,deathsTotal,deathsAverage
  }
}

const plotData = (data) => {
  console.log(data)
  const dailyDeathsPlot = {
    x: data["dates"],
    y: data["deathsDaily"],
    marker: {
      color: "#003f5c"
    },
    name: "Daily Deaths",
    type: 'bar'
  }
  const averageDeathsPlot = {
    x: data["dates"],
    y: data["deathsAverage"],
    marker: {
      color: "#ff6361"
    },
    name: "Moving Average (7 Days)",
    type: 'line'
  }
  graphData = [dailyDeathsPlot, averageDeathsPlot]
  layout = {
    title: "COVID Deaths in California",
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: '1 Month',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6 months',
            step: 'month',
            stepmode: 'backward'
          },
          {
            step: 'all'
          }
        ]
      }
    }
  }
  Plotly.newPlot(graph, graphData, layout, {displayModeBar: false,responsive: true})
}

// const cleanData = (json) => {  
//   dates = new Array();
//   dailyDeaths = new Array();
//   averageDeaths = new Array();
  
//   for (const line in json) {
//     const data = json[line]
//     let dateNum = data["date"].toString().split("");
//     let year = parseInt(dateNum.slice(0, 4).join(""))
//     let month = parseInt(dateNum.slice(4, 6).join(""))
//     let day = parseInt(dateNum.slice(6).join(""))
//     let date = new Date(year,month,day)
//     dates.push(date)
//     dailyDeaths.push(data["deathIncrease"]);
//   }
//   let trace1 = {
//     x: dates,
//     y: dailyDeaths,
//     name: 'daily deaths',
//     type: 'bar'
//   }
//   let trace2 = {
//     x: dates,
//     y: averageDeaths,
//     name: "total deaths",
//     type: 'line'
//   }
//   data = [trace1,trace2]
//   return data
// }

// const plotGraph = (data) => {
//   Plotly.newPlot(TESTER, data,{ margin: {t: 0}})
// }






graph = document.getElementById('graph');
fetchData();








const sample = {
  "date": 20210117, "state": "CA", "positive": 2942475,
    "probableCases": null, "negative": 35286140, "pending": null,
    "totalTestResultsSource": "totalTestsViral", "totalTestResults": 38228615,
    "hospitalizedCurrently": 21143, "hospitalizedCumulative": null, "inIcuCurrently": 4820, "inIcuCumulative": null,
    "onVentilatorCurrently": null, "onVentilatorCumulative": null, "recovered": null, "dataQualityGrade": "B", "lastUpdateEt": "1/17/2021 02:59",
    "dateModified": "2021-01-17T02:59:00Z", "checkTimeEt": "01/16 21:59", "death": 33392, "hospitalized": null, "dateChecked": "2021-01-17T02:59:00Z",
    "totalTestsViral": 38228615, "positiveTestsViral": null, "negativeTestsViral": null, "positiveCasesViral": 2942475, "deathConfirmed": null, "deathProbable": null,
    "totalTestEncountersViral": null, "totalTestsPeopleViral": null, "totalTestsAntibody": null, "positiveTestsAntibody": null, "negativeTestsAntibody": null, "totalTestsPeopleAntibody": null,
    "positiveTestsPeopleAntibody": null, "negativeTestsPeopleAntibody": null, "totalTestsPeopleAntigen": null, "positiveTestsPeopleAntigen": null, "totalTestsAntigen": null, "positiveTestsAntigen": null,
    "fips": "06", "positiveIncrease": 42229, "negativeIncrease": 384131, "total": 38228615, "totalTestResultsIncrease": 426360, "posNeg": 38228615, "deathIncrease": 432,
    "hospitalizedIncrease": 0, "hash": "ddcb6ef73ec2f71509678afb75d4237bbf2db6fa", "commercialScore": 0, "negativeRegularScore": 0, "negativeScore": 0, "positiveScore": 0,
      "score": 0, "grade": ""
}
