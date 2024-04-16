chrome.contextMenus.create({id: "searchYoutube", title: "Search YouTube", contexts: ["selection"]});


chrome.contextMenus.create({id: "searchAmazon", title: "Search Amazon", contexts: ["selection"]});

chrome.contextMenus.create({id: "searchStackOverflow", title: "Search StackOverflow", contexts: ["selection"]});

chrome.contextMenus.create({id: "searchTikTok", title: "Search TikTok", contexts: ["selection"]});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "searchYoutube":
            chrome.tabs.create({
                url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(info.selectionText)
            });
            break
        case "searchAmazon":
            chrome.tabs.create({
                url: "https://www.amazon.com/s?k=" + encodeURIComponent(info.selectionText)
            });
            break
        case "searchStackOverflow":
            chrome.tabs.create({
                url: "https://stackoverflow.com/search?q=" + encodeURIComponent(info.selectionText)
            });
            break
    }
});
