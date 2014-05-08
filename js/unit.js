var AllUnit = function(type){
    var scale = {
            'LDPI': .75,
            'MDPI': 1,
            'HDPI': 1.5,
           'XHDPI': 2,
          'XXHDPI': 3,
         'XXXHDPI': 4,
        'Standard': 1,
          'Retina': 2
    },
    resetUnit = function( layers ){
        var layers = layers.array();

        each(layers, function(layer){
          var layerName = [layer name];
          if(
            [layer class] == MSLayerGroup &&
            layerName.match(/\$GUIDE\d+/)
          ){
            var length, textLayer;
            each([layer layers].array(), function(layer){
              var layerName = [layer name];

              if(layerName.match(/label-(\d+)/)){
                length = layerName.match(/label-(\d+)/)[1];
            if ([layer class] == MSLayerGroup) {
                  each([layer layers].array(), function(layer){
                    if([layer class] == MSTextLayer){
                      textLayer = layer;
                    }
                  });
                }
              }

              if([layer class] == MSTextLayer){
                textLayer = layer;
              }
            });


            var newLength = parseInt(length / scale[type]),
                     unit = (type.match(/DPI/))? 'dp' : 'px';
                     text = textLayer.stringValue().replace( /(\d+[dxps]{2})/g, newLength + unit),
                newTextLayer = addText('text');

            [textLayer setStringValue: text];
            [newTextLayer setStringValue: text];
            [newTextLayer setFontSize: defaultConfig.fontSize];
            [newTextLayer setFontPostscriptName: defaultConfig.fontType];
            [newTextLayer setLineSpacing: parseInt(defaultConfig.fontSize * 1.2)];

            var offset = parseInt( ( [[textLayer frame] width] - [[newTextLayer frame] width] ) / 2 );
            [[textLayer frame] addX: offset];
            removeLayer(newTextLayer);

          }
          else if( [layer class] == MSLayerGroup ){
            resetUnit([layer layers]);
          }
        });
    };

    resetUnit([current layers]);
}