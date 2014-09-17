var Get = {
  width: function(){
    var layers = selection;

    if([layers count] == 1){
      MeasureSizes(layers[0], 'width', 'middle', 'WIDTH');
      removeLayer(layers[0]);
    }
  },
  height: function(){
    var layers = selection;

    if([layers count] == 1){
      MeasureSizes(layers[0], 'height', 'center', 'HEIGHT');
      removeLayer(layers[0]);
    }
  },
  label: function(){
    var layers = selection;

    if( [layers count] == 1 ){
      var layer = layers[0],
          parent = (isText(layer))? [layer parentGroup]: layer;

      if ( /\$PROPERTY|\$LABEL/.exec([parent name]) && isGroup(parent) ){
        ResetLabel(layer);
      }
      else if(isText(layer)){
        CreateLabel(layer, layer.stringValue(), 'none', 'label', 'LABEL');
        removeLayer(layer);
      }
    }
  }
}