var CreateLabel = function(layer, content, position, data, idname){
    var timestamp = new Date().getTime(),
        idname = (idname)? idname: 'LABEL',
        data = (data)? data: 'text',
        rect = getRect(layer),
        group = addGroup('$' + idname + timestamp),
        gap = addShape('gap', group),
        label = addShape(data, group),
        text = addText('text', group);

    [text setStringValue: content];
    [text setFontSize: configs.fontSize];
    [text setFontPostscriptName: configs.fontType];
    [text setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var textRect   = getRect(text),
        labelWidth  = textRect.width + 10,
        labelHeight = textRect.height + 10;

    setSize(label, labelWidth, labelHeight);
    setSize(gap, 8, 8);
    [gap setRotation: 45];

    setPosition(text, 5, 4);

    var gX     = Math.round(rect.x + (rect.width - labelWidth) / 2),
        gY     = Math.round(rect.y + (rect.height - labelHeight) / 2),
        gapX   = Math.round((labelWidth - 8) / 2),
        gapY   = Math.round((labelHeight - 8) / 2);

    if( position == 'top' ) {
      gapY = labelHeight - 4;
      gY   = rect.y - labelHeight - 6;
    }
    else if( position == 'right' ) {
      gapX = -4;
      gX   = rect.x + rect.width + 6;
    }
    else if( position == 'bottom' ) {
      gapY = -4;
      gY   = rect.y + rect.height + 6;
    }
    else if( position == 'left' ) {
      gapX = labelWidth - 4;
      gX   = rect.x - labelWidth - 6;
    }

    setPosition(text, 5, 5);
    setPosition(gap, gapX, gapY);
    setPosition(group, gX, gY, true);

    var basicColor = configs.labelBasic,
        textColor = configs.labelText;

    if(idname == 'PROPERTY'){
      basicColor = configs.propertyBasic;
      textColor = configs.propertyText;
    }

    setColor(gap, basicColor);
    setColor(label, basicColor);
    setColor(text, textColor);

    [text setIsSelected: 1];
    [text setIsSelected: 0];
}