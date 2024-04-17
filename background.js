const defaultSearches = [];
defaultSearches.push({id: 'searchYoutube', title: "Search Youtube", url: "https://www.youtube.com/results?search_query="})
defaultSearches.push({id: 'searchAmazon', title: "Search Amazon", url: "https://www.amazon.com/s?k="})
defaultSearches.push({id: 'searchStackOverflow', title: "Search StackOverflow", url: "https://stackoverflow.com/search?q="})

function getDataFromSyncStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data);
            }
        });
    });
}

getDataFromSyncStorage().then((data) => {
    let searches;
    if (!data.customSearchList) {
        searches = defaultSearches;
    } else {
      console.log(data.customSearchList)
        const customSearches = [];
        data.customSearchList.forEach(function (object) {
            customSearches.push({id: object.customInputSearchId, title: object.customInputSearchId, url: object.customInputSearchUrl})
        });
        searches = defaultSearches.concat(customSearches);

    } searches.forEach(search => {
        chrome.contextMenus.create({id: search.id, title: search.title, contexts: ["selection"]});
    })

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        chrome.tabs.create({
            url: searches.find(search => search.id === info.menuItemId).url + encodeURIComponent(info.selectionText)
        })
    });

}).catch((error) => {
    console.error("Error retrieving data from sync storage:", error);
});
