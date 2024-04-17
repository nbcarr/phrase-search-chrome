/**
 * Returns a Promise representing all data in the sync storage
 * @returns Promise
 */
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

/**
 * Creates the list of search options in the context menu given the custom search options 
 * @param {*} data Object representing all data in sync storage
 */
function createSearchContextMenu(data) {
    let customSearches = [];
    if (data.customSearchList) {
        console.log(data.customSearchList)
        data.customSearchList.forEach(function (object) {
            customSearches.push({id: object.customInputSearchId, title: object.customInputSearchId, url: object.customInputSearchUrl})
        });
    }
    const defaultSearches = [];
    defaultSearches.push({id: 'searchYoutube', title: "Search Youtube", url: "https://www.youtube.com/results?search_query="})
    defaultSearches.push({id: 'searchAmazon', title: "Search Amazon", url: "https://www.amazon.com/s?k="})
    defaultSearches.push({id: 'searchStackOverflow', title: "Search StackOverflow", url: "https://stackoverflow.com/search?q="})

    const searches = customSearches.length > 0 ? defaultSearches.concat(customSearches) : defaultSearches;

    chrome.contextMenus.removeAll(() => {
        searches.forEach(search => {
            chrome.contextMenus.create({id: search.id, title: search.title, contexts: ["selection"]});
        })
    })

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        chrome.tabs.create({
            url: searches.find(search => search.id === info.menuItemId).url + encodeURIComponent(info.selectionText)
        })
    });
}

// On initial load
getDataFromSyncStorage().then((data) => {
    createSearchContextMenu(data)
})

// On new option added
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "option_added") {
        getDataFromSyncStorage().then((data) => {
            createSearchContextMenu(data)
        })
    }
});

// On options cleared
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "option_cleared") {
        getDataFromSyncStorage().then((data) => {
            createSearchContextMenu(data)
        })
    }
});
