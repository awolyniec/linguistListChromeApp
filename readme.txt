Code documentation for the LINGUIST List Chrome app
Version: August 21st, 2015
Developed by Alec Wolyniec and Petar Garzina

————————————————————————————————————————————————

Description: 

The LINGUIST List Chrome app features several of the most important functions of the LINGUIST List website (linguistlist.org) in a convenient, responsive format. These include:
	-GeoLing - The LINGUIST List’s map app, built to help linguists locate 				events, jobs, and geographically tagged information about languages
	-Subscribe - Manage your subscription to the LINGUIST List
	-RSS - Read papers, job descriptions, and other information posted to the LINGUIST 		List website (in progress)
Help and settings menus are currently in progress. The settings menu currently allows users to turn geolocation settings on and off for privacy purposes.

————————————————————————————————————————————————

Table of contents:
1- _locales
  1a- en
    1ai - messages.json
  1b- hr
    1bi - messages.json
2- assets
3- js
  3a- jQuery
	-jQuery utility files for this project
    3ai- jquery.jpanelmenu.js
    3aii- jQuery_dev.js
  3b- asyncManagement.js
	-Function to trigger an event whenever a queue of asynchronous operations has been completed
  3c- defunctCode.js
  3d- geoLingMenuContainer.js
	-Various used and unused functions to support the tab-based menu of the GeoLing map app
  3e- loadEvents.js
	-Events to trigger upon loading, including click event handlers for buttons and a prompt to set geolocation preferences (on/off) if they have not been set before
  3f- rss2.js
	-Handles the content of the “read” panel - to read LINGUIST List postings
  3g- settingsHelpMenu.js
	-Display settings for the settings and help menu
  3h- storage.js
	-A Chrome local storage model, based on the model found in tutorials at 	developer.chrome.com
  3i- storedSettings.js
	-Handles the storage of geolocation and other settings in Chrome local storage
  3j- unitTests.js
	-A few unit tests for app properties (i.e. ensuring that when the total width of menu tabs exceeds the width of the app window, all tabs decrease in size to fit into the app window). Many of these are not relevant to the current version of the app.
  3k- viewControl.js
	-Controls which app view is shown at any given time
4- pageViews
  4a- index.html
  4b- sandboxed.html
	-A sandboxed version of GeoLing, imported from linguistlist.org
5- styleSheets
  5a- fonts.css
  5b- geoLing.css
  5c- homepage.css
  5d- index.css
  5e- mainMenu.css
  5f- rssStyle2.css
  5g- rssStyle3.css
6- background.js
	-Background file
7- manifest.json
	-Project manifest