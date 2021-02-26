const ctx = document.querySelector(".js-chart").getContext("2d");
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
  .then(parseData)
  .then(getLabelsAndData)
  .then(({ years, tempGlobal, tempNorth, tempSouth }) =>
    drawChart(years, tempGlobal, tempNorth, tempSouth)
  )
  .catch(console.log);

function fetchData() {
  return fetch("./ZonAnn.Ts+dSST.csv").then((response) => response.text());
}

function parseData(data) {
  return Papa.parse(data, { header: true }).data;
}

function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.tempGlobal.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.tempNorth.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
      acc.tempSouth.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);
      console.log(acc);
      return acc;
    },
    { years: [], tempGlobal: [], tempNorth: [], tempSouth: [] }
  );
}

function drawChart(labels, dataGlobal, dataNorth, dataSouth) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Average temperature",
          data: dataGlobal,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Northern Average temperature",
          data: dataNorth,
          borderColor: "CornflowerBlue",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Southern Average temperature",
          data: dataSouth,
          borderColor: "GoldenRod",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback(value) {
                return value + "°";
              },
            },
          },
        ],
      },
    },
  });
}
