var RANGE = 1

var stats = (function() {
  var module = {}
  module.updateModel = function(data) {
    $(".progress").progress({
      percent: 0
    });
    for (var i in data.feature_preference) {
      var val = data.feature_preference[i];
      console.log(data.feature_preference)
      $("#bar-" + i + Math.sign(val)).progress({
        percent: Math.min(Math.abs(val / RANGE) * 100, 100)
      });
    }
  }
  return module;
})();