//Contains functions that handle the geoLingMenuContainer div and the menus,
//scrollbars, and tabs inside of it

var NUMGEOLINGTABS = 0;
var FREESPACE = 0;
var MARKER = false;
var GOLEFT;
var GORIGHT;
var CURRENTGEOLINGTAB = null;

//Calculate the amount of free space left in the geoLingTabContainer div; 
//display the extension marker if there is not enough free space for another tab
function checkOverflow() {
  //Get the width of the geoLingTabContainer div and of all the tabs present in it
  var element = document.getElementById("geoLingTabContainer");
  var style = window.getComputedStyle(element);
  var navWidth = parseInt(style.getPropertyValue('width'));
  var tabWidth;
  var allTabsWidth;
  
  if (document.getElementsByClassName("geoLingTab").length > 0) {
    element = document.getElementsByClassName("geoLingTab")[0];
    style = window.getComputedStyle(element);
    tabWidth = parseInt(style.getPropertyValue('width'));
    allTabsWidth = tabWidth * NUMGEOLINGTABS;
  }
  else {
    allTabsWidth = 0;
  }
  
  //Calculate the amount of width left in the geoLingTabContainer that is not
  //taken up by tabs
  var navCont = document.getElementById("geoLingTabContainer");
  FREESPACE = navWidth - allTabsWidth; 

  var overMarkL = document.getElementById("overflowExtL");
  var overMarkR = document.getElementById("overflowExtR");
  
  /* Display scroll markers if the total width of tabs is greater than
  the width of the geoLingTabContainer div, hide them if there is enough and 
  the markers are currently visible */
  if (FREESPACE < 0 && MARKER === false) {
    $(overMarkL).css("display", "block");
    $(overMarkR).css("display", "block");
    /*var overMarkP = document.createElement("p");
    overMarkP.setAttribute("id", "overPL");
    overMarkP.innerHTML = "<";
    overMarkL.appendChild(overMarkP);*/
    
    //Add scroll-left and stop-scrolling event handlers to the left marker;
    //limit of one marker per event
    overMarkL.onmouseover = scroll("left", 50);
    overMarkL.onmouseout = stopScroll();
    
    /*overMarkP = document.createElement("p");
    overMarkP.setAttribute("id", "overPR");
    overMarkP.innerHTML = ">";
    overMarkR.appendChild(overMarkP);*/
    
    //Add scroll-right and stop-scrolling event handlers to the right marker;
    //limit of one marker per event
    overMarkR.onmouseover = scroll("right", 50);
    overMarkR.onmouseout = stopScroll();

    MARKER = true;  
  }
  //Deactivate the scroll markers
  else if (FREESPACE >= 0 && MARKER === true) {
    /*var overMarc = document.getElementById("overflowExtL");
    var overMarcP = document.getElementById("overPL");
    overMarc.removeChild(overMarcP);
    overMarc = document.getElementById("overflowExtR");
    overMarcP = document.getElementById("overPR");
    overMarc.removeChild(overMarcP);*/
    $(overMarkL).css("display", "none");
    $(overMarkR).css("display", "none");    
    MARKER = false;
  }
  
}

//Scroll the geoLingTabContainer div to the left or to the right continuously
function scroll (direction, speed) {
  var handler = function () {
    var navCont = document.getElementById("geoLingTabContainer");
    
    if (direction === "left") {
      GOLEFT = setInterval(function () {navCont.scrollLeft -= 10;}, speed);
    }
    else if (direction === "right") {
      GORIGHT = setInterval(function () {navCont.scrollLeft += 10;}, speed);
    }
  };
  return handler;
}

//Stop scrolling the geoLingTabContainer div
function stopScroll () {
  var handler = function() {
    window.clearInterval(GOLEFT);
    GOLEFT = null;
    window.clearInterval(GORIGHT);
    GORIGHT = null;
  };
  return handler;
}

//Scroll a given HTML element all the way to the right
function scrollToRight (elel) {
  var oldScroll = 0;
  var newScroll = -1;
  while (oldScroll !== newScroll) {
    oldScroll = elel.scrollLeft;
    elel.scrollLeft += 20;
    newScroll = elel.scrollLeft;
  }
}

//geoLingTabs
function geoLingTab (myGeoLingTabLL) {
  NUMGEOLINGTABS++;
  //Set up properties of the tab
  this.HTMLRep = this.createTabHTML(myGeoLingTabLL);
  this.node = new geoLingTabNode(this);
  myGeoLingTabLL.addLast(this.node); 
  this.view = newGeoLingView(this);
  
  //Change the layout of the page to accomodate the new tab, if necessary
  //checkOverflow();
  //If the scroll markers in the geoLingTabContainer div are present, scroll the div
  //all the way to the right
  var bar = document.getElementById("geoLingTabContainer");
  if (MARKER === true) {scrollToRight(bar);}
  //When certain sizes are reached, HTML settings of tabs must be changed
  if (bar.children.length === 1) {
    removeXButtons(this.HTMLRep);
  }
  else if (bar.children.length === 2) {
    addXButtons(document.getElementsByClassName("geoLingTab")[0]);
  }

  //Activate this tab's view
  changeCurrentGeoLingTab(this);
  setGeoLingViewSwitchFrom();
  setGeoLingViewAdd(this.view);
  resizeGeoLingTabs();

  //Load settings for this tab's GeoLing view
  manageGeoLingInstanceSettings(this);
}

/*Create the HTML representation of the tab; place it in the 
geoLingTabContainer div*/
geoLingTab.prototype.createTabHTML = function (myGeoLingTabLL) {
  var self = this;
  
  //Create the tab and its components
  var bar = document.getElementById("geoLingTabContainer");
  var newTab = document.createElement("div");
  newTab.setAttribute("class", "geoLingTab");
  //x button
  var tabButt = document.createElement("button");
  var tabButtText = document.createTextNode("X");
  tabButt.className = "geoLingTabButton";
  tabButt.appendChild(tabButtText);
  //clickable area
  var tabBack = document.createElement("div");
  tabBack.className = "geoLingTabBackground";
  //add everything together
  newTab.appendChild(tabBack);
  newTab.appendChild(tabButt);
  bar.appendChild(newTab);
  
  /*Make tab background a clickable area that switches to the current tab's view
  when it's clicked.*/
  tabBack.onclick = function() {
    changeCurrentGeoLingTab(self);
    setGeoLingViewSwitchFrom();
    setGeoLingViewSwitchTo(self.view);
  };
  /*set delete button to delete this tab's HTML representation, node, and view;
  switch views if this is the current tab*/
  tabButt.onclick = function() {
    NUMGEOLINGTABS--;
    self.deleteTabHTML();
    myGeoLingTabLL.removeGeoLingTabNode(self.node);
    setGeoLingViewDelete(self.view);
    resizeGeoLingTabs();
    
    //Change the page's view to the new last node's tab's view
    if (self === CURRENTGEOLINGTAB) {
      changeCurrentGeoLingTab(myGeoLingTabLL.last.value);
      setGeoLingViewSwitchTo(CURRENTGEOLINGTAB.view);
    }
  };
  
  return newTab;
};
  
//Delete the tab's HTML representation
geoLingTab.prototype.deleteTabHTML = function () {
  //Remove the HTML representation; remove scroll markers if necessary
  var bar = document.getElementById("geoLingTabContainer");
  bar.removeChild(this.HTMLRep);
  
  //Changes the view of menuContainer when necessary
  //When certain sizes are reached, HTML settings of tabs must be changed
  if (bar.children.length === 1) {
    removeXButtons(bar.children[0]);
  }
  //checkOverflow();
};

//Set a given tab to be the current tab, highlight it in light blue while
//removing the highlight from the old current, and place its view in the 
//content div
var changeCurrentGeoLingTab = function(newCurr) {
  if (CURRENTGEOLINGTAB !== null) {
    CURRENTGEOLINGTAB.HTMLRep.style.backgroundColor='#EEEEEE';
  }
  CURRENTGEOLINGTAB = newCurr;
  if (newCurr !== null) {
    newCurr.HTMLRep.style.backgroundColor="lightblue";
  }
};

//Hides X button from a given tab's HTMLRep
function removeXButtons (tabHTML) {
  var button = $(tabHTML).find(".geoLingTabButton")[0];
  $(button).css("visibility", "hidden");
}

//Makes X button on a given tab's HTMLRep visible
function addXButtons (tabHTML) {
  var button = $(tabHTML).find(".geoLingTabButton")[0];
  $(button).css("visibility", "visible");
}

//A linked list of GeoLingTabNode, which represent tabs
function geoLingTabLL () {
  this.last = null;
  this.size = 0;
}

//A tab node, containing a tab
function geoLingTabNode (tab) {
  this.value = tab;
  this.prev = null;
}

//Adds a given GeoLingTabNode to the end of the TabLL
geoLingTabLL.prototype.addLast = function (geoLingTabNode) {
  this.size++;
  if (this.last !== null) {
    geoLingTabNode.prev = this.last;
  }
  this.last = geoLingTabNode;
};

//Removes a specified GeoLingTabNode from the LL
geoLingTabLL.prototype.removeGeoLingTabNode = function (geoLingTabNode) {
  this.size--;
  if (geoLingTabNode === this.last) {
    if (geoLingTabNode.prev === null) {
      this.last = null;
    }
    else {
      this.last = geoLingTabNode.prev;
    }
    return;
  }
  //Traverse the list until the tab is found; remove it
  var currentNode = this.last.prev;
  var nextNode = this.last;
  while (currentNode !== geoLingTabNode) {
    nextNode = currentNode;
    currentNode = currentNode.prev;
  }
  nextNode.prev = currentNode.prev;
};

//Takes a string and returns a new string that is the original in camelCase
function textToCamelCase(name) {
  var newName = "";
  for (var i = 0; i < name.length; i++) {
    if (name[i] !== " ") {
      if (i === 0) {
        newName += name[i].toLowerCase(); 
      }
      else {
        newName += name[i];
      }
    }
  }
  return newName;
}

