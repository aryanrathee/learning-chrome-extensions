// var bg = chrome.extension.getBackgroundPage();

// Load the Visualization API and the piechart package.
google.charts.load("current", { packages: ["corechart", "table"] });
// Set a callback to run when the Google Visualization API is loaded.
// if (window.top === window.self) {
//   google.charts.setOnLoadCallback(function () {
//     displayData();
//   });
// } else {
  // For screenshot: if in iframe, load the most recently viewed mode
  google.charts.setOnLoadCallback(function () {
    displayData();
  });
// }

// Converts duration to String
// function timeString(numSeconds) {
//     var timeStr = "";
//     timeStr+=numSeconds;
//     return timeStr;
// }

// Show the data for the time period indicated by addon
function displayData() {
  // Get the domain data
  var domains = JSON.parse(localStorage["domains"]);
  var chart_data = [];
  for (var domain in domains) {
    var domain_data = JSON.parse(localStorage[domain]);
    var numSeconds = 0;
    numSeconds = domain_data.today;
    if (numSeconds > 0) {
      chart_data.push([
        domain,
        {
          v: numSeconds,
          // f: timeString(numSeconds),
          p: {
            style: "text-align: left; white-space: normal;",
          },
        },
      ]);
    }
  }

  // Display help message if no data
//   if (chart_data.length === 0) {
//     document.getElementById("nodata").style.display = "inline";
//   } else {
//     document.getElementById("nodata").style.display = "none";
//   }

  // Sort data by descending duration
  chart_data.sort(function (a, b) {
    return b[1].v - a[1].v;
  });

  // Limit chart data
  var limited_data = [];
//   var chart_limit;
  // For screenshot: if in iframe, image should always have 9 items
//   if (top == self) {
//     chart_limit = parseInt(localStorage["chart_limit"], 10);
//   } else {
//     chart_limit = 9;
//   }
  for (var i = 0; i < chart_data.length; i++) {
    limited_data.push(chart_data[i]);
  }

  // Draw the chart
  drawChart(limited_data);

  // Add total time
  var total = JSON.parse(localStorage["total"]);
  var numSeconds = 0;
  numSeconds = total.today;
  limited_data.push([
    {
      v: "Total",
      p: {
        style: "font-weight: bold;",
      },
    },
    {
      v: numSeconds,
      // f: timeString(numSeconds),
      p: {
        style: "text-align: left; white-space: normal; font-weight: bold;",
      },
    }
  ]);

  // Draw the table
  drawTable(limited_data);
}
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(chart_data) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Domain");
  data.addColumn("number", "Time");
  data.addRows(chart_data);

  // Set chart options
  var options = {
    tooltip: {
      text: "percentage",
    },
    chartArea: {
      width: 400,
      height: 180,
    },
    pieHole : 0.3,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
}

function drawTable(table_data) {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Domain");
  data.addColumn("number", "Time Spent ( today )");
  data.addRows(table_data);

  var options = {
    allowHtml: true,
    sort: "disable",
    width: "100%",
    height: "100%",
  };
  var table = new google.visualization.Table(
    document.getElementById("table_div")
  );
  table.draw(data, options);
}