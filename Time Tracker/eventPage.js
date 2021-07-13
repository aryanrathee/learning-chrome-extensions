var UPDATE_INTERVAL = 1;
// var TYPE = {
//     today: "today"
//   };
//   // Current viewing mode
//   var mode = TYPE.today;
setDefaults();
// Set default settings
function setDefaults() {
  // Set number of days Web Timer has been used
//   if (!localStorage["num_days"]) {
//     localStorage["num_days"] = 1;
//   }
  // Set date
//   if (!localStorage["date"]) {
//     localStorage["date"] = new Date().toLocaleDateString();
//   }
  // Set domains seen before
  if (!localStorage["domains"]) {
    localStorage["domains"] = JSON.stringify({});
  }
  // Set total time spent
  if (!localStorage["total"]) {
    localStorage["total"] = JSON.stringify({
      today: 0,
      all: 0,
    });
  }
  // Limit how many sites the chart shows
  // if (!localStorage["chart_limit"]) {
  //   localStorage["chart_limit"] = 7;
  // }
  // Set "other" category
  // NOTE: other.today is not currently used
  if (!localStorage["other"]) {
    localStorage["other"] = JSON.stringify({
      today: 0,
      all: 0,
    });
  }
}
//******************************** TO BE DONE *********************************************************************** */
function inBlacklist(url) {
  if (!url.match(/^http/)) {
    return true;
  }
  return false;
}
//******************************************************************************************************** */
  // Extract the domain from the url
  // e.g. http://google.com/ -> google.com
  function extractDomain(url) {
    var re = /:\/\/(www\.)?(.+?)\//;
    return url.match(re)[2];
  }

  function updateData() {

    // Select single active tab from focused window
    chrome.tabs.query({ lastFocusedWindow: true, active: true }, function (
      tabs
    ) {
      if (tabs.length === 0) {
        return;
      }
      var tab = tabs[0];
      var domain = extractDomain(tab.url);
      // Add domain to domain list if not already present
      var domains = JSON.parse(localStorage["domains"]);
      if (!(domain in domains)) {
        // FIXME: Using object as hash set feels hacky
        domains[domain] = 1;
        localStorage["domains"] = JSON.stringify(domains);
      }
      var domain_data;
      if (localStorage[domain]) {
        domain_data = JSON.parse(localStorage[domain]);
      } else {
        domain_data = {
          today: 0,
          all: 0,
        };
      }
      domain_data.today += UPDATE_INTERVAL;
      domain_data.all += UPDATE_INTERVAL;
      localStorage[domain] = JSON.stringify(domain_data);
      // Update total time
      var total = JSON.parse(localStorage["total"]);
      total.today += UPDATE_INTERVAL;
      total.all += UPDATE_INTERVAL;
      localStorage["total"] = JSON.stringify(total);
      // Update badge with number of minutes spent on
      // current site
      var num_min = Math.floor(domain_data.today / 60).toString();
      if (num_min.length < 4) {
        num_min += "m";
      }
      chrome.browserAction.setBadgeText({
        text: num_min,
      });
    });
  }
  // Update timer data every UPDATE_INTERVAL seconds
  setInterval(updateData, UPDATE_INTERVAL * 1000);