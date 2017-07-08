//------------Input Button Stuff----------------------//
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //
var USER_INPUT_CSV;

    document.getElementById('get_file').onclick = function() {
       document.getElementById('my_file').click();
    };

    var inputElement = document.getElementById("my_file");
    inputElement.addEventListener("onchange", handleFiles, false);

    function handleFiles() {
       USER_INPUT_CSV = this.files; /* now you can work with the file list */
    }

//------------Customize Button Stuff----------------//
    var modal = document.getElementById('modal');
    var btn = document.getElementById("cust_file");
    var exit = document.getElementsByClassName("close")[0];


   // modal appears when Custimize Btn is clicked
   btn.onclick = function() {
       modal.style.display = "block";
   }

   // stuff to close modal
   exit.onclick = function() {
      modal.style.display = "none";
   }
   
 // run is called when the submit button is clicked
 // it saves whatever is in each textarea to a variable
 // TODO: parse the input to work with cartogram
 function run() {
  var cust_file_name = document.getElementById("file_name").value;
  var col_1_input =  document.getElementById("data_col_1").value;
  var col_2_input =  document.getElementById("data_col_2").value;
  var col_3_input =  document.getElementById("data_col_3").value;
  console.log(cust_file_name);
  console.log(col_1_input);
  console.log(col_2_input);
  console.log(col_3_input);
  
}
