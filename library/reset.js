var resetAllUnit = function(layers, type){
  var layers = [layers array];

  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i];

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

var resetUnit = function(group, type){
  var length, textLayer, labelLayer, textWidth, labelX, labelY, labelWidth, labelHeight,
      gapLayer, gapX, gapY, gapWidth, gapHeight,
      layers = [[group layers] array],
      groupName = [group name], textColor;
  for (var i = 0; i < [layers count]; i++) {
    var layer = layers[i],
        rect = getRect(layer),
        layerName = [layer name];

    if(/^(\-?\d+\,?\s?)*$/.exec(layerName)){
      var length = layerName.split(',');

      labelLayer = layer;
      labelX = rect.x;
      labelY = rect.y;
      labelWidth = rect.width;
      labelHeight = rect.height;

    }
    else if(/^gap$/.exec(layerName)){
      gapLayer = layer;

      gapX = rect.x;
      gapY = rect.y;
      gapWidth = rect.width;
      gapHeight = rect.height;
    }
    else if(isText(layer)){
      textLayer = layer;
      textWidth = rect.width;
    }
  };


  if (length){
    var newLength = [];

    for (var i = 0; i < length.length; i++) {
      newLength.push(parseFloat(length[i]));
    };

    length = newLength;

    var context = [textLayer stringValue],
        newContext = '',
        m = 0;


    context = context.replace(/\-?\d+[dxpst]{2}/g, function(match){
      match = updateLength(length[m], type);
      m++;
      return match;
    });

    context = context.replace(/size\:\s\-?\d+(dp)/, function(match){
      return match.replace('dp', 'sp');
    });

    var newTextLayer = addText('text', group),
        textRect = getRect(textLayer);

    [newTextLayer setStringValue: context];
    [newTextLayer setFontSize: configs.fontSize];
    [newTextLayer setFontPostscriptName: configs.fontType];
    [newTextLayer setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var newTextRect   = getRect(newTextLayer),
        newLabelWidth  = newTextRect.width + 10,
        offset = 0;

    [textLayer setStringValue: context];
    setSize(labelLayer, newLabelWidth, labelHeight);
    setSize(textLayer, newTextRect.width, newTextRect.height);

    if( !gapLayer || ( ( gapLayer && gapX > labelX ) && ( gapX + gapWidth ) < ( labelX + labelWidth ) ) ){
      offset = (labelWidth - newLabelWidth) / 2;
    }
    else if( gapLayer && ( gapX + gapWidth ) > ( labelX + labelWidth ) ){
      offset = ( labelWidth - newLabelWidth);
    }

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

