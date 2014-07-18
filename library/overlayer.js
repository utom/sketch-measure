var GetOverlayer = function(layer){
      var timestamp = new Date().getTime(),
          idname = (idname)? idname: 'OVERLAYER',
          rect = getRect(layer);
          group = addGroup('$' + idname + timestamp),
          overlayer = addShape('mask', group);
      setPosition(overlayer, rect.x, rect.y, true);
      setSize(overlayer, rect.width, rect.height);
      setColor(overlayer, configs.sizeBasic, .3);

      [overlayer setIsSelected: 1];
      [overlayer setIsSelected: 0];
    },
    Overlayer = function(){
    	var layers = selection;
        if ([layers count] > 0) {
          for (var i = 0; i < [layers count]; i++) {
            var layer = layers[i];
            GetOverlayer(layer);
          }
        } else {
          alert("Make sure you've selected layers that.");
        }
    }