// Saves options to chrome.storage

const saveOptions = async () => {
    const customInputSearchId = document.getElementById('customInputSearchId').value;
    const customInputSearchUrl = document.getElementById('customInputSearchUrl').value;

    chrome.storage.sync.get({
        customSearchList: []
    }, function (data) {
        let customSearchList = data.customSearchList;
        const newCustomSearch = {
            customInputSearchId,
            customInputSearchUrl
        }
        customSearchList.push(newCustomSearch);
        chrome.storage.sync.set({customSearchList: customSearchList});

        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 1500);
        displayOptions();
    });

    chrome.runtime.sendMessage({msg: "option_added"});

};

const displayOptions = async () => {
    const savedInputSearches = document.getElementById('savedInputSearches');
    const currentOptions = await chrome.storage.sync.get(null);
    savedInputSearches.innerHTML = '';
    if (! currentOptions.customSearchList) {
        let div = document.createElement('div');
        div.textContent = `No options set`;
        savedInputSearches.appendChild(div);
        return;
    }
    currentOptions.customSearchList.forEach(function (object) {
        let div = document.createElement('div');
        div.textContent = `Search ID: ${
            object.customInputSearchId
        }, Search URL: ${
            object.customInputSearchUrl
        }`;
        savedInputSearches.appendChild(div);
    });
}

const clearOptions = () => {
    chrome.storage.sync.clear()
    const savedInputSearches = document.getElementById('savedInputSearches');
    savedInputSearches.innerHTML = '';

    chrome.runtime.sendMessage({msg: "option_cleared"});

    displayOptions();
}

document.addEventListener('DOMContentLoaded', displayOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear').addEventListener('click', clearOptions);
