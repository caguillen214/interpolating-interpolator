var getOperands = require('../lib/getOperands');

describe('getOperands()', function() {
  it('should return the operands of the interpolation expression', function() {
    var toSend = 'data + data.name';
    var result = iEye.getOperands(toSend, '{{','}}');
    var expected = ['data ',' data.name'];
    expect(result).toEqual(expected);
    toSend = 'data[0] + data.["test"]';
    result = iEye.getOperands(toSend, '{{','}}');
    expected = ['data[0] ',' data.["test"]'];
    expect(result).toEqual(expected);
    toSend = 'getData() + getData("test")';
    result = iEye.getOperands(toSend, '{{','}}');
    expected = ['getData() ',' getData("test")'];
    expect(result).toEqual(expected);
  });
});