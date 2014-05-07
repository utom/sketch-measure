var page      = [doc currentPage],
    artboard  = [[doc currentPage] currentArtboard],
    current   = artboard? artboard: page;

var defaultConfig = {
      fontSize: 12,
      fontFill: '#FFFFFF',
      fontType: 'Helvetica',
      fill:     '#FF0000'
    },
    otherConfig = {
      fill: '#4A90E2'
    };

function each(layers, callback){
  var count = [layers count];
  for (var i = 0; i < count; i++){
    var layer = layers[i];
    callback.call(layer, layer, i);
  }
}

function addLayer(name, type, parent) {
  var parent = parent? parent: current,
      layer = [parent addLayerOfType: type];
  if (name) [layer setName: name];
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
  if(parent) [parent removeLayer: layer];
}

function getPosition(layer){
  var p = { x: 0, y: 0 },
      fn = function( layer ){
        p.x += [[layer frame] x];
        p.y += [[layer frame] y];
        if( [[layer parentGroup] class] == MSLayerGroup){
          fn([layer parentGroup]);
        }
      };

      fn(layer);

      return p;
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

function setColor(layer, hex){
  var fills = [[layer style] fills];
  if ( [fills count] <= 0 ) [fills addNewStylePart];
  var fill  = fills.array()[0],
      color = [fill color],
      rgb   = hexToRgb(hex),
      r     = parseInt(rgb.r / 255),
      g     = parseInt(rgb.g / 255),
      b     = parseInt(rgb.b / 255);

      [color setRed: r]
      [color setGreen: g]
      [color setBlue: b]
}

function toPositive(number){
  return (number < 0)? -(number): number;
}