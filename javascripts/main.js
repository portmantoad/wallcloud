requirejs.config({
    baseUrl: 'javascripts/mylibs',
    paths: {
        vendor: '../libs',
        jquery: '../libs/jquery'
    },
    shim: {
        'vendor/audioplayer': {
            deps: ['jquery'],
            exports: 'jQuery.fn.audioplayer'
        },
        'plugins': {
            deps: ['jquery'],
            exports: 'jQuery.fn.plugins'
        }
    }
});


// Start the main app logic.
requirejs(
    ['jquery', '_frames', '_placement', '_util', '_loader', '_filmstrip', 'vendor/fastclick', 'vendor/audioplayer', 'vendor/screenfull', 'plugins' ],
    function ($, frames, placement, util, loader, filmstrip, fastclick) {


        util.addLoadOverlay();


        frames.prepareFrames();
        
        frames.addStrokes();
        
        

        $(function() {
            FastClick.attach(document.body);
            $( '#track' ).audioPlayer();
        });
        

        $(window).on("orientationchange", function() { frames.refreshPlacement(); });
        $(window).smartresize(function(){ frames.refreshPlacement(); });

        $('#prevbutton').on("click", function() { frames.changeFrame('prev'); });
        $('#nextbutton').on("click", function() { frames.changeFrame('next'); });

        $('#nextbutton').one("click", function() { 
            if ( !$('.bottombar').hasClass('active') ) {
                $('#track')[0].play();
                $('.bottombar').addClass('active');
                $('.audioplayer').removeClass('audioplayer-stopped').addClass('audioplayer-playing');
            }
        });

        $(window).one('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code == 39) {
                if ( !$('.bottombar').hasClass('active') ) {
                    $('#track')[0].play();
                    $('.bottombar').addClass('active');
                    $('.audioplayer').removeClass('audioplayer-stopped').addClass('audioplayer-playing');
                }
            }
        });
           
        $('.fullscreen.btn').on("click", function() { 
            if (screenfull.enabled) {
                screenfull.request();
            }
        });

        $('.bottombar .share.btn').add("#shareoverlay .close-modal").add("#sharebutton").on("click", function() { 
            $('#shareoverlay').toggleClass('active');
            $('.share.btn').toggleClass('active');
        });

        $(window).on('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
             if(code == 37) {
               frames.changeFrame('prev');
             }
             if(code == 39) {
               frames.changeFrame('next');
               $('.bottombar').addClass('active');
             }
        });


        // filter.filter();
        
        // noise.addNoise();

        // $(window).on("load", function(){
        loader.ensureLoaded( $('img').toArray(), function() { 
            filmstrip.filmStripWrap();
            frames.refreshPlacement(); 
            frames.changeFrame('first');
            // util.hideAddressBar();
            util.removeLoadOverlay();
        });

  
});