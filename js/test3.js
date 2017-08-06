/* jquery.js */
/* jquery.velocity.js */
/* velocity.ui.js */

$("div")
  .velocity("transition.slideUpIn", 2250)
  .delay(700)
  .velocity({
    opacity: 0.8
  }, 750);
