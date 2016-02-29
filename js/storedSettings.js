/* Get and return the app's stored setting, long-term or temporary, of a
particular type */
function appSetting(type) {
  var value;
  asyncs.add();
  SETTINGSTORAGE.find({"type": type}, function(storedSetting){
    //console.log(storedSetting);
    value = storedSetting[0] || {};
    asyncs.remove();
  });
  this.getSetting = function() {
    return value;
  };
}

/* Return true if stored setting calls for the permission to be allowed, return
false if stored setting calls for permission to be denied, returns undefined
otherwise*/
function checkStatusOfSetting(storedSetting) {
  if (storedSetting.hasOwnProperty("status")) {
    if (storedSetting["status"] === "allow") {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return undefined;
  }
}

/* Uses data extracted from a given form to change the app's saved geolocation
settings */
function changeSetting(form) {
  var formData = $(form).serializeArray()[0];
  var data = formData["value"];
  var type = formData["name"];
  var setting = {"type": type};

  //Process data; set "setting["timeframe"]" and "setting["status"]"
  var entry = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i] === " ") {
      setting["status"] = entry;
      entry = "";
    }
    else {
      entry += data[i];
      if (i === data.length - 1) {
        setting["timeframe"] = entry;
      }
    }
  }
  asyncs.add();
  SETTINGSTORAGE.save(setting, type, false, function(storage){
    setupSettingsMenuFormDefaults();
    asyncs.remove();
  });
}

/* Searches user's stored settings to see if the user has allowed or disallowed
geolocation, and sends the results of the search to be processed*/
function handleGeolocationPermissionSettings(element) {
  //Get the setting
  var settingObj = new appSetting("geolocationPermission");

  /* Once the setting has finished loading asynchronously, check to see if it
  allows or denies geolocation. If it allows it, set element to allow geolocation.
  If it denies it, set element to deny geolocation. If no preference has been set,
  raise an exception, as a preference should have been set by now */
  window.addEventListener("asynchronousDone", processStoredPermissionSetting);
  function processStoredPermissionSetting() {
    var newSetting = settingObj.getSetting();
    element.addEventListener("permissionrequest", function(permission) {
      var status = checkStatusOfSetting(newSetting);
      //If long-term or temporary preference has been set, use it
      if (status === true) {
        permission.request.allow();
      }
      else if (status === false) {
        permission.request.deny();
      }
      //If no preference has been set by now, something has gone wrong
      else {
        permission.request.deny();
        throw {
          name:"NoPermissionsSet",
          message:"Long term or temporary permission preference should be set before"+
          "permissions are requested; none found for this permission type."
        };
      }
    });
    //Ensure this process only runs once per element
    window.removeEventListener("asynchronousDone", processStoredPermissionSetting);
  }
}