var AllFill = function(type) {
  var setFill = function(layers) {
    each(layers, function(layer) {
      log([layer class]);
      if (type == 'shape' && [layer class] == MSShapeGroup) {
        setColor(layer, colorHex);
      } else if (type == 'text' && [layer class] == MSTextLayer) {
        setColor(layer, colorHex);
      } else if ([layer class] == MSLayerGroup) {
        setFill([layer layers].array());
      }
    });
  },
    resetFill = function(layers) {

      var layers = layers.array();

      each(layers, function(layer) {
        var layerName = [layer name];
        if (
          [layer class] == MSLayerGroup &&
          layerName.match(/\$GUIDE\d+/)
        ) {
          setFill([layer layers].array());

        } else if ([layer class] == MSLayerGroup) {
          resetFill([layer layers]);
        }
      });
    };

  if (type == 'text') {
    inputLabel = 'Do you want to reset all text color (HEX: FFFFFF)',
    inputValue = 'FFFFFF';
  } else if (type == 'shape') {
    inputLabel = 'Do you want to reset all background color (HEX: FF0000)',
    inputValue = '4A90E2';
  }

  var colorHex = [doc askForUserInput: inputLabel initialValue: inputValue];

  if (colorHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    resetFill([current layers]);
  } else {
    alert('Error, Must be Color HEX!');
  }


}