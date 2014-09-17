var resetAllUnit = function(layers, type){
  var layers = [layers array];

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(
      /\$SIZE|\$WIDTH|\$HEIGHT|\$DISTANCE/.exec([layer name])
    ){
      resetFontsize(layer, configs.fontSize);
    }

    if(
      /\$PROPERTY|\$LABEL|\$COORDINATE/.exec([layer name])
    ){
      resetFontsize(layer, configs.fontSize, true);
    }

    if(
      isGroup(layer) &&
      /\$SIZE|\$WIDTH|\$HEIGHT|\$DISTANCE|\$COORDINATE/.exec([layer name])
    ){
      resetUnit(layer, type);
    }
    else if(
      isGroup(layer) &&
      /\$PROPERTY/.exec([layer name])
    ){
      resetUnit(layer, type, true);
    }
    else if( isGroup(layer) ){
      resetAllUnit([layer layers], type);
    }
  };
}

var resetUnit = function(group, type, sp){
  var length, textLayer, labelLayer, textWidth, labelWidth, labelHeight,
      layers = [[group layers] array],
      groupName = [group name], textColor, isArrayLength;
  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i],
        rect = getRect(layer),
        layerName = [layer name];

    if(/^\d+$/.exec(layerName)){
      length = layerName;
      labelLayer = layer;
      labelWidth = rect.width;
      labelHeight = rect.height;
    }
    else if(/^\-?\d+\,\s\-?\d+$/.exec(layerName)){
      length = layerName.split(',');
      var l0 = parseFloat(length[0]),
          l1 = parseFloat(length[1]);

      length = [l0, l1];
      labelLayer = layer;
      labelWidth = rect.width;
      labelHeight = rect.height;

      isArrayLength = true;
    }
    else if(isText(layer)){
      textLayer = layer;
      textWidth = rect.width;
    }
  };

  if(labelLayer){
    var text = (isArrayLength)? updateLength(length[0], type) + ', ' + updateLength(length[1], type): textLayer.stringValue().replace( /(\d+[dxpst]{2})/g, updateLength(length, type, sp)),
        newTextLayer = addText('text', group),
        textRect = getRect(textLayer);

    [newTextLayer setStringValue: text];
    [newTextLayer setFontSize: configs.fontSize];
    [newTextLayer setFontPostscriptName: configs.fontType];
    [newTextLayer setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var newTextRect   = getRect(newTextLayer),
        newLabelWidth  = newTextRect.width + 10,
        offset = (labelWidth - newLabelWidth) / 2;

    [textLayer setStringValue: text];
    setSize(labelLayer, newLabelWidth, labelHeight);
    setSize(textLayer, newTextRect.width, newTextRect.height);

    if (!isArrayLength) {
      [[labelLayer frame] addX: offset]
      [[textLayer frame] addX: offset]
    };

    removeLayer(newTextLayer);

    [textLayer setIsSelected: 1];
    [textLayer setIsSelected: 0];
  }
}

var resetAllStyle = function(layers, styles){
  var layers = [layers array],
      regx;

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(
      isGroup(layer) &&
      /\$SIZE|\$WIDTH|\$HEIGHT|\$DISTANCE|\$PROPERTY|\$LABEL|\$OVERLAYER|\$COORDINATE/.exec([layer name])
    ){
      if( 
        styles.size &&
        /\$SIZE|\$WIDTH|\$HEIGHT/.exec([layer name])
      ){
        resetStyle(layer, styles.size.basic, styles.size.text);
      }

      if( 
        styles.size &&
        /\$OVERLAYER/.exec([layer name])
      ){
        resetStyle(layer, styles.size.basic, styles.size.text, .3);
      }

      if( 
        styles.distance &&
        /\$DISTANCE/.exec([layer name])
      ){
        resetStyle(layer, styles.distance.basic, styles.distance.text);
      }

      if( 
        styles.property &&
        /\$PROPERTY|\$LABEL/.exec([layer name])
      ){
        resetStyle(layer, styles.property.basic, styles.property.text);
      }

      if( 
        styles.coordinate &&
        /\$COORDINATE/.exec([layer name])
      ){
        resetStyle(layer, styles.coordinate.basic, styles.coordinate.text);
      }

      if(
        styles.fontsize &&
        /\$SIZE|\$WIDTH|\$HEIGHT|\$DISTANCE/.exec([layer name])
      ){
        resetFontsize(layer, styles.fontsize);
      }

      if(
        styles.fontsize &&
        /\$PROPERTY|\$LABEL|\$COORDINATE/.exec([layer name])
      ){
        resetFontsize(layer, styles.fontsize, true);
      }
    }
    else if( isGroup(layer) ){
      resetAllStyle([layer layers], styles);
    }
  };
}
var resetFontsize = function(group, fontsize, dont) {
  var layers = [[group layers] array],
      textLayer, labelLayer, lineLayer, aLayer;

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i],
        layerName = [layer name];

    if(isText(layer)){
      textLayer = layer;
    }
    else if(/^\d+$/.exec(layerName) || /^label$/.exec([layer name])){
      labelLayer = layer;
    }
    else if(/^line$/.exec(layerName)){
      lineLayer = layer;
    }
    else if(/^start\-arrow$/.exec(layerName)){
      aLayer = layer;
    }
  };

  var textRect = getRect(textLayer),
      labelRect = getRect(labelLayer),
      text = textLayer.stringValue(),
      newTextLayer = addText('text', group);
  if (!dont){
  var lineRect = getRect(lineLayer),
      aRect = getRect(aLayer),
      isWidth = (aRect.width > aRect.height)? false: true;
  }
  
  [newTextLayer setStringValue: text];
  [newTextLayer setFontSize: fontsize];
  [newTextLayer setFontPostscriptName: configs.fontType];
  [newTextLayer setLineSpacing: parseInt(fontsize * 1.2)];

  var newTextRect   = getRect(newTextLayer),
      offsetX = parseInt( ( textRect.width - newTextRect.width ) / 2 ),
      offsetY = parseInt( ( textRect.height - newTextRect.height ) / 2 );

  [textLayer setFontSize: fontsize];
  [textLayer setLineSpacing: parseInt(fontsize * 1.2)];

  setSize(labelLayer, newTextRect.width + 10, newTextRect.height + 10);
  setSize(textLayer, newTextRect.width, newTextRect.height);

  if (!dont){
    if (isWidth){
      if (labelRect.y > lineRect.y){
        offsetY = 0;
      }
      else if (labelRect.y + labelRect.height < lineRect.y){
        offsetY = textRect.height - newTextRect.height;
      }
    }
    else {
      if (labelRect.x > lineRect.x){
        offsetX = 0;
      }
      else if (labelRect.x + labelRect.width < lineRect.x){
        offsetX = textRect.width - newTextRect.width;
      }
    }
  }

  [[labelLayer frame] addX: offsetX]
  [[labelLayer frame] addY: offsetY]
  [[textLayer frame] addX: offsetX]
  [[textLayer frame] addY: offsetY]

  removeLayer(newTextLayer);

  [textLayer setIsSelected: 1];
  [textLayer setIsSelected: 0];
}

var resetStyle = function(group, basicColor, textColor, alpha){
  var layers = [[group layers] array],
      alpha = (alpha && !isNaN(alpha) && (alpha <= 1 || alpha >= 0))? alpha: 1;
  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(isText(layer)){
      setColor(layer, textColor, alpha);
    }
    else if(isShape(layer)){
      setColor(layer, basicColor, alpha);
    }
  };
}

var Reset = {
  Unit: function( type ){
    resetAllUnit([current layers], type);
  },
  Style: function( styles ){
    resetAllStyle([current layers], styles);
  }
}

