var MeasureDistances = function( layers, mode, types ) {
      var r0 = getRect(layers[0]),
          r1 = getRect(layers[1]),
          tDist = r0.y - r1.y,
          rDist = (r0.x + r0.width) - (r1.x + r1.width),
          bDist = (r0.y + r0.height) - (r1.y + r1.height),
          lDist = r0.x - r1.x;

      if (mode == 'spacing') {
        for (var i = 0; i < types.length; i++) {

          if(types[i] == 'top'){
            if (tDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = r1.x,
                tY = r0.y,
                tW = r1.width,
                tH = toPositive(tDist);

            if (r0.y > r1.y) tY = r1.y;

            setPosition(tempLayer, tX, tY, true);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'height', 'center', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'right'){
            if (rDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = r1.x + r1.width,
                tY = r1.y,
                tW = toPositive(rDist),
                tH = r1.height;

            if (r0.x + r0.width < r1.x + r1.width) tX = r0.x + r0.width;

            setPosition(tempLayer, tX, tY, true);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'width', 'middle', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'bottom'){
            if (bDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = r1.x,
                tY = r1.y + r1.height,
                tW = r1.width,
                tH = toPositive(bDist);

            if (r0.y + r0.height < r1.y + r1.height) tY = r0.y + r0.height;

            setPosition(tempLayer, tX, tY, true);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'height', 'center', 'DISTANCE');
            removeLayer(tempLayer);
          }
          else if(types[i] == 'left') {
            if (lDist == 0) return false;
            var tempLayer = addShape('temp'),
                tX = r0.x,
                tY = r1.y,
                tW = toPositive(lDist),
                tH = r1.height;

            if (r0.x > r1.x) tX = r1.x;

            setPosition(tempLayer, tX, tY, true);
            setSize(tempLayer, tW, tH);

            MeasureSizes(tempLayer, 'width', 'middle', 'DISTANCE');
            removeLayer(tempLayer);
          };

        };
      }
      else if( mode == 'distance' ){

        if( tDist > 0 && tDist > r1.height ) {
          var hLayer = addShape('temp'),
              tX = r1.x,
              tY = r1.y + r1.height,
              tW = r1.width,
              tH = toPositive(tDist - r1.height);
        }
        else if( tDist < 0 && toPositive(tDist) > r0.height ) {
          var hLayer = addShape('temp'),
              tX = r1.x,
              tY = r0.y + r0.height,
              tW = r1.width,
              tH = toPositive(toPositive(tDist) - r0.height);
        }

        if(hLayer){
          setPosition(hLayer, tX, tY, true);
          setSize(hLayer, tW, tH);
          MeasureSizes(hLayer, 'height', 'center', 'DISTANCE');
          removeLayer(hLayer);
        }

        if( lDist > 0 && lDist > r1.width ) {
          var wLayer = addShape('temp'),
              tX = r1.x + r1.width,
              tY = r1.y,
              tW = lDist - r1.width,
              tH = r1.height;
        }
        else if( lDist < 0 && toPositive(lDist) > r0.width ) {
          var wLayer = addShape('temp'),
              tX = r0.x + r0.width,
              tY = r1.y,
              tW = toPositive(toPositive(lDist) - r0.width),
              tH = r1.height;
        }

        if(wLayer){
          setPosition(wLayer, tX, tY, true);
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
        alert("You must be selected only two layers that.");
      }

    };