// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
	// Check if the tab update was a complete event
	if(changeInfo && changeInfo.status == "complete")
	{
		// Check url
	  	if(~tab.url.indexOf('oneplus.net'))
	  	{
	  		// It's a OnePlus page, show the page action
	  		chrome.pageAction.show(tabId);

	  		// Retreive the current urls we want to check for availability of a product
			chrome.storage.local.get({onePlusStoreAvailabilityUrls: []}, function (result) 
			{
			    var onePlusStoreAvailabilityUrls = result.onePlusStoreAvailabilityUrls;
			    if(~onePlusStoreAvailabilityUrls.indexOf(tab.url))
			    {
			    	console.log("OnePlus page detected");
				    // It's a OnePlus page, get current tab and start our script
					var queryInfo = 
					{
					   	active: true,
					    currentWindow: true
					};

				    console.log("Injecting script");

				    chrome.tabs.executeScript(tab.id, 
				    {
				        file: "content_script.js"
				    }, function() 
				    {
				        if (chrome.runtime.lastError) 
				        {
				            console.error(chrome.runtime.lastError.message);
				        }
				    });
				}
			});
	  	}
	}
});