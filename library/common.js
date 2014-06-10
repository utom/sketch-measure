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
        'Retina @2x (px)': 2
  };

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

function setColor(layer, hex) {
  var fills = [[layer style] fills];

  if([fills count] <= 0){
    [fills addNewStylePart]
  }

  fills = [[layer style] fills].array();
  var fill = fills[0],
      color = [fill color],
      rgb = hexToRgb(hex),
      r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
  [color setRed: r];
  [color setGreen: g];
  [color setBlue: b];
}

function getSize(layer) {
  var s = {
    width : 0,
    height: 0
  };

  s.width  = [[layer frame] width];
  s.height = [[layer frame] height];

  return s;
}

function setSize(layer, width, height) {
  [[layer frame] setWidth: width];
  [[layer frame] setHeight: height];

  return layer;
}

function getPosition(layer) {
  var p = {
    x: 0,
    y: 0
  },
  fn = function(layer) {
    p.x += [[layer frame] x];
    p.y += [[layer frame] y];
    if ([[layer parentGroup] class] == MSLayerGroup) {
      fn([layer parentGroup]);
    }
  };

  if( [layer class] != MSArtboardGroup ){
    fn(layer);
  }

  return p;
}

function setPosition(layer, x, y) {
  [[layer frame] setX: x];
  [[layer frame] setY: y];

  return layer;
}

function getFrame(layer) {
  var s = getSize(layer),
      p = getPosition(layer);

  return {
    x     : p.x,
    y     : p.y,
    width : s.width,
    height: s.height
  }
}

function updateLength(length, scale){
  var scale = (scale)? scale: configs.resolution,
      length = Math.round(length / resolution[scale]),
        unit = (scale.match(/\(dp\)/))? 'dp' : 'px';
// log(configs.resolution.match(/DPI/));
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
    setConfig('version', '0.0.3');
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
    setConfig('remenber-size-width', 'top');
    setConfig('remenber-size-height', 'none');
    setConfig('remenber-spacing-top', true);
    setConfig('remenber-spacing-right', false);
    setConfig('remenber-spacing-bottom', false);
    setConfig('remenber-spacing-left', true);
    setConfig('remenber-property-font', false);
    setConfig('remenber-property-size', true);
    setConfig('remenber-property-color', true);
    setConfig('remenber-property-line', false);
    setConfig('remenber-property-border', false);
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
  configs.remenberSizeWidth = getConfig('remenber-size-width');
  configs.remenberSizeHeight = getConfig('remenber-size-height');
  configs.remenberSpacingTop = getConfig('remenber-spacing-top');
  configs.remenberSpacingRight = getConfig('remenber-spacing-right');
  configs.remenberSpacingBottom = getConfig('remenber-spacing-bottom');
  configs.remenberSpacingLeft = getConfig('remenber-spacing-left');
  configs.remenberPropertyFont = getConfig('remenber-property-font');
  configs.remenberPropertySize = getConfig('remenber-property-size');
  configs.remenberPropertyColor = getConfig('remenber-property-color');
  configs.remenberPropertyLine = getConfig('remenber-property-line');
  configs.remenberPropertyBorder = getConfig('remenber-property-border');
  configs.remenberPropertyAt = getConfig('remenber-property-at');
}

initConfigs();