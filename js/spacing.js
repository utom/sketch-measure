var spacing = function(position){
  var layers = selection,
    layer0, layer1,
    distanceTop, distanceRight, distanceBottom, distanceLeft,
    tempX, tempY, tempW, tempH, tempLayer = addShape('temp');

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

  var layer0Position = getPosition(layer0),
      layer0X        = layer0Position.x,
      layer0Y        = layer0Position.y,
      layer0W        = [[layer0 frame] width],
      layer0H        = [[layer0 frame] height],

      layer1Position = getPosition(layer1),
      layer1X        = layer1Position.x,
      layer1Y        = layer1Position.y,
      layer1W        = [[layer1 frame] width],
      layer1H        = [[layer1 frame] height];

  distanceTop    = layer0Y - layer1Y;
  distanceRight  = (layer0X + layer0W) - (layer1X + layer1W);
  distanceBottom = (layer0Y + layer0H) - (layer1Y + layer1H);
  distanceLeft   = layer0X - layer1X;

    if(position && position == 'top'){
      if( distanceTop == 0 ) removeLayer(tempLayer); return false;
      tempX = layer1X;
      tempY = layer0Y;
      tempW = layer1W;
      tempH = toPositive(distanceTop);

      if (layer0Y > layer1Y) tempY = layer1Y;
    }
    else if(position && position == 'right'){
      if( distanceRight == 0 ) removeLayer(tempLayer); return false;
      tempX = layer1X + layer1W;
      tempY = layer1Y;
      tempW = toPositive(distanceRight);
      tempH = layer1H;

      if (layer0X + layer0W < layer1X + layer1W) tempX = layer0X + layer0W;
    }
    else if(position && position == 'bottom'){
      if( distanceBottom == 0 ) removeLayer(tempLayer); return false;
      tempX = layer1X;
      tempY = layer1Y + layer1H;
      tempW = layer1W;
      tempH = toPositive(distanceBottom);

      if (layer0Y + layer0H < layer1Y + layer1H) tempY = layer0Y + layer0H;
    }
    else if(position && position == 'left'){
      if( distanceLeft == 0 ) removeLayer(tempLayer); return false;
      tempX = layer0X;
      tempY = layer1Y;
      tempW = toPositive(distanceRight);
      tempH = layer1H;

      if (layer0X > layer1X) tempX = layer1X;
    }

    [[tempLayer frame] setX: tempX];
    [[tempLayer frame] setY: tempY];
    [[tempLayer frame] setWidth: tempW];
    [[tempLayer frame] setHeight: tempH];
    if(position && (position == 'top' || position == 'bottom')) size.height('center', tempLayer);
    if(position && (position == 'right' || position == 'left')) size.width('middle', tempLayer);
    

    removeLayer(tempLayer);

}