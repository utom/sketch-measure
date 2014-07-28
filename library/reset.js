var resetAllUnit = function(layers, type){
  var layers = [layers array];

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(
      isGroup(layer) &&
      /\$SIZE|\$DISTANCE|\$PROPERTY|\$COORDINATE/.exec([layer name])
    ){
      resetUnit(layer, type);
    }
    else if( isGroup(layer) ){
      resetAllUnit([layer layers], type);
    }
  };
}

var resetUnit = function(group, type){
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
log(groupName + layerName);
log(isArrayLength);
  if(labelLayer){
    var text = (isArrayLength)? updateLength(length[0], type) + ', ' + updateLength(length[1], type): textLayer.stringValue().replace( /(\d+[dxps]{2})/g, updateLength(length, type)),
        newTextLayer = addText('text', group),
        textRect = getRect(textLayer);
log(text);
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

    if (typeof length != 'object') {
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
      /\$SIZE|\$DISTANCE|\$PROPERTY|\$OVERLAYER|\$COORDINATE/.exec([layer name])
    ){
      if( 
        styles.size &&
        /\$SIZE/.exec([layer name])
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
        /\$PROPERTY/.exec([layer name])
      ){

        resetStyle(layer, styles.property.basic, styles.property.text);
      }

      if( 
        styles.coordinate &&
        /\$COORDINATE/.exec([layer name])
      ){

        resetStyle(layer, styles.coordinate.basic, styles.coordinate.text);
      }
    }
    else if( isGroup(layer) ){
      resetAllStyle([layer layers], styles);
    }
  };
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

