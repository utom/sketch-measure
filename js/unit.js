var unit = function(){
    var scale = {
             'LDPI': .75,
            'MDPI': 1,
            'HDPI': 1.5,
           'XHDPI': 2,
          'XXHDPI': 3,
         'XXXHDPI': 4,
        'Standard': 2,
          'Retina': 1
    },
    getText  = function(layers){
      
    },
    resetUnit = function( layers ){
        var layers = layers.array();
        each(layers, function(layer){
          var layerName = [layer name];
          if(
            [layers class] == MSLayerGroup &&
            layerName.match(/\$GUIDE\-\d+/)
          ){
            
          }
        });
      // layers.each(function( layer ){
      //   if( layer.class() == MSLayerGroup && layer.name().match(/\$Guide\-\d+/) ){
      //     var guideItems = layer.layers();
      //     guideItems.each(function( item ){
      //       var length = item.name() + '';

      //       if( item.class() == MSTextLayer && length.match(/\d+/) ){

      //         var number = parseInt( length / scale[type] ),
      //             unit = ( type >= 6 )? 'px': 'dp',
      //             text = item.stringValue().replace( /(\d+\s[dxps]{2})/g, number + ' ' + unit),
      //             x = item.frame().x(),
      //             y = item.frame().y(),
      //             width = item.frame().width(),
      //             newItem = layer.addLayerOfType('text');

      //         newItem.name = length;
      //         newItem.setStringValue( text );
      //         newItem.setFontSize( MUGlobal.font.size );
      //         newItem.setFontPostscriptName( MUGlobal.font.family );
      //         newItem.style().fills().addNewStylePart();
      //         self.setColor( newItem, MUGlobal.font.color.r, MUGlobal.font.color.g, MUGlobal.font.color.b );

      //         newItem.frame().setX( parseInt( x + ( ( width - newItem.frame().width() ) / 2 ) ) );
      //         newItem.frame().setY( y );

      //         layer.removeLayer( item );
      //       }
      //     });
      //   }
      //   else if( layer.class() == MSLayerGroup ){
      //     resetUnit( layer.layers() );
      //   }

      // });
    }
}