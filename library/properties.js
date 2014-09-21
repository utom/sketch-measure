var GetProperties = function(layer, types, position) {
  var content = '',
      getContext = function(color, position) {
        var alpha = [color alpha],
            hex = ([color hexValue] == 0)? '000000': [color hexValue],
            rgb = hexToRgb(hex),
            position = (!isNaN(position))? Math.round(position * 100) + '% - ': '';

        alpha = (alpha == 1)? '': ' (' + Math.round(alpha * 100) + '%)';
        return position + '#' + hex + ' / ' + rgb.r + ',' + rgb.g + ',' + rgb.b + alpha;
      },
      getColor = function(layer, fill) {

        var layer = layer,
            fill = (fill)? fill: [[layer style] fill],
            fillType = [fill fillType],
            gradient = (fillType != 1)? null: [fill gradient],
            gradientType = (fillType != 1)? null: [gradient gradientType];

        if(fill && [fill isEnabled] && fillType == 0){
          var color = [fill color];
          if ([color hexValue] == 'D8D8D8') setColor(layer, 'D8D8D8');
          return getContext(color)
        }
        else if(fill && [fill isEnabled] && fillType == 1) {
          var stops = [[gradient stops] array],
              stopsContext = (gradientType > 0)? 'radial\r\n': 'linear\r\n';

          for (var i = 0; i < [stops count]; i++) {
            var stop = stops[i];
            stopsContext += ' * ' + getContext([stop color], [stop position]) + '\r\n'
          }

          return [stopsContext trim];
        }
        else if(( !fill || (fill && ![fill isEnabled])) && [layer class] == MSTextLayer){
          var color = [layer textColor];
          return getContext(color);
        }
        else{
          return null;
        }
      };

  for (var i = 0; i < types.length; i++) {
    if(isText(layer) && types[i] == 'font') content += 'font: ' + [layer fontPostscriptName] + '\r\n';
    if(isText(layer) && types[i] == 'size') content += 'size: ' + updateLength([layer fontSize], false, true) + '\r\n';
    if(types[i] == 'color' && getColor(layer)) content += 'color: ' + getColor(layer) + '\r\n';
    if(isText(layer) && types[i] == 'line') content += 'line: ' + Math.ceil([layer lineSpacing] / [layer fontSize] * 100) + '%\r\n';
    if(types[i] == 'border' && [[layer style] border]) content += 'border: ' + getColor(layer, [[layer style] border]) + '\r\n';
    if(types[i] == 'opacity' && [[[layer style] contextSettings] opacity]) content += 'opacity: ' + Math.round([[[layer style] contextSettings] opacity] * 100) + '%\r\n';
  };

  if(content == '') return false;
  var data = (isText(layer))? [layer fontSize]: '';

  CreateLabel(layer, [content trim], position, data, 'PROPERTY');
},
SelectionProperties = function(types, position){
	var layers = selection,
      types = (types instanceof Array)? types: [types];
  if ([layers count] > 0) {
    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      GetProperties(layer, types, position);
    }
  } else {
    alert("Make sure you've selected layers that.");
  }
}