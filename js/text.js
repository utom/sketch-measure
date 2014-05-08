var TextGuide = function(position){
  var layers   = selection,
      types    = 'font, size, color, line',
      getColor = function(layer){
        var fills = [[layer style] fills].array(),
            fill  = ( [fills count] > 0 )? fills[0]: null,
            color = ( [fills count] > 0 )? [fill color]: [layer textColor],
            hex   = [color hexValue],
            rgb   = hexToRgb(hex);
        return '#' + hex + ' (' + rgb.r + ', ' + rgb.g + ', ' +  rgb.b + ')';
      },
      fn       = function(layer){
        if([layer class] != MSTextLayer ) return false;
        var height        = [[layer frame] height],
            layerPosition = getPosition(layer),
            x             = layerPosition.x,
            y             = layerPosition.y,
            count         = 0,
            labelText     = '';

        if(types['font']) labelText += 'font: ' + [layer fontPostscriptName] + '\r\n'; count++;
        if(types['size']) labelText += 'size: ' + parseInt([layer fontSize]) + 'px\r\n'; count++;
        if(types['color']) labelText += 'color: ' + getColor(layer) + '\r\n'; count++;
        if(types['line']) labelText += 'line: ' + parseInt([layer lineSpacing] / [layer fontSize] * 100) + '%\r\n'; count++;

        labelText = [labelText trim];

        var text = addText('text');
        [text setStringValue: labelText];


        if(position && position == 'top'){
          var guide = TipGuide('bottom', text, parseInt([layer fontSize]));
          [[guide frame] setX: x + 5];
          [[guide frame] setY: y - ( 5 + [[text frame] height])];
        }
        else if(position && position == 'right'){
          var guide = TipGuide('left', text, parseInt([layer fontSize]));
          [[guide frame] setX: x + 5 + [[layer frame] width]];
          [[guide frame] setY: y];
        }
        else if(position && position == 'bottom'){
          var guide = TipGuide('top', text, parseInt([layer fontSize]));
          [[guide frame] setX: x + 5];
          [[guide frame] setY: y + 5 + [[layer frame] height]];
        }
        else if(position && position == 'left'){
          var guide = TipGuide('right', text, parseInt([layer fontSize]));

          [[guide frame] setX: x - ( 5 + [[text frame] width] )];
          [[guide frame] setY: y];
        }
      }
  if ([layers count] > 0) {
      types = getTypes([doc askForUserInput:types initialValue:types]);
      each(layers, fn);
  }
  else{
    alert("Make sure you've selected a symbol, or a layer that.");
  }
}