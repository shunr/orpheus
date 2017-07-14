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
        ['#9D50BB', '#6E48AA'],
        ['#4776E6', '#8E54E9']
      ]
    }
  }
});

function playTrack(src) {
  track = $('#audio')[0];
  track.autoplay = false;
  track.src = src;
  track.load();
  track.play();
}