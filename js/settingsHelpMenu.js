//Display the drop-down menu for help and settings; set the drop-down menu to disappear when moused over and then
//moused off
function displayDrop () {
  var drop = document.querySelector("#settingsMenuDropDown");
  $(drop).css("visibility", "visible");
  //Create a setting such that if menuDrop is moused over and then moused out,
  //it will disappear
  if (!(drop.onmouseover)) {
    drop.onmouseover =  function(){
        if ($(drop).css("visibility") === "visible") {
            drop.addEventListener("mouseleave", disappearListener); //mousing over border seems to count as mouseout
        }
    };
  }
}

function disappearListener() {
  var drop = document.getElementById("settingsMenuDropDown");
  $(drop).css("visibility", "hidden");
  drop.removeEventListener("mouseleave", disappearListener);
}

// Hide the drop-down menu
function hideDrop() {
  $("#settingsMenuDropDown").css("visibility", "hidden");
}

