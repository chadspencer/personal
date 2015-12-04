$(document).ready(function() {

  /* Reverse Circles */
  enquire.register("screen and (min-width: 767px)", {
    match : function() {
      $('ul:first-of-type li.days').before($('ul:first-of-type li.nights'));
    },
    unmatch : function() {
      $('ul:first-of-type li.nights').before($('ul:first-of-type li.days'));
    }
  });
  
});