var Size = {
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
          if (position && position == 'left') {
            [[labelGroup frame] addX: parseInt(labelWidth / 2 + 7)];
            [gapFrame addX: parseInt(0 - 3 - 10)];
          } else {
            [[labelGroup frame] addX: parseInt(0 - 7 - labelWidth / 2)];
            [gapFrame addX: parseInt(labelWidth - 5 - 10)];
          }
        }

        if (position && position == 'center') {
          offset = parseInt((width - 7) / 2);
        } else if (position && position == 'left') {
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