define(
	['jquery', '_filmstrip', '_placement', '_strokes'],
	function ($, filmstrip, placement, strokes) {

var frameIndex = 0,
	prevFrameIndex = 0,
	framect = 0,

	$main = $('#main'),
	$pageNumber = $('.page-number'),
	$prevbutton = $('#prevbutton'),
    $nextbutton = $('#nextbutton'),
    $sharebutton = $('#sharebutton'),

	$frameGroup,
	$frame,
	$frameElements;

	//--------------------------------------------------------
	// start and stop the embedded content
	//--------------------------------------------------------
	$.fn.startEmbeddedContent = function() {

		var frame = $(this);

		// frame.find( 'video, audio' ).each( function() {

		// 	if( this.hasAttribute( 'autoplay' ) ) {
		// 		this.play();
		// 		$(this).bind('ended', function(){
		// 			this.play();
		// 		});
		// 	}
		// } );

		// // YouTube embeds
		// frame.find( 'iframe[src*="youtube.com/embed/"]' ).each( function() {
		// 	if( this.hasAttribute( 'data-autoplay' ) ) {
		// 		this.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
		// 	}
		// });

		frame.find('.framewrap').each( function() {
			filmstrip.playFilmStrip(this);
		});

		return this;
	};


	$.fn.stopEmbeddedContent = function() {

		var frame = $(this);
		
		// frame.find( 'video, audio' ).each( function() {
		// 		this.pause();
		// });

		// // YouTube embeds
		// frame.find( 'iframe[src*="youtube.com/embed/"]' ).each( function() {
		// 	if( typeof this.contentWindow.postMessage === 'function' ) {
		// 		this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
		// 	}
		// });

		frame.find('.framewrap').each( function() {
			filmstrip.stopFilmStrip(this);
		});

		return this;
	};


	return {
		//--------------------------------------------------------
		// Prepares the info about which frames elements are visible on each frame
		//--------------------------------------------------------

		prepareFrames: function(){

				$frameGroup = $(".frame-group");
				$frame = $frameGroup.children("li");
				$frameElements = $frameGroup.add($frame);


			//--------------------------------------------------------
			// add the duration info for each frame
			//--------------------------------------------------------

			// adds a "depth" to each frame element, reflects how deeply nested it is
			$frameElements.each(function() {
				$(this).data('depth', $(this).parents($frameElements).length);
			});

			// sorts based on depth
			$frameElements.get().sort(function(a, b) {
				var aD = jQuery.data(a, 'depth'),
				bD = jQuery.data(b, 'depth');

				if (aD < bD) { return -1; }
				if (aD === bD){ return 0;  }
				if (aD > bD) { return 1;  }

			});

			// inverts the order (so that it goes deepest –> least-deep)
			$($frameElements.get().reverse()).each(function() {

				var $this = $(this),
				$childrenDuration = 0,
				duration = 1,
				persist = $this.data('frame-persist') || 0,
				steps = $this.data('frame-steps') || 0,
				$children = $this.children($frameElements);

				if ($this.is( $frame )) {

					$children.each(function(){
						var $childDuration = $(this).data('duration');
						if ($childDuration > $childrenDuration) { $childrenDuration = $childDuration; }
					});

					if ($childrenDuration > 1) { $this.addClass('extra-frames'); }

				} else{ //if it's a frame-group

					$children.each(function(){
						$childrenDuration = $childrenDuration + $(this).data('duration');
					});
				}

				if (duration < $childrenDuration) {
					duration = $childrenDuration;
				}

				if (duration < steps) {
					duration = steps;
					$this.addClass('extra-frames');
				}
				
				$this.data('natural-duration', duration);
				$this.data('duration', (duration + persist));

			});

			//change the frame count to match new data
			framect = $main.data('duration');


			//--------------------------------------------------------
			// add which frames each frame is visible on
			//--------------------------------------------------------

			$($frameElements).each(function(){
				var $this = $(this),
				end = $this.data('duration'),
				v = [],
				i = 0,
				firstFrame = 0,
				firstChild = 0;
				

				if ($this.is($frame)){
					var sibling = $this.prev($frame);
					if (sibling && sibling.data('visible-frames')) {
						sibling = sibling.data('visible-frames');
						firstFrame = sibling[sibling.length-1] + 1;
					} else {
						firstChild = true;
					}
				}

				if ($this.not($main).is($frameGroup) || firstChild){
					firstFrame = $this.parent().data('visible-frames')[0];
				}

					i = firstFrame;
					end = end + firstFrame;

					while (i < end){
						v.push(i);
						if ($this.is($frame)) {
							$this.addClass('p-' + (i+1));
							if (i === firstFrame) {  $this.addClass('p-' + (i) + '-before') }
							if (i === (end-1) ) { $this.addClass('p-' + (i+2) + '-after') }
						};
						i++;
					}

				$this.data('visible-frames', v);
			});

		},

		refreshPlacement: function(){
			placement.focalpointElems = $('.focalpoint');
			$frame.addClass('p-haslayout');
			placement.focalpoint(); 
			$frame.removeClass('p-haslayout');
		},

		addStrokes: function(){
			$frame.addClass('p-haslayout');
			strokes.stroke();
			$('.textBlock').addClass('ready');
			$frame.removeClass('p-haslayout');
		},


		hideNavShare: function() {$sharebutton.addClass('hidden'); },
    	showNavShare: function() {$sharebutton.removeClass('hidden'); this.hideNavNext();},

    	hideNavNext: function() {$nextbutton.addClass('hidden'); },
    	showNavNext: function() {$nextbutton.removeClass('hidden'); this.hideNavShare();},

    	hideNavPrev: function() {$prevbutton.addClass('hidden');},
    	showNavPrev: function() {$prevbutton.removeClass('hidden');},

    	hideNav: function() {this.hideNavNext(); this.hideNavPrev();},
    	showNav: function() {this.showNavNext(); this.showNavPrev();},


		//--------------------------------------------------------
		// actually changes the frame
		//--------------------------------------------------------

		changeFrame: function(value){
			prevFrameIndex = frameIndex;

		//change the frame index to the new value
			if (value==="next") { if (frameIndex < framect-1) frameIndex++; }
			else if (value==="prev") { if (frameIndex > 0) frameIndex--;}
			else if (value==="first") { frameIndex = 0; }
			else if (value==="last"){ frameIndex = framect - 1; }
			else { frameIndex = Math.max(0, Math.min(framect - 1, parseInt(value, 10))); }


				// //gathers old "page-" classes
				// if ( $main.attr("class") ) {
				// 	var classes = $main.attr("class").split(" ").filter(function(item) {
				// 		return item.indexOf("page-") === -1 ? item : "";
				// 	});

				// 	$main.attr("class", classes.join(" ")); //removes old "page-" classes
				// };
				
				// adds new "page-" class
				$main.removeClass('page-' + (prevFrameIndex+1) );
				$main.addClass('page-' + (frameIndex+1) );


				




			//show/hide nav buttons
			if (frameIndex===0) { this.hideNavPrev(); this.showNavNext();}
			else if (frameIndex===framect-1) { this.showNavPrev(); this.showNavShare();}
			else{this.showNav();};

			if ($pageNumber) {
				$pageNumber.text( (frameIndex+1) + "/" + (framect));
			};

		}

	};

});