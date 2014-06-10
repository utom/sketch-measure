var MeasureDistances = function( layers, mode, types ) {
      var f0 = getFrame(layers[0]),
          f1 = getFrame(layers[1]),
          tDist = f0.y - f1.y,
          rDist = (f0.x + f0.width) - (f1.x + f1.width),
          bDist = (f0.y + f0.height) - (f1.y + f1.height),
          lDist = f0.x - f1.x;

      if (mode == 'spacing') {
        for (var i = 0; i < types.length; i++) {

          if(types[i] == 'top'){
            if (tDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = f1.x,
                tY = f0.y,
                tW = f1.width,
                tH = toPositive(tDist);

            if (f0.y > f1.y) tY = f1.y;

            setPosition(tempLayer, tX, tY);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'height', 'center', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'right'){
            if (rDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = f1.x + f1.width,
                tY = f1.y,
                tW = toPositive(rDist),
                tH = f1.height;

            if (f0.x + f0.width < f1.x + f1.width) tX = f0.x + f0.width;

            setPosition(tempLayer, tX, tY);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'width', 'middle', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'bottom'){
            if (bDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = f1.x,
                tY = f1.y + f1.height,
                tW = f1.width,
                tH = toPositive(bDist);

            if (f0.y + f0.height < f1.y + f1.height) tY = f0.y + f0.height;

            setPosition(tempLayer, tX, tY);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'height', 'center', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'left') {
            if (lDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = f0.x,
                tY = f1.y,
                tW = toPositive(lDist),
                tH = f1.height;

            if (f0.x > f1.x) tX = f1.x;

            setPosition(tempLayer, tX, tY);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'width', 'middle', 'DISTANCE');
            removeLayer(tempLayer);
          };

        };
      }
      else if( mode == 'distance' ){
        if( tDist > 0 && toPositive(tDist) > f0.height ) {
          var hLayer = addShape('temp'),
              tX = f1.x,
              tY = f1.y + f1.height,
              tW = f1.width,
              tH = toPositive(tDist - f1.height);
        }
        else if( tDist < 0 && toPositive(tDist) > f1.height ) {
          var hLayer = addShape('temp'),
              tX = f1.x,
              tY = f0.y + f0.height,
              tW = f1.width,
              tH = toPositive(toPositive(tDist) - f0.height);
        }

        if(hLayer){
          setPosition(hLayer, tX, tY);
          setSize(hLayer, tW, tH);
          MeasureSizes(hLayer, 'height', 'center', 'DISTANCE');
          removeLayer(hLayer);
        }

        if( lDist > 0 && lDist > f1.width ) {
          var wLayer = addShape('temp'),
              tX = f1.x + f1.width,
              tY = f1.y,
              tW = lDist - f1.width,
              tH = f1.height;
        }
        else if( lDist < 0 && toPositive(lDist) > f0.width ) {
          var wLayer = addShape('temp'),
              tX = f0.x + f0.width,
              tY = f1.y,
              tW = toPositive(toPositive(lDist) - f0.width),
              tH = f1.height;
        }

        if(wLayer){
          setPosition(wLayer, tX, tY);
          setSize(wLayer, tW, tH);
          MeasureSizes(wLayer, 'width', 'middle', 'DISTANCE');
          removeLayer(wLayer);
        }
      }
    },
    SelectionDistances = function( mode, types ) {
      var layers = selection,
          types = (types instanceof Array)? types: [types];

      if ([layers count] && [layers count] < 3) {
        if(mode != 'distance' && [layers count] == 1){
          MeasureDistances( [current, layers[0]], mode, types );
        }
        else if([layers count] == 2) {
          MeasureDistances( [layers[0], layers[1]], mode, types );
        }
      } else {
        alert("Make sure you've selected layers that.");
      }

    };