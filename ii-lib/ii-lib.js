(function (iiLib) {
'use strict';

var hintLog = require('angular-hint-log');
hintLog.moduleName = 'Interpolation';
hintLog.moduleDescription = '';
iiLib.errorNumber = 0;
iiLib.currentPromises = {};
iiLib.ngHintInterpMessages = [];

iiLib.getAllParts = require('../lib/getAllParts');

iiLib.getInterpolation = require('../lib/getInterpolation');

iiLib.getOperands = require('../lib/getOperands');

iiLib.concatParts = require('../lib/concatParts');

iiLib.delayDisplay = require('../lib/delayDisplay');

iiLib.displayMessages = require('../lib/displayMessages');

iiLib.partsEvaluate = require('../lib/partsEvaluate');

iiLib.buildMessage = require('../lib/buildMessage');

iiLib.getSuggestion = require('../lib/getSuggestion');

iiLib.areSimilarEnough = require('../lib/areSimilarEnough');

iiLib.levenshtein = require('../lib/levenshtein');

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.iiLib = {}) : (window.iiLib = {}) ));
