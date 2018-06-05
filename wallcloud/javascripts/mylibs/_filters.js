define(
    ['jquery', '_loader', '_util'],
    function ($, loader, util) {


  function screenBlend(idata,c) {

      var px = idata.data,
           t, tt;

      for(var i = 0; i < px.length; i+=4) {
        t = px[i]; 
        if (px[i+1]>t) t=px[i+1]; 
        if (px[i+2]>t) t=px[i+2];

        px[i+3] = t;

        t = t/255;
        px[i] = px[i]/t;
        px[i+1] = px[i+1]/t;
        px[i+2] = px[i+2]/t;
      }

      idata.data = px;

      c.putImageData(idata,0,0);

  }


  function multiplyBlend(idata,c) {

      var px = idata.data,
          t, tt;

      for(var i = 0; i < px.length; i+=4) {
        t = px[i]; 
        if (px[i+1]<t) t=px[i+1]; 
        if (px[i+2]<t) t=px[i+2];
          
          px[i+3] = (255 - t);
          tt = px[i+3]/255;
          px[i] = (px[i] - t) / tt;
          px[i+1] = (px[i+1] - t) / tt;
          px[i+2] = (px[i+2] - t) / tt;
          
      }
      idata.data = px;

      c.putImageData(idata,0,0);
  }


  function mask(idata,c,w,h,color,inverted){

    var data = idata.data;

      for(var i = 0; i < data.length; i+=4) {
          data[i+3] = ( 0.2125 * data[i] + 0.7154 * data[i+1] + 0.0721 * data[i+2] ) * data[i+3] / 255;
      }

      idata.data = data;

      c.putImageData(idata,0,0);

    if (inverted) {  c.globalCompositeOperation = 'source-out';} 
    else {           c.globalCompositeOperation = 'source-in'; }

    c.rect(0,0,w,h);
    c.fillStyle = color;
    c.fill();

  }

  return{
    filter: function() {
        $( ".filter" ).each(function(){

          var $this = $(this),
          source = this,
              // bgRgb = $this.data('bgRgb') || $this.css('background-color').replace(/rgb\(/, '').replace(/rgba\(/, '').replace(/\)/, '').split(','),
              bgRgb = $this.data('bgRgb') || $this.css('background-color'),
              canvas = $this.next('canvas').length ? $this.next('canvas')[0] : $('<canvas />').insertAfter($this)[0];

                if ( !$this.data('bgRgb') ) { $this.css('background-color', 'transparent').data('bgRgb', bgRgb); }
                
                util.cloneAllAttributes($this, canvas);

          var context = canvas.getContext('2d'),
              cw,ch;


                loader.ensureLoaded( source, function() { 
                  cw = $this.width();
                  ch = $this.height();           
                  canvas.width = cw;
                  canvas.height = ch;

                  context.drawImage(source,0,0,cw,ch);

                  var idata = context.getImageData(0,0,cw,ch);

                  if( $this.hasClass('screen') ){
                      screenBlend(idata,context);
                  } else if( $this.hasClass('multiply') ){
                     multiplyBlend(idata,context);
                  } else if( $this.hasClass('mask') ){
                    $this.hasClass('inverted') ? mask(idata,context,cw,ch,bgRgb,true) : mask(idata,context,cw,ch,bgRgb);
                  }  

                  $this.remove();
                  $(canvas).removeClass('filter');

                });

          });
    }
  }

});