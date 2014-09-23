var GetProperties = function(layer, types, position) {
  var content = '',
      getColorContext = function(color, position) {
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
            fillType = (fill)? [fill fillType]: null,
            gradient = (fillType != 1)? null: [fill gradient],
            gradientType = (fillType != 1)? null: [gradient gradientType];

        if(fill && [fill isEnabled] && fillType == 0){
          var color = [fill color];
          if ([color hexValue] == 'D8D8D8') setColor(layer, 'D8D8D8');
          return getColorContext(color)
        }
        else if(fill && [fill isEnabled] && fillType == 1) {
          var stops = [[gradient stops] array],
              stopsContext = (gradientType > 0)? 'radial gradient\r\n': 'linear gradient\r\n';

          for (var i = 0; i < [stops count]; i++) {
            var stop = stops[i];
            stopsContext += ' * ' + getColorContext([stop color], [stop position]) + '\r\n'
          }

          return [stopsContext trim];
        }
        else if(( !fill || (fill && ![fill isEnabled])) && [layer class] == MSTextLayer){
          var color = [layer textColor];
          return getColorContext(color);
        }
        else{
          return null;
        }
      };

  var border = [[layer style] border],
      shadow = [[layer style] shadow],
      innerShadow = [[layer style] innerShadow],
      data = [];
  for (var i = 0; i < types.length; i++) {
    if(isText(layer) && types[i] == 'font') content += 'font: ' + [layer fontPostscriptName] + '\r\n';
    if(isText(layer) && types[i] == 'size'){
      data.push([layer fontSize]);
      content += 'size: ' + updateLength([layer fontSize], false, true) + '\r\n';
    }
    if(types[i] == 'color' && getColor(layer)) content += 'color: ' + getColor(layer) + '\r\n';
    if(isText(layer) && types[i] == 'line') content += 'line: ' + Math.ceil([layer lineSpacing] / [layer fontSize] * 100) + '%\r\n';
    if(
      types[i] == 'border' &&
      border &&
      [border isEnabled]
    ){ 
      content += 'border: ' + getColor(layer, border) + '\r\n';
    }
    if(
      types[i] == 'shadow' &&
      shadow &&
      [shadow isEnabled]
    ){
      var blur = [shadow blurRadius],
          spread = [shadow spread];

      data.push([shadow offsetX]);
      data.push([shadow offsetY]);
      if(blur) data.push(blur);
      if(spread) data.push(spread);

      blur = (blur)? '\r\n * blur - ' + updateLength(blur, false): '';
      spread = (spread)? '\r\n * spread - ' + updateLength(spread, false): '';
      content += 'shadow: \r\n * x & y - ' + updateLength([shadow offsetX], false) + ', ' + updateLength([shadow offsetY], false) + blur + spread + '\r\n * ' + getColorContext([shadow color]) + '\r\n';
    }

    if(
      types[i] == 'inner-shadow' &&
      innerShadow &&
      [innerShadow isEnabled]
    ){
      var innerblur = [innerShadow blurRadius],
          innerspread = [innerShadow spread];

      data.push([innerShadow offsetX]);
      data.push([innerShadow offsetY]);
      if(innerblur) data.push(innerblur);
      if(innerspread) data.push(innerspread);

      innerblur = (innerblur)? '\r\n * blur - ' + updateLength(innerblur, false): '';
      innerspread = (innerspread)? '\r\n * spread - ' + updateLength(innerspread, false): '';
      content += 'inner shadow: \r\n * x & y - ' + updateLength([innerShadow offsetX], false) + ', ' + updateLength([innerShadow offsetY], false) + innerblur + innerspread + '\r\n * ' + getColorContext([innerShadow color]) + '\r\n';
    }
    if(types[i] == 'opacity' && [[[layer style] contextSettings] opacity]) content += 'opacity: ' + Math.round([[[layer style] contextSettings] opacity] * 100) + '%\r\n';
  };

  if(content == '') return false;
  var data = (data.length > 0)? data.join(', '): '';

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