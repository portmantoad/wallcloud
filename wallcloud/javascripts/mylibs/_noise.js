define(
    [],
    function () {


function generateNoise(outputWidth, outputHeight, scale){
  
var outputC = document.createElement('canvas'),
    inputC = document.createElement('canvas'),
    oCtx = outputC.getContext('2d'),
    iCtx = inputC.getContext('2d'), 
    scale = scale || 1,
    oWidth = outputWidth || 500,
    oHeight = outputHeight || 500,
    seedWidth = ~~Math.max(outputWidth/3, 500),
    seedHeight = ~~Math.max(outputHeight/3, 500);

   inputC.width = seedWidth;
   inputC.height = seedHeight;
   outputC.width = oWidth;
   outputC.height = oHeight;



//----------------------------
//Generate Randomness

   var eLength = ~~Math.min(seedWidth*seedHeight, Math.max(seedWidth,seedHeight)*100-233),
       entropy = new Array(eLength);
   
   for (var i = 0; i < eLength; i++) {
      entropy[i] = Math.random() * 255;
   }
 
//----------------------------
//Draw noise onto input Canvas

    var imageData = iCtx.createImageData(seedWidth, seedHeight),
    pd = imageData.data;
   
   for (var i = 0, il = pd.length; i < il; i += 4) {
      pd[i+3] = entropy[i % eLength];
   }
 
   iCtx.putImageData(imageData, 0, 0);


var noisePattern = oCtx.createPattern(inputC, 'repeat');

        oCtx.rect(0, 0, oWidth, oHeight);
        oCtx.fillStyle = noisePattern;
        oCtx.fill();
        oCtx.fill();
        

//----------------------------

  
   oCtx.globalCompositeOperation = 'destination-in'; 
   oCtx.fill();
   
   oCtx.drawImage(outputC,0,0, oWidth*scale, oHeight*scale);
   oCtx.drawImage(outputC,0,0, oWidth*scale, oHeight*scale);


   return outputC;

}

return{
  addNoise: function(){

    var textureCanvasLight = document.getelementbyid('texture'),
    textureCanvasDark = document.getelementbyid('texture2'),
    textureContextLight = textureCanvasLight.getContext('2d'),
    textureContextDark = textureCanvasDark.getContext('2d'),
    textureWidth = window.innerWidth + 350,
    textureHeight = window.innerHeight + 350,
    scale = 1.4,  
    texture;

    if (window.devicePixelRatio) {

        scale = scale * window.devicePixelRatio;

        $(textureCanvasLight).css({ width: textureWidth, height: textureHeight});
        $(textureCanvasDark).css({ width: textureWidth, height: textureHeight});

        textureWidth = textureWidth * scale;
        textureHeight = textureHeight * scale;
         

    };


      texture = generateNoise(textureWidth, textureHeight, scale);

    textureCanvasLight.width = textureWidth;
    textureCanvasLight.height = textureHeight;
    textureCanvasDark.width = textureWidth;
    textureCanvasDark.height = textureHeight;

    textureContextLight.drawImage(texture, 0, 0, textureWidth, textureHeight);
    textureContextDark.drawImage(texture, 0, 0, textureWidth, textureHeight);

    textureContextLight.globalCompositeOperation = 'source-in';
    textureContextDark.globalCompositeOperation = 'source-in';

    // colorimage.imagesLoaded().done(function (){
    //   colorimage = colorimage[0];
    //   textureContext.drawImage(colorimage, 0, 0, textureWidth, textureHeight);
    // });

            textureContextLight.rect(0, 0, textureWidth, textureHeight);
            textureContextLight.fillStyle = 'rgba(250,250,250,.3)';
            textureContextLight.fill();

            textureContextDark.rect(0, 0, textureWidth, textureHeight);
            textureContextDark.fillStyle = 'rgba(0,0,0,.2)';
            textureContextDark.fill();

  }

}

});