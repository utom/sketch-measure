var page = [doc currentPage],
  artboard = [[doc currentPage] currentArtboard],
  current = artboard ? artboard : page,
  prefix = 'utom',
  configs = {},
  resolution = {
          'LDPI @0.75x (dp)': .75,
          'MDPI @1x (dp)': 1,
          'HDPI @1.5x (dp)': 1.5,
         'XHDPI @2x (dp)': 2,
        'XXHDPI @3x (dp)': 3,
       'XXXHDPI @4x (dp)': 4,
      'Standard @1x (px)': 1,
        'Retina @2x (pt)': 2
  };

function is(layer, theClass){
  var klass = [layer class];
  return klass === theClass;
}

function isGroup(layer){
  return is(layer, MSLayerGroup);
}

function isText(layer){
  return is(layer, MSTextLayer);
}

function isShape(layer){
  return is(layer, MSShapeGroup);
}

function addLayer(name, type, parent) {
  var parent = parent ? parent : current,
    layer = [parent addLayerOfType: type];
  if (name)[layer setName: name];
  return layer;
}

function addGroup(name, parent) {
  return addLayer(name, 'group', parent);
}

function addShape(name, parent) {
  return addLayer(name, 'rectangle', parent);
}

function addText(name, parent) {
  return addLayer(name, 'text', parent);
}

function removeLayer(layer) {
  var parent = [layer parentGroup];
  if (parent)[parent removeLayer: layer];
}

function setColor(layer, hex, alpha) {
  var color = [[MSColor alloc] init],
      rgb = hexToRgb(hex),
      red = rgb.r / 255,
      green = rgb.g / 255,
      blue = rgb.b / 255,
      alpha = (alpha && !isNaN(alpha) && (alpha <= 1 || alpha >= 0))? alpha: 1;

  [color setRed: red];
  [color setGreen: green];
  [color setBlue: blue];
  [color setAlpha: alpha];

  if( isText(layer) ) {
    [layer setTextColor: color];
  }
  else if( isShape(layer) ) {
    var fills = [[layer style] fills];
    if([fills count] <= 0) [fills addNewStylePart];
    [[[layer style] fill] setColor: color];
  }
}


function setSize(layer, width, height, absolute) {
  if(absolute){
    [[layer absoluteRect] setWidth: width];
    [[layer absoluteRect] setHeight: height];
  }
  else{
    [[layer frame] setWidth: width];
    [[layer frame] setHeight: height];
  }

  return layer;
}


function setPosition(layer, x, y, absolute) {
  if(absolute){
    [[layer absoluteRect] setX: x];
    [[layer absoluteRect] setY: y];
  }
  else{
    [[layer frame] setX: x];
    [[layer frame] setY: y];
  }

  return layer;
}

function getFrame(layer) {
  var frame = [layer frame];

  return {
    x: Math.round([frame x]),
    y: Math.round([frame y]),
    width: Math.round([frame width]),
    height: Math.round([frame height])
  };
}

function getRect(layer) {
  var rect = [layer absoluteRect];
  return {
    x: Math.round([rect x]),
    y: Math.round([rect y]),
    width: Math.round([rect width]),
    height: Math.round([rect height])
  };
}

function updateLength(length, scale){
  var scale = (scale)? scale: configs.resolution,
      length = Math.round(length / resolution[scale]),
        unit = (scale.match(/\(dp\)/))? 'dp' : 'px',
        unit = (scale.match(/\(pt\)/))? 'pt' : unit;

  return length + unit;
}

function toPositive(number) {
  return (number < 0) ? -(number) : number;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getIndex(items, content) {
  var index = 0;
  for (var i = 0; i < items.length; i++) {
    if(items[i] == content) index = i;
  };
  return index;
}

function getConfig(key) {
  var defaults = [NSUserDefaults standardUserDefaults];

  return [defaults objectForKey: '-' + prefix + '-' + key];
}

function setConfig(key, value) {
  var defaults = [NSUserDefaults standardUserDefaults],
      configs  = [NSMutableDictionary dictionary];

  [configs setObject: value forKey: '-' + prefix + '-' + key]

  return [defaults registerDefaults: configs];
}
function elementAtIndex (view, index) {
  return [view viewAtIndex: index]
}
function valueAtIndex (view, index) {
  var element = elementAtIndex(view, index);
  return [element stringValue]
}
function checkedAtIndex (view, index) {
  var element = elementAtIndex(view, index);
  return [element state]
}

function createAlertBase () {
  var alert = [COSAlertWindow new];

  [alert addButtonWithTitle: 'OK'];
  [alert addButtonWithTitle: 'Cancel'];

  return alert;
}

function alert (message) {
  var alert = [COSAlertWindow new];
  [alert setMessageText: 'Sketch Measure']
  [alert setInformativeText: message]
  [alert runModal]
}

function createSelect (items, selectedItemIndex) {
  selectedItemIndex = selectedItemIndex || 0
  var comboBox = [[NSComboBox alloc] initWithFrame: NSMakeRect(0, 0, 300, 25)];
  [comboBox addItemsWithObjectValues: items]
  [comboBox selectItemAtIndex: selectedItemIndex]
  return comboBox;
}

function creatCheckbox (item, checked) {
  checked = (checked == false)? NSOffState: NSOnState;
  var checkbox = [[NSButton alloc] initWithFrame: NSMakeRect(0, 0, 300, 25)];
  [checkbox setButtonType: NSSwitchButton]
  [checkbox setBezelStyle: 0]
  [checkbox setTitle: item.name]
  [checkbox setTag: item.value]
  [checkbox setState: checked]
  return checkbox;
}

function initConfigs(){
  var version = getConfig('version');
  if(!version){
    setConfig('version', '0.0.3.1');
    setConfig('resolution', 'Standard @1x (px)');
    setConfig('font-size', 12);
    setConfig('font-type', 'Helvetica');
    setConfig('size-basic', '#D0021B');
    setConfig('size-text', '#FFFFFF');
    setConfig('distance-basic', '#50E3C2');
    setConfig('distance-text', '#FFFFFF');
    setConfig('label-basic', '#7BD228');
    setConfig('label-text', '#FFFFFF');
    setConfig('property-basic', '#F5A623');
    setConfig('property-text', '#FFFFFF');
    setConfig('coordinate-basic', '#7ED321');
    setConfig('coordinate-text', '#FFFFFF');
    setConfig('remenber-size-width', 'top');
    setConfig('remenber-size-height', 'none');
    setConfig('remenber-size-overlayer', true);
    setConfig('remenber-spacing-top', true);
    setConfig('remenber-spacing-right', false);
    setConfig('remenber-spacing-bottom', false);
    setConfig('remenber-spacing-left', true);
    setConfig('remenber-property-font', false);
    setConfig('remenber-property-size', true);
    setConfig('remenber-property-color', true);
    setConfig('remenber-property-line', false);
    setConfig('remenber-property-border', false);
    setConfig('remenber-property-opacity', false);
    setConfig('remenber-property-at', 'top');
  }

  configs.version  = getConfig('version');
  configs.resolution  = getConfig('resolution');
  configs.fontSize = getConfig('font-size');
  configs.fontType = getConfig('font-type');
  configs.sizeBasic = getConfig('size-basic');
  configs.sizeText = getConfig('size-text');
  configs.distanceBasic = getConfig('distance-basic');
  configs.distanceText = getConfig('distance-text');
  configs.labelBasic = getConfig('label-basic');
  configs.labelText = getConfig('label-text');
  configs.propertyBasic = getConfig('property-basic');
  configs.propertyText = getConfig('property-text');
  configs.coordinateBasic = getConfig('coordinate-basic');
  configs.coordinateText = getConfig('coordinate-text');
  configs.remenberSizeWidth = getConfig('remenber-size-width');
  configs.remenberSizeHeight = getConfig('remenber-size-height');
  configs.remenberSizeOverlayer = getConfig('remenber-size-overlayer');
  configs.remenberSpacingTop = getConfig('remenber-spacing-top');
  configs.remenberSpacingRight = getConfig('remenber-spacing-right');
  configs.remenberSpacingBottom = getConfig('remenber-spacing-bottom');
  configs.remenberSpacingLeft = getConfig('remenber-spacing-left');
  configs.remenberPropertyFont = getConfig('remenber-property-font');
  configs.remenberPropertySize = getConfig('remenber-property-size');
  configs.remenberPropertyColor = getConfig('remenber-property-color');
  configs.remenberPropertyLine = getConfig('remenber-property-line');
  configs.remenberPropertyBorder = getConfig('remenber-property-border');
  configs.remenberPropertyOpacity = getConfig('remenber-property-opacity');
  configs.remenberPropertyAt = getConfig('remenber-property-at');
}

initConfigs();