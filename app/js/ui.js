//------------Input Button Stuff----------------------//
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //
document.getElementById('get_file').onclick = function() {
  document.getElementById('input_csv').click();
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
function run() {
  //var cust_file_name = document.getElementById("file_name").value;
  var col_1_input = document.getElementById("data_col_1").value;
  var col_2_input = document.getElementById("data_col_2").value;
  //var col_3_input =  document.getElementById("data_col_3").value;
  //console.log(cust_file_name);
  console.log(col_1_input);
  console.log(col_2_input);
  //console.log(col_3_input);

}
