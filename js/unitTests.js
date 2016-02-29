//Tests to see if clicking the "+" button in the menu div creates a visible
//drop-down menu, a div right below the menu that contains a ul and an "X" button
function testMenuCreateMenuDrop() {
  var good = false;
  console.log("Testing to see if clicking '+' button in menu div creates a"+
  " drop-down menu; a visible div right below the menu that contains a <ul>"+
  " and an 'X' button...");
  try {
    var menu = document.getElementById("menu");
    
    //Search for a "+" button within the menu div; click the first one if it's there
    var menuChild = menu.children;
    for (var i = 0; i < menuChild.length; i++) {
      if (menuChild[i].tagName === "BUTTON" && menuChild[i].innerHTML === "+") {
        $(menuChild[i]).click();
        break;
      }
    }
    
    //Check right below the menu div to see if there is a div that is visible
    //and contains a ul and an X button. If such a div is found, the test condition
    //is satisfied.
    var divs = document.getElementsByTagName("div");
    var true1 = false;
    var true2 = false;
    var below;
    for (i = 0; i < divs.length; i++) {
      if ($(divs[i]).offset().top === $(menu).offset().top + $(menu).outerHeight(true) &&
      $(divs[i]).css("visibility") === "visible" &&
      $(divs[i]).css("display") !== "none") {
        below = divs[i];
        var divChildren = below.children;
        for (var j = 0; j < divChildren.length; j++) {
          //if it's a ul
          if (divChildren[j].tagName === "UL") {
            true1 = true;
          }
          //if it's an x button
          if (divChildren[j].tagName === "BUTTON" && 
          (divChildren[j].innerHTML === "X" || divChildren[j].innerHTML === "x")) {
            true2 = true;
          }
        }
      }
    }
    if (true1 === true && true2 === true) {
      good = true;
    }

    //Remove the div that was found if it was found
    if (below.parent !== undefined) {
      below.parent.removeChild(below);
    }
    else {
      document.body.removeChild(below);
    }
    
  }
  catch (e) {
    console.log("FAILED due to exception.");
    //console.log(e);
    return;
  }
  if (good === false) {
    console.log("FAILED.");
  }
  else {
    console.log("Success!");
  }
}

/*Tests the checkOverflow() function when MARKER is initially set to false, 
and the geoLingTabContainer div initially has no children. MARKER should be false,
and overflowExtL/overflowExtR need to: have no children, have no text, have
no event listeners, and have their "id" attributes unchanged*/
function testCheckOverflowWithEmptyNavAndFalseMARKER () {
  console.log("Testing checkOverflow() function with MARKER initially set to"+
  " false, and a geoLingTabContainer div with no children...");
  var good = false;
  try {
    //Create initial settings
    MARKER = false;
    var nav = document.getElementById("geoLingTabContainer");
    var navChildren = nav.children;
    for (var i = 0; i < navChildren.length; i++) {
      nav.removeChild(navChildren[i]);
    }
    var ovL = document.getElementById("overflowExtL");
    var ovR = document.getElementById("overflowExtR");
  
    //Test and check results
    var goodCounter = 0;
    checkOverflow();
    /*MARKER needs to be false; ovL and ovR need to be empty divs with no
    event listeners, and the same ids as before*/
    if (MARKER === false) {
      goodCounter++;
    }
    if (ovL.innerText === "" && ovL.children.length === 0) {
      goodCounter++;
    }
    if (ovR.innerText === "" && ovR.children.length === 0) {
      goodCounter++;
    }
    if (ovL.id === "overflowExtL") {
      goodCounter++;
    }
    if (ovR.id === "overflowExtR") {
      goodCounter++;
    }
    if (ovL.onmouseover === null && ovL.onmouseout === null) {
      goodCounter++;
    }
    if (ovR.onmouseover === null && ovR.onmouseout === null) {
      goodCounter++;
    }
    if (goodCounter === 7) {
      good = true; //test succeeds
    }
    
    //Restore previous settings (home tab)
    for (i = 0; i < navChildren.length; i++) {
      nav.appendChild(navChildren[i]);
    }
    MARKER = false;
    for (i = 0; i < ovL.children.length; i++) {
      ovL.removeChild(ovL.children[i]);
    }
    for (i = 0; i < ovR.children.length; i++) {
      ovR.removeChild(ovR.children[i]);
    }
    ovL.innerText = "";
    ovR.innerText = "";
    ovL.id = "overflowExtL";
    ovR.id = "overflowExtR";
  }
  
  //Return results
  catch(e) {
    console.log("FAILED due to exception.");
    //console.log(e);
    return;
  }
  if (good === true) {
    console.log("Success!");
  }
  else {
    console.log("FAILED.");
  }
}

/* Tests createTab method when the text argument has value "GeoLing" and the 
geoLingTabContainer div has just one tab in it; it should result in one extra child in 
the div, a tab, with a specific format and two event listeners that trigger 
functions,should not be triggered, and the whole extra child 
should be returned. */
function testCreateTabWithGeoLingTextAndOneTabOffExistingTab () {
  console.log("Testing createTab method with text argument 'GeoLing' and"+
  " geoLingTabContainer div containing one child, a tab (div of class 'tab'), and"+
  " document containing one tab object...");
  var good = false;

  try {
    //initialize conditions
    var nav = document.getElementById("geoLingTabContainer");
    var navChildren = nav.children;
    var numNavChildrenOrig = navChildren.length;
    var numTabsOrig = NUMTABS;
    var tab = CURRENTTAB; //no current tab
    
    //activate method
    var returnedValue = tab.createTab("GeoLing");
  
    //Check results
    var goodCounter = 0;
    //NUMTABS should have increased by 1
    if (NUMTABS === numTabsOrig + 1) {
      goodCounter++;
      //console.log("1");
    }
    //There should be one more child of geoLingTabContainer
    if (navChildren.length === numNavChildrenOrig + 1) {
      goodCounter++;
      //console.log("2");
    }
    //The last child of geoLingTabContainer should be a div
    var shouldBeTab = navChildren[navChildren.length - 1];
    if (shouldBeTab.tagName === "DIV") {
      goodCounter++;
      //console.log("3");
    }
    //The last child of geoLingTabContainer should be a tab
    if (shouldBeTab.className === "tab") {
      goodCounter++;
      //console.log("4");
    }
    //The tab should have two children, a div and a button (in that order)
    var tabChildren = shouldBeTab.children;
    if (tabChildren.length === 2 && tabChildren[0].tagName === "DIV" &&
    tabChildren[1].tagName === "BUTTON") {
      goodCounter++;
      //console.log("5");
    }
    if (shouldBeTab.innerText === "GeoLingX") {
      goodCounter++;
      //console.log("6");
    }
    //The first child of the tab should define the tab's background area
    var shouldBeBackDiv = tabChildren[0];
    if (shouldBeBackDiv.className === "tabBackground") {
      goodCounter++;
      //console.log("7");
    }
    //The background area div should have one child: A <p> with text "GeoLing"
    if (shouldBeBackDiv.children.length === 1 && 
    shouldBeBackDiv.children[0].tagName === "P" &&
    shouldBeBackDiv.children[0].innerHTML === "GeoLing") {
      goodCounter++;
      //console.log("8");
    }
    //The tab background should have an event listener that triggers a function
    if (typeof shouldBeBackDiv.onclick === "function") {
      goodCounter++;
      //console.log("9");
    }
    //The tab's button should have class "tabButton"
    if (shouldBeTab.children[1].className === "tabButton") {
      goodCounter++;
      //console.log("10");
    }
    //The button should have an event listener that triggers a function
    if (typeof tabChildren[1].onclick === "function") {
      goodCounter++;
      //console.log("11");
    }
    if (shouldBeTab === returnedValue) {
      goodCounter++;
      //console.log("12");
    }
  
    if (goodCounter === 12) {
      good = true;
    }
  }
  //Return results
  catch (e) {
    console.log("FAILED due to exception.");
    //console.log(e);
    return;
  }
  if (good === true) {
    console.log("Success!");
  }
  else {
    console.log("FAILED.");
  }
}

/*Create an asynchronous request counter and get the value of its counter
variable, which should be 0*/
function testAsyncCounterInitGet() {
  console.log("Testing creation of asynchronous request counter and immediate"+
  " retrieval of counter variable value...");
  var async1;
  var result;
  try {
    async1 = new asyncRequestCounter();
    result = async1.getSize();
  }
  catch(e) {
    console.log("FAILED due to exception.");
    //console.log(e);
    return;
  }
  if (result === 0) {
    console.log("Success!");
  }
  else {
    console.log("FAILED.");
  }
}

/*Create an asynchronous request counter, decrement by 1, and get the value of
its counter. A negative counter exception should be raised.*/
function testAsyncCounterInitRemoveGet() {
  console.log("Testing creation of asynchronous request counter, decrementation"+
  " of counter variable, and retrieval of counter variable value...");
  var async1;
  var result;
  try {
    async1 = new asyncRequestCounter();
    async1.remove();
    result = async1.getSize();
  }
  catch(e) {
    if (e instanceof negativeCounterException) {
      console.log("Success!");
    }
    else {
      console.log("FAILED due to exception.");
      //console.log(e);
    }
    return;
  }
  //Fails if no exception is thrown
  console.log("FAILED.");
}

/*Create an asynchronous request counter, increment twice, and get the value of 
the counter. A value of 2 should be returned. */
function testAsyncCounterInitAddTwiceGet() {
  console.log("Testing creation of asynchronous request counter, two "+
  "incrementations, and retrieval of counter variable value...");
  var async1;
  var result;
  try {
    async1 = new asyncRequestCounter();
    async1.add();
    async1.add();
    result = async1.getSize();
  }
  catch(e) {
    console.log("FAILED due to exception.");
    //console.log(e);
    return;
  }
  if (result === 2) {
    console.log("Success!");
  }
  else {
    console.log("FAILED.");
  }
}

/*Create an asynchronous request counter, increment, decrement, increment, and
decrement again, and get the value of the counter. A value of 0 should be
returned. */
function testAsyncCounterInitAddRemoveAddRemoveGet() {
  console.log("Testing creation of asynchronous request counter, an "+
  "incrementation, a decrementation, another incrementation, another "+
  "decrementation, and retrieval of counter variable value...");
  var async1;
  var result;
  try {
    async1 = new asyncRequestCounter();
    async1.add();
    async1.remove();
    async1.add();
    async1.remove();
    result = async1.getSize();
  }
  catch(e) {
    console.log("FAILED due to exception.");
    console.log(e);
    return;
  }
  if (result === 0) {
    console.log("Success!");
  }
  else {
    console.log("FAILED.");
  }
}

/* Create an asynchronous request counter, increment, decrement, decrement, and
get the value of the counter variable. A negative counter exception should be
thrown. */
function testAsyncCounterInitAddRemoveRemoveGet() {
  console.log("Testing creation of asynchronous request counter, two "+
  "decrementations of counter variable, and retrieval of counter variable "+
  "value...");
  var async1;
  var result;
  try {
    async1 = new asyncRequestCounter();
    async1.add();
    async1.remove();
    async1.remove();
    result = async1.getSize();
  }
  catch(e) {
    if (e instanceof negativeCounterException) {
      console.log("Success!");
    }
    else {
      console.log("FAILED due to exception.");
      //console.log(e);
    }
    return;
  }
  //Fails if no exception is thrown
  console.log("FAILED.");
}

/*Runs various tests of the setContentsView function*/
function testSetContentsView() {
  console.log("Testing setContentsView function...");
  var testCounter = 1;
  var passedTestCounter = 0;
  
  //Increments the counter if the test is passed
  passedTestCounter += testSetContentsViewWithNewPosition0();
  /*passedTestCounter += testSetContentsViewWithNewPositionNeg1();
  passedTestCounter += testSetContentsViewWithNewPosition123();
  passedTestCounter += testSetContentsViewWithNewPosition0Point4();*/
  
  //Returns results
  console.log(passedTestCounter+" out of "+testCounter+" tests passed.");
}

/*tests setContentsView(0). The first contentView should be visible; the rest
should be hidden. The first tab should have class "activeViewTab"; the rest
shouldn't. The barContainer div should have block display. The height of content
should be window.innerHeight - menu height - barContainer height - header height.*/

//This test doesn't yet work
function testSetContentsViewWithNewPosition0() {
  var goodCounter = 0;
  var shouldBe;
  try {
    setContentsView(0);
    
    var contentViews = document.getElementsByClassName("contentView");
    var tabs = document.getElementsByClassName("tab");
    shouldBe = contentViews.length + tabs.length + 2;
    
    //test the visibility of contentView divs
    for (var i = 0; i < contentViews.length; i++) {
      var contentView = contentViews[i];
      if (i === 0 && $(contentView).css("visibility") !== "visible") {
        break;
      }
      else if (i !== 0 && $(contentView).css("visibility") !== "hidden") {
        break;
      }
      goodCounter++;
    }
    
    //test for the "activeViewTab" class on all tabs
    for (i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      if (i === 0 && !($(tab).hasClass("activeViewTab"))) {
        break;
      }
      else if (i !== 0 && $(tab).hasClass("activeViewTab")) {
        break;
      }
      goodCounter++;
    }
    
    //Check the display of the barContainer div
    if ($("#geoLingMenuContainer").css("display") === "block") {
      console.log("here");
      goodCounter++;
    }
    
    //Check the height of content div
    if ($("#content").css("height") === window.innerHeight - 
    $("#menu").outerHeight(true) - $("#geoLingMenuContainer").outerHeight(true) - 
    $("#header").outerHeight(true)) {
      console.log("here");
      goodCounter++;
    }
    
  }
  catch(e) {
    return 0;
  }
  if (goodCounter === shouldBe) {
    return 1;
  }
  return 0;
}

function testSetContentsViewWithNewPositionNeg1() {
  return 0;
}

function testSetContentsViewWithNewPosition123() {
  return 0;
}

function testSetContentsViewWithNewPosition0Point4() {
  return 0;
}

/*Tests to see if the menu button and the drop-down menu, when clicked, create
valid tabs in the geoLingTabContainer div. Tabs are considered valid if they are
right below the header, have visibility/display settings that allow them to be
seen, are to the right of the menu div, have text that matches its type, have
an "X" button, the last one created is colored differently from the others, and 
if the scrollLeft of any of them plus its width is greater than or equal to the 
scrollLeft of overflowExtR, the tabs are in a div with no-wrap white space 
and overflow-x set to auto.
function testMenuCreateTabs () {
  console.log("Testing to see if clicking menuButton and <li> in dropDown creates"+
  " valid tabs..."); //must update
  var good;
  
  try {
    good = false;
    
    //initialize menuDrop and get the number of kinds of tabs it can open
    $("#menuButton").click();
    var menuDropLi = $("#menuDrop").find("li");
    var maxPos = menuDropLi.length;
    
    //initial conditions for tests
    var initialTabs = myTabLL.size; //initial number of tabs
    var numTabs = 12;
    var finalTabs = numTabs + initialTabs;
    var textArray = []; // the text that should be contained within each tab; fill it up to account for initial tabs
    var correctCases = 0; //Counts the number of times the test loop returns the
    //correct result
    var nonEndColor = "rgb(238, 238, 238)";
    var endColor = "rgb(204, 235, 255)";
    for (var i = initialTabs; i < finalTabs; i++) {
      //Choose random type of tab to be created, then create it
      var pos = Math.floor(Math.random() * maxPos);
      menuDropLi[pos].click(); //click doesn't wait for the tab to finish creating...need a callback.
      textArray.push(menuDropLi[pos].innerHTML);
      
      //Check each tab that's already been created to see if it's valid
      var works = 0;
      var tabs = document.getElementsByClassName("tab");
      for (var j = initialTabs; j < tabs.length; j++) {
        var tab = tabs[j];
        //console.log(j);
        //console.log($(tab).css("background-color"));
        
        //All tabs but last have the same color?
        if (j !== tabs.length - 1 && 
        $(tab).css("background-color") !== nonEndColor) { 
          console.log("Tab not at end of list has wrong color.");
          //break;
        }
        //Last tab colored differently from the others?
        else if (j === tabs.length - 1 && 
        $(tab).css("background-color") !== endColor) {
          console.log("Tab at end of list has wrong color."); //mistakenly does this due to multithreading
          console.log(j);
          console.log($(tab).css("background-color"));
          //break;
        }
        
        //end-stage tests
        if (j === numTabs - 1) {
          //Is it right below the header?
        
          //Proper visibility/display settings?
        
          //Just to the right of the menu div?
        
          //Correct text?
        
          //X button?
        
          //Overflowed if it's to the right of overflowExtR?
          
          //Opens a unique instance of the correct tab type
        }
        works++;
      }
      if (works === tabs.length - initialTabs) {
        correctCases++; //only reach here if all tests work out
      }
      else {
        break;
      }
    }
    if (correctCases === numTabs) {
      good = true;
    }
    
    //delete all tabs that were created; this inadvertently tests the deleteTab() function
    while (myTabLL.size > 1) {
      myTabLL.last.value.deleteTab();
    }
  }
  //end results
  catch (e) {
    console.log("FAILED due to exception.");
    console.log(e);
  }
  finally {
    if (good === true) {
      console.log("Success!");
    }
    else {
      console.log("FAILED.");
    }
  }
}
*/

    //For a different test to validate the quality of any tabs created
  /*
  -	Does navContainer have only <number of tabs> children?
  -	Is CURRENTTAB the last created tab?
  -	Is the last created tab light blue?
  -	Are all the other tabs gray?
  -	Does .content have only one child?
  -	Is .content’s first child the last tab’s child?
  -	Is the linked list of tabs the length of the number of tabs?
  -	Is the last tab in the linked list the last node created?
  */
  
    /*var good = true;
    if(CURRENTTAB !== testTab1){
      good = false;
      console.log("Failed at if-statement 1");
    }
    if(document.getElementById("navContainer").lastChild !== testTab1.HTMLRep){
      good = false;
      console.log("Failed at if-statement 2");
    }
    if(document.getElementById("content").children[0] !== testTab1.view){
      good = false;
      console.log("Failed at if-statement 3");
      console.log(document.getElementById("content").children[0]);
      console.log(testTab1.view);
    }
    if(testTab1.HTMLRep.style.backgroundColor !== "rgb(173, 216, 230)"){
      good = false;
      console.log("Failed at if-statement 4");
      console.log(testTab1.HTMLRep.style.backgroundColor);
    }
    if (myTabLL.last !== testTab1.node){
      good = false;
      console.log("Failed at if-statement 5");
    }
  
    if (good === true) {console.log("Success!");}
    */

//Create a storage object, create simulated e-mail addresses and id by
//generating a Subscribe tab and clicking on its button, save that data
//to local storage, and then check to see if it is in storage

//MUST WRITE WITH CALLBACKS, otherwise you'll never get the function order you want
/*function testSaveClickToStorage() { //returns a success even if no data was entered
  //generate preliminary conditions
  console.log("Testing generate e-mail and id via button on Subscribe page,"+
  "then save data...");
  
  testStorage = new Store("test", function(storage) {
    console.log("Storage created.");
    notDone = true;
  
    //generate data from page and add to it
    var testTab = new Tab("Subscribe");
    $("#test").click();
    address = document.getElementById("target1").innerHTML;
    aId = document.getElementById("target2").innerHTML;
    if (address !== "" && aId !== "") {
      address = ["ad1", "ad2", "ad3", "ad4", "ad5"];
      aId = ["1", "2", "3", "4", "5"];
    }
  
    var self = this;
    //save data
    for (var i = 0; i < address.length; i++) {
      saveData(self, i);
    }
  });
}

//function that saves data
function saveData (self, j) {
  console.log(j);
  self.save({email: address[j], id: aId[j]}, checkData);  //looping works, the right data is used for the save function, yet only one object is saved each time
}

//Check data; grade the success of the test
function checkData (storage) {
  console.log("Data saved.");
  score = 0;
  //Check to see if each "entry" from address and aId has a corresponding
  //item in login storage
  if (notDone === true) { //make sure this only runs once
    notDone = false;
    chrome.storage.local.get(this.dbName, function(storage){
      console.log("Checking data...");
      for (var i = 0; i < address.length; i++) {
        console.log(storage[this.dbName].logins);
        var data = storage[this.dbName].logins.filter(filterData);
        if (data.length !== 0) {
          score++;
        }
      }
      if (score === address.length) {
        console.log("Success!");
      }
      else {
        console.log("FAILED.");
      }
      //clear storage, delete vars
      notDone = undefined;
      address = undefined;
      aId = undefined;
      score = undefined;
      //restore default view
      chrome.storage.local.clear(function() {
        $("#navContainer:last-child button").click();
        console.log("clearing...");
      });
    }.bind(this));
  }
}
function filterData (login) {
  if (login['email'] !== address[i]) {
    return false;
  }
  if (login['id'] !== aId[i]) {
    return false;
  }
  return true;
}
*/

/*function testSaveClickToStorage() {
  console.log("Testing generate e-mail and id via button on Subscribe page,"+
  "then save data...");
  
  //Create deferred object to handle asynchronous functions
  var functionList = jQuery.deferred();
  
  //Create storage
  functionList.done(function(){
    testStorage = new Store("test", function(storage) {
      console.log("Storage created.");
    });
  });
  
  //generate data from page and add to it
  var testTab = new Tab("Subscribe");
  $("#test").click();
  address = document.getElementById("target1").innerHTML;
  aId = document.getElementById("target2").innerHTML;
  if (address !== "" && aId !== "") {
    address = ["ad1", "ad2", "ad3", "ad4", "ad5"];
    aId = ["1", "2", "3", "4", "5"];
  }
  
  //save data
  for (var i = 0; i < address.length; i++) {
    functionList.done(saveData(i)); //check to see if everything is being saved correctly
  }
  
  //Retrieve data
  functionList.done(function() {
    chrome.storage.local.get(function(storage) {
      //evaluate data; return results
      var logins = storage[testStorage.dbName].logins;
      var data;
      for (var i; i < address.length; i++) {
        data = logins.filter(filterFunction(login));
      }
    });
  });
  
  //Evaluate data; return results
  
  //Resolve the deferred to execute everything
  functionList.resolve();
  
  //Clear storage, delete global vars (may want to edit out global vars)
}
function saveData(i) {
  return function(i) {
    testStorage.save({email:address[i], id:aId[i]});
  };
}
function filterFunction(login) {
  return function (login) {
    //if () {
      
    //}
  };
}
*/

/*//Tests to see if the currently empty logIn() function works
function testLogIn() {
  //$(".signButton:first").click();
  logOut();
  console.log("Testing to see logIn function works...");
  logIn();
  if(LOGGED === false) {console.log("FAILED.");}
  else {console.log("Success!");}
  logOut();
}*/

//Run tests
window.addEventListener("load", function (){
  window.addEventListener("doneLoading", function(){
    //testMenuCreateMenuDrop(); //more of a hybrid test than a unit test
    //testCreateTabWithGeoLingTextAndOneTabOffExistingTab();
    testAsyncCounterInitGet();
    testAsyncCounterInitRemoveGet();
    testAsyncCounterInitAddTwiceGet();
    testAsyncCounterInitAddRemoveAddRemoveGet();
    testAsyncCounterInitAddRemoveRemoveGet();
    testSetContentsView();
  });
});
