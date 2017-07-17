var RANGE = 1

var stats = (function() {
  var module = {}
  module.updateModel = function(data) {
    $('#trained-songs').text(data.trainedSongs - 1);
    $(".progress").progress({
      percent: 100,
      autoSuccess: false
    });
    for (var f in data.feature_preference) {
      var val = data.feature_preference[f];
      var percent = (50 + Math.min(val / RANGE * 50, 50));
      $("#bar-" + f + ' .circular.icon').css(
        'left',
         percent + "%"
      );
    }
    var worst = 0,
      best = 0;
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
  return module;
})();