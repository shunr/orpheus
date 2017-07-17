var stats = (function() {
  var RANGE = 1
  var module = {}
  
  module.updateModel = function(data) {
    $('#trained-songs').text(data.trainedSongs - 1);
    for (var f in data.feature_preference) {
      var val = data.feature_preference[f];
      var percent = (50 + Math.min(val / RANGE * 50, 50));
      $("#bar-" + f + ' .circular.icon').css(
        'left',
        percent + "%"
      );
    }
    var worst = 0;
    var best = 0;
    for (var i = 0; i < data.genre_ranking.length; i++) {
      if (worst >= 3) break;
      if (worst < 3 && data.genre_ranking[i][0] < 0) {
        $('#worst-genre-' + worst + '>span').text(genres[data.genre_ranking[i][1]]);
        worst++;
      }
    }
    for (var i = data.genre_ranking.length - 1; i >= 0; i--) {
      if (best >= 3) break;
      if (best < 3 && data.genre_ranking[i][0] > 0) {
        $('#best-genre-' + best + '>span').text(genres[data.genre_ranking[i][1]]);
        best++;
      }
    }
  }

  module.updatePreference = function(data) {
    var percent = 0;
    if (data) {
      percent = 50 + Math.min(Math.sqrt(Math.abs(data)) / (RANGE * 2) * 50, 50) * Math.sign(data);
    }
    $('#preference-chance').progress('set percent', percent);
  }

  return module;
})();