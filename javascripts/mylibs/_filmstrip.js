define(
    ['jquery', '_loader', '_util'],
    function ($, loader, util) {

return {

  filmStripWrap: function(){

        $( ".filmstrip" ).each(function(){

            var $this = $(this);

            if ( $this.parent().hasClass('framewrap') == false ) {
              $this.wrap('<div class="framewrap" />')

              var frameWrap = $this.parent(),
              frameCount = $this.data('framecount') || $this.prev().data('framecount'),
              fps = $this.data('fps') || $this.prev().data('fps') || 10,
              duration = ~~(1000/fps*frameCount),
              frameWidth, frameHeight, stripHeight;


              //pass some stuff up to the wrapper element
              if ($this.hasClass("focalpoint")) { 
                $this.removeClass("focalpoint"); 
                frameWrap.addClass("focalpoint"); 
              };

              util.cloneJqueryData($this, frameWrap);
              frameWrap.attr('style', $this.attr('style'));
              $this.attr('style', '');

              $this.css({
                "-webkit-animation": "filmstrip-" + frameCount + " " + duration + "ms" + " steps( "+ (frameCount-1) + ") infinite",
                   "-moz-animation": "filmstrip-" + frameCount + " " + duration + "ms" + " steps( "+ (frameCount-1) + ") infinite",
                    "-ms-animation": "filmstrip-" + frameCount + " " + duration + "ms" + " steps( "+ (frameCount-1) + ") infinite",
                     "-o-animation": "filmstrip-" + frameCount + " " + duration + "ms" + " steps( "+ (frameCount-1) + ") infinite",
                        "animation": "filmstrip-" + frameCount + " " + duration + "ms" + " steps( "+ (frameCount-1) + ") infinite"
              });

              frameWrap.width(imgRealSize($this).width).height(imgRealSize($this).height/frameCount);
                  
            } 
        });

        

  },

  playFilmStrip: function(elem) {
      $(elem).removeClass('paused');
  },

  stopFilmStrip: function(elem) {
        $(elem).addClass('paused');
    }
}

});