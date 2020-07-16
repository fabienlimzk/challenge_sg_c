$(document).ready(function() {
  var max_fields = 4;
  var wrapper = $(".container1”");
  var add_button = $(".add_form_field");
  var x = 1;
  $(add_button).click(function(e) {
      e.preventDefault();
      if (x < max_fields) {
          x++;
          $(wrapper).append('<div><input type="text" name="items[]"/><a href="#" class="delete">Delete</a></div><div><input name="quantity" type="number" placeholder="1" /></div>'); //add input box
      } else {
          alert('You Reached the limit of items');
      }
  });
  $(wrapper).on("click", ".delete", function(e) {
      e.preventDefault();
      $(this).parent('div').remove();
      x--;
  })
});