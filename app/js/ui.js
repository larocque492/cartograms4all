//------------Input Button Stuff----------------------//
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //

    document.getElementById('get_file').onclick = function() {
       document.getElementById('my_file').click();
    };

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
