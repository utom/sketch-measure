var tip = function(gapPosition, text, content){
    if ([text class] != MSTextLayer) {
        return false;
    }
	var timestamp     = parseInt(new Date().getTime() / 1000),
        content       = content? '-' + content: '';

    var group = addGroup('$GUIDE' + timestamp),
        gap   = addShape('gap', group),
        label = addShape('label' + content, group);

    removeLayer(text);
    [group addLayer: text]

    var gapFrame = [gap frame];
    [gapFrame setWidth: 8];
    [gapFrame setHeight: 8];
    [gap setRotation: 45];

    [text setFontSize: defaultConfig.fontSize];
    [text setFontPostscriptName: defaultConfig.fontType];
    [text setLineSpacing: parseInt(defaultConfig.fontSize * 1.2)];

    setColor(gap, defaultConfig.fill);
    setColor(label, defaultConfig.fill);
    setColor(text, defaultConfig.fontFill);

    [[label frame] setWidth: [[text frame] width] + 10]
    [[label frame] setHeight: [[text frame] height] + 11]
    [[label frame] setX: [[text frame] x] - 5];
    [[label frame] setY: [[text frame] y] - 5];

    if(gapPosition && gapPosition == 'top'){
        [[gap frame] setX: [[text frame] x] + 3];
        [[gap frame] setY: [[text frame] y] - 8];
    }
    else if(gapPosition && gapPosition == 'right'){
        [[gap frame] setX: [[text frame] x] + [[text frame] width]];
        [[gap frame] setY: [[text frame] y] + 3];
    }
    else if(gapPosition && gapPosition == 'bottom'){
        [[gap frame] setX: [[text frame] x] + 3];
        [[gap frame] setY: [[text frame] y] + [[text frame] height]];
    }
    else if(gapPosition && gapPosition == 'left'){
        [[gap frame] setX: [[text frame] x] - 8];
        [[gap frame] setY: [[text frame] y] + 3];
    }

    [label setIsSelected: 1];
    [label setIsSelected: 0];
    [text setIsSelected: 0];

    return group;
}