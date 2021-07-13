setTimeout(function(){
    chrome.tabs.query({active: true, currentWindow: true},function(tab){
        console.log(tab[0].url);
    });
},5000);