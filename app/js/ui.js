//------------Input Button Stuff----------------------//
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //
document.getElementById('upload_link').onclick = function() {
  document.getElementById('input_csv').click();

};

document.getElementById('upload_topo').onclick = function() {
  document.getElementById('input_topo').click();
};
/*
 * Code to run when document is ready
 */
$(document).ready(function() {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();

  $('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      alert("Ready");
      console.log(modal, trigger);
    },
    complete: function() {
      alert('Closed');
    } // Callback for Modal close
  });

  $(".dropdown-button").dropdown();
});


//------------Customize Button Stuff----------------//
var modal = document.getElementById('modal');
var btn = document.getElementById("cust_file");
var exit = document.getElementsByClassName("close")[0];


// modal appears when Customize Btn is clicked
btn.onclick = function() {
  modal.style.display = "block";
}

// stuff to close modal
// exit.onclick = function() {
//   modal.style.display = "none";
// }

// run is called when the submit button is clicked
// it saves whatever is in each textarea to a variable
// TODO: parse the input to work with cartogram

var counter = 1;
var limit = 50;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          newdiv.innerHTML =  " <table> <td> <textarea rows='10' cols='40' name='data_col_1'></textarea> </td> <td> <textarea rows='10' cols='40' name='data_col_2'></textarea> </td></table>";
          document.getElementById(divName).appendChild(newdiv);
           
          counter++;
     }
};

function run() {
  //var cust_file_name = document.getElementById("file_name").value;
  //var col_1_input = document.getElementById("data_col_1").value;
  //var col_2_input = document.getElementById("data_col_2").value;

var cells1 = document.getElementsByName("data_col_1");
var cells2 = document.getElementsByName("data_col_2"); 
var Projection = document.getElementsByName("proj");
var cal = document.getElementById("colo").value;
col = cal;
latitude = Projection[0].value;
longitude = Projection[1].value;
pScale = Projection[2].value;

 console.log("col is" + col);

 console.log(latitude);
    console.log(longitude);
        console.log("Scale value" + pScale);

   

for (var i = 0; i < cells1.length; i++) { 
    
   
    console.log(cells1[i].value + "1");
    console.log(cells2[i].value + "2");
   
    }

  //for (i = 0; i < 10; i++) { 
  //  var TESTO = document.getElementsByName("data_col_1").[i];
  //    console.log(TESTO.name);
  //  }
  //var col_3_input =  document.getElementById("data_col_3").value;
  //console.log(cust_file_name);
  //console.log(col_1_input);
  //console.log(col_2_input);
  //console.log(col_3_input);
 // inito();

};
