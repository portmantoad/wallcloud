// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');




!function (window) {
  var
      equestAnimationFrame = 'equestAnimationFrame',
      requestAnimationFrame = 'r' + equestAnimationFrame,
 
      ancelAnimationFrame = 'ancelAnimationFrame',
      cancelAnimationFrame = 'c' + ancelAnimationFrame,
 
      expectedTime = 0,
      vendors = ['moz', 'ms', 'o', 'webkit'],
      vendor;
 
  while (!window[requestAnimationFrame] && (vendor = vendors.pop())) {
    window[requestAnimationFrame] = window[vendor + 'R' + equestAnimationFrame];
    window[cancelAnimationFrame] =
        window[vendor + 'C' + ancelAnimationFrame] ||
            window[vendor + 'CancelR' + equestAnimationFrame];
  }
 
  if (!window[requestAnimationFrame]) {
    window[requestAnimationFrame] = function (callback) {
      var
          currentTime = +new Date,
          adjustedDelay = 16 - (currentTime - expectedTime),
          delay = adjustedDelay > 0 ? adjustedDelay : 0;
 
      expectedTime = currentTime + delay;
 
      return setTimeout(function () {
        callback(expectedTime);
      }, delay);
    };
 
    window[cancelAnimationFrame] = clearTimeout;
  }
}(this);


function imgRealSize(img) {
    var $img = $(img);
    if ($img.prop('naturalWidth') == undefined) {
        var $tmpImg = $('<img/>').attr('src', $img.attr('src'));
        $img.prop('naturalWidth', $tmpImg[0].width);
        $img.prop('naturalHeight', $tmpImg[0].height);
    }
    return { 'width': $img.prop('naturalWidth'), 'height': $img.prop('naturalHeight') }
}