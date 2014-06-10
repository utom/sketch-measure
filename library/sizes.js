var MeasureSizes = function(layer, mode, position, idname) {
    var timestamp = new Date().getTime(),
        idname = (idname)? idname: 'SIZE',
        frame = getFrame(layer),
        group = addGroup('$' + idname + timestamp),
        line = addShape('line', group),
        start = addShape('start-arrow', group),
        end = addShape('end-arrow', group),
        gap = addShape('gap', group),
        label = addShape('label', group),
        text = addText('text', group);

    if(mode == 'width') {
      [label setName: frame.width]

      setSize(line, frame.width, 1);
      setSize(start, 1, 7);
      setSize(end, 1, 7);
      setSize(gap, 8, 8);

      [text setStringValue: updateLength(frame.width)];
      [text setFontSize: configs.fontSize];
      [text setFontPostscriptName: configs.fontType];
      [text setLineSpacing: parseInt(configs.fontSize * 1.2)];
      [gap setRotation: 45];

      var textFrame   = getFrame(text),
          labelWidth  = textFrame.width + 10,
          labelHeight = textFrame.height + 10;

      setSize(label, labelWidth, labelHeight);

      var labelX = Math.round((frame.width - labelWidth) / 2),
          labelY = Math.round((7 - labelHeight) / 2),
          gapX   = Math.round(labelX + (labelWidth - 8) / 2),
          gapY   = Math.round(labelY + 5);

      if( labelWidth + 20 > frame.width ) {
        if( position == 'bottom' ) {
          labelY = labelY + labelHeight - 5;
          gapY   = Math.round(labelY - 4);
        }
        else {
          labelY = labelY - labelHeight + 5;
          gapY   = labelY + labelHeight - 5;
        }
      }

      setPosition(end, frame.width - 1, 0);
      setPosition(line, 0, 3);
      setPosition(label, labelX, labelY);
      setPosition(text, labelX + 5, labelY + 5);
      setPosition(gap, gapX, gapY);

      setPosition(group, frame.x, frame.y - 8);

      if( position == 'middle' ) {
       setPosition(group, frame.x, Math.round( frame.y + ( frame.height - 7 ) / 2 ) ); 
      }
      else if( position == 'bottom' ) {
        setPosition(group, frame.x, frame.y + frame.height + 1 );
      }
    }
    else if(mode == 'height'){
      [label setName: frame.height]

      setSize(line, 1, frame.height);
      setSize(start, 7, 1);
      setSize(end, 7, 1);
      setSize(gap, 8, 8);

      [text setStringValue: updateLength(frame.height)];
      [text setFontSize: configs.fontSize];
      [text setFontPostscriptName: configs.fontType];
      [text setLineSpacing: configs.fontSize];
      [gap setRotation: 45];

      var textFrame   = getFrame(text),
          labelWidth  = textFrame.width + 10,
          labelHeight = textFrame.height + 10;

      setSize(label, labelWidth, labelHeight);

      var labelX = Math.round((7 - labelWidth) / 2),
          labelY = Math.round((frame.height - labelHeight) / 2),
          gapX   = Math.round(labelX + 5),
          gapY   = Math.round(labelY + (labelHeight - 8) / 2);

      if( labelHeight + 20 > frame.height ) {
        if( position == 'right' ) {
          labelX =  11;
          gapX   = Math.round(labelX - 4);
        }
        else {
          labelX = 0 - labelWidth - 4;
          gapX   = labelX + labelWidth - 4;
        }
      }

      setPosition(end, 0, frame.height - 1);
      setPosition(line, 3, 0);
      setPosition(label, labelX, labelY);
      setPosition(text, labelX + 5, labelY + 6);
      setPosition(gap, gapX, gapY);

      setPosition(group, frame.x - 8, frame.y);

      if( position == 'center' ) {
       setPosition(group, Math.round( frame.x + ( frame.width - 7 ) / 2 ),  frame.y); 
      }
      else if( position == 'right' ) {
        setPosition(group, frame.x + frame.width + 1, frame.y );
      }
    }

    basicColor = configs.sizeBasic;
    textColor = configs.sizeText;

    if( idname == 'DISTANCE' ){
      basicColor = configs.distanceBasic;
      textColof = configs.distanceText;
    }

    setColor(line, basicColor);
    setColor(start, basicColor);
    setColor(end, basicColor);
    setColor(gap, basicColor);
    setColor(label, basicColor);
    setColor(text, textColor);

    [text setIsSelected: 1];
    [text setIsSelected: 0];
  },
  SelectionSizes = function(mode, position) {
    var layers = selection;
    if ([layers count] > 0) {
      for (var i = 0; i < [layers count]; i++) {
        var layer = layers[i];
        MeasureSizes(layer, mode, position);
      }
    } else {
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  };