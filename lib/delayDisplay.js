module.exports = function(messages, $timeout) {
  $timeout.cancel(iiLib.currentPromises);
  iiLib.currentPromises = $timeout(function() {
    iiLib.displayMessages(messages);
  }.bind(this),250);
};
