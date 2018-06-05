define(
    ['jquery'],
    function ($) {

return {
  // ----------------------------------------------------------------
  // Used for title text – makes text fill a predictable percentage of the parent container
  // ----------------------------------------------------------------

  fitText: function() {
      $( ".fittext" ).each(function(){

        // Store the object
        var $this = $(this),
            compressor = $this.data('font-scale') || 1,
            minFontSize = $this.data('min-font-size') || Number.NEGATIVE_INFINITY,
            maxFontSize = $this.data('max-font-size') || Number.POSITIVE_INFINITY;

        // Resizer() resizes items based on the object width divided by the compressor * 10
        var resizer = function () {
          $this.css('font-size', 
            Math.max(
              Math.min(
                ($this.width() * compressor) / 10, //inverted from fittext plugin
                parseFloat(maxFontSize)
              ), 
              parseFloat(minFontSize)
            )
          );
        };

        // Call once to set.
        resizer();

        // Call on resize. Opera debounces their resize by default.
        $(window).on('resize orientationchange', resizer);

      });

  },

  focalpointElems: $( ".focalpoint" ),


  // ----------------------------------------------------------------
  // Used to position things around a certain focal point, with the option to scale the object to 'cover' or 'contain'
  // ----------------------------------------------------------------
  focalpoint: function(callback) {

      this.focalpointElems.each(function() {
        var block = $(this), 
        container = block.data('container') || block.parent(),
        containerWidth = container.innerWidth(),
        containerHeight = container.innerHeight(),
        blockWidth = block.outerWidth(),
        blockHeight = block.outerHeight(),
        scaleMode = block.data('focus-scale'),
        focusLeft = block.data('focus-left') || .5,
        focusTop = block.data('focus-top') || .5;

        if (!block.data('container')) { block.data('container', container) };

        if (scaleMode == 'cover' || scaleMode == 'contain') {

            if (scaleMode == 'cover') {
              var scale = Math.max( (containerWidth / blockWidth), (containerHeight / blockHeight) );
            } else {
              var scale = Math.min( (containerWidth / blockWidth), (containerHeight / blockHeight) );
            }

            if (!scale) { scale = 1 };

            scale = -~(scale*100)/100;

            blockWidth = blockWidth * scale,
            blockHeight = blockHeight * scale;

            if (block.is("video, img")){

              block.css({
                width: blockWidth,
                height: blockHeight
              });

            } else {

              block.css({
                mozTransform: 'scale(' + scale + ')',
                msTransform:  'scale(' + scale + ')',
                webkitTransform: 'scale(' + scale + ')',
                oTransform: 'scale(' + scale + ')',
                transform: 'scale(' + scale + ')'
              });

            }

        }

                if (focusLeft < 0.01) { block.css('left', 0); }
                else if (focusLeft > 0.99) { block.css('left', ~~(containerWidth - blockWidth) ); }
                else{ block.css('left', ~~((containerWidth - blockWidth) * focusLeft) ) } 

                if (focusTop < 0.01) { block.css('top', 0); }
                else if (focusTop > 0.99) { block.css('top', ~~(containerHeight - blockHeight) ); }
                else{ block.css('top', ~~((containerHeight - blockHeight) * focusTop) ) }; 


    });
  }

}

});