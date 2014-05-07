var spacing = function(position){
  var layers = selection,
    layer0, layer1,
    distanceTop, distanceRight, distanceBottom, distanceLeft,
    tempX, tempY, tempWidth, tempHeight, tempLayer = addShape('temp');

  if( [layers count] == 1 && [current class] == MSArtboardGroup ){
    layer0 = current;
    layer1 = layers[0];
  }
  else if( [layers count] == 2 ){
    layer0 = layers[0];
    layer1 = layers[1];
  }
  else{
    return false;
  }

  distanceTop    = [[layer0 frame] y] - [[layer1 frame] y];
  distanceRight  = ([[layer0 frame] x] + [[layer0 frame] width]) - ([[layer1 frame] x] + [[layer1 frame] width]);
  distanceBottom = ([[layer0 frame] y] + [[layer0 frame] height]) - ([[layer1 frame] y] + [[layer1 frame] height]);
  distanceLeft   = [[layer0 frame] x] - [[layer1 frame] x];


log(distanceTop);
log(distanceRight);
log(distanceBottom);
log(distanceLeft);
    // if( [layer class] == MSArtboardGroup ){
    //   lTemp.x = 0;
    //   lTemp.y = 0;
    // }
}