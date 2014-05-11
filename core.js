var page = [doc currentPage],
  artboard = [[doc currentPage] currentArtboard],
  current = artboard ? artboard : page;

var defaultConfig = {
  fontSize: 12,
  fontFill: '#FFFFFF',
  fontType: 'Helvetica',
  fill: '#FF0000'
},
  otherConfig = {
    fill: '#4A90E2'
  },
  getGapPosition = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  };
function each(layers, callback) {
  var count = [layers count];
  for (var i = 0; i < count; i++) {
    var layer = layers[i];
    callback.call(layer, layer, i);
  }
}

function addLayer(name, type, parent) {
  var parent = parent ? parent : current,
    layer = [parent addLayerOfType: type];
  if (name)[layer setName: name];
  return layer;
}

function addGroup(name, parent) {
  return addLayer(name, 'group', parent);
}

function addShape(name, parent) {
  return addLayer(name, 'rectangle', parent);
}

function addText(name, parent) {
  return addLayer(name, 'text', parent);
}

function removeLayer(layer) {
  var parent = [layer parentGroup];
  if (parent)[parent removeLayer: layer];
}

function getPosition(layer) {
  var p = {
    x: 0,
    y: 0
  },
    fn = function(layer) {
      p.x += [[layer frame] x];
      p.y += [[layer frame] y];
      if ([[layer parentGroup] class] == MSLayerGroup) {
        fn([layer parentGroup]);
      }
    };

  fn(layer);

  return p;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function setColor(layer, hex) {
  if (![[layer style] fill]) [[[layer style] fills] addNewStylePart];
  var color = [[[layer style] fill] color],
      rgb = hexToRgb(hex),
      r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
  [color setRed: r];
  [color setGreen: g];
  [color setBlue: b];
}

function getTypes(types) {
  var typeArray = types.split(','),
    types = {};

  typeArray.forEach(function(type) {
    var type = type.trim();
    types[type] = 1;
  });
  return types;
}

function toPositive(number) {
  return (number < 0) ? -(number) : number;
}

var SizeGuide = {
  Width: function(position, layer) {
    var layers = selection,
      fn = function(layer) {
        var timestamp = new Date().getTime(),
          frame = [layer frame],
          width = [frame width],
          height = [frame height],
          layerPosition = getPosition(layer),
          x = layerPosition.x,
          y = layerPosition.y;

        var group = addGroup('$GUIDE' + timestamp),
          rulerGroup = addGroup('ruler', group),
          line = addShape('line', rulerGroup),
          start = addShape('start-arrow', rulerGroup),
          end = addShape('end-arrow', rulerGroup),
          labelGroup = addGroup('label-' + width, group),
          gap = addShape('gap', labelGroup),
          label = addShape('label', labelGroup),
          text = addText('text', labelGroup);

        var gapFrame = [gap frame];
        [gapFrame setWidth: 8];
        [gapFrame setHeight: 8];
        [gap setRotation: 45];

        var lineFrame = [line frame];
        [lineFrame setWidth: width];
        [lineFrame setHeight: 1];
        [lineFrame setY: 3];

        var startFrame = [start frame];
        [startFrame setWidth: 1];
        [startFrame setHeight: 7];

        var endFrame = [end frame];
        [endFrame setWidth: 1];
        [endFrame setHeight: 7];
        [endFrame setX: width - 1];

        [text setStringValue: parseInt(width) + 'px'];
        [text setFontSize: defaultConfig.fontSize];
        [text setFontPostscriptName: defaultConfig.fontType];
        [[text frame] setX: 5];
        [[text frame] setY: 5];

        var labelFrame = [label frame],
          labelWidth = [[text frame] width] + 10,
          labelHeight = [[text frame] height] + 11;

        [labelFrame setWidth: labelWidth];
        [labelFrame setHeight: labelHeight];

        setColor(gap, defaultConfig.fill);
        setColor(line, defaultConfig.fill);
        setColor(start, defaultConfig.fill);
        setColor(end, defaultConfig.fill);
        setColor(label, defaultConfig.fill);
        setColor(text, defaultConfig.fontFill);

        [text setIsSelected: 1];
        [line setIsSelected: 1];
        [text setIsSelected: 0];
        [line setIsSelected: 0];

        var labelGroupX = parseInt([[labelGroup frame] x] + (width - labelWidth) / 2);
        labelGroupY = parseInt([[labelGroup frame] y] - (labelHeight - 7) / 2);
        [[labelGroup frame] setX: labelGroupX];
        [[labelGroup frame] setY: labelGroupY];

        var groupFrame = [group frame];
        offset = -8;

        [gapFrame addX: parseInt((labelWidth - 8) / 2)];
        [gapFrame addY: 10];

        if (width < labelWidth + 20) {
          if (position && position == 'bottom') {
            [[labelGroup frame] addY: parseInt(labelHeight / 2 + 7)];
            [gapFrame addY: parseInt(0 - 3 - 10)];
          } else {
            [[labelGroup frame] addY: parseInt(0 - 7 - labelHeight / 2)];
            [gapFrame addY: parseInt(labelHeight - 5 - 10)];
          }
        }

        if (position && position == 'middle') {
          offset = parseInt((height - 7) / 2);
        } else if (position && position == 'bottom') {
          offset = height + 1;
        }
        [groupFrame setX: x]
        [groupFrame setY: y + offset]
      }

    if (layer) {
      fn(layer);
    } else if ([layers count] > 0) {
      each(layers, fn);
    } else {
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  },
  Height: function(position, layer) {
    var layers = selection,
      fn = function(layer) {
        var timestamp = new Date().getTime(),
          frame = [layer frame],
          width = [frame width],
          height = [frame height],
          layerPosition = getPosition(layer),
          x = layerPosition.x,
          y = layerPosition.y;

        var group = addGroup('$GUIDE' + timestamp),
          rulerGroup = addGroup('ruler', group),
          line = addShape('line', rulerGroup),
          start = addShape('start-arrow', rulerGroup),
          end = addShape('end-arrow', rulerGroup),
          labelGroup = addGroup('label-' + height, group),
          gap = addShape('gap', labelGroup),
          label = addShape('label', labelGroup),
          text = addText('text', labelGroup);

        var gapFrame = [gap frame];
        [gapFrame setWidth: 8];
        [gapFrame setHeight: 8];
        [gap setRotation: 45];

        var lineFrame = [line frame];
        [lineFrame setWidth: 1];
        [lineFrame setHeight: height];
        [lineFrame setX: 3];

        var startFrame = [start frame];
        [startFrame setWidth: 7];
        [startFrame setHeight: 1];

        var endFrame = [end frame];
        [endFrame setWidth: 7];
        [endFrame setHeight: 1];
        [endFrame setY: height - 1];

        [text setStringValue: parseInt(height) + 'px'];
        [text setFontSize: defaultConfig.fontSize];
        [text setFontPostscriptName: defaultConfig.fontType];
        [[text frame] setX: 5];
        [[text frame] setY: 5];

        var labelFrame = [label frame],
          labelWidth = [[text frame] width] + 10,
          labelHeight = [[text frame] height] + 11;

        [labelFrame setWidth: labelWidth];
        [labelFrame setHeight: labelHeight];

        setColor(gap, defaultConfig.fill);
        setColor(line, defaultConfig.fill);
        setColor(start, defaultConfig.fill);
        setColor(end, defaultConfig.fill);
        setColor(label, defaultConfig.fill);
        setColor(text, defaultConfig.fontFill);

        [text setIsSelected: 1];
        [line setIsSelected: 1];
        [text setIsSelected: 0];
        [line setIsSelected: 0];

        var labelGroupX = parseInt([[labelGroup frame] x] - (labelWidth - 7) / 2);
        labelGroupY = parseInt([[labelGroup frame] y] + (height - labelHeight) / 2);
        [[labelGroup frame] setX: labelGroupX];
        [[labelGroup frame] setY: labelGroupY];

        var groupFrame = [group frame];
        offset = -8;

        [gapFrame addX: 10];
        [gapFrame addY: parseInt((labelHeight - 8) / 2)];

        if (height < labelHeight + 20) {
          if (position && position == 'right') {
            [[labelGroup frame] addX: parseInt(labelWidth / 2 + 7)];
            [gapFrame addX: parseInt(0 - 3 - 10)];
          } else {
            [[labelGroup frame] addX: parseInt(0 - 7 - labelWidth / 2)];
            [gapFrame addX: parseInt(labelWidth - 5 - 10)];
          }
        }

        if (position && position == 'center') {
          offset = parseInt((width - 7) / 2);
        } 
        else if (position && position == 'right') {
          offset = width + 1;
        }
        [groupFrame setX: x + offset]
        [groupFrame setY: y]
      }

    if (layer) {
      fn(layer);
    } else if ([layers count] > 0) {
      each(layers, fn);
    } else {
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  }
}

var WidthGuide = function() {
  var positions = ['null', 'top', 'middle', 'bottom'];
      index = parseInt([doc askForUserInput: '1. top; 2. middle; 3. bottom' initialValue: '1']),
      position = (index >= 1 && index < 4)? positions[index]: positions[1];
    SizeGuide.Width(position);
}

var HeightGuide = function() {
  var positions = ['null', 'left', 'center', 'right'];
      index = parseInt([doc askForUserInput: '1. left; 2. center; 3. right' initialValue: '1']),
      position = (index >= 1 && index < 4)? positions[index]: positions[1];
    SizeGuide.Height(position);
}

var SpacingGuide = function(side, isGap) {
  var layers = selection,
    layer0, layer1,
    distanceTop, distanceRight, distanceBottom, distanceLeft,
    tempX, tempY, tempW, tempH, tempLayer;

  if ([layers count] == 1 && [current class] == MSArtboardGroup) {
    layer0 = current;
    layer1 = layers[0];
  } else if ([layers count] == 2) {
    layer0 = layers[0];
    layer1 = layers[1];
  } else {
    return false;
  }

  var layer0Position = getPosition(layer0),
    layer0X = ([layers count] == 1 && [layer0 class] == MSArtboardGroup)? 0: layer0Position.x,
    layer0Y = ([layers count] == 1 && [layer0 class] == MSArtboardGroup)? 0: layer0Position.y,
    layer0W = [[layer0 frame] width],
    layer0H = [[layer0 frame] height],

    layer1Position = getPosition(layer1),
    layer1X = layer1Position.x,
    layer1Y = layer1Position.y,
    layer1W = [[layer1 frame] width],
    layer1H = [[layer1 frame] height];

  distanceTop = layer0Y - layer1Y;
  distanceRight = (layer0X + layer0W) - (layer1X + layer1W);
  distanceBottom = (layer0Y + layer0H) - (layer1Y + layer1H);
  distanceLeft = layer0X - layer1X;

  if (side && side == 'top') {
    if (distanceTop == 0) return false;
    tempLayer = addShape('temp');
    tempX = layer1X;
    tempY = layer0Y;
    tempW = layer1W;
    tempH = toPositive(distanceTop);

    if (layer0Y > layer1Y) tempY = layer1Y;

    if (isGap && layer1Y > layer0Y + layer0H) {
      tempY = layer0Y + layer0H;
      tempH = tempH - layer0H;
    } else if (isGap && layer0Y > layer1Y + layer1H) {
      tempY = layer1Y + layer1H;
      tempH = tempH - layer1H;
    } else if (isGap) {
      removeLayer(tempLayer);
      return false;
    };
  } else if (side && side == 'right') {
    if (distanceRight == 0) return false;
    tempLayer = addShape('temp');
    tempX = layer1X + layer1W;
    tempY = layer1Y;
    tempW = toPositive(distanceRight);
    tempH = layer1H;

    if (layer0X + layer0W < layer1X + layer1W) tempX = layer0X + layer0W;

    if (isGap && layer0X > layer1X + layer1W) {
      tempX = layer1X + layer1W;
      tempW = tempW - layer0W;
    } else if (isGap && layer1X > layer0X + layer0W) {
      tempW = tempW - layer1W;
    } else if (isGap) {
      removeLayer(tempLayer);
      return false;
    };
  } else if (side && side == 'bottom') {
    if (distanceBottom == 0) return false;
    tempLayer = addShape('temp');
    tempX = layer1X;
    tempY = layer1Y + layer1H;
    tempW = layer1W;
    tempH = toPositive(distanceBottom);

    if (layer0Y + layer0H < layer1Y + layer1H) tempY = layer0Y + layer0H;
  } else if (side && side == 'left') {
    if (distanceLeft == 0) return false;
    tempLayer = addShape('temp');
    tempX = layer0X;
    tempY = layer1Y;
    tempW = toPositive(distanceLeft);
    tempH = layer1H;

    if (layer0X > layer1X) tempX = layer1X;
  }

  [[tempLayer frame] setX: tempX];
  [[tempLayer frame] setY: tempY];
  [[tempLayer frame] setWidth: tempW];
  [[tempLayer frame] setHeight: tempH];
  if (side && (side == 'top' || side == 'bottom')) SizeGuide.Height('center', tempLayer);
  if (side && (side == 'right' || side == 'left')) SizeGuide.Width('middle', tempLayer);


  removeLayer(tempLayer);

}
var MarginGuide = function() {
  var positions = ['null', 'top', 'right', 'bottom', 'left'];
      index = parseInt([doc askForUserInput: '1. top; 2. right; 3. bottom; 4. left;' initialValue: '1']),
      position = (index >= 1 && index < 5)? positions[index]: positions[1];
    SpacingGuide(position);
}

var DistanceGuide = function() {
  var positions = ['null', 'right', 'top'];
      index = parseInt([doc askForUserInput: '1. width; 2. height;' initialValue: '1']),
      position = (index >= 1 && index < 5)? positions[index]: positions[1];
    SpacingGuide(position, 1);
}

var LabelGuide = function(gapPosition, textContent, data) {
    var timestamp = new Date().getTime(),
        data = data? '-' + data : '';

    var groupLayer = addGroup('$GUIDE' + timestamp),
        gapLayer = addShape('gap', groupLayer),
        labelLayer = addShape('label' + data, groupLayer),
        textLayer = addText('text', groupLayer);

    [textLayer setStringValue: textContent];
    [textLayer setFontSize: defaultConfig.fontSize];
    [textLayer setFontPostscriptName: defaultConfig.fontType];
    [textLayer setLineSpacing: parseInt(defaultConfig.fontSize * 1.2)];

    [[gapLayer frame] setWidth: 8];
    [[gapLayer frame] setHeight: 8];
    [gapLayer setRotation: 45];

    setColor(textLayer, defaultConfig.fontFill);
    setColor(gapLayer, defaultConfig.fill);
    setColor(labelLayer, defaultConfig.fill);

    [[labelLayer frame] setWidth: [[textLayer frame] width] + 10]
    [[labelLayer frame] setHeight: [[textLayer frame] height] + 11]
    [[labelLayer frame] setX: [[textLayer frame] x] - 5];
    [[labelLayer frame] setY: [[textLayer frame] y] - 5];

    if (gapPosition && gapPosition == 'top') {
        [[gapLayer frame] setX: [[textLayer frame] x] + 3];
        [[gapLayer frame] setY: [[textLayer frame] y] - 8];
    } else if (gapPosition && gapPosition == 'right') {
        [[gapLayer frame] setX: [[textLayer frame] x] + [[textLayer frame] width]];
        [[gapLayer frame] setY: [[textLayer frame] y] + 3];
    } else if (gapPosition && gapPosition == 'bottom') {
        [[gapLayer frame] setX: [[textLayer frame] x] + 3];
        [[gapLayer frame] setY: [[textLayer frame] y] + [[textLayer frame] height]];
    } else if (gapPosition && gapPosition == 'left') {
        [[gapLayer frame] setX: [[textLayer frame] x] - 8];
        [[gapLayer frame] setY: [[textLayer frame] y] + 3];
    }
    [textLayer setIsSelected: 1];
    [textLayer setIsSelected: 0];

    return {
      layer: groupLayer,
      textWidth: [[textLayer frame] width],
      textHeight: [[textLayer frame] height]
    };
}

var TextGuide = function(position) {
  var layers = selection,
    types = 'font, size, color, line',
    getColor = function(layer) {
      var fill = [[layer style] fill],
        color = (fill) ? [fill color] : [layer textColor],
        hex = ([color hexValue] == 0)? '000000': [color hexValue],
        rgb = hexToRgb(hex);
      return '#' + hex + ' (' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    },
    fn = function(layer) {
      if ([layer class] != MSTextLayer) return false;
      var width = [[layer frame] width],
        height = [[layer frame] height],
        layerPosition = getPosition(layer),
        x = layerPosition.x,
        y = layerPosition.y,
        textContent = '';

      var layerFill = [[layer style] fill];
      if (layerFill && [[layerFill color] hexValue] == 'D8D8D8') setColor(layer, 'D8D8D8'); //fix default
      if (types['font']) textContent += 'font: ' + [layer fontPostscriptName] + '\r\n';
      if (types['size']) textContent += 'size: ' + parseInt([layer fontSize]) + 'px\r\n';
      if (types['color']) textContent += 'color: ' + getColor(layer) + '\r\n';
      if (types['line']) textContent += 'line: ' + parseInt([layer lineSpacing] / [layer fontSize] * 100) + '%\r\n';

      var guideInfo = LabelGuide(getGapPosition[position], [textContent trim], parseInt([layer fontSize])),
          guide = guideInfo.layer,
          textWidth = guideInfo.textWidth,
          textHeight = guideInfo.textHeight;

      if (position && position == 'top') {
        [[guide frame] setX: x + 5];
        [[guide frame] setY: y - (5 + textHeight)];
      } else if (position && position == 'right') {
        [[guide frame] setX: x + 5 + width];
        [[guide frame] setY: y];
      } else if (position && position == 'bottom') {
        [[guide frame] setX: x + 5];
        [[guide frame] setY: y + 5 + height];
      } else if (position && position == 'left') {
        [[guide frame] setX: x - (5 + textWidth)];
        [[guide frame] setY: y];
      }
    }
  if ([layers count] > 0) {
    types = getTypes([doc askForUserInput: types initialValue: types]);
    each(layers, fn);
  } else {
    alert("Make sure you've selected a symbol, or a layer that.");
  }
}

var ShapeGuide = function(position) {
  var layers = selection,
    types = 'fill, border',
    getColor = function(color){
      var hex = ([color hexValue] == 0)? '000000': [color hexValue],
          rgb = hexToRgb(hex);
      return '#' + hex + ' (' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    },
    fn = function(shape) {
      if ([shape class] != MSShapeGroup) return false;
      var shapePosition = getPosition(shape),
          width = [[shape frame] width],
          height = [[shape frame] height],
          x = shapePosition.x,
          y = shapePosition.y,
          textContent = '';

      var shapeFill = [[shape style] fill],
          shapeBorder = [[shape style] border];

      if (shapeFill && [[shapeFill color] hexValue] == 'D8D8D8') setColor(shape, 'D8D8D8'); //fix default
      if (types['fill'] && shapeFill) textContent += 'fill: ' + getColor([shapeFill color]) + '\r\n';
      if (types['border'] && shapeBorder) textContent += 'border: ' + getColor([shapeBorder color]) + '\r\n';

      var guideInfo = LabelGuide(getGapPosition[position], [textContent trim]),
          guide = guideInfo.layer,
          textWidth = guideInfo.textWidth,
          textHeight = guideInfo.textHeight;

      if (position && position == 'top') {
        [[guide frame] setX: x + 5];
        [[guide frame] setY: y - (5 + textHeight)];
      } else if (position && position == 'right') {
        [[guide frame] setX: x + 5 + width];
        [[guide frame] setY: y];
      } else if (position && position == 'bottom') {
        [[guide frame] setX: x + 5];
        [[guide frame] setY: y + 5 + height];
      } else if (position && position == 'left') {
        [[guide frame] setX: x - (5 + textWidth)];
        [[guide frame] setY: y];
      }
    };

  if ([layers count] > 0) {
    types = getTypes([doc askForUserInput: types initialValue: types]);
    each(layers, fn);
  } else {
    alert("Make sure you've selected a symbol, or a layer that.");
  }
}

var Unit = function(type){
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
    resetUnit = function(layers){
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
            [[textLayer frame] setWidth: [[newTextLayer frame] width]];
            removeLayer(newTextLayer);

          }
          else if( [layer class] == MSLayerGroup ){
            resetUnit([layer layers]);
          }
        });
    };

    resetUnit([current layers]);
}

var GuideStyle = function() {
  var setStyle = function(layers) {
    each(layers, function(layer) {
      if ([layer class] == MSShapeGroup) {
        setColor(layer, basicColor);
      }

      if ([layer class] == MSTextLayer) {
        setColor(layer, textColor);
      }

      if ([layer class] == MSLayerGroup) {
        setStyle([layer layers].array());
      }
    });
  },
  resetStyle = function(layers) {
    each(layers, function(layer) {
      var layerName = [layer name];
      if (
        [layer class] == MSLayerGroup &&
        layerName.match(/\$GUIDE\d+/)
      ) {
        setStyle([layer layers].array());
      } else if ([layer class] == MSLayerGroup) {
        resetStyle([layer layers]);
      }
    });
  };

  var colorHex = [doc askForUserInput: 'Change guide style (#Basic, #Text)' initialValue: '4A90E2, FFFFFF'],
      colorHex = colorHex.split(',');
  var basicColor = colorHex[0].trim(),
      textColor = colorHex[1].trim();

  if (basicColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i) && textColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    if([selection count] > 0) {
      resetStyle(selection);
    }
    else {
      resetStyle([current layers].array());
    }
  } else {
    alert('Error, Must be Color HEX!');
  }


}