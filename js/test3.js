/* jquery.js */
/* jquery.velocity.js */
/* velocity.ui.js */

$("div")
  .velocity("transition.slideUpIn", 5250)
  .delay(700)
  .velocity({
    opacity: 0
  }, 750);
