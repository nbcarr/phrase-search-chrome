// Saves options to chrome.storage

const saveOptions = async () => {
    const customInputSearchId = document.getElementById('customInputSearchId').value;
    const customInputSearchUrl = document.getElementById('customInputSearchUrl').value;

    chrome.storage.sync.get({ customSearchList: [] }, function(data) {
        // check for duplicates
        let customSearchList = data.customSearchList;
        const newCustomSearch = {customInputSearchId, customInputSearchUrl}
        customSearchList.push(newCustomSearch);
        chrome.storage.sync.set({ customSearchList: customSearchList });

        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
    });

  };

  const displayOptions = async () => {
    const savedInputSearches = document.getElementById('savedInputSearches');
    const currentOptions = await chrome.storage.sync.get(null);
    if (!currentOptions.customSearchList) {
        let div = document.createElement('div');
        
        // Set the content of the div using object properties
        div.textContent = `No options set`;
    
        // Append the div to the parent element
        savedInputSearches.appendChild(div);
        return;
    }
    currentOptions.customSearchList.forEach(function(object) {
        // Create a new div element
        let div = document.createElement('div');
        
        // Set the content of the div using object properties
        div.textContent = `Search ID: ${object.customInputSearchId}, Search URL: ${object.customInputSearchUrl}`;
    
        // Append the div to the parent element
        savedInputSearches.appendChild(div);
    }); 
  }

  const clearOptions = () => {
    chrome.storage.sync.clear()
    const savedInputSearches = document.getElementById('savedInputSearches');
    savedInputSearches.innerHTML = '';
    displayOptions();
  }
  
  document.addEventListener('DOMContentLoaded', displayOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('clear').addEventListener('click', clearOptions);

