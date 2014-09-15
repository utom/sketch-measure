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

    if( [layers count] == 1 && isText(layers[0]) ){
      CreateLabel(layers[0], layers[0].stringValue(), 'none', 'label', 'LABEL');
      removeLayer(layers[0]);
    }
  }
}