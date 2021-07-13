// var bg = chrome.extension.getBackgroundPage();

// Load the Visualization API and the piechart package.
google.charts.load("current", { packages: ["corechart", "table"] });
// Set a callback to run when the Google Visualization API is loaded.
// if (window.top === window.self) {
  google.charts.setOnLoadCallback(function () {
    displayData();
  });
// } else {
//   // For screenshot: if in iframe, load the most recently viewed mode
//   google.charts.setOnLoadCallback(function () {
//     displayData();
//   });
// }

// Show options in a new tab
// function showOptions() {
//   chrome.tabs.create({
//     url: "options.html",
//   });
// }

// Converts duration to String
function timeString(numSeconds) {
  if (numSeconds === 0) {
    return "0 sec";
  }
  var remainder = numSeconds;
  var timeStr = "";
  var timeTerms = {
    hr: 3600,
    min: 60,
    sec: 1,
  };
  // Don't show seconds if time is more than one hour
  // if (remainder >= timeTerms.hour) {
  //   remainder = remainder - (remainder % timeTerms.minute);
  //   delete timeTerms.second;
  // }
  // Construct the time string
  for (var term in timeTerms) {
    var divisor = timeTerms[term];
    if (remainder >= divisor) {
      var numUnits = Math.floor(remainder / divisor);
      timeStr += numUnits + " " + term;
      // Make it plural
      // if (numUnits > 1) {
      //   timeStr += "s";
      // }
      remainder = remainder % divisor;
      if (remainder) {
        timeStr += " ";
      }
    }
  }
  return timeStr;
}

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
          f: timeString(numSeconds),
          p: {
            style: "text-align: left; white-space: normal;",
          },
        },
      ]);
    }
  }

  // Display help message if no data
  if (chart_data.length === 0) {
    document.getElementById("nodata").style.display = "inline";
  } else {
    document.getElementById("nodata").style.display = "none";
  }

  // Sort data by descending duration
  chart_data.sort(function (a, b) {
    return b[1].v - a[1].v;
  });

  // Limit chart data
  var limited_data = [];
  var chart_limit;
  // For screenshot: if in iframe, image should always have 9 items
  if (top == self) {
    chart_limit = parseInt(localStorage["chart_limit"], 10);
  } else {
    chart_limit = 9;
  }
  for (var i = 0; i < chart_limit && i < chart_data.length; i++) {
    limited_data.push(chart_data[i]);
  }
  var sum = 0;
  for (var i = chart_limit; i < chart_data.length; i++) {
    sum += chart_data[i][1].v;
  }
  // Add time in "other" category for total and average
  // var other = JSON.parse(localStorage["other"]);
  // if (type === bg.TYPE.average) {
  //   sum += Math.floor(other.all / parseInt(localStorage["num_days"], 10));
  // } else if (type === bg.TYPE.all) {
  //   sum += other.all;
  // }
  if (sum > 0) {
    limited_data.push([
      "Other",
      {
        v: sum,
        f: timeString(sum),
        p: {
          style: "text-align: left; white-space: normal;",
        },
      },
    ]);
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
      f: timeString(numSeconds),
      p: {
        style: "text-align: left; white-space: normal; font-weight: bold;",
      },
    },
  ]);

  // Draw the table
  drawTable(limited_data);
}

// function updateNav(type) {
//   document.getElementById("today").className = "";
//   document.getElementById("average").className = "";
//   document.getElementById("all").className = "";
//   document.getElementById(type).className = "active";
// }

// function show(mode) {
//   bg.mode = mode;
//   displayData(mode);
//   // updateNav(mode);
// }

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
    is3D: true,
    pieHole : 0.4,
    colors: ['#4e58cc', '#a711f2', '#c353e6', '#ed39a8', '#e66ec8', '#eb3147', '#ffae00', '#0db81e', '#fff700']
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
  // var timeDesc;
  // if (type === bg.TYPE.today) {
  //   timeDesc = "Today";
  // } else if (type === bg.TYPE.average) {
  //   timeDesc = "Daily Average";
  // } else if (type === bg.TYPE.all) {
  //   timeDesc = "Over " + localStorage["num_days"] + " Days";
  // } else {
  //   console.error("No such type: " + type);
  // }
  data.addColumn("number", "Time Spent Today");
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

document.addEventListener("DOMContentLoaded", function () {
  // document.querySelector("#today").addEventListener("click", function () {
  //   show(bg.TYPE.today);
  // });
  // document.querySelector("#average").addEventListener("click", function () {
  //   show(bg.TYPE.average);
  // });
  // document.querySelector("#all").addEventListener("click", function () {
  //   show(bg.TYPE.all);
  // });

  document.querySelector("#options").addEventListener("click", function() {
    chrome.tabs.create({
      url: "options.html",
    });
  });
});
