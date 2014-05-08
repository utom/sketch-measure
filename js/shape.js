var ShapeGuide = function(position){
  var   layers = selection,
         types = 'fill, border',
      getColor = function(colorObj){
                  var color = [colorObj color],
                        hex = [color hexValue],
                        rgb = hexToRgb(hex);
                  return '#' + hex + ' (' + rgb.r + ', ' + rgb.g + ', ' +  rgb.b + ')';
                 },
            fn = function(layer){
                if([layer class] != MSShapeGroup ) return false;
                var layerPosition = getPosition(layer),
                           height = [[layer frame] height],
                                x = layerPosition.x,
                                y = layerPosition.y,
                            count = 0,
                        labelText = '',
                            fills = [[layer style] fills].array(),
                             fill = ([fills count] > 0)? fills[0]: null,
                           border = [[layer style] border];
// log(border);return false;
                if(types['fill'] && fill) labelText += 'fill: ' + getColor(fill) + '\r\n'; count++;
                if(types['border'] && border) labelText += 'border: ' + getColor(border) + '\r\n'; count++;

                labelText = [labelText trim];

                var text = addText('text');
                [text setStringValue: labelText];

                if(position && position == 'top'){
                  var guide = TipGuide('bottom', text);
                  [[guide frame] setX: x + 5];
                  [[guide frame] setY: y - ( 5 + [[text frame] height])];
                }
                else if(position && position == 'right'){
                  var guide = TipGuide('left', text);
                  [[guide frame] setX: x + 5 + [[layer frame] width]];
                  [[guide frame] setY: y];
                }
                else if(position && position == 'bottom'){
                  var guide = TipGuide('top', text);
                  [[guide frame] setX: x + 5];
                  [[guide frame] setY: y + 5 + [[layer frame] height]];
                }
                else if(position && position == 'left'){
                  var guide = TipGuide('right', text);
                  [[guide frame] setX: x - ( 5 + [[text frame] width] )];
                  [[guide frame] setY: y];
                }
              };

  if ([layers count] > 0) {
      types = getTypes([doc askForUserInput:types initialValue:types]);
      each(layers, fn);
  }
  else{
    alert("Make sure you've selected a symbol, or a layer that.");
  }
}