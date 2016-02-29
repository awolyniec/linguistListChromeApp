/*Counter meant to count the number of asynchronous requests being handled
by the app at a given moment. Does not go below zero and dispatches a specific
event when the counter reaches zero (i.e. when all asynchonous requests have 
finished)*/

function negativeCounterException(){}

//could also replace with a jQuery deferred object
function asyncRequestCounter () {
  var counter = 0;
  
  this.add = function() {
    if (counter < 0) {
      throw new negativeCounterException();
    }
    counter++;
  };
  this.remove = function() {
    counter--;
    //signifies that all asynchronous operations have been completed
    if (counter === 0) {
      //New event to signify that all asynchronous requests have finished
      var asyncDoneEvent = new CustomEvent(
        "asynchronousDone",
        {
          detail: {},
          bubbles: true,
          cancelable: true
        }
      );
      window.dispatchEvent(asyncDoneEvent);
    }
    else if (counter < 0) {
      throw new negativeCounterException();
    }
  };
  this.getSize = function() {
    return counter;
  };
}