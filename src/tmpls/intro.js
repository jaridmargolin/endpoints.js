;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(['jquery'], definition); }
  else { context[name] = definition(); }
})('endpoints', this, function (jquery) {
