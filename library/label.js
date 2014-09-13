var CreateLabel = function(layer, content, position, data, idname){
    var timestamp = new Date().getTime(),
        idname = (idname)? idname: 'LABEL',
        data = (data)? data: 'text',
        rect = getRect(layer),
        group = addGroup('$' + idname + timestamp),
        label = addShape('' + data, group),
        text = addText('text', group);

    [text setStringValue: content];
    [text setFontSize: configs.fontSize];
    [text setFontPostscriptName: configs.fontType];
    [text setLineSpacing: parseInt(configs.fontSize * 1.2)];

    var textRect   = getRect(text),
        labelWidth  = textRect.width + 10,
        labelHeight = textRect.height + 10;

    setSize(label, labelWidth, labelHeight);

    setPosition(text, 5, 4);

    var gX     = Math.round(rect.x + (rect.width - labelWidth) / 2),
        gY     = Math.round(rect.y + (rect.height - labelHeight) / 2);

    if( position == 'top' ) {
      gY   = rect.y - labelHeight - 6;
    }
    else if( position == 'right' ) {
      gX   = rect.x + rect.width + 6;
    }
    else if( position == 'bottom' ) {
      gY   = rect.y + rect.height + 6;
    }
    else if( position == 'left' ) {
      gX   = rect.x - labelWidth - 6;
    }

    setPosition(text, 5, 5);
    setPosition(group, gX, gY, true);

    var basicColor = configs.labelBasic,
        textColor = configs.labelText;

    if(idname == 'PROPERTY'){
      basicColor = configs.propertyBasic;
      textColor = configs.propertyText;
    }

    setColor(label, basicColor);
    setColor(text, textColor);

    [text setIsSelected: 1];
    [text setIsSelected: 0];
}