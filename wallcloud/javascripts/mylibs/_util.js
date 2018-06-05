define(
    ['jquery'],
    function ($) {

	var $loadingOverlay = $('#loadingoverlay'),
	loading = 0;

		/**
	 * Causes the address bar to hide on mobile devices,
	 * more vertical space ftw.
	 */
	function removeAddressBar() {

		if( window.orientation === 0 ) {
			document.documentElement.style.overflow = 'scroll';
			// document.body.style.height = '120%';
			document.body.style.height = (window.outerHeight + 50) + 'px';
		}
		else {
			document.documentElement.style.overflow = '';
			document.body.style.height = '100%';
		}

		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 1000 );


	}

	return{

		// ----------------------------------------------------------------
		// Hides/Shows the loading overlay element
		// ----------------------------------------------------------------
		addLoadOverlay: function(){
			loading = loading + 1;
			$loadingOverlay.removeClass('complete');
			// console.log('addLoadOverlay');
		},

		removeLoadOverlay: function(){
			loading = Math.max( (loading - 1), 0 );
			if (!loading) { $loadingOverlay.addClass('complete'); };
			// console.log('removeLoadOverlay');
		},


		// ----------------------------------------------------------------
		// Hides the address bar if we're on a mobile device.
		// ----------------------------------------------------------------
		hideAddressBar: function() {

		    if( /iphone|ipod|android/gi.test( navigator.userAgent ) && !/crios/gi.test( navigator.userAgent ) ) {
		      // Events that should trigger the address bar to hide
		      window.addEventListener( 'load', removeAddressBar, false );
		      window.addEventListener( 'orientationchange', removeAddressBar, false );
		    }

		},

		// ----------------------------------------------------------------
		// copys all of the jquery object data from one object to another
		// ----------------------------------------------------------------
		cloneJqueryData: function(originalObject, targetObject){

		    $.each( $(originalObject).data(), function(name,value) {
		        $(targetObject).data(name, value);
		    })
		},

		cloneAllAttributes: function(originalObject, targetObject){

			    $.each( $(originalObject).prop("attributes"), function() { 
			    	$(targetObject).attr(this.name, this.value); 
			    });
		}

	}

});