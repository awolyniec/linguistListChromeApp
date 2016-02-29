/*
  Storage class that saves, retrieves, and handles user data (in object format)
  from chrome.storage.local.
*/

/**
  * Creates a new client side storage object and will create an empty
  * collection if no collection already exists.
  *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
*/
//this constructor also specifies the types of data that storage will deal with
function Store(name, callback) {
  var data;
  var dbName = name;
  this.dbName = dbName;
  
  callback = callback || function () {};

  chrome.storage.local.get(function(storage) { //first param of callback function is the data
    if ( storage[dbName] !== undefined) {
      callback.call(this, storage[dbName].settings);
    } 
    else {
      storage = {};
      storage[dbName] = { settings: [] };
      chrome.storage.local.set(storage, function() {
        callback.call(this, storage[dbName].settings);
      }.bind(this));
    }
  }.bind(this));
}
  
/**
 * Finds a setting based on a query given as a JS object
 *
  * @param {object} query The query to match against (i.e. {foo: 'bar'})
 * @param {function} callback  The callback to fire when the query has
 * completed running
 *
 * @example
 * db.find({foo: 'bar', hello: 'world'}, function (data) {
 *   // data will return any items that have foo: bar and
  *   // hello: world in their properties
  * });
*/
Store.prototype.find = function (query, callback) {
  if (!callback) {
    return;
  }

  chrome.storage.local.get(function(storage) {
    var settings = storage[this.dbName].settings.filter(function(setting) {
      for (var q in query) {
        if (query[q] !== setting[q]) {
          return false;
        }
        return true;
      }
    });
    callback.call(this, settings); //settings is an array
  }.bind(this));
};
  
/**
 * Will retrieve all settings data from the collection
 *
 * @param {function} callback The callback to fire upon retrieving data
 */
Store.prototype.findAll = function (callback) {
  callback = callback || function () {};
  chrome.storage.local.get(this.dbName, function(storage) {
    var settings = storage[this.dbName] && storage[this.dbName].settings || [];
    callback.call(this, settings);
  }.bind(this));
};
  
/**
  * Will save the given data to the DB. If no item exists it will create a new
 * item, otherwise it'll simply update an existing item's properties
 *
 * @param {object} data to save back into the DB
 * @param {function} callback The callback to fire after saving
 * @param {string} type An optional param to enter the type of an existing item to update
 */
Store.prototype.save = function (updateData, type, retainOld, callback) {
  if (updateData === null || updateData === undefined) {
    return;
  }
  if (retainOld !== true && retainOld !== false) {
    retainOld = true;
  }
  
  chrome.storage.local.get(function(storage) {
    var data = storage[this.dbName];
    var settings = data.settings;
    
    callback = callback || function () {};

    // If a type was actually given, find the item and update each property
    var found = false;
    if (typeof type !== 'undefined') {
      for (var i = 0; i < settings.length; i++) {
        if (settings[i].type === type) {
          found = true;
          //Depending on parameters, may wipe the old version of the setting
          if (retainOld === false) {
            /*If the old version is wiped, the new version must at least have
            a type*/
            if (typeof updateData.type !== "string") {
              throw {
                name: "TypeRemovedFromSetting", 
                message: "When settings are wiped and updated, update data"+
                "must have a type. None found."
              };
            }
            settings[i] = {}; //doesn't do this
          }
          for (var x in updateData) {
            settings[i][x] = updateData[x]; //temporary vs long-term; temporaries must be deleted at some point
          }
        }
      }
    }
    /* If no type was given, or if the type doesn't match anything in storage,
    create a new entry using the data given.*/
    if (typeof type === 'undefined' || found === false) {
      if (typeof updateData.type !== "string") {
        throw {
          name: "TypeRemovedFromSetting", 
          message: "When settings are wiped and updated, update data"+
          "must have a type. None found."
        };
      }
      else {
        settings.push(updateData);
      }
    }
    //Save the newly stored data
    chrome.storage.local.set(storage, function() {
      chrome.storage.local.get(this.dbName, function(storage) {
        console.log(storage);
        callback.call(this, storage[this.dbName].settings);
      }.bind(this));
    }.bind(this));
    
  }.bind(this));
};
  
/**
  * Will remove an item from the Store based on its type
 *
  * @param {string} type The type of the item you want to remove
 * @param {function} callback The callback to fire after saving
  */
Store.prototype.remove = function (type, callback) {
  chrome.storage.local.get(this.dbName, function(storage) {
    var data = storage[this.dbName];
    var settings = data.settings;

    for (var i = 0; i < settings.length; i++) {
      if (settings[i].type === type) {
        settings.splice(i, 1);
        break;
      }
    }

    chrome.storage.local.set(storage, function() {
      callback.call(this, settings);
    }.bind(this));
  }.bind(this));
};

/**
  * Will drop all storage and start fresh
 *
  * @param {function} callback The callback to fire after dropping the data
 */
Store.prototype.drop = function (callback) { //drop test storage
  chrome.storage.local.clear(function(){
    callback.call(this);
  });
};
