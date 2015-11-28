// Global variables
var asyncRetrievalStatus;
var onePlusStoreAvailabilityUrls;
var currentTab;
var $startButton;
var $stopButton;
var $urlList;

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the current tab is found.
 */
function getCurrentTab(callback) 
{
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0]);
  });
}

/**
 * Enable the buttons when we have our required info.
 */
function enableButtonsIfApplicable()
{
  // asyncRetrievalStatus is 2 when both the availabilityurls and current tab have been retrieved async
  if(asyncRetrievalStatus == 2)
  {
    if(~onePlusStoreAvailabilityUrls.indexOf(currentTab.url))
    {
      $stopButton.disabled = false;
      $startButton.disabled = true;
    }
    else
    {
      $startButton.disabled = false;
      $stopButton.disabled = true;
    }
  }
}

/**
 * Display the availability urls in a list
 */
function updateVisualUrlList()
{
  if(onePlusStoreAvailabilityUrls.length == 0)
    $urlList.innerHTML = 'None';
  else
  {
    $urlList.innerHTML = '';
    for(var i = 0; i < onePlusStoreAvailabilityUrls.length; i++) {
      var listItem = document.createElement('li');
      listItem.appendChild(document.createTextNode(onePlusStoreAvailabilityUrls[i]));
      $urlList.appendChild(listItem);
    }
  }

  // If the list of urls change, we might also need to change our buttons
  enableButtonsIfApplicable();
}

/**
 * Listen for DOMContentLoaded event.
 */
document.addEventListener('DOMContentLoaded', function() 
{
  // Set default values
  asyncRetrievalStatus = 0;
  onePlusStoreAvailabilityUrls = [];
  currentTab = null;

  // Get our buttons
  $startButton = document.getElementById('start');
  $stopButton = document.getElementById('stop');
  $urlList = document.getElementById('urls');

  // Disable the buttons until we have our information
  $startButton.disabled = true;
  $stopButton.disabled = true;

  // Retreive the urls we are already checking for availability
  chrome.storage.local.get({onePlusStoreAvailabilityUrls: []}, function (result) 
  {
    onePlusStoreAvailabilityUrls = result.onePlusStoreAvailabilityUrls;
    asyncRetrievalStatus ++;

    updateVisualUrlList();
    enableButtonsIfApplicable();
  });

  // Get the current tab url
  getCurrentTab(function(tab)
  {
    currentTab = tab;
    asyncRetrievalStatus ++;

    enableButtonsIfApplicable();
  });

  // Listen for start and stop button clicks
  $startButton.addEventListener('click', function() 
  {
    // Add current tab url to the check list
    onePlusStoreAvailabilityUrls.push(currentTab.url);
    chrome.storage.local.set({onePlusStoreAvailabilityUrls: onePlusStoreAvailabilityUrls}, function() 
    {
      updateVisualUrlList();
      chrome.tabs.reload(currentTab.id);
    });
  });
  
  $stopButton.addEventListener('click', function() 
  {
    // Remove current tab url from check list
    onePlusStoreAvailabilityUrls.splice(onePlusStoreAvailabilityUrls.indexOf(currentTab.url), 1);
    chrome.storage.local.set({onePlusStoreAvailabilityUrls: onePlusStoreAvailabilityUrls}, function() 
    {
      updateVisualUrlList();
      chrome.tabs.reload(currentTab.id);
    });    
  });
});
