Array.prototype.each = function(callback){
  var count = 0;
  for (var i = 0; i < this.length(); i++){
    var el = this[i];
    callback.call(this,el,count);
    count++;
  }
}

var alert = function(msg, title) {
  if (title == undefined) { title = "Whoops" };
  var app = NSApplication.sharedApplication();
  app.displayDialog(msg).withTitle(title);
},MUGlobal = {
  currentArtboard: doc.currentPage().currentArtboard(),
  color: { r: 1, g: 0, b: 0 },
  font: {
    size: 12,
    family: 'Helvetica',
    color: { r: 1, g: 1, b: 1 }
  }
},Measure = {

  init: function(){
    this.Measure = this.getMeasure();
    if( !this.Measure ){
      this.Measure = MUGlobal.currentArtboard.addLayerOfType('group');
      this.Measure.name = '_measure';
      this.Measure.setIsLocked( true );
    }
  },
  getMeasure: function(){
    var groups = [],
        current = MUGlobal.currentArtboard;
        layers = current.layers();

    layers.each(function(layer){
      if( layer.class() == MSLayerGroup && layer.name().toString() == '_measure' ){
        groups.push(layer);
      }
    });

    return groups[0];
  },
  setColor: function( el, r, g, b ){
    if( el.style().fills().length() <= 0 ){
      el.style().fills().addNewStylePart();
    }
    var color = el.style().fills()[0].color();

    color.setRed( r );
    color.setGreen( g );
    color.setBlue( b );
  },
  createGuide: function(){
    var guide = {};

    guide.group = this.getMeasure().addLayerOfType('group');

    guide.gap = guide.group.addLayerOfType('rectangle');
    guide.gap.name = 'gap';
    guide.gap.frame().setWidth(8);
    guide.gap.frame().setHeight(8);
    guide.gap.setRotation(45);
    guide.gap.style().fills().addNewStylePart();
    this.setColor( guide.gap, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.line = guide.group.addLayerOfType('rectangle');
    guide.line.name = 'line';
    this.setColor( guide.line, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.startArrow = guide.group.addLayerOfType('rectangle');
    guide.startArrow.name = 'start-arrow';
    this.setColor( guide.startArrow, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.endArrow = guide.group.addLayerOfType('rectangle');
    guide.endArrow.name = 'end-arrow';
    this.setColor( guide.endArrow, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.label = guide.group.addLayerOfType('rectangle');
    guide.label.name = 'label';
    this.setColor( guide.label, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    return guide;
  },
  addLabel: function( guide, length ){
    guide.text = guide.group.addLayerOfType('text');
    guide.text.setStringValue( length + ' px');
    guide.text.setFontSize( MUGlobal.font.size );
    guide.text.setFontPostscriptName( MUGlobal.font.family );
    this.setColor( guide.text, MUGlobal.font.color.r, MUGlobal.font.color.g, MUGlobal.font.color.b );

    guide.text.frame().setX(5);
    guide.text.frame().setY(5);

    guide.label.frame().setWidth( guide.text.frame().width() + 10 );
    guide.label.frame().setHeight( MUGlobal.font.size + 11 );
    return guide;
  },
  horizontal: function( position ){
    var self = this;
    if (selection.length() > 0) {
      var selectLayer = selection[0],
          guide = self.createGuide(),
          width = selectLayer.frame().width(),
          height = selectLayer.frame().height(),
          x = selectLayer.frame().x(),
          y = selectLayer.frame().y();

      guide = self.addLabel( guide, width );

      var labelWidth = guide.label.frame().width(),
          labelHeight = guide.label.frame().height();

      var arrowWidth = 1,
          arrowHeight = 7,
          labelX = parseInt(x + (width - labelWidth) / 2),
          labelY = parseInt(y - ( labelHeight + arrowHeight ) / 2 - 2 );

      if( position && position == 'middle' ){
        labelY = parseInt( y - ( labelHeight - height ) / 2 );
      }
      else if( position && position == 'bottom' ){
        labelY = parseInt( y - (labelHeight - arrowHeight) / 2 + height + 2 );
      }

      var gapX = labelX + 10,
          gapY = labelY + 10,
          lineWidth = width,
          lineHeight = 1,
          lineX = x + 0,
          lineY = parseInt(labelY + labelHeight / 2),
          startArrowX = x,
          startArrowY = lineY - 3,
          endArrowX = startArrowX + width - 1,
          endArrowY = startArrowY;

      if( labelWidth > lineWidth ){
        labelY = parseInt( labelY - (labelHeight + arrowHeight) / 2 - 4 );
        gapX = parseInt( labelX + (labelWidth - 8) / 2 );
        gapY = parseInt( labelY + labelHeight - 4 );

        if( position && position == 'bottom' ){
          labelY = parseInt( y + height + 13 );
          gapY = parseInt( labelY - 4 );
        }
      }

      guide.text.frame().addX( labelX );
      guide.text.frame().addY( labelY );

      guide.label.frame().setX( labelX );
      guide.label.frame().setY( labelY );

      guide.gap.frame().setX( gapX );
      guide.gap.frame().setY( gapY );

      guide.line.frame().setWidth( lineWidth );
      guide.line.frame().setHeight( lineHeight );

      guide.line.frame().setX( lineX );
      guide.line.frame().setY( lineY );

      guide.startArrow.frame().setWidth( arrowWidth );
      guide.startArrow.frame().setHeight( arrowHeight );
      guide.startArrow.frame().setX( startArrowX );
      guide.startArrow.frame().setY( startArrowY );

      guide.endArrow.frame().setWidth( arrowWidth );
      guide.endArrow.frame().setHeight( arrowHeight );
      guide.endArrow.frame().setX( endArrowX );
      guide.endArrow.frame().setY( endArrowY );

    }
    else{
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  },
  vertical: function( position ){
    var self = this;
    if (selection.length() > 0) {
      var selectLayer = selection[0],
          guide = self.createGuide(),
          width = selectLayer.frame().width(),
          height = selectLayer.frame().height(),
          x = selectLayer.frame().x(),
          y = selectLayer.frame().y();

      guide = self.addLabel( guide, height );

      var labelWidth = guide.label.frame().width(),
          labelHeight = guide.label.frame().height();

      var arrowWidth = 7,
          arrowHeight = 1,
          labelX = parseInt(x - ( labelWidth + arrowWidth ) / 2 - 2),
          labelY = parseInt(y + ( height - labelHeight) / 2);

      if( position && position == 'center' ){
        labelX = parseInt( x - ( labelWidth - width ) / 2 );
      }
      else if( position && position == 'right' ){
        labelX = parseInt( x - (labelWidth - arrowWidth) / 2 + width + 2 );
      }

      var gapX = labelX + 10,
          gapY = labelY + 10,
          lineWidth = 1,
          lineHeight = height,
          lineX = parseInt(labelX + labelWidth / 2),
          lineY = y + 0,
          startArrowX = lineX - 3,
          startArrowY = y,
          endArrowX = startArrowX,
          endArrowY = startArrowY + height - 1;

      if( labelHeight > lineHeight ){
        labelX = parseInt( labelX - (labelWidth + arrowWidth) / 2 - 4 );
        gapX = parseInt( labelX + labelWidth - 4 );
        gapY = parseInt( labelY + (labelHeight - 8) / 2 );

        if( position && position == 'right' ){
          labelX = parseInt( x + width + 13 );
          gapX = parseInt( labelX - 4 );
        }
      }

      guide.text.frame().addX( labelX );
      guide.text.frame().addY( labelY );

      guide.label.frame().setX( labelX );
      guide.label.frame().setY( labelY );

      guide.gap.frame().setX( gapX );
      guide.gap.frame().setY( gapY );

      guide.line.frame().setWidth( lineWidth );
      guide.line.frame().setHeight( lineHeight );

      guide.line.frame().setX( lineX );
      guide.line.frame().setY( lineY );

      guide.startArrow.frame().setWidth( arrowWidth );
      guide.startArrow.frame().setHeight( arrowHeight );
      guide.startArrow.frame().setX( startArrowX );
      guide.startArrow.frame().setY( startArrowY );

      guide.endArrow.frame().setWidth( arrowWidth );
      guide.endArrow.frame().setHeight( arrowHeight );
      guide.endArrow.frame().setX( endArrowX );
      guide.endArrow.frame().setY( endArrowY );

    }
    else{
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  }
};
