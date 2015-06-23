var com = com || {};

com.utom = {
    configsGroup: undefined,
    configs: undefined,
    document: undefined,
    selection: undefined,
    page: undefined,
    artboard: undefined,
    current: undefined,
    styles: undefined,
    init: function(context){
        this.document = context.document;
        this.selection = context.selection;

        this.page = this.document.currentPage();
        this.artboard = this.page.currentArtboard();

        this.current = this.artboard || this.page;
        if(!this.is(this.current, MSArtboardGroup)){
            this.message("You need an artboard.");
            return false;
        }


        this.getConfigs();
    },
    extend: function( options, target ){
        var target = target || this;

        for ( var key in options ){
            target[key] = options[key];
        }

    },
    is: function(layer, theClass){
        var klass = [layer class];
        return klass === theClass;
    },
    isIntersect: function(lf, tf){
        return !(
            lf.maxX <= tf.x ||
            lf.x >= tf.maxX ||
            lf.y >= tf.maxY ||
            lf.maxY <= tf.y
        );
    },
    getFrame: function(layer) {
        var rect = layer.absoluteRect();
        return {
            x: Math.round(rect.x()),
            y: Math.round(rect.y()),
            width: Math.round(rect.width()),
            height: Math.round(rect.height()),
            maxX: Math.round(rect.x() + rect.width()),
            maxY: Math.round(rect.y() + rect.height())
        };
    },
    getDistance: function(frame, target){
        var tf = target || this.getFrame(this.current);

        return [
            ( frame.y - tf.y ),
            ( (tf.x + tf.width) - frame.maxX ),
            ( (tf.y + tf.height) - frame.maxY ),
            ( frame.x - tf.x )
        ];
    },
    addLayer: function(type, container){
        var container = container || this.current;
        return container.addLayerOfType(type);
    },
    addGroup: function(container){
        var container = container || this.current;
        return this.addLayer("group", container);
    },
    addShape: function(container){
        var container = container || this.current;
        return this.addLayer("rectangle", container);
    },
    addText: function(container){
        var container = container || this.current;
        return this.addLayer("text", container);
    },
    removeLayer: function(layer){
        var container = layer.parentGroup();
        if (container) container.removeLayer(layer);
    },
    message: function(message){
        this.document.showMessage(message);
    }
};


//Math
com.utom.extend({
    mathHalf: function(number){
        return Math.round( number / 2 );
    },
    math255: function(number){
        return Math.round( 255 * number );
    },
    updateLength: function(length, sp){
        var unit = (this.configs.resolution > 0)? "pt": "px";
        unit = (this.configs.resolution > 3)? "dp": unit;
        var scale = this.allResolution[this.configs.resolution].scale;

        length = Math.round( length / scale );

        if(this.configs.resolution > 2 && sp){
            unit = "sp";
        }

        return length + unit;
    }
});

//Find
com.utom.extend({
    find: function(name, container, isArray){
        var predicate = NSPredicate.predicateWithFormat("(name != NULL) && (name == %@)", name);
        var container = container || this.current;
        var items;
        if(isArray){
            items = container;
        }
        else if(container.pages){
            items = container.pages();
        }else{
            items = container.children();
        }

        var queryResult = items.filteredArrayUsingPredicate(predicate);

        if (queryResult.count()==1){
            return queryResult[0];
        } else if (queryResult.count()>0){
            return queryResult;
        } else {
            // debug("no layer matched while predicating")
            return false;
        }
    }
});

//Shared
com.utom.extend({
    sharedLayerStyle: function(name, color, alpha) {
        var layerStyles = this.document.documentData().layerStyles();
        var layerStylesLibrary = layerStyles.objectsSortedByName();
        var layerStyle = this.find(name, layerStylesLibrary, true);
        var alpha = alpha || 1;

        if( layerStyle == false ){
            var style = MSStyle.alloc().init();
            var color = MSColor.colorWithSVGString(color);

            color.setAlpha(alpha);

            var fill = style.fills().addNewStylePart();
            fill.color = color;

            layerStyles.addSharedStyleWithName_firstInstance(name, style);

            layerStyle = style;
        }

        return (layerStyle.newInstance)? layerStyle.newInstance(): layerStyle;
    },
    sharedTextStyle: function(name, color, alpha) {
        var textStyles = this.document.documentData().layerTextStyles();
        var textStylesLibrary = textStyles.objectsSortedByName();
        var textStyle = this.find(name, textStylesLibrary, true);

        if( textStyle == false ){
            var textLayer = this.addText(this.page);
            textLayer.setTextColor(MSColor.colorWithSVGString(color));
            textLayer.setFontSize(12);
            textLayer.setFontPostscriptName("HelveticaNeue");
            textLayer.setCharacterSpacing(2);

            var style = textLayer.style();
            this.removeLayer(textLayer);

            textStyles.addSharedStyleWithName_firstInstance(name, textLayer.style());

            textStyle = style;
        }

        return (textStyle.newInstance)? textStyle.newInstance(): textStyle;
    }
})

//Configs
com.utom.extend({
    getConfigs: function(){
        var configsGroup = this.find("@Sketch Measure Configs", this.artboard);
        var textLayer;

        if(configsGroup == false){
            var defaultConfigs = {};
            var resolution = this.resolutionSetting();

            if(!resolution && resolution !== 0){
                return false;
            }

            defaultConfigs.resolution = resolution;
            defaultConfigs.typography = ["font", "size", "color", "line"];
            defaultConfigs.property = ["fill", "border"];
            this.setConfigs(defaultConfigs);
        }
        else{
            var textLayer = configsGroup.children().firstObject();
            this.configs = JSON.parse(textLayer.stringValue());
        }
    },
    setConfigs: function(configs){
        var configsGroup = this.find("@Sketch Measure Configs", this.artboard);
        var textLayer;

        this.configs = this.configs || {};


        this.extend(configs, this.configs);
        this.configs.timestamp = new Date().getTime();

        if(configsGroup == false){
            configsGroup = this.addGroup(this.artboard);
            configsGroup.setName("@Sketch Measure Configs");

            textLayer = this.addText(configsGroup);
            textLayer.setName("Configs");
        }
        else{
            textLayer = configsGroup.children().firstObject();
        }

        textLayer.setStringValue(JSON.stringify(this.configs));

        textLayer.setTextBehaviour(1);
        textLayer.setTextBehaviour(0);
        configsGroup.resizeRoot(true);
        configsGroup.setIsLocked(true);
        configsGroup.setIsVisible(false);
    }
});

// Settings
com.utom.extend({
    allResolution: [
        {
            name: "Standard @1x (px)",
            scale: 1
        },
        {
            name: "Points @1x (pt)",
            scale: 1
        },
        {
            name: "Retina @2x (pt)",
            scale: 2
        },
        {
            name: "Retina HD @2x (pt)",
            scale: 3
        },
        {
            name: "LDPI @0.75x (dp, sp)",
            scale: .75
        },
        {
            name: "MDPI @1x (dp, sp)",
            scale: 1
        },
        {
            name: "HDPI @1.5x (dp, sp)",
            scale: 1.5
        },
        {
            name: "XHDPI @2x (dp, sp)",
            scale: 2
        },
        {
            name: "XXHDPI @3x (dp, sp)",
            scale: 3
        },
        {
            name: "XXXHDPI @4x (dp, sp)",
            scale: 4
        }
    ],
    resolutionSetting: function(){
        var cellWidth = 300;
        var cellHeight = 260;
        var allResolution = this.allResolution;

        var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, cellWidth, cellHeight + 30));
        var matrix = [[NSMatrix alloc] initWithFrame:NSMakeRect(0, 30, cellWidth, cellHeight)
            mode:NSRadioModeMatrix
            cellClass:[NSButtonCell class]
            numberOfRows: allResolution.length
            numberOfColumns:1
        ];
        [matrix setCellSize:NSMakeSize(cellWidth, 25)]

        allResolution.forEach(function(data, i) {
            var cell = [matrix cells][i]
            [cell setButtonType:NSRadioButton]
            [cell setTitle:data.name]
            [cell setTag:i]
        })

        [accessory addSubview:matrix]

        var alert = NSAlert.alloc().init();
        alert.setMessageText("Resolution Setup");
        alert.setInformativeText("* Choose your design resolution");
        alert.addButtonWithTitle("Save");
        alert.addButtonWithTitle("Cancel");
        alert.setAccessoryView(accessory);

        var buttonReturnValue = [alert runModal],
            selectedIndex = [[matrix selectedCell] tag];

        if (buttonReturnValue === NSAlertFirstButtonReturn) {
            return selectedIndex;
        }
        return false;
    }
});

com.utom.extend({
    measureSize: function(){
        if(!this.configs) return false;

        var styles = [
            this.sharedLayerStyle("@Size / Layer", "#FF5500"),
            this.sharedTextStyle("@Size / Text", "#FFFFFF")
        ];

        if (this.selection.count() < 1){
            this.message("Please select a layer for measuring.");
            return false;
        }

        this.measureWidth(this.selection[0], styles);
        this.measureHeight(this.selection[0], styles);
    },
    measureWidth: function(layer, styles, name, isSpacing){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];
        var frame = this.getFrame(layer);
        var name = name || "WIDTH#" + layer.objectID();
        var container = this.find(name);
        var distance = this.getDistance(frame);
        var layerStyle = styles[0];
        var textStyle = styles[1];

        if (container) this.removeLayer(container);

        container = this.addGroup();
        container.setName(name);

        var shape = this.addShape(container);
        shape.setStyle(layerStyle);

        var line = shape.duplicate();
        var lineFrame = line.absoluteRect();
        line.setName("line");
        lineFrame.setWidth(frame.width);
        lineFrame.setHeight(1);
        lineFrame.setX( frame.x );

        var start = shape.duplicate();
        var startFrame = start.absoluteRect();
        start.setName("start");
        startFrame.setWidth(1);
        startFrame.setHeight(5);
        startFrame.setX( frame.x );

        var end = shape.duplicate();
        var endFrame = end.absoluteRect();
        end.setName("end");
        endFrame.setWidth(1);
        endFrame.setHeight(5);
        endFrame.setX( frame.x + frame.width - 1 );

        var text = this.addText(container);
        text.setStyle(textStyle);
        text.setStringValue(this.updateLength(frame.width));
        text.setTextBehaviour(1);
        text.setTextBehaviour(0);

        var textFrame = text.absoluteRect();
        var label = shape.duplicate();
        var labelFrame = label.absoluteRect();
        var labelX;
        var labelY;
        var gapX;
        var gapY;
        var gapWidth;
        var gapHeight;
        var labelWidth = Math.round( textFrame.width() + 8 );
        var labelHeight = Math.round( textFrame.height() + 6 );

        label.setName("" + frame.width);
        labelFrame.setWidth( labelWidth );
        labelFrame.setHeight( labelHeight );

        var gap = shape.duplicate();
        var gapFrame = gap.absoluteRect();
        gap.setName("gap");
        gap.setRotation(45);
        gap.flatten();
        gapFrame.setWidth(8);
        gapFrame.setHeight(8);
        gapFrame = gap.absoluteRect();
        gapWidth = Math.round( gapFrame.width() );
        gapHeight = Math.round( gapFrame.height() );

        labelX = frame.x + this.mathHalf(frame.width) - this.mathHalf(labelWidth);
        gapX = labelX + this.mathHalf(labelWidth) - this.mathHalf(gapWidth);

        if(distance[0] < distance[2] && distance[2] >= 50 && !isSpacing){
            lineFrame.setY( frame.y + frame.height + 3 );
            startFrame.setY( frame.y + frame.height + 1 );
            endFrame.setY( frame.y + frame.height + 1 );
        }
        else if( distance[0] >= 50 && !isSpacing ){
            lineFrame.setY( frame.y - 4 );
            startFrame.setY( frame.y - 6 );
            endFrame.setY( frame.y - 6 );
        }
        else{
            lineFrame.setY( frame.y + this.mathHalf(frame.height) );
            startFrame.setY( frame.y + this.mathHalf(frame.height) - 2 );
            endFrame.setY( frame.y + this.mathHalf(frame.height) - 2 );
        }

        var lineY = lineFrame.y();
        labelY = lineY - this.mathHalf(labelHeight);
        gapY = labelY + this.mathHalf(labelHeight) - this.mathHalf(gapHeight);

        if( (labelWidth + 10) > frame.width ){
            labelY = (distance[0] < distance[2])? lineY + 6: lineY - labelHeight - 5;
            gapY = (distance[0] < distance[2])? lineY + 3: lineY - 10;
        }

        var aFrame = this.getFrame(this.current);
        labelX = (aFrame.x > labelX)? aFrame.x : labelX;
        labelX = (aFrame.maxX < ( labelX + labelWidth ) )? ( labelX - ( (labelX + labelWidth) - aFrame.maxX ) ): labelX;

        labelFrame.setX(labelX);
        labelFrame.setY(labelY);
        gapFrame.setX(gapX);
        gapFrame.setY(gapY);
        textFrame.setX(labelX + 4);
        textFrame.setY(labelY + 3);

        this.removeLayer(shape);
        container.resizeRoot(true);
    },
    measureHeight: function(layer, styles, name, isSpacing){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];
        var frame = this.getFrame(layer);
        var name = name || "HEIGHT#" + layer.objectID();
        var container = this.find(name);
        var distance = this.getDistance(frame);
        var layerStyle = styles[0];
        var textStyle = styles[1];

        if (container) this.removeLayer(container);

        container = this.addGroup();
        container.setName(name);

        var shape = this.addShape(container);
        shape.setStyle(layerStyle);

        var line = shape.duplicate();
        var lineFrame = line.absoluteRect();
        line.setName("line");
        lineFrame.setWidth(1);
        lineFrame.setHeight(frame.height);
        lineFrame.setY( frame.y );

        var start = shape.duplicate();
        var startFrame = start.absoluteRect();
        start.setName("start");
        startFrame.setWidth(5);
        startFrame.setHeight(1);
        startFrame.setY( frame.y );

        var end = shape.duplicate();
        var endFrame = end.absoluteRect();
        end.setName("end");
        endFrame.setWidth(5);
        endFrame.setHeight(1);
        endFrame.setY( frame.y + frame.height - 1 );

        var text = this.addText(container);

        text.setStyle(textStyle);
        text.setStringValue(this.updateLength(frame.height));
        text.setTextBehaviour(1);
        text.setTextBehaviour(0);

        var textFrame = text.absoluteRect();
        var label = shape.duplicate();
        var labelFrame = label.absoluteRect();
        var labelX;
        var labelY;
        var gapX;
        var gapY;
        var gapWidth;
        var gapHeight;
        var labelWidth = Math.round( textFrame.width() + 8 );
        var labelHeight = Math.round( textFrame.height() + 6 );

        label.setName("" + frame.height);
        labelFrame.setWidth( labelWidth );
        labelFrame.setHeight( labelHeight );

        var gap = shape.duplicate();
        var gapFrame = gap.absoluteRect();
        gap.setName("gap");
        gap.setRotation(45);
        gap.flatten();
        gapFrame.setWidth(8);
        gapFrame.setHeight(8);
        gapFrame = gap.absoluteRect();
        gapWidth = Math.round( gapFrame.width() );
        gapHeight = Math.round( gapFrame.height() );

        labelY = frame.y + this.mathHalf(frame.height) - this.mathHalf(labelHeight);
        gapY = labelY + this.mathHalf(labelHeight) - this.mathHalf(gapHeight);

        if (distance[1] < distance[3] && distance[3] >= 50 && !isSpacing) {
            lineFrame.setX( frame.x - 4 );
            startFrame.setX( frame.x - 6 );
            endFrame.setX( frame.x - 6 );
        }
        else if( distance[1] >= 50 && !isSpacing){
            lineFrame.setX( frame.x + frame.width + 3 );
            startFrame.setX( frame.x + frame.width + 1 );
            endFrame.setX( frame.x + frame.width + 1 );
        }
        else{
            lineFrame.setX( frame.x + this.mathHalf(frame.width) );
            startFrame.setX( frame.x + this.mathHalf(frame.width) - 2 );
            endFrame.setX( frame.x + this.mathHalf(frame.width) - 2 );
        }

        var lineX = lineFrame.x();
        labelX = lineX - this.mathHalf(labelWidth);
        gapX = labelX + this.mathHalf(labelWidth) - this.mathHalf(gapWidth);

        if( (labelHeight + 10) > frame.height ){
            labelX = (distance[1] < distance[3])? lineX - labelWidth - 5 : lineX + 6;
            gapX = (distance[1] < distance[3])? lineX - 10 : lineX + 3;
        }

        var aFrame = this.getFrame(this.current);
        labelY = (aFrame.y > labelY)? aFrame.y : labelY;
        labelY = (aFrame.maxY < ( labelY + labelHeight ) )? ( labelY - ( (labelY + labelHeight) - aFrame.maxY ) ): labelY;

        labelFrame.setX(labelX);
        labelFrame.setY(labelY);
        gapFrame.setX(gapX);
        gapFrame.setY(gapY);
        textFrame.setX(labelX + 4);
        textFrame.setY(labelY + 3);


        this.removeLayer(shape);
        container.resizeRoot(true);
    }
});

com.utom.extend({
    measureSpacing: function(){
        if(!this.configs) return false;

        var styles = styles || [
            this.sharedLayerStyle("@Spacing / Layer", "#50E3C2"),
            this.sharedTextStyle("@Spacing / Text", "#FFFFFF")
        ];

        if (this.selection.count() < 1){
            this.message("Please select 1 or 2 layers for measuring.");
            return false;
        }

        var layers = this.selection;
        var layer;
        var target;

        if( layers.count() == 1 ){
            layer = layers[0];
            target = this.current;
            this.measureVertical(layer, target, styles);
            this.measureHorizontal(layer, target, styles);
        }
        else if( layers.count() == 2 ){
            layer = layers[1];
            target = layers[0];
            this.measureVertical(layer, target, styles);
            this.measureHorizontal(layer, target, styles);
        }
    },
    measureVertical: function(layer, target, styles){
        if(!this.configs) return false;

        var layer = layer;
        var target = target;
        var lf = this.getFrame(layer);
        var tf = this.getFrame(target);
        var distance = this.getDistance(lf, tf);
        var idname = layer.objectID() + '#' + target.objectID();
        var intersect = this.isIntersect(lf, tf);

        var name = "VERTICAL#" + idname;
        var temp = this.addShape(this.current);
        var tempFrame = temp.absoluteRect();
        var tempX;
        var tempY;
        var tempWidth;
        var tempHeight;

        tempX = lf.x;
        tempWidth = lf.width;
        if( intersect ){
            tempY = (distance[0] > distance[2])? lf.y + lf.height: lf.y - distance[0];
            tempHeight = (distance[0] > distance[2])? distance[2]: distance[0];
        }
        else{
            if(lf.maxY <  tf.y ){
                tempY = lf.maxY;
                tempHeight = tf.y - lf.maxY;
            }
            else if( lf.y > tf.maxY ){
                tempY = tf.maxY;
                tempHeight = lf.y - tf.maxY;
            }
        }

        if( 
            ( intersect && ( ( this.is(target, MSArtboardGroup) && tempHeight > 0 ) || ( !this.is(target, MSArtboardGroup) && tempHeight != 0 ) ) ) ||
            ( !intersect && tempHeight > 0 )
        ){
            tempFrame.setX( tempX );
            tempFrame.setY( tempY );
            tempFrame.setWidth( tempWidth );
            tempFrame.setHeight( tempHeight );
            this.measureHeight(temp, styles, name, true);
        }

        this.removeLayer(temp);
    },
    measureHorizontal: function(layer, target, styles){
        if(!this.configs) return false;

        var layer = layer;
        var target = target;
        var lf = this.getFrame(layer);
        var tf = this.getFrame(target);
        var distance = this.getDistance(lf, tf);
        var idname = layer.objectID() + '#' + target.objectID();
        var intersect = this.isIntersect(lf, tf);

        var name = "HORIZONTAL#" + idname;
        var temp = this.addShape(this.current);
        var tempFrame = temp.absoluteRect();

        var tempX;
        var tempY;
        var tempWidth;
        var tempHeight;

        tempY = lf.y;
        tempHeight = lf.height;
        if( intersect ){
            tempX = (distance[3] > distance[1])? lf.x + lf.width : lf.x - distance[3];
            tempWidth = (distance[3] > distance[1])? distance[1]: distance[3];
        }
        else{
           if(lf.maxX <  tf.x ){
                tempX = lf.maxX;
                tempWidth = tf.x - lf.maxX;
            }
            else if( lf.x > tf.maxX ){
                tempX = tf.maxX;
                tempWidth = lf.x - tf.maxX;
            }
        }

        if(
            ( intersect && ( ( this.is(target, MSArtboardGroup) && tempWidth > 0 ) || ( !this.is(target, MSArtboardGroup) && tempWidth != 0 ) ) ) ||
            ( !intersect && tempWidth > 0 )
        ){
            tempFrame.setX( tempX );
            tempFrame.setY( tempY );
            tempFrame.setWidth( tempWidth );
            tempFrame.setHeight( tempHeight );
            this.measureWidth(temp, styles, name, true);
        }

        this.removeLayer(temp);
    }
});

com.utom.extend({
    createOverlayer: function(){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];

        if (this.selection.count() < 1){
            this.message("Please select a layer for creating.");
            return false;
        }

        var frame = this.getFrame(layer);
        var name = "OVERLAYER#" + layer.objectID();
        var container = this.find(name);
        var layerStyle = this.sharedLayerStyle("@Overlayer / Layer", "#FF5500", .3);

        if (container) this.removeLayer(container);

        container = this.addGroup();
        container.setName(name);

        var overlayer = this.addShape(container);
        var overlayerFrame = overlayer.absoluteRect();
        overlayer.setStyle(layerStyle);
        overlayer.setName('overlayer');
        overlayerFrame.setX(frame.x);
        overlayerFrame.setY(frame.y);
        overlayerFrame.setWidth(frame.width);
        overlayerFrame.setHeight(frame.height);

        container.resizeRoot(true);
    }
})

com.utom.extend({
    drawLabel: function(target, styles, name){
        if(!this.configs) return false;

        var target = target || this.selection[0];

        if (!target || !this.is(target, MSTextLayer) ){
            this.message("Please select a text layer for drawing.");
            return false;
        }

        var text = target;
        var textFrame;
        var container = text.parentGroup();
        var label;
        var labelFrame;

        if(/LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(container.name())){
            label = this.find('label', container);
        }
        else{
            var name = name || "LABEL#" + text.objectID();
            container = this.find(name);

            var styles = styles || [
                this.sharedLayerStyle("@Label / Layer", "#7ED321"),
                this.sharedTextStyle("@Label / Text", "#FFFFFF")
            ];
            var layerStyle = styles[0];
            var textStyle = styles[1];

            if (container) this.removeLayer(container);

            container = this.addGroup();
            container.setName(name);

            label = this.addShape(container);
            label.setName("label");
            this.removeLayer(text);
            container.addLayers([text]);

            label.setStyle(layerStyle);
            text.setStyle(textStyle);
        }

        textFrame = this.getFrame(text);
        labelFrame = label.absoluteRect();
        labelFrame.setX(textFrame.x - 4);
        labelFrame.setY(textFrame.y - 3);
        labelFrame.setWidth(textFrame.width + 8);
        labelFrame.setHeight(textFrame.height + 6);

        container.resizeRoot(true);
    },
    getTypography: function(){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];

        if( !this.is(layer, MSTextLayer) ){
            this.message("Please select a text layer for getting typography.");
            return false;
        }

        var styles = [
            this.sharedLayerStyle("@Typography / Layer", "#F5A623"),
            this.sharedTextStyle("@Typography / Text", "#FFFFFF")
        ];

        var name = "TYPOGRAPHY#" + layer.objectID();
        var frame = this.getFrame(layer);
        var distance = this.getDistance(frame);

        var content = [];
        var color = layer.textColor();
        var alphaText = (color.alpha() != 1)? " (" + Math.round(color.alpha() * 100) + "%)": "";

        content.push(this.updateLength(layer.fontSize(), true) + ", " + layer.fontPostscriptName());
        content.push("#" + color.hexValue() + " / " + this.math255(color.red()) + "," + this.math255(color.green()) + "," + this.math255(color.blue()) + alphaText);

        var temp = this.addText();
        temp.setStyle(styles[1]);
        temp.setStringValue(content.join("\r\n"));
        temp.setTextBehaviour(1);
        temp.setTextBehaviour(0);

        var tempFrame = temp.absoluteRect();

        var tempX = (distance[1] > distance[3])? frame.x + 4: frame.maxX - tempFrame.width() - 4;
        var tempY = (distance[0] < distance[2])? frame.maxY + 3: frame.y - tempFrame.height() - 3;

        tempFrame.setX(tempX);
        tempFrame.setY(tempY);

        this.drawLabel(temp, styles, name);
    },
    allProperty: [
        {
            name: "Fill / Color / Gradient",
            slug: "fill"
        },
        {
            name: "Border Color",
            slug: "border"
        },
        {
            name: "Layer Opacity",
            slug: "opacity"
        },
        // {
        //     name: "Radius",
        //     slug: "radius"
        // },
        {
            name: "Shadow",
            slug: "shadow"
        },
        {
            name: "Inner Shadow",
            slug: "inner-shadow"
        }
    ],
    propertyDialog: function(){
        var cellWidth = 300;
        var cellHeight = 120;
        var allProperty = this.allProperty;
        var propertyConfigs = this.configs.property;

        var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, cellWidth, cellHeight + 30));

        var btns = [];
        allProperty.forEach(function(data, i) {
            btns[i] = NSButton.alloc().initWithFrame(NSMakeRect(0.0, 130.0 - i * 24, 200.0, 20.0));
            btns[i].setButtonType(NSSwitchButton);
            btns[i].setTitle(data.name);
            btns[i].setState(false);
            propertyConfigs.forEach(function(slug){
                if(slug == data.slug){
                    btns[i].setState(true);
                }
            });
            accessory.addSubview(btns[i]);
        })

        var alert = NSAlert.alloc().init();
        alert.setMessageText("Get Properties");
        alert.setInformativeText("* Customize the Property Guide that will be created.");
        alert.addButtonWithTitle("Save");
        alert.addButtonWithTitle("Cancel");
        alert.setAccessoryView(accessory);

        var responseCode = alert.runModal()

        if(responseCode == 1000){
            var tmps = [];
            btns.forEach(function(btn, i) {
                if(btn.state()){
                    tmps.push(allProperty[i].slug);
                }
            });

            this.setConfigs({property: tmps});
            return tmps;
        }
        else{
            return false;
        }

    },
    getProperty: function(){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];

        if( !layer || this.is(layer, MSTextLayer) ){
            this.message("Please select a layer (not text layer) for getting typography.");
            return false;
        }

        var styles = [
            this.sharedLayerStyle("@Property / Layer", "#4A90E2"),
            this.sharedTextStyle("@Property / Text", "#FFFFFF")
        ];

        var types = this.propertyDialog();

        if(!types) return false;

        var name = "PROPERTY#" + layer.objectID();
        var frame = this.getFrame(layer);
        var distance = this.getDistance(frame);

        var content = [];
        var layerStyle = layer.style();
        var border = layer.style().border();
        var shadow = layer.style().shadow();
        var innerShadow = layer.style().shadow();


        var self = this;
        function getColorContext(color, position) {
            var alpha = color.alpha(),
                hex = color.hexValue(),
                position = (!isNaN(position))? Math.round(position * 100) + '% - ': '';

            alpha = (alpha == 1)? '': ' (' + Math.round(alpha * 100) + '%)';
            return position + '#' + hex + ' / ' + self.math255(color.red()) + ',' + self.math255(color.green()) + ',' + self.math255(color.blue()) + alpha;
        }

        function getColor(layer, fill){
            var layer = layer,
                fill = fill || layer.style().fill(),
                fillType = (fill)? fill.fillType(): null,
                gradient = (fillType != 1)? null: fill.gradient(),
                gradientType = (fillType != 1)? null: gradient.gradientType();

            if(fill && fill.isEnabled() && fillType == 0){
                var color = fill.color();
                return getColorContext(color);
            }
            else if(fill && fill.isEnabled() && fillType == 1) {
                var stops = gradient.stops().array(),
                    stopsContext = [];

                stopsContext = (gradientType > 0)? 'radial gradient\r\n': 'linear gradient\r\n';

                for (var i = 0; i < stops.count(); i++) {
                    var stop = stops[i];
                    stopsContext += ' * ' + getColorContext(stop.color(), stop.position()) + '\r\n'
                }

                return stopsContext.trim();
            }
            else{
                return null;
            }
        }

        for (var i = 0; i < types.length; i++) {
            if(types[i] == 'opacity' && layerStyle.contextSettings().opacity() ) content.push("opacity: " + Math.round( layerStyle.contextSettings().opacity() * 100) + "%");
            if(types[i] == 'fill' && getColor(layer)) content.push("fill: " + getColor(layer));
            if(
                types[i] == 'border' &&
                border &&
                border.isEnabled()
            ){ 
                content.push("border: " + getColor(layer, border));
            }

            if(
                types[i] == "shadow" &&
                shadow &&
                shadow.isEnabled()
            ){
                var blur = shadow.blurRadius(),
                    spread = shadow.spread();

                blur = (blur)? "\r\n * blur - " + this.updateLength(blur): "";
                spread = (spread)? "\r\n * spread - " + this.updateLength(spread): "";

                content.push("shadow: \r\n * x & y - " + this.updateLength(shadow.offsetX()) + ", " + this.updateLength(shadow.offsetY()) + blur + spread +"\r\n * " + getColorContext(shadow.color()));
            }

            if(
                types[i] == "inner-shadow" &&
                innerShadow &&
                innerShadow.isEnabled()
            ){
                var blur = innerShadow.blurRadius(),
                    spread = innerShadow.spread();

                blur = (blur)? "\r\n * blur - " + this.updateLength(blur): "";
                spread = (spread)? "\r\n * spread - " + this.updateLength(spread): "";

                content.push("inner shadow: \r\n * x & y - " + this.updateLength(innerShadow.offsetX()) + ", " + this.updateLength(innerShadow.offsetY()) + blur + spread +"\r\n * " + getColorContext(innerShadow.color()));
            }
        }
        var temp = this.addText();
        temp.setStyle(styles[1]);
        temp.setStringValue(content.join("\r\n"));
        temp.setTextBehaviour(1);
        temp.setTextBehaviour(0);

        var tempFrame = temp.absoluteRect();

        var tempX = (distance[1] > distance[3])? frame.x + 4: frame.maxX - tempFrame.width() - 4;
        var tempY = (distance[0] < distance[2])? frame.maxY + 3: frame.y - tempFrame.height() - 3;

        tempFrame.setX(tempX);
        tempFrame.setY(tempY);

        this.drawLabel(temp, styles, name);
    }
});

com.utom.extend({
    isMeasureHidden: false,
    isMeasureHidden: false,
    toggleMeasureHidden: function(){
        if(!this.configs) return false;

        var artboard = this.artboard;

        var isMeasureHidden = (this.configs.isMeasureHidden)? false : !Boolean(this.configs.isMeasureHidden);
        this.setConfigs({isMeasureHidden: isMeasureHidden});

        var layers = artboard.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && /OVERLAYER\#|WIDTH\#|HEIGHT\#|VERTICAL\#|HORIZONTAL\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(item.name())){
                item.setIsVisible(!isMeasureHidden);
            }
        }
    },
    toggleMeasureLocked: function(){
        if(!this.configs) return false;

        var artboard = this.artboard;

        var isMeasureLocked = (this.configs.isMeasureLocked)? false : !Boolean(this.configs.isMeasureLocked);
        this.setConfigs({isMeasureLocked: isMeasureLocked});

        var layers = artboard.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && /OVERLAYER\#|WIDTH\#|HEIGHT\#|VERTICAL\#|HORIZONTAL\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(item.name())){
                item.setIsLocked(isMeasureLocked);
            }
        }
    },
    moveToGroup: function(){
        if(!this.configs) return false;

        var artboard = this.artboard;
        var configsGroup = this.find("@Sketch Measure Configs", this.artboard);



        var groupSpecs = this.find("@Specs");
        if(!groupSpecs){
            groupSpecs = this.addGroup(artboard);
            groupSpecs.setName("@Specs");
        }

        var layers = artboard.children().objectEnumerator();
        var specLayers = [];

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && /OVERLAYER\#|WIDTH\#|HEIGHT\#|VERTICAL\#|HORIZONTAL\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(item.name())){
                this.removeLayer(item);
                specLayers.push(item);
            }
        }

        groupSpecs.addLayers(specLayers);
        groupSpecs.resizeRoot(true);
        groupSpecs.setIsLocked(true);
    },
    clearMeasure: function(){
        if(!this.configs) return false;

        var artboard = this.artboard;
        var configsGroup = this.find("@Sketch Measure Configs", this.artboard);

        var layers = artboard.children().objectEnumerator();

        this.removeLayer(configsGroup);

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && /OVERLAYER\#|WIDTH\#|HEIGHT\#|VERTICAL\#|HORIZONTAL\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(item.name())){
                this.removeLayer(item);
            }
        }

        this.getConfigs();
    }
});


