var getOperands = require('../lib/getOperands');

describe('getOperands()', function() {
  it('should return the operands of the interpolation expression', function() {
    var toSend = 'data + data.name';
    var result = getOperands(toSend, '{{','}}');
    var expected = ['data ',' data.name'];
    expect(result).toEqual(expected);

    toSend = 'data[0] + data.["test"]';
    result = getOperands(toSend, '{{','}}');
    expected = ['data[0] ',' data.[]'];
    expect(result).toEqual(expected);

    toSend = 'getData() + getData("test")';
    result = getOperands(toSend, '{{','}}');
    expected = [ 'getData   ', ' getData  ' ];
    expect(result).toEqual(expected);

    toSend = 'a && b || c && d';
    result = getOperands(toSend, '{{','}}');
    expected = [ 'a ', '', ' b ', '', ' c ', '', ' d' ];
    expect(result).toEqual(expected);

    toSend = '(a + b) + ((c + d))';
    result = getOperands(toSend, '{{','}}');
    expected = [' a ', ' b  ', '   c ', ' d  '];
    expect(result).toEqual(expected);

    toSend = '"(a + b)" + variable + "((c + d))"';
    result = getOperands(toSend, '{{','}}');
    expected = [ ' ', ' variable ', ' ' ];
    expect(result).toEqual(expected);
  });
});