/* jscs:disable validateQuoteMarks, maximumLineLength */
'use strict';

// 140bytes, https://gist.github.com/140bytes/962807, License Public Domain
var synthesizer = "" +
  "onmessage = function() { " +
    "var f = '(t<<3)*[8/9,1,9/8,6/5,4/3,3/2,0][[0xd2d2c8,0xce4088,0xca32c8,0x8e4009][t>>14&3]>>(0x3dbe4688>>((t>>10&15)>9?18:t>>10&15)*3&7)*3&7]&255';" +
    "for(var t=0,S='RIFF_oO_WAVEfmt '+atob('EAAAAAEAAQBAHwAAQB8AAAEACAA')+'data';++t<3e5;)S+=String.fromCharCode(eval(f));" +
    "postMessage(S);" +
  "};";

function boombox(selector) {
  document.querySelector(selector).classList.add('boombox');
}

function shake(selector) {
  document.querySelector(selector).classList.add('shake', 'shake-constant');
}

function play(data) {
  var audio = new Audio('data:audio/wav;base64,' + btoa(data));
  audio.loop = true;
  audio.play();
}

function isSafari() {
  return /^((?!chrome).)*safari/i.test(navigator.userAgent);
}

/**
  Init Boombox widget in a specified placeholder.
  @param {string} - The selector of a placeholder.
  @alias GeneratorBoombox
  @class
 */
module.exports = function(selector) {
  boombox(selector);

  // Workaround: atob doesn't work in web worker and Safari.
  if (!isSafari() && window.Worker && window.Audio) {
    var blob = new Blob([ synthesizer ], { type: 'application/javascript' });
    var worker = new Worker(window.URL.createObjectURL(blob));

    worker.onmessage = function(event) {
      shake(selector);
      play(event.data);
      worker.terminate();
    };

    // Workaround: Firefox doesn't accept invocation without arguments
    worker.postMessage('');
  } else {
    shake(selector);
  }
};
