var contextMenuItem = {
    "id": "spendMoney",
    "title": "Spend Money",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

function isInt(value){
    return !isNaN(value);
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    if(clickData.menuItemId == "spendMoney" && clickData.selectionText){
        if(isInt(clickData.selectionText)){
            chrome.storage.sync.get(['total', 'limit'], function(budget){
                var newtotal = 0;
                if(budget.total){
                    newtotal += parseInt(budget.total);
                }
                newtotal += parseInt(clickData.selectionText);
                chrome.storage.sync.set({'total': newtotal}, function(){
                    if(newtotal >= budget.limit){
                        var notifOptions = {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Limit Reached',
                            message: "You are spending a lot!!!"
                        };
                        chrome.notifications.create('limitNotif', notifOptions);
                    }
                });
            });
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});