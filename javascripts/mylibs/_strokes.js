define(
	['jquery', '_util', '_loader'],
	function ($, util, loader) {

		var strokeImg = new Image(),
			strokes = {
				pen: {
					height:100,
					vPadding: 35,
					hPadding: 40,
					url: 'assets/strokes/pen/pen-optim.png',
					images: [
						{ width: 143 },
						{ width: 177 },
						{ width: 221 },
						{ width: 249 },
						{ width: 298 },
						{ width: 309 },
						{ width: 345 },
						{ width: 350 },
						{ width: 360 },
						{ width: 375 },
						{ width: 376 },
						{ width: 400 },
						{ width: 410 },
						{ width: 433 },
						{ width: 451 },
						{ width: 509 },
						{ width: 585 },
						{ width: 612 },
						{ width: 645 },
						{ width: 688 },
						{ width: 805 },
						{ width: 866 },
						{ width: 970 },
						{ width: 1059 },
						{ width: 1135 },
						{ width: 1385 }
					]
				},

				paint: {
					height:100,
					vPadding: 35,
					hPadding: 50,
					url: 'assets/strokes/paint/paint-optim.png',
					images: [
						{ width: 195 },
						{ width: 208 },
						{ width: 222 },
						{ width: 230 },
						{ width: 239 },
						{ width: 260 },
						{ width: 269 },
						{ width: 278 },
						{ width: 288 },
						{ width: 297 },
						{ width: 306 },
						{ width: 315 },
						{ width: 325 },
						{ width: 331 },
						{ width: 338 },
						{ width: 342 },
						{ width: 349 },
						{ width: 356 },
						{ width: 371 },
						{ width: 394 },
						{ width: 405 },
						{ width: 412 },
						{ width: 422 },
						{ width: 447 },
						{ width: 467 },
						{ width: 480 },
						{ width: 503 },
						{ width: 523 },
						{ width: 552 },
						{ width: 586 },
						{ width: 625 },
						{ width: 684 },
						{ width: 749 },
						{ width: 793 }
					]
				}

			};




	function getStroke(mode, width, height) {

		if (!strokes[mode].images.length) { return false };

		width = width * (strokes[mode].height / height)

		var wdiff, a, b, c, d, e, bUsed, cUsed, dUsed, eUsed, x;

		for (var i = strokes[mode].images.length; i--;) {
			wdiff = Math.abs( strokes[mode].images[i].width - width );
				if ( a === undefined || wdiff <= a[1]) { e=d; d=c; c=b; b=a; a=[i, wdiff] }
			else if ( b === undefined || wdiff <= b[1]) { e=d; d=c; c=b; b=[i, wdiff] }
			else if ( c === undefined || wdiff <= c[1]) { e=d; d=c; c=[i, wdiff] }
			else if ( d === undefined || wdiff <= d[1]) { e=d; d=[i, wdiff] }
			else if ( e === undefined || wdiff <= e[1]) { e=[i] }
		}

		x = [ a[0], strokes[mode].images[ a[0] ].used ];

		bUsed = strokes[mode].images[ b[0] ].used ;
		cUsed = strokes[mode].images[ c[0] ].used ;
		dUsed = strokes[mode].images[ d[0] ].used ;
		eUsed = strokes[mode].images[ e[0] ].used ;

		if ( x[1] && !bUsed  ||  bUsed < x[1] ) { x = [ b[0], bUsed ] };
		if ( x[1] && !cUsed  ||  cUsed < x[1] ) { x = [ c[0], cUsed ] };
		if ( x[1] && !dUsed  ||  dUsed < x[1] ) { x = [ d[0], dUsed ] };
		if ( x[1] && !eUsed  ||  eUsed < x[1] ) { x = [ e[0] ] };

		return strokes[mode].images[ x[0] ];

	}


	return{

		stroke: function(strokeType){

			util.addLoadOverlay();



				 var mode = strokeType || 'paint',
				 	 hPad = strokes[mode].hPadding,
				 	 vPad = strokes[mode].vPadding,
					   sh = strokes[mode].height,
				 $stroked = $( ".stroked" );

			strokeImg.src = strokes[mode].url;


			// $(strokeImg).imagesLoaded().done(function (){
			
			// loader.ensureLoaded( strokeImg, function() { 


				$stroked.each(function(){

					var $this = $(this),
					containerOffsets = $this[0].getBoundingClientRect(),
					$wrap = $this.wrapInner('<span />').children(),
					lines = $wrap[0].getClientRects(),
					bgRgb = $this.data('bgRgb') || $this.css('background-color');


					if ( !$this.data('bgRgb') ) { $this.css('background-color', 'transparent').data('bgRgb', bgRgb); }

					

					$(lines).each(function(){
						
						var w  = this.width || this.right - this.left,
							h  = this.height || this.bottom - this.top,
							cw = w + (hPad * 2),
							ch = h + (vPad * 2),
							t  = this.top - containerOffsets.top - vPad,
							l  = this.left - containerOffsets.left - hPad;


						//checks to see if the detected 'client rect' is worth covering
						if (w >= 2 && h >= 2) {

							var canvas = document.createElement('canvas');

								if (window.devicePixelRatio) {
									$(canvas).css({ width: cw, height: ch});
									cw = cw * window.devicePixelRatio;
								  	ch = ch * window.devicePixelRatio;
								};


							var scale 			= ch / sh,
								stroke 			= getStroke(mode, cw, ch),
								sw 				= stroke.width,
								context 		= canvas.getContext('2d'), 
								strokeOffset 	= sh * strokes[mode].images.indexOf(stroke),
								centerWidth 	= sw - (2 * hPad),
								centerStretched = -~(cw - (2 * hPad * scale)),
								tipWidth 		= ~~(hPad*scale);


								$(canvas).prependTo($this).css({ top: t, left: l });
							   	stroke.used = stroke.used + 1 || 1;
								canvas.width = cw;
								canvas.height = ch;
								context.rect(0, 0, cw, ch);
								context.fillStyle = bgRgb;


								
								$(strokeImg).on("load", function (){
									context.drawImage( strokeImg, 0, strokeOffset, hPad, sh, 0, 0, tipWidth, ch); // left unstretched tip
									context.drawImage( strokeImg, (sw - hPad), strokeOffset, hPad, sh, (centerStretched + tipWidth), 0, tipWidth, ch );// right unstretched tip
									context.drawImage( strokeImg, hPad, strokeOffset, centerWidth, sh, tipWidth, 0, centerStretched, ch);// stretched middle

									context.globalCompositeOperation = 'source-in';

									context.fill();
								});  
	   
								

							}

						

					});


					$stroked.addClass('loaded');
					

				});
			util.removeLoadOverlay();

		}

	}

});

