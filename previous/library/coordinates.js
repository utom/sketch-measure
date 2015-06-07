var MeasureCoordinates = function(layer) {
    var timestamp = new Date().getTime(),
        boardRect = (artboard)? getRect(artboard): {x: 0, y: 0},
        rect = getRect(layer),
        group = addGroup('$COORDINATE' + timestamp),
        xline = addShape('xline', group),
        yline = addShape('yline', group),
        label = addShape('label', group),
        text = addText('text', group),
        fx = rect.x - boardRect.x,
        fy = rect.y - boardRect.y;

    [label setName: fx + ', ' + fy]

    setSize(xline, 15, 1);
    setSize(yline, 1, 15);

    [text setStringValue: updateLength( fx ) + ', ' + updateLength( fy )];
    [text setFontSize: configs.fontSize];
    [text setFontPostscriptName: configs.fontType];
    [text setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var textRect   = getRect(text),
        labelWidth  = textRect.width + 10,
        labelHeight = textRect.height + 10;

    setSize(label, labelWidth, labelHeight);

    setPosition(label, 3, 3);
    setPosition(text, 8, 8);
    setPosition(xline, -7, 0);
    setPosition(yline, 0, -7);

    setPosition(group, rect.x, rect.y, true);

    setColor(xline, configs.coordinateBasic);
    setColor(yline, configs.coordinateBasic);
    setColor(label, configs.coordinateBasic);
    setColor(text, configs.coordinateText);

    [text setIsSelected: 1];
    [text setIsSelected: 0];
  }
  SelectionCoordinates = function() {
    var layers = selection;
    if ([layers count] > 0) {
      for (var i = 0; i < [layers count]; i++) {
        var layer = layers[i];
        MeasureCoordinates(layer);
      }
    } else {
      alert("Make sure you've selected layers that.");
    }
  }