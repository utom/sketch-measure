var resetAllUnit = function(layers, type){
  var layers = [layers array];

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(
      isGroup(layer) &&
      /\$SIZE|\$DISTANCE|\$PROPERTY/.exec([layer name])
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
      groupName = [group name], textColor;
  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i],
        frame = getFrame(layer),
        layerName = [layer name];

    if(/^\d+$/.exec(layerName)){
      length = layerName;
      labelLayer = layer;
      labelWidth = frame.width;
      labelHeight = frame.height;
    }
    else if(isText(layer)){
      textLayer = layer;
      textWidth = frame.width;
    }
  };

  if(labelLayer){
    var text = textLayer.stringValue().replace( /(\d+[dxps]{2})/g, updateLength(length, type)),
        newTextLayer = addText('text', group),
        textFrame = getFrame(textLayer);

    [newTextLayer setStringValue: text];
    [newTextLayer setFontSize: configs.fontSize];
    [newTextLayer setFontPostscriptName: configs.fontType];
    [newTextLayer setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var newTextFrame   = getFrame(newTextLayer),
        newLabelWidth  = newTextFrame.width + 10,
        offset = (labelWidth - newLabelWidth) / 2;

    [textLayer setStringValue: text];
    setSize(labelLayer, newLabelWidth, labelHeight);
    setSize(textLayer, newTextFrame.width, newTextFrame.height);

    [[labelLayer frame] addX: offset]
    [[textLayer frame] addX: offset]

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
      /\$SIZE|\$DISTANCE|\$PROPERTY/.exec([layer name])
    ){
      if( 
        styles.size &&
        /\$SIZE/.exec([layer name])
      ){
        resetStyle(layer, styles.size.basic, styles.size.text);
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
    }
    else if( isGroup(layer) ){
      resetAllStyle([layer layers], type, basicColor, textColor);
    }
  };
}

var resetStyle = function(group, basicColor, textColor){
  var layers = [[group layers] array];
  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];
    if(isText(layer)){
      setColor(layer, textColor);
    }
    else if(isShape(layer)){
      setColor(layer, basicColor);
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

