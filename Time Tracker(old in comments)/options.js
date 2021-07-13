// var bg = chrome.extension.getBackgroundPage();

// Saves options to localStorage.
function save_options() {
  // Save blacklist domains
  // var blackListEl = document.getElementById("blacklist");
  // var blacklist_domains = blackListEl.value.split(/\r?\n/);
  // var blacklist = [];
  // Get rid of empty lines
  // for (var i = 0; i < blacklist_domains.length; i++) {
  //   var domain = blacklist_domains[i];
  //   if (domain) {
  //     blacklist.push(domain);
  //   }
  // }
  // blackListEl.value = blacklist.join("\n");
  // localStorage["blacklist"] = JSON.stringify(blacklist);

  // Remove data for sites that have been added to the blacklist
  // var domains = JSON.parse(localStorage["domains"]);
  // for (var domain in domains) {
  //   for (var i = 0; i < blacklist.length; i++) {
  //     if (domain.match(blacklist[i])) {
  //       // Remove data for any domain on the blacklist
  //       delete domains[domain];
  //       delete localStorage[domain];
  //       localStorage["domains"] = JSON.stringify(domains);
  //     }
  //   }
  // }

  // Check daily limit data
  var daily_limit_hr = parseInt(document.getElementById("daily_limit_hr").value);
  if (!isNaN(daily_limit_hr)) {
    localStorage["daily_limit_hr"] = daily_limit_hr;
    // daily_limit_data_hr.value = daily_limit_hr;
  } else {
    document.getElementById("daily_limit_hr").value = localStorage["daily_limit_hr"];
  }

  var daily_limit_min = parseInt(document.getElementById("daily_limit_min").value);
  if (!isNaN(daily_limit_min)) {
    localStorage["daily_limit_min"] = daily_limit_min;
    // daily_limit_data_min.value = daily_limit_min;
  } else {
    document.getElementById("daily_limit_min").value = localStorage["daily_limit_min"];
  }

  var daily_limit_sec = parseInt(document.getElementById("daily_limit_sec").value);
  if (!isNaN(daily_limit_sec)) {
    localStorage["daily_limit_sec"] = daily_limit_sec;
    // daily_limit_data_sec.value = daily_limit_sec;
  } else {
    document.getElementById("daily_limit_sec").value = localStorage["daily_limit_sec"];
  }

  // Check chart limit data
  var limit = parseInt(document.getElementById("chart_limit").value);
  if (limit) {
    localStorage["chart_limit"] = limit;
    // limit_data.value = limit;
  } else {
    document.getElementById("chart_limit").value = localStorage["chart_limit"];
  }

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  status.className = "success";
  setTimeout(function () {
    status.innerHTML = "";
    status.className = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  // var blacklist = JSON.parse(localStorage["blacklist"]);
  // var blackListEl = document.getElementById("blacklist");
  // blackListEl.value = blacklist.join("\n");
  document.getElementById("daily_limit_hr").value = localStorage["daily_limit_hr"];
  document.getElementById("daily_limit_min").value = localStorage["daily_limit_min"];
  document.getElementById("daily_limit_sec").value = localStorage["daily_limit_sec"];

  document.getElementById("chart_limit").value = localStorage["chart_limit"];
}

// Clear all data except for blacklist
function clearData() {
  // Clear everything except for blacklist
  // var blacklist = localStorage["blacklist"];
  localStorage.clear();
  // localStorage["blacklist"] = blacklist;
  // bg.setDefaults();
  chrome.extension.getBackgroundPage().setDefaults();
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  // Restore options
  restore_options();

  // Set handlers for option descriptions
  document.querySelector("#save-button").addEventListener("click", save_options);
  document.querySelector("#clear-data").addEventListener("click", clearData);
  // var rows = document.querySelectorAll("tr");
  // var mouseoverHandler = function () {
  //   this.querySelector(".description").style.visibility = "visible";
  // };
  // var mouseoutHandler = function () {
  //   this.querySelector(".description").style.visibility = "hidden";
  // };
  // for (var i = 0; i < rows.length; i++) {
  //   var row = rows[i];
  //   row.addEventListener("mouseover", mouseoverHandler);
  //   row.addEventListener("mouseout", mouseoutHandler);
  // }
});
