var Unit = function(){
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
    // setText   = function(layer){
    //     log(layer);
    //     var layerName = [layer name];

        
    //     if(layerName.match(/\label-(\d+)/)){
    //       var length = layerName.match(/\label-(\d+)/);
    //       length = parseInt(length[1]);
    //       if([layer class] == MSLayerGroup){
    //         each([layer layers].array(), function(layer){

    //         });
    //       }
    //     }
    // },
    getElementBy('')
    resetUnit = function( layers ){
        var layers = layers.array();

        each(layers, function(layer){
          var layerName = [layer name];
          // log(layerName.match(/\$GUIDE\-\d+/));
          if(
            [layer class] == MSLayerGroup &&
            layerName.match(/\$GUIDE\d+/)
          ){
            // each([layer layers].array(), setText);
            
          }
          else if( [layer class] == MSLayerGroup ){
            resetUnit([layer layers]);
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
    };

    resetUnit([current layers]);
}