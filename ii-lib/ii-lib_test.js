describe('ieye-lib', function() {
  describe('getAllParts()', function() {
    //E.g. the parts in "hello, {{data.user[1].name}}" are data, data.user[1],data.user[1].name
    it('should return an array with all parts of the interpolation', function() {
      var toSend = 'Hello, {{data.firstName + data.lastName}}';
      var parts = iEye.getAllParts(toSend, '{{','}}');
      var expected = ['data','data.firstName','data.lastName'];
      expect(parts).toEqual(expected);
      toSend = 'Hello, {{3 + data.age}}';
      parts = iEye.getAllParts(toSend, '{{','}}');
      expected = ['data','data.age'];
      expect(parts).toEqual(expected);
    });
    it('should throw if start and end symbol are not found', function() {
      var toSend = 'Hello, {{name]]';
      expect(function(){
        iEye.getAllParts(toSend, '{{','}}');
      }).toThrow
        ('Missing start or end symbol in interpolation. Start symbol: "{{" End symbol: "}}"');
    });
  });
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
  describe('concatParts()', function() {
    it('should return the correct grouping of parts based on concatLength', function() {
      var toSend = ['data','name','first'];
      var result = iEye.concatParts(toSend, 1);
      expect(result).toBe('data.name');
      toSend = ['data','name[0]','first'];
      result = iEye.concatParts(toSend, 2);
      expect(result).toBe('data.name[0].first');
    });
  });
});