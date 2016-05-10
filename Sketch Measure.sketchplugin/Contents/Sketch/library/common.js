var I18N = {};
var lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0);
I18N["zh-Hans"] = {
    "You need an artboard."                             : "请在画板中使用该功能.",
    "Resolution setup"                                  : "设计分辨率设定",
    "* Choose your design resolution"                   : "* 请选择你的设计分辨率", 
    "Please select a layer for measuring."              : "请选择 1 个图层.",
    "Please select 1 or 2 layers for measuring."        : "请选择 1 个或 2 个图层",
    "Please select a layer for creating."               : "请选择 1 个图层.",
    "Please select a text layer for creating."          : "请选择 1 个文字图层.",
    "Fill / Text color / Gradient"                      : "填充 / 字体颜色 / 渐变",
    "Border"                                            : "边框",
    "Layer opacity"                                     : "图层不透明度",
    "Radius"                                            : "圆角",
    "Shadow"                                            : "外阴影",
    "Inner shadow"                                      : "内阴影",
    "Font size"                                         : "字号",
    "Line height"                                       : "行高",
    "Font face"                                         : "字体",
    "Get properties"                                    : "获取属性",
    "Style name"                                        : "样式名称",
    "Properties:"                                       : "属性:",
    "Please select a layer for getting properties."     : "请选择图层标注它的属性",
  "* Customize the property guide that will be created.": "* 选择标注的属性和显示位置.",
    "Export spec"                                       : "导出规范",
    "Export to:"                                        : "导出到:",
    "Export"                                            : "导出",
    "Export complete!"                                  : "导出成功!",
    "OK"                                                : "确定",
    "Cancel"                                            : "取消",
    "Select 1 or multiple artboards"                    : "选中一个或多个画板",
    "Position top"                                      : "上侧",
    "Position right"                                    : "右侧",
    "Position bottom"                                   : "下侧",
    "Position left"                                     : "左侧",
    "Show position:"                                    : "显示位置:",
    "Color hex, E.g. #FFFFFF 100%"                      : "颜色 hex [#FFFFFF 100%]",
    "ARGB hex, E.g. #FFFFFFFF"                          : "ARGB hex [#FFFFFFFF]",
    "RGBA CSS, E.g. rgba(255, 255, 255, 1)"             : "RGBA CSS [rgba(255, 255, 255, 1)]",
    "Color format"                                      : "颜色格式",
    "Remeasure all guides to see the new theme."        : "Remeasure all guides to see the new theme.",
    "Show color name"                                   : "显示颜色名称",
    "untitled"                                          : "未命名"
};
 
function _(str){
    return (I18N[lang] && I18N[lang][str])? I18N[lang][str]: str;
}

var com = com || {};

com.utom = {
    configsPage: undefined,
    configsColors: undefined,
    prefix: "SMConfigs",
    configs: undefined,
    context: undefined,
    command: undefined,
    document: undefined,
    selection: undefined,
    pages: undefined,
    page: undefined,
    artboard: undefined,
    current: undefined,
    styles: undefined,
    isPercentage: false,
    init: function(context, currentIsArtboard){
        this.context = context;
        this.document = context.document;
        this.command = context.command;
        this.selection = context.selection;
        this.pages = this.document.pages();
        this.page = this.document.currentPage();
        this.artboard = this.page.currentArtboard();
        this.current = this.artboard || this.page;
        if(currentIsArtboard && !(this.is(this.current, MSArtboardGroup) || this.is(this.current, MSSymbolMaster))){
            this.message(_("You need an artboard."));
            return false;
        }

        this.initConfigs();
    },
    extend: function( options, target ){
        var target = target || this;

        for ( var key in options ){
            target[key] = options[key];
        }
        return target;
    },
    is: function(layer, theClass){
        if(!layer) return false;
        var klass = layer.class();
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

        length = Math.round( length / scale * 10 ) / 10;

        if(this.configs.resolution > 2 && sp){
            unit = "sp";
        }

        if (scale === 27) {
          unit = "gu";
        }

        if (scale === 14) {
          unit = "rem";
        }

        return length + unit;
    },
    updatePercentLength: function(length, width){
        var aFrame = this.artboard.frame();
        if (width) {
             return Math.round((length / aFrame.width()) * 1000) / 10 + "%";

        } 
        return Math.round((length / aFrame.height()) * 1000) / 10 + "%";
    },
    toHex:function(c) {
        var hex = Math.round(c).toString(16).toUpperCase();
        return hex.length == 1 ? "0" + hex :hex;
    },
    rgbToHex:function(r, g, b, a) {
        if (a === undefined) {
            return this.toHex(r) + this.toHex(g) + this.toHex(b);
        } else {
            return this.toHex(a * 255) + this.toHex(r) + this.toHex(g) + this.toHex(b);
        }
    }
});

//Find
com.utom.extend({
    find: function(name, container, isArray, field){
        var field = field || "name";
        var predicate = NSPredicate.predicateWithFormat("(" + field + " != NULL) && (" + field + " == %@)", name);
        var container = container || this.current;
        var items;
        if(isArray){
            items = container;
        }
        else{
            items = container.children();
        }

        var queryResult = items.filteredArrayUsingPredicate(predicate);

        if (queryResult.count()==1){
            return queryResult[0];
        } else if (queryResult.count()>0){
            return queryResult;
        } else {
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
        layerStyle = ( !layerStyle || this.is(layerStyle, MSSharedStyle))? layerStyle: layerStyle[0];

        var alpha = alpha || 1;

        if( layerStyle == false ){
            var style = MSStyle.alloc().init();
            var color = MSColor.colorWithSVGString(color);

            color.setAlpha(alpha);

            var fill = style.addStylePartOfType(0);
            fill.color = color;

            layerStyles.addSharedStyleWithName_firstInstance(name, style);

            layerStyle = style;
        }

        return (layerStyle.newInstance)? layerStyle.newInstance(): layerStyle;
    },
    sharedLayerStyleBorder: function(style, color, alpha) {
        var alpha = alpha || 1;
        var border = style.addStylePartOfType(1);
        var color = MSColor.colorWithSVGString(color);
        color.setAlpha(alpha);
        border.color = color;
        border.thickness = 1;

        return style;
    },
    sharedTextStyle: function(name, color, alpha, center) {
        var textStyles = this.document.documentData().layerTextStyles();
        var textStylesLibrary = textStyles.objectsSortedByName();
        var textStyle = this.find(name, textStylesLibrary, true);
        textStyle = (!textStyle || this.is(textStyle, MSSharedStyle))? textStyle: textStyle[0];

        var alpha = alpha || 1;

        if( textStyle == false ){
            var color = MSColor.colorWithSVGString(color);

            color.setAlpha(alpha);

            var textLayer = this.addText(this.page);
            textLayer.setTextColor(color);

            textLayer.setFontSize(14);
            textLayer.setFontPostscriptName("HelveticaNeue");
            if(center) textLayer.setTextAlignment(2);

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
    getConfigs: function(container){
        var container = (container)? container: this.page;
        var command = this.command;
        var prefix = this.prefix;
        var configsData = [command valueForKey: prefix onLayer: container];
        return JSON.parse(configsData);
    },
    setConfigs: function(newConfigs, container){
        var container = (container)? container: this.page;
        var command = this.command;
        var prefix = this.prefix;
        var configs = this.extend(newConfigs, this.getConfigs(container) || {});
        configs.timestamp = new Date().getTime();

        var configsData = JSON.stringify(configs);
        [command setValue: configsData forKey: prefix onLayer: container];
        return configs;
    },
    removeConfigs: function(container){
        var container = (container)? container: this.page;
        var command = this.command;
        var prefix = this.prefix;

        [command setValue: null forKey: prefix onLayer: container];
    },
    initConfigs: function(){
        this.configs = this.getConfigs();
        
        this.configsPage = this.find("Sketch Measure", this.pages, true);

        if(this.configsPage){
            this.configsColors = this.find("Color Palette", this.configsPage);
        }

        if(!this.configs){
            var defaultConfigs = {};
            var resolution = this.resolutionSetting();

            if(!resolution && resolution !== 0){
                return false;
            }
            defaultConfigs.theme = 0;
            defaultConfigs.resolution = resolution;
            defaultConfigs.property = ["color", "border"];
            defaultConfigs.colorFormat = 0;
            this.configs = this.setConfigs(defaultConfigs);
        }

        

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
            name: "Retina HD @3x (pt)",
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
        },
        {
            name: "Ubuntu Grid (27px)",
            scale: 27
        },
        {
            name: "CSS Rem (14px)",
            scale: 14
        },
    ],
    resolutionSetting: function(){
        var self = this;
        var cellWidth = 300;
        var rowHeight = 26;
        var allResolution = this.allResolution;
        var cellHeight = rowHeight * allResolution.length;

        var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, cellWidth, cellHeight + 30));
        var matrix = [[NSMatrix alloc] initWithFrame:NSMakeRect(0, 30, cellWidth, cellHeight)
            mode:NSRadioModeMatrix
            cellClass:[NSButtonCell class]
            numberOfRows: allResolution.length
            numberOfColumns:1
        ];
        matrix.setCellSize(NSMakeSize(cellWidth, 25))

        allResolution.forEach(function(data, i) {
            var cell = matrix.cells()[i]
            cell.setButtonType(NSRadioButton);
            cell.setTitle(data.name);
            cell.setTag(i);
        });

        [accessory addSubview:matrix]

        var alert = NSAlert.alloc().init();
        alert.setMessageText(_("Resolution setup"));
        alert.setInformativeText(_("* Choose your design resolution"));
        alert.addButtonWithTitle(_("OK"));
        alert.addButtonWithTitle(_("Cancel"));
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

        var sizeStyle = [
            this.sharedLayerStyle("@Size / Layer", "#FF5500"),
            this.sharedTextStyle("@Size / Text", "#FFFFFF", 1),
            this.sharedTextStyle("@Size / Type", "#FF5500", 1)
        ]

        if (this.selection.count() < 1){
            this.message(_("Please select a layer for measuring."));
            return false;
        }

        this.measureWidth(this.selection[0], sizeStyle);
        this.measureHeight(this.selection[0], sizeStyle);
    },
    getLabelDims: function(textWidth, textHeight) {
        var totalPadding = textHeight * 0.4;
        return {
            width: Math.round(textWidth + totalPadding),
            height: Math.round(textHeight + totalPadding),
            padding: totalPadding / 2,
        };
    },
    measureWidth: function(layer, styles, name, isCenter){
        if(!this.configs) return false;
        if(this.configs.theme) return this.measureWidthNop(layer, styles, name, isCenter);
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
        var textL = this.addText(container);
        textL.setStyle(textStyle);

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

        var text = textL.duplicate();
        text.setStringValue(this.updateLength(frame.width));
        text.setName("text");

        if (this.isPercentage) {
            text.setStringValue(this.updatePercentLength(frame.width, true));

        } else {
            text.setStringValue(this.updateLength(frame.width));

        }
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

        var labelDims = this.getLabelDims(textFrame.width(), textFrame.height());
        var labelWidth = labelDims.width;
        var labelHeight = labelDims.height;

        label.setName("label");
        labelFrame.setWidth(labelWidth);
        labelFrame.setHeight(labelHeight);

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

        if(distance[0] < distance[2] && distance[2] >= 50 && !isCenter){
            lineFrame.setY( frame.y + frame.height + 3 );
            startFrame.setY( frame.y + frame.height + 1 );
            endFrame.setY( frame.y + frame.height + 1 );
        }
        else if( distance[0] >= 50 && !isCenter ){
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

        textFrame.setX(labelX + labelDims.padding);
        textFrame.setY(labelY + labelDims.padding);

        this.setConfigs({original: frame.width}, container);

        this.removeLayer(shape);
        this.removeLayer(textL);
        container.resizeToFitChildrenWithOption(0);

        return container;
    },
    measureWidthNop: function(layer, styles, name, isCenter){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];
        var frame = this.getFrame(layer);
        var name = name || "WIDTH#" + layer.objectID();
        var container = this.find(name);
        var distance = this.getDistance(frame);
        var layerStyle = styles[0];
        var textStyle = styles[2];

        if (container) this.removeLayer(container);

        container = this.addGroup();
        container.setName(name);

        var shape = this.addShape(container);
        shape.setStyle(layerStyle);
        var textL = this.addText(container);
        textL.setStyle(textStyle);

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

        var text = textL.duplicate();
        text.setStringValue(this.updateLength(frame.width));
        text.setName("text");

        if (this.isPercentage) {
            text.setStringValue(this.updatePercentLength(frame.width, true));

        } else {
            text.setStringValue(this.updateLength(frame.width));

        }
        text.setTextBehaviour(1);
        text.setTextBehaviour(0);
        var textFrame = text.absoluteRect();
        textFrame.setX( frame.x + this.mathHalf(frame.width - textFrame.width()) )

        var arrow = shape.duplicate();
        var arrowFrame = arrow.absoluteRect();
        arrow.setName("arrow");
        arrowFrame.setWidth(1);
        arrowFrame.setHeight(6);
        arrowFrame.setX( frame.x + this.mathHalf(frame.width - 1)  );

        if(distance[0] < distance[2] && distance[2] >= 50 && !isCenter){
            lineFrame.setY( frame.maxY + 3 );
            startFrame.setY( frame.maxY + 1 );
            endFrame.setY( frame.maxY + 1 );
            arrowFrame.setY( frame.maxY + 3 );
            textFrame.setY( frame.maxY + 10 );
        }
        else if( distance[0] >= 50 && !isCenter ){
            lineFrame.setY( frame.y - 4 );
            startFrame.setY( frame.y - 6 );
            endFrame.setY( frame.y - 6 );
            arrowFrame.setY( frame.y - 9 );
            textFrame.setY( frame.y - textFrame.height() - 10 );
        }
        else{
            var ly = frame.y + this.mathHalf(frame.height);
            lineFrame.setY( ly );
            startFrame.setY( ly - 2 );
            endFrame.setY( ly - 2 );
            if(distance[0] < distance[2]){
                arrowFrame.setY( ly);
                textFrame.setY( ly + 7 );
            }
            else{
                arrowFrame.setY( ly - 5);
                textFrame.setY( ly - textFrame.height() - 6 );
            }
        }

        var aFrame = this.getFrame(this.current);
        var tFrame = this.getFrame(text);

        if( aFrame.x > tFrame.x ){
            textFrame.setX( aFrame.x );
        }
        else if(aFrame.maxX < tFrame.maxX){
            textFrame.setX( tFrame.x - (tFrame.maxX - aFrame.maxX) );
        }

        this.setConfigs({original: frame.width}, container);

        this.removeLayer(shape);
        this.removeLayer(textL);
        container.resizeToFitChildrenWithOption(0);

        return container;
    },
    measureHeight: function(layer, styles, name, isCenter){
        if(!this.configs) return false;
        if(this.configs.theme) return this.measureHeightNop(layer, styles, name, isCenter);
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
        var textL = this.addText(container);
        textL.setStyle(textStyle);

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

        var text = textL.duplicate();
        text.setStringValue(this.updateLength(frame.height));
        text.setName("text");
        if (this.isPercentage) {
          text.setStringValue(this.updatePercentLength(frame.height, false));

        } else {
          text.setStringValue(this.updateLength(frame.height));
        }

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

        var labelDims = this.getLabelDims(textFrame.width(), textFrame.height());
        var labelWidth = labelDims.width;
        var labelHeight = labelDims.height;

        label.setName("label");
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

        if (distance[1] < distance[3] && distance[3] >= 50 && !isCenter) {
            lineFrame.setX( frame.x - 4 );
            startFrame.setX( frame.x - 6 );
            endFrame.setX( frame.x - 6 );
        }
        else if( distance[1] >= 50 && !isCenter){
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

        textFrame.setX(labelX + labelDims.padding);
        textFrame.setY(labelY + labelDims.padding);

        this.setConfigs({original: frame.height}, container);

        this.removeLayer(shape);
        this.removeLayer(textL);
        container.resizeToFitChildrenWithOption(0);

        return container;
    },
    measureHeightNop: function(layer, styles, name, isCenter){
        if(!this.configs) return false;

        var layer = layer || this.selection[0];
        var frame = this.getFrame(layer);
        var name = name || "HEIGHT#" + layer.objectID();
        var container = this.find(name);
        var distance = this.getDistance(frame);
        var layerStyle = styles[0];
        var textStyle = styles[2];

        if (container) this.removeLayer(container);

        container = this.addGroup();
        container.setName(name);

        var shape = this.addShape(container);
        shape.setStyle(layerStyle);
        var textL = this.addText(container);
        textL.setStyle(textStyle);

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

        var text = textL.duplicate();
        text.setStringValue(this.updateLength(frame.height));
        text.setName("text");
        if (this.isPercentage) {
          text.setStringValue(this.updatePercentLength(frame.height, false));

        } else {
          text.setStringValue(this.updateLength(frame.height));
        }

        text.setTextBehaviour(1);
        text.setTextBehaviour(0);

        var textFrame = text.absoluteRect();
        textFrame.setY( frame.y + this.mathHalf(frame.height - textFrame.height()) )

        var arrow = shape.duplicate();
        var arrowFrame = arrow.absoluteRect();
        arrow.setName("arrow");
        arrowFrame.setWidth(6);
        arrowFrame.setHeight(1);
        arrowFrame.setY( frame.y + this.mathHalf(frame.height - 1)  );

        if (distance[1] < distance[3] && distance[3] >= 50 && !isCenter) {
            lineFrame.setX( frame.x - 4 );
            startFrame.setX( frame.x - 6 );
            endFrame.setX( frame.x - 6 );
            arrowFrame.setX( frame.x - 9 );
            textFrame.setX( frame.x - textFrame.width() - 10 );
        }
        else if( distance[1] >= 50 && !isCenter){
            lineFrame.setX( frame.maxX + 3 );
            startFrame.setX( frame.maxX + 1 );
            endFrame.setX( frame.maxX + 1 );
            arrowFrame.setX( frame.maxX + 3 );
            textFrame.setX( frame.maxX + 10 );
        }
        else{
            lx = frame.x + this.mathHalf(frame.width);
            lineFrame.setX( lx );
            startFrame.setX( lx - 2 );
            endFrame.setX( lx - 2 );
            if(distance[1] < distance[3]){
                arrowFrame.setX( lx - 5 );
                textFrame.setX( lx - textFrame.width() - 6 );
            }
            else{
                arrowFrame.setX( lx );
                textFrame.setX( lx + 7 );
            }
        }

        this.setConfigs({original: frame.height}, container);

        this.removeLayer(shape);
        this.removeLayer(textL);
        container.resizeToFitChildrenWithOption(0);

        return container;
    }
});

com.utom.extend({
    measureSpacing: function(){
        if(!this.configs) return false;

        var styles = styles || [
            this.sharedLayerStyle("@Spacing / Layer", "#50E3C2"),
            this.sharedTextStyle("@Spacing / Text", "#FFFFFF", 1),
            this.sharedTextStyle("@Spacing / Type", "#50E3C2", 1)
        ];

        if (this.selection.count() < 1 || this.selection.count() > 2){
            this.message(_("Please select 1 or 2 layers for measuring."));
            return false;
        }

        var layers = this.selection;
        var layer;
        var target;

        if( layers.count() == 1 ){
            layer = layers[0];
            target = this.current;
            this.measureVertical(layer, target, styles);
            this.measureVertical(layer, target, styles, true);
            this.measureHorizontal(layer, target, styles);
            this.measureHorizontal(layer, target, styles, true);
        }
        else if( layers.count() == 2 ){
            layer = layers[1];
            target = layers[0];
            this.measureVertical(layer, target, styles);
            this.measureVertical(layer, target, styles, true);
            this.measureHorizontal(layer, target, styles);
            this.measureHorizontal(layer, target, styles, true);
        }
    },
    measureVertical: function(layer, target, styles, position){
        if(!this.configs) return false;

        var layer = layer;
        var target = target;
        var lf = this.getFrame(layer);
        var tf = this.getFrame(target);
        var distance = this.getDistance(lf, tf);
        var idname = layer.objectID() + '#' + target.objectID();
        var intersect = this.isIntersect(lf, tf);

        var slug = (!position)? "TOP#": "BOTTOM#";
        slug = (!intersect)? "VERTICAL#": slug;
        var name = slug + idname;
        var temp = this.addShape(this.current);
        var tempFrame = temp.absoluteRect();
        var tempX;
        var tempY;
        var tempWidth;
        var tempHeight;

        tempX = lf.x;
        tempWidth = lf.width;
        if( intersect ){
            tempY = (position)? lf.y + lf.height: lf.y - distance[0];
            tempHeight = (position)? distance[2]: distance[0];
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
    measureHorizontal: function(layer, target, styles, position){
        if(!this.configs) return false;

        var layer = layer;
        var target = target;
        var lf = this.getFrame(layer);
        var tf = this.getFrame(target);
        var distance = this.getDistance(lf, tf);
        var idname = layer.objectID() + '#' + target.objectID();
        var intersect = this.isIntersect(lf, tf);

        var slug = (!position)? "LEFT#": "RIGHT#";
        slug = (!intersect)? "HORIZONTAL#": slug;
        var name = slug + idname;
        var temp = this.addShape(this.current);
        var tempFrame = temp.absoluteRect();

        var tempX;
        var tempY;
        var tempWidth;
        var tempHeight;

        tempY = lf.y;
        tempHeight = lf.height;
        if( intersect ){
            tempX = (position)? lf.x + lf.width : lf.x - distance[3];
            tempWidth = (position)? distance[1]: distance[3];
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
    createOverlay: function(){
        if(!this.configs) return false;

        if (this.selection.count() < 1){
            this.message(_("Please select a layer for creating."));
            return false;
        }

        var layer = layer || this.selection[0];

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

        container.resizeToFitChildrenWithOption(0);
    }
});

com.utom.extend({
    measurePercentageSize: function(){
        this.isPercentage = true;
        this.measureSize();
    },
    measurePercentageSpacing: function(){
        this.isPercentage = true;
        this.measureSpacing();
    }
})

com.utom.extend({
    createNote: function(target, reference, styles, name, configs){
        if(!this.configs) return false;
        var selection = (this.selection.count() && this.selection[0]) ? this.selection[0]: undefined;
        var target = target || selection;

        if (
            !target ||
            ( target && !this.is(target, MSTextLayer) )
        ){
            this.message(_("Please select a text layer for creating."));
            return false;
        }

        var text = target;
        var textFrame;
        var container = text.parentGroup();
        var shape;
        var label;
        var gap;
        var gapFrame;
        var labelFrame;

        if(/NOTE\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#/.exec(container.name())){
            label = this.find('label', container);
            labelFrame = this.getFrame(label);
            gap = this.find('gap', container);
            if(gap){
                gapFrame = this.getFrame(gap);
                var old = {
                    ly: labelFrame.y,
                    lh: labelFrame.height,
                    gy: gapFrame.y
                }
            }

        }
        else{
            var name = name || "NOTE#" + text.objectID();
            container = this.find(name);

            var styles = styles || [
                this.sharedLayerStyleBorder(this.sharedLayerStyle("@NOTE / Layer", "#FFFCDC"), "#CCCCCC"),
                this.sharedTextStyle("@NOTE / Text", "#555555")
            ];

            var layerStyle = styles[0];
            var textStyle = styles[1];

            if (container) this.removeLayer(container);

            container = this.addGroup();
            container.setName(name);

            shape = this.addShape(container);
            shape.setStyle(layerStyle);

            label = shape.duplicate();
            label.setName("label");
            textFrame = this.getFrame(text);

            this.removeLayer(text);
            container.addLayers([text]);

            text.setStyle(textStyle);
            if(configs) this.setConfigs(configs, container);
        }

        textFrameAbsoluteRect = text.absoluteRect();
        if(textFrame){
            textFrameAbsoluteRect.setX(textFrame.x);
            textFrameAbsoluteRect.setY(textFrame.y);
        }
        labelFrame = label.absoluteRect();
        labelFrame.setX(textFrameAbsoluteRect.x() - 4);
        labelFrame.setY(textFrameAbsoluteRect.y() - 3);
        labelFrame.setWidth(textFrameAbsoluteRect.width() + 8);
        labelFrame.setHeight(textFrameAbsoluteRect.height() + 6);

        if(configs && configs.position != undefined){
            var position = configs.position;
            gap = shape.duplicate();

            var gapFrame = gap.absoluteRect();
            gap.setName("gap");
            gap.setRotation(45);
            gap.flatten();
            gapFrame.setWidth(8);
            gapFrame.setHeight(8);
            gapFrame = gap.absoluteRect();
            gapWidth = Math.round( gapFrame.width() );
            gapHeight = Math.round( gapFrame.height() );

            var gapX = labelFrame.x() + this.mathHalf(labelFrame.width() - gapFrame.width());
            var gapY = labelFrame.y() + this.mathHalf(labelFrame.height() - gapFrame.height());

            gapX = (position === 1)? labelFrame.x() - 4: gapX;
            gapX = (position === 3)? labelFrame.x() + labelFrame.width() - 4: gapX;

            gapY = (position === 0)? labelFrame.y() + labelFrame.height() - 4: gapY;
            gapY = (position === 2)? labelFrame.y() - 4: gapY;

            gapFrame.setX(gapX);
            gapFrame.setY(gapY);
        }
        else if(old && old.ly < old.gy){
            gapFrame = gap.absoluteRect();
            gapFrame.setY(old.gy - (old.lh - labelFrame.height()));
        }

        this.removeLayer(shape);

        container.resizeToFitChildrenWithOption(0);

        return container;
    },
    allProperty: [
        {
            name: _("Fill / Text color / Gradient"),
            slug: "color"
        },
        {
            name: _("Border"),
            slug: "border"
        },
        {
            name: _("Layer opacity"),
            slug: "opacity"
        },
        {
            name: _("Radius"),
            slug: "radius"
        },
        {
            name: _("Shadow"),
            slug: "shadow"
        },
        {
            name: _("Inner shadow"),
            slug: "inner-shadow"
        },
        {
            name: _("Font size"),
            slug: "font-size"
        },
        {
            name: _("Character"),
            slug: "character"
        },
        {
            name: _("Line height"),
            slug: "line-height"
        },
        {
            name: _("Font face"),
            slug: "font-face"
        },
        {
            name: _("Style name"),
            slug: "style-name"
        }

    ],
    propertyPosition: [_("Position top"), _("Position right"), _("Position bottom"), _("Position left")],
    colorFormats: [_("Color hex, E.g. #FFFFFF 100%"), _("ARGB hex, E.g. #FFFFFFFF"), _("RGBA CSS, E.g. rgba(255, 255, 255, 1)")],
    propertyDialog: function(){
        var cellWidth = 250;
        var cellHeight = 200;
        var allProperty = this.allProperty;
        var propertyConfigs = this.configs.property;
        var colorFormatConfigs = this.configs.colorFormat || 0;
        var propertyPosition = this.configs.propertyPosition || 0;
        var showColorName = this.configs.showColorName || 0;

        var alert = COSAlertWindow.new();
        alert.setMessageText(_("Get properties"));
        alert.setInformativeText(_("* Customize the property guide that will be created."));
        alert.addButtonWithTitle(_("OK"));
        alert.addButtonWithTitle(_("Cancel"));

        alert.addTextLabelWithValue(_("Properties:"));
        var btns = [];
        allProperty.forEach(function(data, i) {
            btns[i] = NSButton.alloc().initWithFrame(NSMakeRect(0, 0, 200, 14));
            btns[i].setButtonType(NSSwitchButton);
            btns[i].setTitle(data.name);
            btns[i].setState(false);
            propertyConfigs.forEach(function(slug){
                if(slug == data.slug){
                    btns[i].setState(true);
                }
            });
            alert.addAccessoryView(btns[i]);
        });

        var comboBox = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25));
        comboBox.addItemsWithObjectValues(this.propertyPosition);
        comboBox.selectItemAtIndex(propertyPosition);

        alert.addTextLabelWithValue(_("Show position:"));
        alert.addAccessoryView(comboBox);

        var comboColorFormatBox = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,300,25));
        comboColorFormatBox.addItemsWithObjectValues(this.colorFormats);
        comboColorFormatBox.selectItemAtIndex(colorFormatConfigs);

        alert.addTextLabelWithValue(_("Color format:"));
        alert.addAccessoryView(comboColorFormatBox);

        var comboShowColorNameBtn = NSButton.alloc().initWithFrame(NSMakeRect(0, 0, 200, 14));
        comboShowColorNameBtn.setButtonType(NSSwitchButton);
        comboShowColorNameBtn.setState(false);
        comboShowColorNameBtn.setTitle(_("Show color name"));
        if(showColorName){
            comboShowColorNameBtn.setState(true);
        }
        alert.addAccessoryView(comboShowColorNameBtn);

        var responseCode = alert.runModal();

        if(responseCode == 1000){
            var types = [];
            var position = comboBox.indexOfSelectedItem();
            var colorFormat = comboColorFormatBox.indexOfSelectedItem();
            btns.forEach(function(btn, i) {
                if(btn.state()){
                    types.push(allProperty[i].slug);
                }
            });

            this.configs = this.setConfigs({property: types, propertyPosition: position, colorFormat: colorFormat, showColorName: comboShowColorNameBtn.state() });
            return {
                types: types,
                position: position,
                colorFormat: colorFormat,
                showColorName: comboShowColorNameBtn.state()
            };
        }
        else{
            return false;
        }

    },
    getProperty: function( layer, propertyConfigs ){
        var self = this;

        if(!this.configs) return false;

        if( !layer && this.selection.count() < 1 ){
            this.message(_("Please select a layer for getting properties."));
            return false;
        }

        var layer = layer || this.selection[0];

        var styles = [
            this.sharedLayerStyle("@Property / Layer", "#F5A623"),
            this.sharedTextStyle("@Property / Text", "#FFFFFF")
        ];

        if(!propertyConfigs){
            var propertyConfigs = this.propertyDialog();
            if(!propertyConfigs) return false;
        }

        var types = propertyConfigs.types;
        var position = propertyConfigs.position;
        var colorFormat = propertyConfigs.colorFormat;
        var showColorName = propertyConfigs.showColorName;

        if(!types) return false;

        if(showColorName){
            this.getColors();
        }

        var content = [];
        var layerStyle = layer.style();

        var colorContent = function(color){
            var colorName = (self.configs.colors && self.configs.colors["#" + self.rgbToHex(color.r, color.g, color.b, color.a)])? self.configs.colors["#" + self.rgbToHex(color.r, color.g, color.b, color.a)]: undefined;
            if(propertyConfigs.showColorName && colorName){
                return colorName;
            }

            if(colorFormat === 0){
                return "#" + self.rgbToHex(color.r, color.g, color.b) + " " + Math.round(color.a * 100) + "%";
            }
            else if(colorFormat === 1){
                return "#" + self.rgbToHex(color.r, color.g, color.b, color.a);
            }
            return "rgba(" + color.r + "," + color.g + "," + color.b + "," + Math.round(color.a * 10) / 10 + ")";
        }

        var colorTypeContent = function(fillJSON){
            var fillJSON = fillJSON;

            if(fillJSON.fillType == "color"){
                return colorContent(fillJSON.color);
            }

            if(fillJSON.fillType == "gradient"){
                var fc = [];
                fc.push(fillJSON.gradient.type)
                fillJSON.gradient.colorStops.forEach(function(gradient){
                    fc.push(" * " + colorContent(gradient.color));
                });
                return fc.join("\r\n");
            }
        }

        var shadowContent = function(shadow){
            var shadowJSON = self.shadowToJSON(shadow);
            var sc = [];
            if(shadowJSON <= 0) return false;

            sc.push(" * x, y - " + self.updateLength(shadowJSON.offsetX) + ", " + self.updateLength(shadowJSON.offsetY) );
            if(shadowJSON.blurRadius) sc.push(" * blur - " + self.updateLength(shadowJSON.blurRadius) );
            if(shadowJSON.spread) sc.push(" * spread - " + self.updateLength(shadowJSON.spread) );
            return sc.join("\r\n")
        }

        if(types.length <= 0) return false;

        types.forEach(function(type){
            switch(type){
                case "color":
                    if(self.is(layer, MSShapeGroup)){
                        var fillsJSON = self.getFills(layerStyle);

                        if(fillsJSON.length <= 0) return false;

                        var fillJSON = fillsJSON.pop();

                        content.push("fill: " + colorTypeContent(fillJSON));
                    }
                    if(self.is(layer, MSTextLayer)){
                        content.push("text-color: " + colorContent(self.colorToJSON(layer.textColor())));

                    }
                    break;
                case "border":
                    var bordersJSON = self.getBorders(layerStyle);
                    if(bordersJSON.length <= 0) return false;
                    var borderJSON = bordersJSON.pop();

                    content.push("border: " + self.updateLength(borderJSON.thickness) + " " + borderJSON.position + "\r\n * " + colorTypeContent(borderJSON) );
                    break;
                case "opacity":
                    content.push("opacity: " + Math.round( layerStyle.contextSettings().opacity() * 100) + "%");
                    break;
                case "radius":
                    if(!self.is(layer, MSShapeGroup) || !self.is(layer.layers().firstObject(), MSRectangleShape)) return false;
                    var shape = self.is(layer.layers().firstObject(), MSRectangleShape)? layer.layers().firstObject(): undefined;
                    content.push("radius: " + self.updateLength(shape.fixedRadius()));
                    break;
                case "shadow":
                    if(!layerStyle.shadow() || (layerStyle.shadow() && !layerStyle.shadow().isEnabled()) ) return false;
                    content.push("shadow: \r\n" + shadowContent(layerStyle.shadow()));
                    break;
                case "inner-shadow":
                    if(!layerStyle.innerShadow() || (layerStyle.innerShadow() && !layerStyle.innerShadow().isEnabled()) ) return false;
                    content.push("inner-shadow: \r\n" + shadowContent(layerStyle.innerShadow()));
                    break;
                case "font-size":
                    if(!self.is(layer, MSTextLayer)) return false;
                    content.push("font-size: " + self.updateLength(layer.fontSize(), true) );
                    break;
                case "character":
                    if(!self.is(layer, MSTextLayer)) return false;
                    content.push("character: " + self.updateLength(layer.characterSpacing(), true) );
                    break;
                case "line-height":
                    if(!self.is(layer, MSTextLayer)) return false;
                    content.push("line: " + self.updateLength(layer.lineSpacing(), true) + " (" + Math.round(layer.lineSpacing() / layer.fontSize() * 10) / 10  + ")" );
                    break;
                case "font-face":
                    if(!self.is(layer, MSTextLayer)) return false;
                    content.push("font-face: " + layer.fontPostscriptName());
                    break;
                case "style-name":
                    var styleName = self.getStyleName( layer.style(), self.is(layer, MSTextLayer) );
                    if( !styleName ) return false;
                    content.push("style-name: " + styleName );
                    break;
            }
        });

        if(content.length <= 0) return false;

        var name = "PROPERTY#" + layer.objectID();
        var frame = this.getFrame(layer);
        var distance = this.getDistance(frame);

        var temp = this.addText();
        temp.setStyle(styles[1]);
        temp.setStringValue(content.join("\r\n"));
        temp.setTextBehaviour(1);
        temp.setTextBehaviour(0);

        var aFrame = this.getFrame(this.current);
        var tempFrame = temp.absoluteRect();


        var tw = tempFrame.width() + 8;
        var th = tempFrame.height() + 6;

        var tempX = frame.x - this.mathHalf(tempFrame.width() - frame.width);
        var tempY = frame.y - this.mathHalf(tempFrame.height() - frame.height);

        tempX = (position === 1)? frame.x + frame.width + 7: tempX;
        tempX = (position === 3)? frame.x - tempFrame.width() -7: tempX;

        tempY = (position === 0)? frame.y - tempFrame.height() - 6: tempY;
        tempY = (position === 2)? frame.y + frame.height + 6: tempY;

        tempFrame.setX(tempX);
        tempFrame.setY(tempY);

        return this.createNote(temp, frame, styles, name, {
            types: types,
            position: position,
            colorFormat: colorFormat
        });
    }
});

com.utom.extend({
    isHidden: false,
    isLocked: false,
    regexName: /OVERLAYER\#|WIDTH\#|HEIGHT\#|TOP\#|RIGHT\#|BOTTOM\#|LEFT\#|VERTICAL\#|HORIZONTAL\#|NOTE\#|LABEL\#|TYPOGRAPHY\#|PROPERTY\#|LITE\#/,
    toggleHidden: function(){
        if(!this.configs) return false;

        var page = this.page;

        var isHidden = (this.configs.isHidden)? false : !Boolean(this.configs.isHidden);
        this.configs = this.setConfigs({isHidden: isHidden});

        var layers = page.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && this.regexName.exec(item.name())){
                item.setIsVisible(!isHidden);
            }
        }
    },
    toggleLocked: function(){
        if(!this.configs) return false;

        var page = this.page;

        var isLocked = (this.configs.isLocked)? false : !Boolean(this.configs.isLocked);
        this.configs = this.setConfigs({isLocked: isLocked});

        var layers = page.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && this.regexName.exec(item.name())){
                item.setIsLocked(isLocked);
            }
        }
    },
    moveToGroup: function(){
        if(!this.configs) return false;

        var artboard = this.artboard;

        var groupSpecs = this.find("@Specs");
        if(!groupSpecs){
            groupSpecs = this.addGroup(artboard);
            groupSpecs.setName("@Specs");
        }

        var layers = artboard.children().objectEnumerator();
        var specLayers = [];

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && this.regexName.exec(item.name())){
                this.removeLayer(item);
                specLayers.push(item);
            }
        }

        groupSpecs.addLayers(specLayers);
        groupSpecs.resizeToFitChildrenWithOption(0);
        groupSpecs.setIsLocked(true);
    },
    clearMeasure: function(){
        if(!this.configs) return false;

        var page = this.page;

        var layers = page.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && this.regexName.exec(item.name())){
                this.removeLayer(item);
            }
        }
    },
    resetSizeGuide: function(layerGroup){
        if(this.configs.theme) return this.resetSizeGuideNop( layerGroup );
        var smConfigs = this.getConfigs(layerGroup),
            layers = layerGroup.children().objectEnumerator(),
            label, gap, text;

        while(layer = layers.nextObject()) {
            if(layer.name() == "label") label = layer;
            if(layer.name() == "gap") gap = layer;
            if(this.is(layer, MSTextLayer)) text = layer;
        }

        if(/\%/.exec( this.toJSString(text.storage().string()) )) return false;

        lf = this.getFrame(label);
        gf = this.getFrame(gap);
        tf = this.getFrame(text);

        text.setStringValue(this.updateLength(smConfigs.original));
        text.setTextBehaviour(1);
        text.setTextBehaviour(0);

        ntf = this.getFrame(text);

        var la = label.absoluteRect();
        var ta = text.absoluteRect();
        var dx = this.mathHalf(ntf.width - tf.width);
        dx = (gf.maxX > lf.maxX)? (ntf.width - tf.width): dx;
        dx = (gf.x < lf.x && gf.maxX < lf.maxX)? 0: dx;
        ta.setX(tf.x - dx);
        la.setX(lf.x - dx);
        la.setWidth( ta.width() + 7 );

        layerGroup.resizeToFitChildrenWithOption(0);

        return layerGroup;
    },
    resetSizeGuideNop: function(layerGroup){
        var smConfigs = this.getConfigs(layerGroup),
            layers = layerGroup.children().objectEnumerator(),
            arrow, line, text;
        while(layer = layers.nextObject()) {
            if(layer.name() == "arrow") arrow = layer;
            if(layer.name() == "line") line = layer;
            if(this.is(layer, MSTextLayer)) text = layer;
        }

        if(/\%/.exec( this.toJSString(text.storage().string()) )) return false;

        af = this.getFrame(arrow);
        lf = this.getFrame(line);
        tf = this.getFrame(text);

        text.setStringValue(this.updateLength(smConfigs.original));
        text.setTextBehaviour(1);
        text.setTextBehaviour(0);

        ntf = this.getFrame(text);

        var aa = arrow.absoluteRect();
        var ta = text.absoluteRect();
        var dx = this.mathHalf(ntf.width - tf.width);
        if(lf.maxX < af.maxX){
            dx = 0;
        }
        else if(lf.x > af.x){
            dx = dx * 2;
        }

        ta.setX(tf.x - dx);

        layerGroup.resizeToFitChildrenWithOption(0);

        return layerGroup;
    },
    resetPropertyGuide: function(layerGroup){
        var smConfigs = this.getConfigs(layerGroup);
        var splitName = layerGroup.name().split("#");
        var msLayer = this.find(splitName[1], this.page, false, "objectID");
        var msText = this.find(MSTextLayer, layerGroup, false, "class");
        var lf = this.getFrame(layerGroup);
        var nl = this.getProperty(msLayer, smConfigs).absoluteRect();

        nl.setX(lf.x);
        nl.setY(lf.y);

        return layerGroup;
    },
    resetConfigs: function(){
        if(!this.configs) return false;
        var theme = this.configs.theme;
        this.removeConfigs();
        this.initConfigs();

        this.configs = this.setConfigs({theme: theme});

        var page = this.page;

        var layers = page.children().objectEnumerator();

        while(item = layers.nextObject()) {
            if(this.is(item, MSLayerGroup) && /WIDTH\#|HEIGHT\#|TOP\#|RIGHT\#|BOTTOM\#|LEFT\#|VERTICAL\#|HORIZONTAL\#|LITE\#/.exec(item.name())){
                this.resetSizeGuide(item);
            }
            else if( this.is(item, MSLayerGroup) && /PROPERTY\#/.exec(item.name()) ){
                this.resetPropertyGuide(item);
            }
        }
    },
    toggleTheme: function(){
        if(!this.configs) return false;

        this.configs.theme = (this.configs.theme)? 0: 1;

        this.configs = this.setConfigs({theme: this.configs.theme});

        this.message(_("Remeasure all guides to see the new theme."));
    },
    getColors: function(output){
        if (!this.configsColors){
            this.configs.colors = {};
            return false;
        }

        var colorJSON = {};
        var colorDetailJSON = {};
        var colorGroups = this.configsColors.layers().array().objectEnumerator();

        while (colorGroup = colorGroups.nextObject()) {
            if( this.is( colorGroup, MSLayerGroup ) ){
                var configs = this.getConfigs(colorGroup);
                var nameLayer = this.find(configs.nameLayer, colorGroup, false, "objectID");
                var colorLayer = this.find(configs.colorLayer, colorGroup, false, "objectID");
                var color = this.getFills(colorLayer.style()).pop().color;
                var hex = "#" + this.rgbToHex(color.r, color.g, color.b);
                var argb_hex = "#" + this.rgbToHex(color.r, color.g, color.b, color.a);
                var name = nameLayer.stringValue();

                colorDetailJSON[argb_hex] = this.extend(color, {
                    name: name,
                    hex: hex,
                    argb_hex: argb_hex
                });
                if(name != _("untitled")){
                    colorJSON[argb_hex] = this.toJSString(name);
                }
            }
        }

        this.setConfigs({colors: colorJSON});
        this.configs.colors = colorJSON;
        this.colors = colorDetailJSON;
        return colorDetailJSON;
    },
    addColors: function(colors){
        var self = this;

        var colors = this.extend(this.colors, colors || {});
        var pluginPath = NSString.stringWithString(self.context.scriptPath).stringByDeletingLastPathComponent();
        var imagePath = pluginPath.stringByAppendingPathComponent("assets/transparent-background.png");
        var transparentImage = [[NSImage alloc] initWithContentsOfFile:imagePath];

        var index = 0;
        var column = 0;
        var row = 0;

        for ( var argb_hex in colors ){
            var color = colors[argb_hex];
            var group = self.addGroup( self.configsColors );
            var shape = self.addShape( group );
            var nameText = self.addText( group );
            var infoText = self.addText( group );
            var name = color.name? color.name: _("untitled");
            var shapeColor = MSColor.colorWithSVGString(color.hex);
            shapeColor.setAlpha(color.a);

            var grayscale = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;

            var textHex = ( grayscale >= 180 )? "#4A4A4A": "#FFFFFF";
            textHex = (color.a <= .3)? "#4A4A4A": textHex;

            var textColor =  MSColor.colorWithSVGString(textHex);

            group.setName(name);
            shape.setName("color");
            nameText.setName("name");
            infoText.setName("text");

            shape.frame().setWidth(160);
            shape.frame().setHeight(128);

            var transparentBg = shape.style().addStylePartOfType(0);
            transparentBg.setFillType(4);
            transparentBg.setPatternFillType(0);
            transparentBg.setPatternImage(transparentImage);

            var colorBg = shape.style().addStylePartOfType(0);
            colorBg.setFillType(0);
            colorBg.color = shapeColor;

            nameText.frame().setX(16);
            nameText.frame().setY(16);
            nameText.setTextColor(textColor);
            nameText.setFontSize(18);
            nameText.setFontPostscriptName("HelveticaNeue-Medium");
            nameText.setStringValue(name);
            nameText.setTextBehaviour(1);
            nameText.setTextBehaviour(0);

            info = [
                "#" + self.rgbToHex(color.r, color.g, color.b) + ", " + Math.round(color.a * 100) + "%",
                "#" + self.rgbToHex(color.r, color.g, color.b, color.a),
                "rgba(" + color.r + "," + color.g + "," + color.b + "," + Math.round(color.a * 10) / 10 + ")"
            ]

            textColor.setAlpha(.64)
            infoText.frame().setX(16);
            infoText.frame().setY(48);
            infoText.setTextColor(textColor);
            infoText.setFontSize(14);
            infoText.setFontPostscriptName("HelveticaNeue-Light");
            infoText.setStringValue(info.join("\r\n"));
            infoText.setTextBehaviour(1);
            infoText.setTextBehaviour(0);

            shape.setIsLocked(true);
            // infoText.setIsLocked(true);
            group.resizeToFitChildrenWithOption(0);
            group.frame().setX( 160 * column );
            group.frame().setY( 128 * row );

            self.setConfigs({nameLayer: self.toJSString(nameText.objectID()), colorLayer: self.toJSString(shape.objectID())}, group);

            if(index % 5 == 4 && column == 4){
                if(row * 128 > 640) self.configsColors.frame().setHeight(row * 128)
                row++
            }

            if(index % 5 == 4){
                column = 0
            }
            else{
                column++;
            }
            index++;
        }

    },
    getAllColor: function(){
        var self = this;
        var colors = {};
        var colorsArr = [];
        var context = this.context;
        var document = this.document;
        var selection = this.selection;
        var getColor = function(color){
            var color = color;
            var hex = "#" + self.rgbToHex(color.r, color.g, color.b);
            var argb_hex = "#" + self.rgbToHex(color.r, color.g, color.b, color.a);
            var obj = self.extend(color, {
                name: _("untitled"),
                hex: hex,
                argb_hex: argb_hex
            });

            if(!colors[argb_hex]){
                colorsArr.push(obj);
            }
            colors[argb_hex] = obj

        };
        var getColorType = function(fillJSON){
            var fillJSON = fillJSON;
            
            if(fillJSON.fillType == "color"){
                getColor(fillJSON.color);
            }

            if(fillJSON.fillType == "gradient"){
                fillJSON.gradient.colorStops.forEach(function(gradient){
                    getColor(gradient.color);
                });
            }
        }

        var selectionArtboards = this.find(MSArtboardGroup, selection, true, "class");

        if(!selectionArtboards){
            this.message(_("Select 1 or multiple artboards"));
            return false;
        }

        selectionArtboards = (this.is(selectionArtboards, MSArtboardGroup))? NSArray.arrayWithObjects(selectionArtboards): selectionArtboards;
        selectionArtboards = selectionArtboards.objectEnumerator();
        while(msArtboard = selectionArtboards.nextObject()){
            if(msArtboard instanceof MSArtboardGroup){
                var layerIter = msArtboard.children().objectEnumerator();
                while(msLayer = layerIter.nextObject()) {
                    var msGroup = msLayer.parentGroup();

                    if(msLayer && this.is(msLayer, MSLayerGroup) && /LABEL\#|NOTE\#/.exec(msLayer.name())){
                        var msText = msLayer.children()[2];
                        msLayer.setIsVisible(false);
                    }

                    var layerStates = this.getStates(msLayer);

                    if (
                        !this.isExportable(msLayer) ||
                        !layerStates.isVisible ||
                        layerStates.isLocked ||
                        layerStates.hasSlices ||
                        this.isMeasure(msLayer)
                    )
                    {
                        continue;
                    }

                    if ( !this.is(msLayer, MSSliceLayer) ) {
                        var layerStyle = msLayer.style();


                        var fillsJSON = this.getFills(layerStyle);
                        if(fillsJSON.length > 0){
                            var fillJSON = fillsJSON.pop();
                            getColorType(fillJSON)

                        }

                        var bordersJSON = self.getBorders(layerStyle);
                        if(bordersJSON.length > 0){
                            var borderJSON = bordersJSON.pop();
                            getColorType(borderJSON)
                        }

                    }

                    if ( this.is(msLayer, MSTextLayer) ) {
                        getColor(self.colorToJSON(msLayer.textColor()))
                    }
                }
            }
        }

        return colors
    },
    colorPalette: function(){
        if(!this.configs) return false;

        var currentPage = this.page;
        if(this.configsPage == false){
            this.configsPage = this.document.addBlankPage();
            this.configsPage.setName("Sketch Measure");
            this.document.setCurrentPage(currentPage);
        }

        this.configsColors = this.find("Color Palette", this.configsPage);
        this.configsColors = (!this.configsColors || this.is(this.configsColors, MSArtboardGroup))? this.configsColors: undefined;
        
        if( this.configsColors ){
            this.getColors()
            this.removeLayer(this.configsColors);
        }
        this.configsColors = MSArtboardGroup.new();
        frame = this.configsColors.frame();
        frame.setWidth(800);
        frame.setHeight(640);
        frame.setConstrainProportions(false);
        this.configsPage.addLayers([this.configsColors]);
        this.configsColors.setName("Color Palette");
        this.document.setCurrentPage(this.configsPage);


        this.addColors(this.getAllColor());

    }
});

com.utom.extend({
    liteWidth: function(){
        if(!this.configs) return false;

        var styles = styles || [
            this.sharedLayerStyle("@Lite / Layer", "#9013FE"),
            this.sharedTextStyle("@Lite / Text", "#FFFFFF"),
            this.sharedTextStyle("@Lite / Type", "#9013FE")
        ];

        if (this.selection.count() != 1){
            this.message(_("Please select 1 layers for be measure."));
            return false;
        }

        var name = "LITE#" + this.selection[0].objectID();

        var container = this.measureWidth(this.selection[0], styles, name, true);

        this.removeLayer(this.selection[0]);

        container.setIsSelected(true);
    },
    liteHeight: function(){
        if(!this.configs) return false;

        var styles = styles || [
            this.sharedLayerStyle("@Lite / Layer", "#9013FE"),
            this.sharedTextStyle("@Lite / Text", "#FFFFFF"),
            this.sharedTextStyle("@Lite / Type", "#9013FE")
        ];

        if (this.selection.count() != 1){
            this.message(_("Please select 1 layers for be measure."));
            return false;
        }

        var name = "LITE#" + this.selection[0].objectID();

        var container = this.measureHeight(this.selection[0], styles, name, true);

        this.removeLayer(this.selection[0]);

        container.setIsSelected(true);
    },
    liteHeight: function(){
        if(!this.configs) return false;

        var styles = styles || [
            this.sharedLayerStyle("@Lite / Layer", "#9013FE"),
            this.sharedTextStyle("@Lite / Text", "#FFFFFF")
        ];

        if (this.selection.count() != 1){
            this.message(_("Please select 1 layers for be measure."));
            return false;
        }

        var name = "LITE#" + this.selection[0].objectID();

        var container = this.measureHeight(this.selection[0], styles, name, true);

        this.removeLayer(this.selection[0]);

        container.setIsSelected(true);
    }
})

com.utom.extend({
    BorderPositions: ["center", "inside", "outside"],
    FillTypes: ["color", "gradient"],
    GradientTypes: ["linear", "radial", "angular"],
    ShadowTypes: ["outer", "inner"],
    TextAligns: ["left", "right", "center", "justify", "left"]
});  

com.utom.extend({
    slicesPath: undefined,
    maskObjectID: undefined,
    maskRect: undefined,
    symbols: {},
    isExportable: function(layer) {
        return this.is(layer, MSTextLayer) ||
               this.is(layer, MSShapeGroup) ||
               this.is(layer, MSBitmapLayer) ||
               this.is(layer, MSSliceLayer) ||
               this.is(layer, MSSymbolInstance) ||
               this.is(layer, MSLayerGroup) && this.hasExportSizes(layer)
    },
    isMeasure: function(layer){
        var msGroup = layer.parentGroup();
        return (this.regexName.exec(msGroup.name()));
    },
    getStates: function(layer){
        var isVisible = true;
        var isLocked = false;
        var hasSlices = false;
        var isMaskChildLayer = false;

        while (!( this.is(layer, MSArtboardGroup) || this.is(layer, MSSymbolMaster) ) ) {
            var msGroup = layer.parentGroup();
            if (!layer.isVisible()) {
                isVisible = false;
            }

            if (layer.isLocked()) {
                isLocked = true;
            }

            if ( this.is(msGroup, MSLayerGroup) && this.hasExportSizes(msGroup) ) {
                hasSlices = true
            }

            if (
                this.maskObjectID &&
                msGroup.objectID() == this.maskObjectID &&
                !layer.shouldBreakMaskChain()
            ) {
                isMaskChildLayer = true
            }

            layer = msGroup;
        }
        return {
            isVisible: isVisible,
            isLocked: isLocked,
            hasSlices: hasSlices,
            isMaskChildLayer: isMaskChildLayer
        }
    },
    updateMaskRect: function(layer) {
        var layer = this.extend(layer, {});
        layer.maxX = layer.x + layer.width;
        layer.maxY = layer.y + layer.height;
        var mask = this.extend(this.maskRect, {});
        mask.maxX = mask.x + mask.width;
        mask.maxY = mask.y + mask.height;
        var x = layer.x;
        var y = layer.y;
        var width = layer.width;
        var height = layer.height;
        var dx = 0;
        var dy = 0;

        if(this.isIntersect(layer, mask)){
            if(layer.x < mask.x){
                x = mask.x;
                dx = mask.x - layer.x;
            }

            if(layer.y < mask.y){
                y = mask.y;
                dy = mask.y - layer.y;
            }

            if(layer.maxX > mask.maxX){
                width = width - (layer.maxX - mask.maxX) - dx;
            }
            else{
                width = width - dx;
            }

            if(layer.maxY > mask.maxY){
                height = height - (layer.maxY - mask.maxY) - dy;
            }
            else{
                height = height - dy;
            }

            return {
                x: x,
                y: y,
                width: width,
                height: height
            }
        }
        else{
            return false
        }

    },
    hasExportSizes: function(layer){
        return layer.exportOptions().exportFormats().count() > 0;
    },
    toJSString: function(str){
        return new String(str).toString();
    },
    pointToJSON: function(point){
        return {
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        };
    },
    sizeToJSON: function(size){
        return {
            width: parseFloat(size.width),
            height: parseFloat(size.height)
        };
    },
    rectToJSON: function(rect, referenceRect) {
        if (referenceRect) {
            return {
                x: rect.x() - referenceRect.x(),
                y: rect.y() - referenceRect.y(),
                width: rect.width(),
                height: rect.height()
            };
        }

        return {
            x: rect.x(),
            y: rect.y(),
            width: rect.width(),
            height: rect.height()
        };
    },
    colorToJSON: function(color) {
        return {
            r: Math.round(color.red() * 255),
            g: Math.round(color.green() * 255),
            b: Math.round(color.blue() * 255),
            a: color.alpha()
        };
    },
    colorStopToJSON: function(colorStop) {
        return {
            color: this.colorToJSON(colorStop.color()),
            position: colorStop.position()
        };
    },
    gradientToJSON: function(gradient) {
        var stops = [],
            msStop, stopIter = gradient.stops().array().objectEnumerator();
        while (msStop = stopIter.nextObject()) {
            stops.push(this.colorStopToJSON(msStop));
        }

        return {
            type: this.GradientTypes[gradient.gradientType()],
            from: this.pointToJSON(gradient.from()),
            to: this.pointToJSON(gradient.to()),
            colorStops: stops
        };
    },
    shadowToJSON: function(shadow) {
        return {
            type: shadow instanceof MSStyleShadow ? "outer" : "inner",
            offsetX: shadow.offsetX(),
            offsetY: shadow.offsetY(),
            blurRadius: shadow.blurRadius(),
            spread: shadow.spread(),
            color: this.colorToJSON(shadow.color())
        };
    },
    exportSizesToJSON: function(size, layer, slicesPath) {
        var slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
        var size = this.toJSString(size).split(" ");
        var document = this.document;
        slice.scale = size[0];
        slice.format = size[2];

        var suffix = this.toJSString(size[1]);
        suffix = (suffix)? suffix : "";

        var sliceName = this.toJSString(layer.name() + suffix + "." + size[2]);
        var sliceFileName = slicesPath.stringByAppendingPathComponent( sliceName );

        [document saveArtboardOrSlice:slice toFile:sliceFileName];

        return {
            sliceName: "slices/" + sliceName,
            scale: size[0],
            suffix: suffix,
            format: size[2]
        };
    },
    getBorders: function(style) {
        var borders = [],
            msBorder, borderIter = style.borders().array().objectEnumerator();
        while (msBorder = borderIter.nextObject()) {
            if (msBorder.isEnabled()) {
                var fillType = this.FillTypes[msBorder.fillType()],
                    border = {
                        fillType: fillType,
                        position: this.BorderPositions[msBorder.position()],
                        thickness: msBorder.thickness()
                    };

                switch (fillType) {
                    case "color":
                        border.color = this.colorToJSON(msBorder.color());
                        break;

                    case "gradient":
                        border.gradient = this.gradientToJSON(msBorder.gradient());
                        break;

                    default:
                        continue;
                }

                borders.push(border);
            }
        }

        return borders;
    },
    getFills: function(style) {
        var fills = [],
            msFill, fillIter = style.fills().array().objectEnumerator();
        while (msFill = fillIter.nextObject()) {
            if (msFill.isEnabled()) {
                var fillType = this.FillTypes[msFill.fillType()],
                    fill = {
                        fillType: fillType
                    };

                switch (fillType) {
                    case "color":
                        fill.color = this.colorToJSON(msFill.color());
                        break;

                    case "gradient":
                        fill.gradient = this.gradientToJSON(msFill.gradient());
                        break;

                    default:
                        continue;
                }

                fills.push(fill);
            }
        }

        return fills;
    },
    getShadows: function(style) {
        var shadows = [],
            msShadow, shadowIter = style.shadows().array().objectEnumerator();
        while (msShadow = shadowIter.nextObject()) {
            if (msShadow.isEnabled()) {
                shadows.push(this.shadowToJSON(msShadow));
            }
        }

        shadowIter = style.innerShadows().array().objectEnumerator();
        while (msShadow = shadowIter.nextObject()) {
            if (msShadow.isEnabled()) {
                shadows.push(this.shadowToJSON(msShadow));
            }
        }

        return shadows;
    },
    getOpacity: function(style){
        return style.contextSettings().opacity()
    },
    getStyleName: function(style, isText){
        var msStyles = (isText)? this.document.documentData().layerTextStyles(): this.document.documentData().layerStyles();
        var sharedObjectID = style.sharedObjectID();
        var styles = msStyles.objectsSortedByName();
        var style = this.find(sharedObjectID, styles, true, "objectID");
        if(!style) return "";
        return this.toJSString(style.name());
    },
    exportSizes: function(layer, savePath){
        var self = this,
            exportSizes = [],
            size, sizesInter = layer.exportOptions().exportFormats().array().objectEnumerator();

        while (size = sizesInter.nextObject()) {
            if (!self.slicesPath){
                var slicesPath = savePath.stringByAppendingPathComponent("slices");
                self.slicesPath = slicesPath;
                [[NSFileManager defaultManager] createDirectoryAtPath:slicesPath withIntermediateDirectories:true attributes:nil error:nil];
            }

            exportSizes.push(this.exportSizesToJSON(size, layer, self.slicesPath));
        }

        return exportSizes;
    },
    getSavePath: function(){
        var filePath = this.document.fileURL()? this.document.fileURL().path().stringByDeletingLastPathComponent(): "~";
        var fileName = this.document.displayName().stringByDeletingPathExtension();
        var savePanel = NSSavePanel.savePanel();

        savePanel.setTitle(_("Export spec"));
        savePanel.setNameFieldLabel(_("Export to:"));
        savePanel.setPrompt(_("Export"));
        savePanel.setCanCreateDirectories(true);
        savePanel.setNameFieldStringValue(fileName);

        if (savePanel.runModal() != NSOKButton) {
            return false;
        }

        return savePanel.URL().path();
    },
    getArtboard: function( msArtboard, savePath, symbolOffset ){
        var context = this.context;
        var document = this.document;
        var selection = this.selection;

        var tempCon = this.templateContents.tempCon;
        var jqCon = this.templateContents.jqCon;
        var jsappCon = this.templateContents.jsappCon;
        var specCon = this.templateContents.specCon;
        var cssnorCon = this.templateContents.cssnorCon;
        var cssappCon = this.templateContents.cssappCon;

        if(msArtboard instanceof MSArtboardGroup || msArtboard instanceof MSSymbolMaster){
            var artboardFrame = msArtboard.frame();
            var layers = [];
            var notes = [];
            var layerIter = msArtboard.children().objectEnumerator();
            var name = msArtboard.objectID();

            while(msLayer = layerIter.nextObject()) {
                var msGroup = msLayer.parentGroup();

                if(msLayer && this.is(msLayer, MSLayerGroup) && /LABEL\#|NOTE\#/.exec(msLayer.name())){
                    var msText = msLayer.children()[2];

                    notes.push({
                        rect: this.rectToJSON(msLayer.absoluteRect(), artboardFrame),
                        note: this.toJSString(msText.stringValue()).replace(/\n/g,"<br>")
                    });

                    msLayer.setIsVisible(false);
                }

                var layerStates = this.getStates(msLayer);

                if (
                    !this.isExportable(msLayer) ||
                    !layerStates.isVisible ||
                    layerStates.isLocked ||
                    layerStates.hasSlices ||
                    this.isMeasure(msLayer)
                )
                {
                    continue;
                }

                var type = this.is(msLayer, MSTextLayer) ? "text" : "shape";
                type = this.is(msLayer, MSSymbolInstance) ? "symbol" : type;
                type = this.hasExportSizes(msLayer) || this.is(msLayer, MSSliceLayer) ? "slice" : type;

                var layer = {};
                layer.objectID = this.toJSString(msLayer.objectID());
                layer.type = type;
                layer.name = this.toJSString(msLayer.name());
                layer.rect = this.rectToJSON(msLayer.absoluteRect(), artboardFrame);
                if(symbolOffset){
                    layer.rect.x = symbolOffset.x + layer.rect.x;
                    layer.rect.y = symbolOffset.y + layer.rect.y;
                }
                layer.exportSizes = this.exportSizes(msLayer, savePath);

                if ( ! ( this.is(msLayer, MSSliceLayer) || this.is(msLayer, MSSymbolInstance) ) ) {
                    var layerStyle = msLayer.style();

                    layer.rotation = msLayer.rotation();
                    layer.radius = ( msLayer.layers && this.is(msLayer.layers().firstObject(), MSRectangleShape) ) ? msLayer.layers().firstObject().fixedRadius(): null;
                    layer.borders = this.getBorders(layerStyle);
                    layer.fills = this.getFills(layerStyle);
                    layer.shadows = this.getShadows(layerStyle);
                    layer.opacity = this.getOpacity(layerStyle);
                    layer.styleName = (this.is(msLayer, MSTextLayer))? this.getStyleName(layerStyle, true): this.getStyleName(layerStyle);
                }

                if ( this.is(msLayer, MSTextLayer) ) {
                    layer.content = this.toJSString(msLayer.storage().string()),
                    layer.color = this.colorToJSON(msLayer.textColor());
                    layer.fontSize = msLayer.fontSize();
                    layer.fontFace = this.toJSString(msLayer.fontPostscriptName());
                    layer.textAlign = this.TextAligns[msLayer.textAlignment()];
                    layer.letterSpacing = msLayer.characterSpacing();
                    layer.lineHeight = msLayer.lineHeight();
                }


                if(msLayer.hasClippingMask()){
                    this.maskObjectID = msGroup.objectID();
                    this.maskRect = this.rectToJSON(msLayer.absoluteRect(), artboardFrame);
                }
                else if (this.maskObjectID != msGroup.objectID() || msLayer.shouldBreakMaskChain()) {
                    this.maskObjectID = undefined;
                    this.maskRect = undefined;
                }

                if ( type ===  "slice" ){
                    this.slicesData.push(layer);
                }

                if (layerStates.isMaskChildLayer){
                    layer.rect = this.updateMaskRect(layer.rect)
                }

                if (layer.rect){
                    layers.push(layer);
                }

                if( this.is(msLayer, MSSymbolInstance) ){
                    var symbolLayers = this.getArtboard(msLayer.symbolMaster(), savePath, {x: layer.rect.x, y: layer.rect.y});
                    symbolLayers.forEach(function(layer){
                        layers.push(layer);
                    });
                }
            }

            if(!symbolOffset){
                var imageFileName = name + ".png";
                var imagePath = this.toJSString( NSTemporaryDirectory().stringByAppendingPathComponent(imageFileName) );
                var sliceArtboard = MSExportRequest.exportRequestsFromExportableLayer(msArtboard).firstObject();
                sliceArtboard.scale = 2
                [document saveArtboardOrSlice: sliceArtboard
                    toFile: imagePath ];

                var imageURL = NSURL.fileURLWithPath(imagePath);
                var imageData = NSData.dataWithContentsOfURL(imageURL);
                var imageBase64 = imageData.base64EncodedStringWithOptions(0);

                var artboardData = {
                    objectID: this.toJSString(msArtboard.objectID()),
                    name: this.toJSString(msArtboard.name()),
                    imageBase64: this.toJSString(imageBase64),
                    width: artboardFrame.width(),
                    height: artboardFrame.height()
                };

                this.artboardsData.push(artboardData);


                var data = this.extend(artboardData, {
                    resolution: this.configs.resolution,
                    zoom: 1,
                    layers: layers,
                    notes: notes
                });

                var specContent = this.template(specCon, {json: JSON.stringify(data).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')});

                var content = this.template(tempCon, {
                    cssNormalize: cssnorCon,
                    cssApp: cssappCon,
                    jsjQuery: jqCon,
                    jsApp: jsappCon,
                    jsSpec: specContent
                });
                content = NSString.stringWithString(content);
                var artname = this.toJSString( msArtboard.name() ).replace(/[\/\\]/g, "-");
                var exportURL = savePath.stringByAppendingPathComponent( artname + ".html");

                [content writeToFile: exportURL
                          atomically: false
                            encoding: NSUTF8StringEncoding
                               error: null];
            }
            else{
                return layers
            }
        }
    },
    artboardsData: [],
    slicesData: [],
    specExport: function(){
        if(!this.configs) return false;

        var context = this.context;
        var document = this.document;
        var selection = this.selection;

        var selectionArtboards = this.find(MSArtboardGroup, selection, true, "class");

        if(!selectionArtboards){
            this.message(_("Select 1 or multiple artboards"));
            return false;
        }

        savePath = this.getSavePath();
        if(!savePath) return false;
        [[NSFileManager defaultManager] createDirectoryAtPath:savePath withIntermediateDirectories:true attributes:nil error:nil];

        var pluginPath = NSString.stringWithString(this.context.scriptPath).stringByDeletingLastPathComponent();
        var tempPath = pluginPath.stringByAppendingPathComponent("assets/template.html");
        var jqPath = pluginPath.stringByAppendingPathComponent("assets/jquery-1.12.0.min.js");
        var jsappPath = pluginPath.stringByAppendingPathComponent("assets/app.js");
        var specPath = pluginPath.stringByAppendingPathComponent("assets/spec.js");
        var cssnorPath = pluginPath.stringByAppendingPathComponent("assets/normalize-3.0.3.min.css");
        var cssappPath = pluginPath.stringByAppendingPathComponent("assets/app.css");

        var tempCon = [NSString stringWithContentsOfFile:tempPath encoding:NSUTF8StringEncoding error:nil];
        var jqCon = [NSString stringWithContentsOfFile:jqPath encoding:NSUTF8StringEncoding error:nil];
        var jsappCon = [NSString stringWithContentsOfFile:jsappPath encoding:NSUTF8StringEncoding error:nil];
        var specCon = [NSString stringWithContentsOfFile:specPath encoding:NSUTF8StringEncoding error:nil];
        var cssnorCon = [NSString stringWithContentsOfFile:cssnorPath encoding:NSUTF8StringEncoding error:nil];
        var cssappCon = [NSString stringWithContentsOfFile:cssappPath encoding:NSUTF8StringEncoding error:nil];
        this.templateContents = {
            tempCon: tempCon,
            jqCon: jqCon,
            jsappCon: jsappCon,
            specCon: specCon,
            cssnorCon: cssnorCon,
            cssappCon: cssappCon
        }

        selectionArtboards = (this.is(selectionArtboards, MSArtboardGroup))? NSArray.arrayWithObjects(selectionArtboards): selectionArtboards;
        selectionArtboards = selectionArtboards.objectEnumerator();

        while(msArtboard = selectionArtboards.nextObject()){
            this.getArtboard(msArtboard, savePath);
        }

        var sliceLayers = this.page.exportableLayers();

        var artboardsData = this.artboardsData;
        var slicesData = this.slicesData;

        if(slicesData.length > 0){
            var sContent = NSString.stringWithString("var slices = " + JSON.stringify(slicesData) + ";");
            var sExportURL = savePath.stringByAppendingPathComponent( "slices.js");
            [sContent writeToFile: sExportURL
                              atomically: false
                                encoding: NSUTF8StringEncoding
                                   error: null];
        }

        if(artboardsData.length > 1){
            var aContent = NSString.stringWithString("var artboards = " + JSON.stringify(artboardsData) + ";");
            var aExportURL = savePath.stringByAppendingPathComponent( "artboards.js");

            [aContent writeToFile: aExportURL
                              atomically: false
                                encoding: NSUTF8StringEncoding
                                   error: null];
        }

        if(this.configsColors){
            this.getColors();
            var cContent = NSString.stringWithString("var colors = " + JSON.stringify(this.configs.colors) + ";");
            var cExportURL = savePath.stringByAppendingPathComponent( "colors.js");

            [cContent writeToFile: cExportURL
                              atomically: false
                                encoding: NSUTF8StringEncoding
                                   error: null];
        }
        this.message(_("Export complete!"));

    },
    template: function(content, data) {
        var content = content.replace(new RegExp("\\<\\!\\-\\-\\s([^\\s\\-\\-\\>]+)\\s\\-\\-\\>", "gi"), function($0, $1) {
            if ($1 in data) {
                return data[$1];
            } else {
                return $0;
            }
        });
        return content;
    }
});
