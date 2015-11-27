// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', function() 
{
  document.getElementById('start').addEventListener('click', function() 
  {
    getCurrentTabUrl(function(url) 
    {
      chrome.storage.local.get({onePlusStoreAvailabilityUrls: []}, function (result) 
      {
        var onePlusStoreAvailabilityUrls = result.onePlusStoreAvailabilityUrls;
        onePlusStoreAvailabilityUrls.push(url);
        chrome.storage.local.set({onePlusStoreAvailabilityUrls: onePlusStoreAvailabilityUrls});
      });
    });
  });
  
  document.getElementById('stop').addEventListener('click', function() 
  {
    getCurrentTabUrl(function(url) 
    {
      chrome.storage.local.get({onePlusStoreAvailabilityUrls: []}, function (result) 
      {
        var onePlusStoreAvailabilityUrls = result.onePlusStoreAvailabilityUrls;
        onePlusStoreAvailabilityUrls.splice(onePlusStoreAvailabilityUrls.indexOf(url), 1);
        chrome.storage.local.set({onePlusStoreAvailabilityUrls: onePlusStoreAvailabilityUrls});
      });
    });
  });
});
