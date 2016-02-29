//Creates the view for the given tab as an instance of the page view type
//specified by the tab's name
function newContentsView(state) {
  var myFrame = document.createElement("iframe");
  myFrame.setAttribute("id", "myFrame");
  myFrame.setAttribute("src", "../pageViews/geoLing.html"); //Are we sure this is right?
  myFrame.setAttribute("width", "100%");
  myFrame.setAttribute("height", "100%");
  
  myFrame.addEventListener("load", function(){fillContentsViewWithContent(myFrame, "duck");});

  setContentsView(myFrame);
  return myFrame;
}

//Fill the previously created iframe with the content of the desired page type
function fillContentsViewWithContent(frame, view) {
  
  /*var doc = document.implementation.createHTMLDocument("pageTitle");
  //console.log(document.documentElement); //This gets you all the HTML of the 
  //document
  
  //console.log(doc.body.innerHTML); //Could just set the innerHTML of body and head to the new data; this is doable; \n sequences in innerHTML should work
  //console.log(doc.head);
  
  //Collects the innerHTML of the <head> and <body> sections, assuming that these 
  //sections are explicitly declared as HTML elements
  $.get("../pageViews/home.html", function(data, status) {
    var headData = "";
    var bodyData = "";
    
    var headScan = false;
    var bodyScan = false;
    for (var i = 0; i < data.length; i++) {
      if (data.substring(i, i+6) == "<head>") {
        headScan = true;
        i += 6;
      }
      if (data.substring(i, i+7) == "</head>") {
        headScan = false;
        i += 7;
      }
      if (data.substring(i, i+6) == "<body>") {
        bodyScan = true;
        i += 6;
      }
      if (data.substring(i, i+7) == "</body>") {
        bodyScan = false;
        i += 7;
      }
      
      if (headScan === true) {
        headData += data[i];
      }
      else if (bodyScan === true) {
        bodyData += data[i];
      }
      
      if (headScan === true && bodyScan === true) {
        throw { name:"BadFormat", message:
        "Head section and body section of document are not separate"};
      }
    }
    //This changes the data, but always runs at the end of the function calls
    doc.head.innerHTML = headData;
    doc.body.innerHTML = bodyData;
    
    //fill the iframe
    var destDocument = frame.contentWindow.document;
    var srcNode = doc.documentElement;
    var newNode = destDocument.importNode(srcNode, true);
    destDocument.replaceChild(newNode, destDocument.documentElement);  
    
    console.log(window.location);
    console.log(frame.contentWindow.location);
    
    
    //test iframe for comparison to ours
    var testFrame = document.createElement("iframe");
    document.body.appendChild(testFrame);
    testFrame.setAttribute("src", "../pageViews/geoLing.html");
    testFrame.setAttribute("height", "500px");
    testFrame.setAttribute("width", "200px");
    testFrame.addEventListener("load", function() {console.log(testFrame.contentWindow.document); console.log(testFrame.contentWindow.location.href);});
  });*/
}
