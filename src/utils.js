S7.utils = {};

S7.utils.extend = function(subc, superc) {
  var F = function() {};
  F.prototype = superc.prototype;
  subc.prototype = new F();
  subc.prototype.constructor = subc;
  subc.prototype.superclass = superc.prototype;
};