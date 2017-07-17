var siriWave;
var audio = document.getElementById("audio");

var granimInstance = new Granim({
  element: '#bg-canvas',
  name: 'gradient',
  opacity: [1, 1],
  isPausedWhenNotInView: true,
  states: {
    'default-state': {
      gradients: [
        ['#EB3349', '#F45C43'],
        ['#FF8008', '#FFC837'],
        ['#4CB8C4', '#3CD3AD'],
        ['#24C6DC', '#514A9D'],
        ['#FF512F', '#DD2476'],
        ['#DA22FF', '#9733EE']
      ],
      transitionSpeed: 3000
    }
  }
});

$(document).ready(function() {
  $('.start-modal').modal({
    closable: false
  }).modal('show');
  siriWave = new SiriWave({
    container: $('#orpheus')[0],
    cover: true,
    speed: 0.05,
    frequency: 4,
    amplitude: 0.3
  });
  siriWave.start();
  audio.addEventListener("ended", resetProgress);
  audio.addEventListener("canplay", animateProgress);
});

function playTrack(src) {
  audio.src = src;
  audio.volume = 0.8;
  audio.load();
  audio.play();
}

function animateProgress() {
  $('#orpheus .dimmer').removeClass('active');
  $('#progress-overlay').stop();
  $('#progress-overlay').css("width", 0);
  $('#progress-overlay').show();
   $('.action-button').removeClass('disabled');
  $('.track-header').fadeIn();
  $('#progress-overlay').animate({
    width: "100%"
  }, 30 * 1000);
  siriWave.setAmplitude(0.3);
}

function resetProgress() {
  $('#progress-overlay').fadeOut();
  siriWave.setAmplitude(0.01);
  $('.track-header').fadeOut();
}

function cooldown() {
  $('#progress-overlay').stop();
  $('.action-button').addClass('disabled');
  $('#orpheus .dimmer').addClass('active');
  $('#progress-overlay').css("width", 0);
  $('.track-header').fadeOut();
  audio.pause();
}

function menu() {
  $('.menu-modal').modal('show');
}

function hideMenu() {
  $('.menu-modal').modal('hide');
}