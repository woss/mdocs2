var $ = require('jquery');
var Spinner = require('spin.js');

var opts = {
  lines: 15, // The number of lines to draw
  length: 4, // The length of each line
  width: 6, // The line thickness
  radius: 51, // The radius of the inner circle
  corners: 0, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1.6, // Rounds per second
  trail: 53, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

module.exports = function () {
  return new Spinner(opts).spin($('.content')[0]);
};