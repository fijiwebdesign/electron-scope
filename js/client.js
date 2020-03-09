var src = location.search.slice(1)
if (src) {
  src = require('path').resolve(src)
  var Module = window.require('module')
  var wrap = Module.wrap
  Module.wrap = function(content) {
    Module.wrap = wrap
    //content = "\ndebugger;\n" + content
    return Module.wrap(content)
  }
  require(src)
}