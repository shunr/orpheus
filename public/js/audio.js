var track;

var granimInstance = new Granim({
  element: '#bg-canvas',
  name: 'radial-gradient',
  direction: 'radial',
  opacity: [1, 1],
  isPausedWhenNotInView: true,
  states: {
    "default-state": {
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

var siriWave;

window.addEventListener("resize", function() {
  if (siriWave) {
    siriWave.stop();
    $(siriWave.canvas).remove();
    siriWave = null;
  }
  siriWave = new SiriWave({
    speed: 0.06,
    frequency: 4,
    amplitude: 0.2
  });
  siriWave.start();
});

function playTrack(src) {
  track = $('#audio')[0];
  track.src = src;
  track.volume = 0.8;
  track.load();
  track.play();
}