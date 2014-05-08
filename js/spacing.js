var spacing = function(side, isGap){
  var layers = selection,
    layer0, layer1,
    distanceTop, distanceRight, distanceBottom, distanceLeft,
    tempX, tempY, tempW, tempH, tempLayer;

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

    if(side && side == 'top'){
      if( distanceTop == 0 ) return false;
      tempLayer = addShape('temp');
      tempX = layer1X;
      tempY = layer0Y;
      tempW = layer1W;
      tempH = toPositive(distanceTop);

      if (layer0Y > layer1Y) tempY = layer1Y;

      if (isGap && layer1Y > layer0Y + layer0H){
        tempY = layer0Y + layer0H;
        tempH = tempH - layer0H;
      }
      else if(isGap && layer0Y > layer1Y + layer1H){
        tempY = layer1Y + layer1H;
        tempH = tempH - layer1H;
      }
    }
    else if(side && side == 'right'){
      if( distanceRight == 0 ) return false;
      tempLayer = addShape('temp');
      tempX = layer1X + layer1W;
      tempY = layer1Y;
      tempW = toPositive(distanceRight);
      tempH = layer1H;

      if (layer0X + layer0W < layer1X + layer1W) tempX = layer0X + layer0W;

      if (isGap && layer0X > layer1X + layer1W){
        tempX = layer1X + layer1W;
        tempW = tempW - layer0W;
      }
      else if (isGap && layer1X > layer0X + layer0W){
        tempW = tempW - layer1W;
      }
    }
    else if(side && side == 'bottom'){
      if( distanceBottom == 0 ) return false;
      tempLayer = addShape('temp');
      tempX = layer1X;
      tempY = layer1Y + layer1H;
      tempW = layer1W;
      tempH = toPositive(distanceBottom);

      if (layer0Y + layer0H < layer1Y + layer1H) tempY = layer0Y + layer0H;
    }
    else if(side && side == 'left'){
      if( distanceLeft == 0 ) return false;
      tempLayer = addShape('temp');
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
    if(side && (side == 'top' || side == 'bottom')) size.height('center', tempLayer);
    if(side && (side == 'right' || side == 'left')) size.width('middle', tempLayer);
    

    removeLayer(tempLayer);

}