var Measure = {
  width: function(){
    var layers = selection;

    if([layers count] == 1){
      MeasureSizes(selection[0], 'width', 'middle', 'DISTANCE');
      removeLayer(selection[0]);
    }
  },
  height: function(){
    var layers = selection;

    if([layers count] == 1){
      MeasureSizes(selection[0], 'height', 'center', 'DISTANCE');
      removeLayer(selection[0]);
    }
  }
}