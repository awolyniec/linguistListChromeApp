//Controls the page views shown in the app

var CURRENTVIEW = null;

/*Make all contentViews invisible, except the one corresponding to
the tab with the position specified in the arguments. Make that one
visible.*/
function setContentsView(pageType) {
  var contentViews = document.getElementsByClassName("contentView");
  //var tabs = document.getElementsByClassName("tab");
  
  for (var i = 0; i < contentViews.length; i++) {
    var contentView = contentViews[i];
    //var tab = tabs[i];
    //if newPosition, activate the view and set its tab to active mode
    if (contentView.id === pageType+"CV") {
      $(contentView).css("visibility", "visible");
      //$(tab).addClass("activeViewTab");
    }
    //otherwise, hide the view and if its tab is in active mode, turn that off
    else {
      $(contentView).css("visibility", "hidden");
      //$(tab).removeClass("activeViewTab");
    }
  }
  /*Handle display of GeoLing-specific settings*/
  if (pageType === "geoLing") {
    //Have geoLingMenuContainer appear
    $("#geoLingMenuContainer").css("visibility", "visible");
    //If this is the first time GeoLing has been opened, configure GeoLing settings
    if (GEOLINGFIRSTLOADED === false) {
        manageGeoLingLoadSettings();
        GEOLINGFIRSTLOADED = true;
    }
  }
  else {
    $("#geoLingMenuContainer").css("visibility", "hidden");
  }
}

//Create a geoLingView div containing a GeoLing webview
function newGeoLingView(tab) {
  var newView = document.createElement("div");
  newView.setAttribute("class", "geoLingView");
  newView.innerHTML = '<webview src="http://geoling.linguistlist.org"></webview>';
  return newView;
}

//Remove the deleted tab's view from the contents div
function setGeoLingViewDelete(oldView) {
  var tabViews = document.getElementsByClassName("geoLingView");
  for (var i = 0; i < tabViews.length; i++) {
    if (tabViews[i] === oldView) {
      document.getElementById("geoLingCV").removeChild(tabViews[i]);
      break;
    }
  }
}

//Make all geoLingViews invisible
function setGeoLingViewSwitchFrom() {
  var tabViews = document.getElementsByClassName("geoLingView");
  for (var i = 0; i < tabViews.length; i++) {
    $(tabViews[i]).addClass("hiddenElement");
  }
}

//Add the new geoLingTab's geoLingView to the first contentView div, which is for GeoLing
function setGeoLingViewAdd(newView) {
  var content = document.getElementById("geoLingCV");
  content.appendChild(newView);
}

//Make the given geoLingView visible
function setGeoLingViewSwitchTo(newView) {
  var tabViews = document.getElementsByClassName("geoLingView");
  for (var i = 0; i < tabViews.length; i++) {
    if (tabViews[i] === newView) {
      $(tabViews[i]).removeClass("hiddenElement");
      break;
    }
  }
}

//Sets the zoom of a webview
function setZoom(webview) {
  //initialize
  if (window.innerHeight < 600) {
     webview.setZoom((window.innerHeight/600)*(window.innerHeight/600));
  }
  else {
    webview.setZoom(1);
  }
  
  window.addEventListener("resize", function() { 
    if (window.innerHeight < 600) {
      webview.setZoom((window.innerHeight/600)*(window.innerHeight/600));
    }
    else {
      webview.setZoom(1);
    }
  });
}

//Automatically scroll a given container div to put a given element at the top
//left position; container and element can also be passed as CSS selectors
function autoScrollTo(container, element) {
  $(container).animate(
    {scrollTop: ($(element).offset().top - $(container).offset().top) + container.scrollTop}, 'slow');
}

/*Resizes the "content" div to take up all of the window's height not taken up
by the geoLingMenuContainer div, if that is visible*/
function resizeContent() {
  $("#content").css("height", window.innerHeight);
}

/*Sets the width of the bar containing the GeoLing menu so that the menu takes up the entire
width of the screen minus the total width of any visible divs that are children of the header (including margins
and borders), and minus the padding present in the geolingMenuContainer div itself*/
function resizeGeoLingMenuContainer() {
    var newWidth = window.innerWidth;
    var headerChildren = $("#header").children();
    for (var i = 0; i < headerChildren.length; i++) {
        var child = headerChildren[i];
        if ($(child).css("visibility") === "visible") {
            newWidth -= $(child).outerWidth(true);
        }
    }
    var menCont = document.getElementById("geoLingMenuContainer");
    newWidth -= parseInt($(menCont).css("padding-left"));
    newWidth -= parseInt($(menCont).css("padding-right"));
    $(menCont).css("width", newWidth);
}

/*Vertically aligns the geoLingMenuContainer in the center of the header div*/
function positionGeoLingMenuContainer() {
    var menCont = document.getElementById("geoLingMenuContainer");
    var halfHeaderHeight = $("#header").outerHeight(true) / 2;
    var halfMenuHeight = $(menCont).outerHeight(true) / 2;
    console.log(halfHeaderHeight);
    console.log(halfMenuHeight);
    $(menCont).css("margin-top", (halfHeaderHeight - halfMenuHeight));
}

/*Sets the GeoLingTabContainer's width to take up all the geoLingMenuContainer's width not taken up
by the geoLing menu and padding*/
function resizeGeoLingTabContainer() {
  var menCont = document.getElementById("geoLingMenuContainer");
  var newWidth = $(menCont).outerWidth(true) -
  $("#geoLingMenu").outerWidth(true) - parseInt($(menCont).css("padding-left")) -
  parseInt($(menCont).css("padding-right"));
  /*if ($("#overflowExtL").css("display") === "block") {
    newWidth -= 2 * $("#overflowExtL").css("width");
  }*/
  $("#geoLingTabContainer").css("width", newWidth - 1);
}

/*Sets the width of the tabs in the menu div such that they cover the entire
menu, and that they are all the same size*/
function resizeMenuDivs() {
  var tabs = document.getElementsByClassName("tab");
  var menuWidth = parseInt($("#menu").css("width"));
  for (var i = 0; i < tabs.length; i++) {
    $(tabs[i]).css("width", menuWidth/tabs.length);
  }
}

/*Sets the width of each geoLing tab to equal the width of the geoLingTabContainer
divided by the number of geoLingTabs; also sets the width of each geoLingTabBackground
to equal the width of the tab minus the width of its button*/
function resizeGeoLingTabs () { //This causes them to break out
  var geoLingTabs = document.getElementsByClassName("geoLingTab");
  var buttonWidth = $(".geoLingTabButton").eq(0).outerWidth(true);
  var geoLingTCWidth = $("#geoLingTabContainer").outerWidth(true);
  var allTabsWidth = $(".geoLingTab").eq(0).outerWidth(true) * geoLingTabs.length;
  var newWidth;

  if (allTabsWidth > geoLingTCWidth) {
      if ($(geoLingTabs[0]).outerWidth(true) <= buttonWidth) {
        //remove listener that allows menu to create tabs
      }
      else {
        newWidth = geoLingTCWidth/geoLingTabs.length;
      }
  }
  else {
    newWidth = 80;
  }
  for (var i = 0; i < geoLingTabs.length; i++) {
    var tab = geoLingTabs[i];
    var back = document.getElementsByClassName("geoLingTabBackground")[i];
    $(tab).css("width", newWidth);
    $(back).css("width", newWidth - buttonWidth);
  }
}

/* Horizontally center an element within its parent */
function centerElementHorizontally(element, parent) {
  var middle = $(parent).outerWidth(true) / 2;
  var halfWidth = $(element).outerWidth(true) / 2;
  $(element).offset({left: middle - halfWidth}); //200 added because the jPanelMenu extends the width of the doc
}

/* Vertically center an element within its parent */
function centerElementVertically(element, parent) {
  var middle = $(parent).outerHeight(true) / 2;
  var halfHeight = $(element).outerHeight(true) / 2;
  $(element).offset({top: middle - halfHeight});
}

var ACTIVATED = false;
/*Activates one of the menus that appears in the right side of the content div:
Help or settings*/
function activateMenuRightSide(menuType) {
  if (ACTIVATED === false) {
    //Set all contentView divs' width to take up 50% of content div
    var contentViews = document.getElementsByClassName("contentView");
    for (var i = 0; i < contentViews.length; i++) {
      $(contentViews[i]).css("width", "50%");
    }
    
    //Set GeoLing menu width to take up 50% of the screen
    $("#geoLingMenuContainer").css("width", "50%");
    
    //Make the menu appear
    $("#"+menuType+"View").css("visibility", "visible");
    
    //Set the X button in the menu to make the help menu disappear
    var menuX = document.getElementById(menuType+"X");
    if (!(menuX.onclick)) {
      menuX.onclick = function(){
        hidePopupMenu(menuType);
        if (menuType === "settings") {
            setupSettingsMenuFormDefaults();
        }
      };
    }
    if (menuType === "settings") {
        var menuCancel = document.getElementById('settingsCancel');
        if (!(menuCancel.onclick)) {
            menuCancel.onclick = function() {
                hidePopupMenu(menuType);
                setupSettingsMenuFormDefaults();
            };
        }
    }
  
    resizeGeoLingTabContainer();
    resizeGeoLingTabs();
    ACTIVATED = true;
  }
  /*If one of these menus is already visible, hide all of them, except for the one specified in the parameters;
  make that one visible.*/
  else {
    var menus = document.getElementsByClassName("contentMenuView");
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].id === menuType+"View") {
            $(menus[i]).css("visibility", "visible");
        }
        else {
            $(menus[i]).css("visibility", "hidden");
        }
    }
  }
}

function deactivateMenuRightSide(menuType) {
  //Set all contentView divs' width to take up 100% of content div
  var contentViews = document.getElementsByClassName("contentView");
  for (var i = 0; i < contentViews.length; i++) {
    $(contentViews[i]).css("width", "100%");
  }
  
  //Set GeoLing menu width to take up 100% of the screen
  $("#geoLingMenuContainer").css("width", "100%");
  
  //Make the menu disappear
  $("#"+menuType+"View").css("visibility", "hidden");
  
  resizeGeoLingTabContainer();
  resizeGeoLingTabs();
  ACTIVATED = false;
}

/*Prevents the user from interacting with the page and displays a pop-up menu*/
function displayPopupMenu(type) {
  freezePage();
  var theMenu = document.getElementById(type+"PopupMenu");
  $(theMenu).css("display", "block");
  centerElementVertically(theMenu, document.body);
  centerElementHorizontally(theMenu, document.body);
  window.onresize = function(){
    centerElementVertically(theMenu, document.body);
    centerElementHorizontally(theMenu, document.body);
  };
  /* Set the menu to close when certain actions are carried out. The action
  depends on the type of menu.*/
  if (type === "geolocation") {
    var select = $("#geolocationPopupMenu").find("select")[0];
    select.onchange = function(){ //Make this a selection event
      var form = $("#geolocationPopupMenu").find("form")[0]; //wrong type of form
      changeSetting(form);
      window.addEventListener("asynchronousDone", doHide);
    };
  }
  function doHide () {
    hidePopupMenu("geolocation");
    window.removeEventListener("asynchronousDone", doHide);
  }
  var menuX = document.getElementById(type+"X");
  if (!(menuX.onclick)) {
    menuX.onclick = function(){
      hidePopupMenu(type);
      if (type === "settings") {
        setupSettingsMenuFormDefaults();
      }
    };
  }
  if (type === "settings") {
    var menuCancel = document.getElementById('settingsCancel');
    if (!(menuCancel.onclick)) {
      menuCancel.onclick = function() {
        hidePopupMenu(type);
        setupSettingsMenuFormDefaults();
      };
    }
  }
}

function hidePopupMenu(type) {
  unfreezePage();
  var theMenu = document.getElementById(type+"PopupMenu");
  $(theMenu).css("display", "none");
  /*Create a GeoLing tab as would have been done if this pop-up menu hadn't 
  been displayed; remove the dummy map in the menu view*/
  if (type === "geolocation") {
    manageGeoLingLoadSettings();
    var geolingView = document.querySelector("#geoLingCV");
    var image = $(geolingView).find("img")[0];
    geolingView.removeChild(image); //error here
  }
}

/*Make page elements with a z-index below 1 unclickable by displaying element
that covers them*/
function freezePage() {
  document.getElementById("freezer").style.display = "block";
}

/*Reverse the effects of freezePage*/
function unfreezePage() {
  $("#freezer").css("display", "none");
}

function helpLingContent(){
    if ($("#contentLingHelpSH").css('display').localeCompare("none") === 0) {
        $("#contentLingHelpSH").fadeIn();
    } else {
        $("#contentLingHelpSH").fadeOut();
        //$("#contentHelpSH").fadeOut(); // fade out help part when closing the subscription content so when u reopen it the help is not auto open
    }
}

function helpLiteContent(){
    if ($("#contentLiteHelpSH").css('display').localeCompare("none") === 0) {
        $("#contentLiteHelpSH").fadeIn();
    } else {
        $("#contentLiteHelpSH").fadeOut();
        //$("#contentHelpSH").fadeOut(); // fade out help part when closing the subscription content so when u reopen it the help is not auto open
    }
}

function hideReadNavi(){
    $("#ulNaviRead").css("display", "none");
}

function showHeader(){
    $("#header").css("background-color", "#fff");
}

/* Check radio button options in the settings menu that correspond to
the app's current settings */
function setupSettingsMenuFormDefaults() {
  //Get settings
  asyncs.add();
  SETTINGSTORAGE.findAll(function(settings){
    var settingsArray = [];
    //Convert settings to format that matches up with form
    for (var i = 0; i < settings.length; i++) {
      var setting = {};
      setting["type"] = settings[i].type;
      setting["value"] = settings[i].status + " " + settings[i].timeframe;
      settingsArray.push(setting);
    }
    //Get form values; compare them to setting values
    var formInputs = $("#settingsPopupMenu").find("input");
    var ps = $("#settingsPopupMenu").find("form").eq(0).find("p");
    var inputList = [];
    var pList = [];
    var parent;
    /*Replaces form inputs with identical inputs without a "checked" attribute, so that
    their "checked" status can be changed to anything (if user has interacted with the form, the checked
    input will always be the input the user last clicked on)*/
    //Remove the old input element and insert an identical new one without a checked attribute
    for (i = 0; i < formInputs.length; i++) {
        var input = formInputs[i];
        parent = input.parentNode;
        var newInput = document.createElement("input");
        newInput.type = "radio";
        newInput.name = input.name;
        newInput.value = input.value;

        inputList.push(newInput);
        pList.push(ps[i]);
    }
    parent.innerHTML = "";
    for (i = 0; i < inputList.length; i++) {
        parent.appendChild(pList[i]);
        parent.appendChild(inputList[i]);
    }
    /*Check each input to see if it matches with a stored setting. If it does, mark it as checked.*/
    formInputs = $("#settingsPopupMenu").find("input");
    for (i = 0; i < formInputs.length; i++) {
      for (var j = 0; j < settingsArray.length; j++) {
        if (settingsArray[j].type === formInputs[i].getAttribute("name")) {
          if (settingsArray[j].value === formInputs[i].getAttribute("value")) {
            formInputs[i].setAttribute("checked", "checked");
          }
        }
      }
    }
    asyncs.remove();
  });
}

