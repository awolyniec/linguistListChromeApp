//Handles fundamental alterations to the state of the app
var GEOLINGFIRSTLOADED = false;

//Handles settings that are configured when the window is loaded.
window.onload = function(){
  //Creates a counter to measure the number of asynchronous requests being 
  //executed by the program
  asyncs = new asyncRequestCounter();
  //Creates storage, then does everything else involved in setting up the app
  asyncs.add();
  SETTINGSTORAGE = new Store("settings", function(){
    //SETTINGSTORAGE.drop(function(){});
    //Deletes temporary settings
    chrome.storage.local.get("settings", function(storage) {
      var data = storage["settings"];
      var settings = data.settings;
  
      for (var i = 0; i < settings.length; i++) {
        if (settings[i].timeframe === "temporary") {
          settings.splice(i, 1);
          break;
        }
      }
      chrome.storage.local.set(storage, function(){
        asyncs.remove();
      }.bind(this));
    }.bind(this));

    window.addEventListener("asynchronousDone", loadingEvents2);
    function loadingEvents2() {
      window.removeEventListener("asynchronousDone", loadingEvents2);
      //Finalizes the dimensions of the window
      resizeMenuDivs();
      resizeContent();
      resizeGeoLingMenuContainer();
      positionGeoLingMenuContainer();
      resizeGeoLingTabContainer();

      //Generate settings for the various views covered by the app
      manageViewLoadSettings();

      /*Loads the last saved view or the splash page (for development purposes, loads GeoLing);
      places the active view's tab in active mode */
      setContentsView("home");

      //Set divs with static widths to change width whenever the window is resized
      window.addEventListener("resize", function() {
        resizeMenuDivs();
        resizeContent();
        resizeGeoLingMenuContainer();
        resizeGeoLingTabContainer();
        positionGeoLingMenuContainer();
        resizeGeoLingTabs();
      });
      
        var jPM = $.jPanelMenu({
            menu: '#menu1',
            trigger: '.menu-trigger',
            duration: 100,
            //animated:false,
            openPosition: 200,
            clone: false,
            //closeOnContentClick: false,
        });
        jPM.on();
        jPM.trigger(false); //menuPanel is opened at app startup

        // gets the issue numbers of issues saved in favs
        getFavIssueNum();
        // mark the home button as active as soon as app starts
        activityButtonMain("btn_home");

        // main navigation
        $("li").click(function () {
            switch (this.id) {
                case "btn_home":
                    setContentsView("home"); // makes home the active view
                    jPM.trigger(true); // opens or closes the menuPanel
                    hideReadNavi(); // hides the read sub menu if it was opened
                    activityButtonMain(this.id); // makes this the active button
                    $('#readDropDown').css('background-image', 'url(../assets/icons/chevron2.png)'); // flips the arrow of submenu to show it as closed, arrow facing down
                    break;
                case "btn_geoling":
                    setContentsView("geoLing");
                    jPM.trigger(true);
                    hideReadNavi();
                    activityButtonMain(this.id);
                    $('#readDropDown').css('background-image', 'url(../assets/icons/chevron2.png)');
                    break;
                //case "btn_read":
                case "btn_subscription":
                    setContentsView("subscribe");
                    hideReadNavi();
                    jPM.trigger(true);
                    activityButtonMain(this.id);
                    $('#readDropDown').css('background-image', 'url(../assets/icons/chevron2.png)');
                    break;
            }
        });

    function activityButtonMain(button) {
        $('#btn_home, #btn_geoling, #btn_subscription, #liRead').removeClass('btnActive');
        $('#' + button).addClass('btnActive');

        switch (button){
            case "btn_home":
                $('#homeIcon').css('background-image', 'url(../assets/icons/house204b.png)');
                $('#geoIcon').css('background-image', 'url(../assets/icons/pin12.png)');
                $('#readIcon').css('background-image', 'url(../assets/icons/news.png)');
                break;
            case "btn_geoling":
                $('#geoIcon').css('background-image', 'url(../assets/icons/pin12b.png)');
                $('#homeIcon').css('background-image', 'url(../assets/icons/house204.png)');
                $('#readIcon').css('background-image', 'url(../assets/icons/news.png)');
                break;
            case "liRead":
                $('#readIcon').css('background-image', 'url(../assets/icons/newsb.png)');
                $('#homeIcon').css('background-image', 'url(../assets/icons/house204.png)');
                $('#geoIcon').css('background-image', 'url(../assets/icons/pin12.png)');
                break;
        }
    }


// i had to remove the btn_read from id in li to id in p, so i can have a click that does one thing when clicked on Read, and a click that does another
    // thing when clicked on arrow
    $("#btn_read").click(function(){
        activityButtonMain("liRead");
        setContentsView("RSS");
        jPM.trigger(true);
    });

// when the arrow for the subMenu is clicked the submenu shows
    $("#readDropDown").click(function() {
        if ($("#ulNaviRead").css('display').localeCompare("none") === 0) {
            $("#ulNaviRead").css("display", "block");
            $('#readDropDown').css('background-image', 'url(../assets/icons/chevron1.png)');
        } else {
            $("#ulNaviRead").css("display", "none");
            $('#readDropDown').css('background-image', 'url(../assets/icons/chevron2.png)');
        }
    });

// home screen the button for donate
    $("#btn_donateHome").click(function(){
        window.open('http://funddrive.linguistlist.org/donate/');
    });

    // home screen the button for subscription
    $("#btn_subscriptionHome").click(function(){
        if ($("#subscriptionHome").css('display').localeCompare("none") === 0) {
            $("#subscriptionHome").fadeIn();
        } else {
            $("#subscriptionHome").fadeOut();
        }
    });
    // home screen buttons subscribe, unsubsribe and help
    $(".subscribtionButtons").click(function(){
        switch (this.id) {
            case "linguistSubscribe":
                window.open("MAILTO:LINGUIST-join@listserv.linguistlist.org");
                break;
            case "linguistUnSubscribe":
                window.open("MAILTO:LINGUIST-leave@listserv.linguistlist.org");
                break;
            case "linguistHelp":
                helpLingContent(); // fading in or out help content
                $("#contentLiteHelpSH").css('display', "none"); // removing the other help content
                $("#contentLingHelpSH").text(chrome.i18n.getMessage("contentHelpLing")); // setting the text
                $("#linguistHelp").toggleClass("activeHelp"); // setting the button as active or inactive button
                $("#lingliteHelp").removeClass("activeHelp"); // removing the other help button as active

                break;
            case "lingliteSubscribe":
                window.open("MAILTO:LINGLITE-join@listserv.linguistlist.org");
                break;
            case "lingliteUnSubsribe":
                window.open("MAILTO:LINGLITE-leave@listserv.linguistlist.org");
                break;
            case "lingliteHelp":
                helpLiteContent();
                $("#contentLingHelpSH").css('display', "none");
                $("#contentLiteHelpSH").text(chrome.i18n.getMessage("contentHelpLite"));
                $("#lingliteHelp").toggleClass("activeHelp");
                $("#linguistHelp").removeClass("activeHelp");
                break;
        }
    });



    // shows the most recent when immediately when u start the app
    getFeed('https://www.linguistlist.org/issues/rss/mostrecent.xml');
    document.getElementById("category_title").innerHTML = "Latest issues:";
    activityButton("btn_latest");

// works only on mobile, was testing chrome app on mobile, as well as the closeme and openme functions
    $('#navmenu').attr('id2', 'out');
    $("#menu-btn").click(function () {
        if ($("#navmenu").attr('id2').localeCompare("out") === 0) {
            openme();
            $('#navmenu').attr('id2', 'in');
        } else {
            closeme();
            $('#navmenu').attr('id2', 'out');
        }
    });

    var content = $("#content");
    function openme() {
        $(function () {
            content.animate({
                left: "120px"
            }, {duration: 200, queue: false});
        });
    }

    function closeme() {
        var closeme = $(function () {
            content.animate({
                left: "0px"
            }, {duration: 200, queue: false});
        });
    }

    // read submenu navigation
    $("a").click(function () {
        switch (this.id) {
            case "btn_latest":
                feed_link = "https://www.linguistlist.org/issues/rss/mostrecent.xml";
                getFeed(feed_link); // gets the feed from the internet, after which it sends the feed to be parsed
                $('#category_title, #toolbarnav-title').html("Latest issues");
                activityButton(this.id); // makes the butten that is clicked the active button
                closeme();  // makes sense only on mobile, closes the panel
                jPM.trigger(true); // closes or opens the manuPanel
                setContentsView("RSS"); // makes the RSS View active.
                //console.log('i18n: ' + chrome.i18n.getMessage("test"));          localization test
                break;
            case "btn_all":
                feed_link = "https://www.linguistlist.org/issues/rss/all.xml";
                getFeed(feed_link);
                // document.getElementById("category_title").innerHTML = "Issues Addressed to All Subscribers:";
                $('#category_title, #toolbarnav-title').html("Issues Addressed to All Subscribers");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_books":
                feed_link = "https://www.linguistlist.org/issues/rss/books.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Book Announcements");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_calls":
                feed_link = "https://www.linguistlist.org/issues/rss/calls.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Calls for Papers");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_conf":
                feed_link = "https://www.linguistlist.org/issues/rss/confs.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Conference Announcements");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_disc":
                feed_link = "https://www.linguistlist.org/issues/rss/disc.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Discussions on Various Topics");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_dise":
                feed_link = "https://www.linguistlist.org/issues/rss/diss.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Dissertation Abstracts");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_fyi":
                feed_link = "https://www.linguistlist.org/issues/rss/fyi.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("For Your Information");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_intern":
                feed_link = "https://www.linguistlist.org/issues/rss/internships.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Internship Announcements");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_jobs":
                feed_link = "https://www.linguistlist.org/issues/rss/jobs.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Job Announcements");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_media":
                feed_link = "https://www.linguistlist.org/issues/rss/media.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Topics in the Media");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_queries":
                feed_link = "https://www.linguistlist.org/issues/rss/qs.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Queries");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_bookRev":
                feed_link = "https://www.linguistlist.org/issues/rss/review.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Book Reviews");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_software":
                feed_link = "https://www.linguistlist.org/issues/rss/software.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Software Announcements");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_summaries":
                feed_link = "https://www.linguistlist.org/issues/rss/sum.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Summaries of Query Responses");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_support":
                feed_link = "https://www.linguistlist.org/issues/rss/support.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Support for Students");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_journal":
                feed_link = "https://www.linguistlist.org/issues/rss/toc.xml";
                getFeed(feed_link);
                $('#category_title, #toolbarnav-title').html("Journal Tables of Contents");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
            case "btn_favorites":

                // gets every issue saved from storage, creates one object and adds every issue to it, then sends it to parseFavs
                chrome.storage.sync.get(null, function (items) {

                    var favorites = [];
                    $.each(items, function (key, value) {
                        //console.log(key, value);
                        favorites.push(value);
                    });
                    // console.log("favorites aft push: " + favorites);
                    parseFavorites(favorites);
                });

                $('#category_title, #toolbarnav-title').html("Favorites");
                activityButton(this.id);
                closeme();  // makes sense only on mobile
                jPM.trigger(true);
                setContentsView("RSS");
                break;
        }
    });

        // social buttons on home page
        $(".socialButtons").click(function(){
            switch (this.id) {
                case "socialFace":
                    window.open("https://www.facebook.com/linguistlist");
                    break;
                case "socialTwitter":
                    window.open("http://twitter.com/linguistlist");
                    break;
                case "socialGplus":
                    window.open("https://plus.google.com/111284427486654326569?prsrc=3");
                    break;
                case "socialYoutube":
                    window.open("http://www.youtube.com/user/linguistlist?feature=creators_cornier-http%253A%2F%2Fs.ytimg.com%2Fyt%2Fimg%2Fcreators_corner%2FYouTube%2Fyoutube_32x32.png");
                    break;
                case "socialBlog":
                    window.open("http://blog.linguistlist.org/");
                    break;
            }

        });









      //New event to signify that the app has finished its onload changes
      var doneLoadingEvent = new CustomEvent(
        "doneLoading",
        {
          detail: {},
          bubbles: true,
          cancelable: true
        }
      );
      //window.dispatchEvent(doneLoadingEvent);
    }
  });
};

/*Generates settings necessary for the functionality of the app that must be
configured before the user is to interact with the app window*/
function manageViewLoadSettings() {
  //Configure settings for the help menu
  manageHelpLoadSettings();
  //Configure settings for the settings menu
  manageSettingsLoadSettings();
  //Configure settings for the RSS feed
  manageRSSLoadSettings();
  //Configure settings for the drop-down settings/help menu
  manageSettingsMenuLoadSettings();
}

//Sets the help button to activate the help menu
function manageHelpLoadSettings() {
  /*var helpButton = document.getElementById("help");
  helpButton.addEventListener("click", function(){activateMenuRightSide("help");});*/
}

//Sets up the settings menu
function manageSettingsLoadSettings() {
  //Sets default checked values for the form that displays the app's current settings
  setupSettingsMenuFormDefaults(); //dispatches some asyncs
  //Sets up the submit button in the settings menu to update app settings
  setupSettingsMenuSubmitButton();
}

var myGeoLingTabLL;
/*Sets up GeoLing view to be fully functional when the user opens it*/
function manageGeoLingLoadSettings() {
  //Check for geolocation preferences; create GeoLing tab if they are there
  var geolocationSetting = new appSetting("geolocationPermission");
  window.addEventListener("asynchronousDone", manageGeoLingLoadSettings2);
  function manageGeoLingLoadSettings2(){
    var stat = geolocationSetting.getSetting();
    var geolocationSettingStatus = checkStatusOfSetting(stat);
    /* If the user has set geolocation preferences, add a GeoLing map view to the
    GeoLing content view */
    if (geolocationSettingStatus === true || geolocationSettingStatus === false) {
      /*Sets up a geoLingTabLL, and a geoLingTab to appear and activate geoLing view
      once geoLing tab is activated*/
      myGeoLingTabLL = new geoLingTabLL();
      new geoLingTab(myGeoLingTabLL);
    }
    /* If the user has not yet set geolocation preferences, have the user set them,
    fill the GeoLing view with a dummy picture, and have the user
    not be able to interact with the rest of the app until preferences are set */
    else {
      displayPopupMenu("geolocation");
      //Display the dummy map until the user picks a setting
      var geolingContent = document.getElementById("geoLingCV");
      var dummyMap = document.createElement("img");
      dummyMap.setAttribute("src", "../emptymap.png");
      geolingContent.appendChild(dummyMap);
    }
    /*Add a listener to create new GeoLing tabs when the menuButton is clicked*/
    document.getElementById("geoLingMenuButton").onclick = function(){
      var newTab = new geoLingTab(myGeoLingTabLL);
    };
    window.removeEventListener("asynchronousDone", manageGeoLingLoadSettings2);
  }

}

function manageRSSLoadSettings() {

}

function manageSettingsMenuLoadSettings() {
    document.getElementById("settingsMenuTrigger").addEventListener("click", function(){
        displayDrop();
    });
    var settingsMenu = document.getElementById("settingsMenuDropDown");
    var lis = $(settingsMenu).find("li");
    for (var i = 0; i < lis.length; i++) {
        liText = lis[i].innerHTML;
        switch(liText) {
            case "Help": lis[i].addEventListener("click", function(){
                displayPopupMenu("help");
                hideDrop();
            }); break;
            case "Settings": lis[i].addEventListener("click", function(){
                displayPopupMenu("settings");
                hideDrop();
            }); break;
        }
    }
}

/*Handles settings to be loaded each time a new instance of a GeoLing view is
opened*/
function manageGeoLingInstanceSettings(newTab) {
  var webview = newTab.view.getElementsByTagName("webview")[0];
  setZoom(webview);
  handleGeolocationPermissionSettings(webview);
}

/* Sets the submit button in the settings menu form to change settings according to the settings selected
in the menu and closes the settings menu */
function setupSettingsMenuSubmitButton() {
  var subButton = document.getElementById("settingsSubmit");
  subButton.onclick = function() {
    //Get and serialize the data from each form; send the data to be processed
    var forms = $("#settingsPopupMenu").find("form");
    for (var i = 0; i < forms.length; i++) {
      changeSetting(forms[i], $(forms[i]).find("input")[0].name);
    }
    window.addEventListener("asynchronousDone", doDeactivate);
    function doDeactivate() {
      window.removeEventListener("asynchronousDone", doDeactivate);
      hidePopupMenu("settings"); //need to wait for asynchronous to finish
    }
  };
}
