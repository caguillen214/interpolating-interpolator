var getInterpolation = require('../lib/getInterpolation');


describe('getInterpolation()', function() {
  it('should return the text inside the interpolation', function() {
    var toSend = 'Hello, {{name}}';
    var result = iEye.getInterpolation(toSend, '{{','}}');
    expect(result).toBe('name');
    toSend = 'Hello, {{}}'
    result = iEye.getInterpolation(toSend, '{{','}}');
    expect(result).toBe('');
  });
});