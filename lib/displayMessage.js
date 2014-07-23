module.exports = function(messages){
  for(var i = 0; i < messages.length; i+=2) {
    hintLog.createErrorMessage(messages[i], iiLib.errorNumber = ++iiLib.errorNumber, messages[i+1]);
  }
};
