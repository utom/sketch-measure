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
  current: ( doc.currentPage().currentArtboard() )? doc.currentPage().currentArtboard(): doc.currentPage(),
  color: { r: 1, g: 0, b: 0 },
  font: {
    size: 12,
    family: 'Helvetica',
    color: { r: 1, g: 1, b: 1 }
  }
},Measure = {
  Guides: [],
  Attrs: [],
  setColor: function( el, r, g, b ){
    if( el.style().fills().length() <= 0 ){
      el.style().fills().addNewStylePart();
    }
    var color = el.style().fills()[0].color();

    color.setRed( r );
    color.setGreen( g );
    color.setBlue( b );
  },
  getPosition: function( layer ){
    var postion = { x: 0, y: 0 },
        getPostion = function( layer ){
          postion.x += layer.frame().x();
          postion.y += layer.frame().y();
          if(layer.parentGroup().class() == MSLayerGroup){
            getPostion(layer.parentGroup());
          }
        };
    getPostion( layer );
    return postion;
  },
  createGuide: function(){
    var guide = {},
        current = MUGlobal.current;

    guide.group = current.addLayerOfType('group');
    guide.group.name = 'Guide-' + ( new Date().getTime() );

    current = guide.group;

    guide.gap = current.addLayerOfType('rectangle');
    guide.gap.name = 'gap';
    guide.gap.frame().setWidth(8);
    guide.gap.frame().setHeight(8);
    guide.gap.setRotation(45);
    guide.gap.style().fills().addNewStylePart();
    this.setColor( guide.gap, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.line = current.addLayerOfType('rectangle');
    guide.line.name = 'line';
    this.setColor( guide.line, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.startArrow = current.addLayerOfType('rectangle');
    guide.startArrow.name = 'start-arrow';
    this.setColor( guide.startArrow, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.endArrow = current.addLayerOfType('rectangle');
    guide.endArrow.name = 'end-arrow';
    this.setColor( guide.endArrow, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    guide.label = current.addLayerOfType('rectangle');
    guide.label.name = 'label';
    this.setColor( guide.label, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

    return guide;
  },
  addLabel: function( guide, length ){
    var current = guide.group;

    guide.text = current.addLayerOfType('text');
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
  setAttr: function( i ){
    var self = this,
        label = self.Attrs[i].label,
        line = self.Attrs[i].line,
        arrow = self.Attrs[i].arrow,
        gap = self.Attrs[i].gap,
        guide = self.Guides[i],
        current = MUGlobal.currentArtboard;

    guide.label.frame().setWidth( label.width );
    guide.label.frame().setHeight( label.height );
    guide.label.frame().setX( label.x );
    guide.label.frame().setY( label.y );

    guide.text.frame().addX( label.x );
    guide.text.frame().addY( label.y );

    guide.line.frame().setWidth( line.width );
    guide.line.frame().setHeight( line.height );
    guide.line.frame().setX( line.x );
    guide.line.frame().setY( line.y );

    guide.startArrow.frame().setWidth( arrow.width );
    guide.startArrow.frame().setHeight( arrow.height );
    guide.startArrow.frame().setX( arrow.start.x );
    guide.startArrow.frame().setY( arrow.start.y );

    guide.endArrow.frame().setWidth( arrow.width );
    guide.endArrow.frame().setHeight( arrow.height );
    guide.endArrow.frame().setX( arrow.end.x );
    guide.endArrow.frame().setY( arrow.end.y );

    guide.gap.frame().setX( gap.x );
    guide.gap.frame().setY( gap.y );

    selection[i].setIsSelected( 0 );
    guide.text.setIsSelected( 1 );
    guide.text.setIsSelected( 0 );
    guide.group.setIsSelected( 1 );
  },
  width: function( position ){
    var self = this;

    if (selection.length() > 0) {
      selection.each(function( selectLayer, i ){
        var i = i,
            selectLayer = selectLayer,
            width = selectLayer.frame().width(),
            height = selectLayer.frame().height(),
            layerPostion = self.getPosition(selectLayer),
            x = layerPostion.x,
            y = layerPostion.y,
            label = {},
            text = {},
            line = {},
            arrow = {},
            gap = {},
            guide = self.createGuide();

        arrow.start = {};
        arrow.end = {};

        guide = self.addLabel( guide, width );

        arrow.width = 1;
        arrow.height = 7;
        label.width = guide.label.frame().width();
        label.height = guide.label.frame().height();
        label.x = parseInt( x + ( width - label.width ) / 2 );
        label.y = parseInt( y - ( label.height + arrow.height ) / 2 - 1 );

        if( position && position == 'middle' ){
          label.y = parseInt( y - ( label.height - height ) / 2 );
        }
        else if( position && position == 'bottom' ){
          label.y = parseInt( y + height - label.height + ( label.height + arrow.height ) / 2 + 1 );
        }

        line.width = width;
        line.height = 1;
        line.x = x;
        line.y = parseInt( label.y + label.height / 2 );

        arrow.start.x = x;
        arrow.start.y = parseInt( label.y + ( label.height - arrow.height ) / 2 );
        arrow.end.x = arrow.start.x + width - 1;
        arrow.end.y = arrow.start.y;

        gap.x = label.x + 10;
        gap.y = label.y + 10;

        if( ( label.width + 20 ) > width ){
          gap.x = parseInt( x + ( width - 8 ) / 2 );
          if( position && position == 'bottom' ){
            label.y = parseInt( label.y + label.height - 8 / 2 );
            gap.y = parseInt( label.y - 4 );
          }
          else{
            label.y = parseInt( label.y - label.height + 8 / 2 );
            gap.y = parseInt( label.y + label.height - 6 );
          }
        }

        self.Attrs[i] = {
          label: label,
          line: line,
          arrow: arrow,
          gap: gap
        };

        self.Guides[i] = guide;

        self.setAttr(i);
      });

    }
    else{
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  },
  height: function( position ){
    var self = this;

    if (selection.length() > 0) {
      selection.each(function( selectLayer, i ){
        var i = i,
            selectLayer = selectLayer,
            width = selectLayer.frame().width(),
            height = selectLayer.frame().height(),
            layerPostion = self.getPosition(selectLayer),
            x = layerPostion.x,
            y = layerPostion.y,
            label = {},
            text = {},
            line = {},
            arrow = {},
            gap = {},
            guide = self.createGuide();

        arrow.start = {};
        arrow.end = {};

        guide = self.addLabel( guide, height );

        arrow.width = 7;
        arrow.height = 1;
        label.width = guide.label.frame().width();
        label.height = guide.label.frame().height();
        label.x = parseInt( x - ( label.width + arrow.width ) / 2 - 1 );
        label.y = parseInt( y + ( height - label.height) / 2 );

        if( position && position == 'center' ){
          label.x = parseInt( x + ( width - label.width ) / 2 );
        }
        else if( position && position == 'right' ){
          label.x = parseInt( x + width - label.width + ( label.width + arrow.width ) / 2 + 1 );
        }

        line.width = 1;
        line.height = height;
        line.x = parseInt( label.x + label.width / 2 );
        line.y = y;

        arrow.start.x = parseInt( line.x - arrow.width / 2 + 1 );
        arrow.start.y = y;
        arrow.end.x = arrow.start.x;
        arrow.end.y = parseInt( y + height - 1 );

        gap.x = label.x + 10;
        gap.y = label.y + 10;

        if( ( label.height + 20 ) > height ){
          gap.y = parseInt( y + ( height - 8 ) / 2 );
          if( position && position == 'right' ){
            label.x = parseInt( line.x + arrow.width );
            gap.x = parseInt( label.x - 4 );
          }
          else{
            label.x = line.x - label.width - arrow.width;
            gap.x = parseInt( label.x + label.width - 4 );
          }
        }

        self.Attrs[i] = {
          label: label,
          line: line,
          arrow: arrow,
          gap: gap
        };

        self.Guides[i] = guide;

        self.setAttr(i);
      });

    }
    else{
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  },
  font: function( position ){
    var self = this,
        current = MUGlobal.current;

    if (selection.length() > 0) {
      selection.each(function( layer ){
        var height = layer.frame().height(),
            layerPostion = self.getPosition(layer),
            x = layerPostion.x,
            y = layerPostion.y,
            guide = {};

        if( layer.class() == MSTextLayer ){

          guide.group = current.addLayerOfType('group');
          guide.group.name = 'Guide-' + ( new Date().getTime() );
          guide.gap = guide.group.addLayerOfType('rectangle');
          guide.label = guide.group.addLayerOfType('rectangle');
          guide.text = guide.group.addLayerOfType('text');

          guide.gap.name = 'gap';
          guide.gap.frame().setWidth(8);
          guide.gap.frame().setHeight(8);
          guide.gap.setRotation(45);
          guide.gap.style().fills().addNewStylePart();
          self.setColor( guide.gap, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

          var font = layer.fontPostscriptName(),
              size = layer.fontSize() + ' px',
              fills = layer.style().fills(),
              color = ( fills.length() > 0 )? fills[0].color(): layer.textColor(),
              hex = ( color.hexValue().toString() == '0' )? '000000': color.hexValue().toString();log('666'),
              red = parseInt(color.red() * 255),
              green = parseInt(color.green() * 255),
              blue = parseInt(color.blue() * 255),
              colorText = '#' + hex + ' (rgb:' + red + ',' + green + ',' + blue + ')';

          guide.text.setStringValue( 'Font: ' + font + '\r\n' + 'Size: ' + size + '\r\n' + 'Color: ' + colorText );
          guide.text.setFontSize( MUGlobal.font.size );
          guide.text.setFontPostscriptName( MUGlobal.font.family );
          guide.text.style().fills().addNewStylePart();
          self.setColor( guide.text, MUGlobal.font.color.r, MUGlobal.font.color.g, MUGlobal.font.color.b );
          guide.text.frame().setX( 5 );
          guide.text.frame().setY( 8 );

          guide.label.frame().setWidth( guide.text.frame().width() + 10 );
          guide.label.frame().setHeight( guide.text.frame().height() + 10 );
          guide.label.style().fills().addNewStylePart();
          self.setColor( guide.label, MUGlobal.color.r, MUGlobal.color.g, MUGlobal.color.b );

          var attrs = {};
          attrs.label = {};
          attrs.gap = {};

          attrs.label.x = x;
          attrs.label.y = parseInt( y - guide.label.frame().height() );
          attrs.gap.x = attrs.label.x + 9;
          attrs.gap.y = attrs.label.y + guide.label.frame().height() - 4;

          if( position && position == 'bottom' ){
            attrs.label.y = parseInt( y + height );
            attrs.gap.y = attrs.label.y - 4;
          }

          guide.label.frame().setX( attrs.label.x );
          guide.label.frame().setY( attrs.label.y );
          guide.text.frame().addX( attrs.label.x );
          guide.text.frame().addY( attrs.label.y );
          guide.gap.frame().setX( attrs.gap.x );
          guide.gap.frame().setY( attrs.gap.y );

          layer.setIsSelected( 0 );
          guide.text.setIsSelected( 1 );
          guide.text.setIsSelected( 0 );
          guide.group.setIsSelected( 1 );

        }
      });



    }
    else{
      alert("Make sure you've selected a symbol, or a layer that.");
    }
  }
};
