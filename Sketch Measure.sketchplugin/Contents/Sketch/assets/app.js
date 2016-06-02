(function(window) {
    var version = "0.0.3", Spec = function(options) {
        return new Spec.fn.init(options);
    },
    jQScreen,
    jQLayers,
    jQSelection,
    jQGuideSizeWidth,
    jQGuideSizeHeight,
    jQGuideHorizontal,
    jQGuideVertical,
    jQGuideTop,
    jQGuideRight,
    jQGuideBottom,
    jQGuideLeft,
    jQZoom,
    jQToggle,
    jQNoteTip,
    jQColorFormat,
    jQResolution,
    jQResolutionList,
    jQAbout,
    jQAboutList,
    jQArtboard,
    jQArtboardList,
    jQAllSliceList,
    jQNavbar,
    jQTabs,
    jQSlices,
    jQLayerName,
    jQProperties,
    jQTypeface,
    jQContent,
    jQFills,
    jQBorders,
    jQShadows,
    jQSidebar,
    ResolutionType = [
      1,   //  0: Standard
      1,   //  1: Points @1x (pt)
      2,   //  2: Retina @2x (pt)
      3,   //  3: Retina HD @3x (pt)
      .75, //  4: LDPI @0.75x (dp, sp)
      1,   //  5: MDPI @1x (dp, sp)
      1.5, //  6: HDPI @1.5x (dp, sp)
      2,   //  7: XHDPI @2x (dp, sp)
      3,   //  8: XXHDPI @3x (dp, sp)
      4,   //  9: XXXHDPI @4x (dp, sp)
      27,  // 10: Ubuntu Grid Units (27px)
      14,  // 11: CSS Rem (14px)
    ],
    ResolutionName = [
      "Standard",                    // 0
      "Points @1x (pt)",             // 1
      "Retina @2x (pt)",             // 2
      "Retina HD @3x (pt)",          // 3
      "LDPI @0.75x (dp, sp)",            // 4
      "MDPI @1x (dp, sp)",               // 5
      "HDPI @1.5x (dp, sp)",             // 6
      "XHDPI @2x (dp, sp)",              // 7
      "XXHDPI @3x (dp, sp)",             // 8
      "XXXHDPI @4x (dp, sp)",            // 9
      "Ubuntu Grid (27px)",    // 10
      "CSS Rem (14px)",              // 11
    ],
    ColorFormat = [
        "Color Hex",
        "RGBA CSS",
        "ARGB Hex"
    ];
    Spec.fn = Spec.prototype = {
        spec:version,
        constructor:Spec,
        index:function() {
            if (!jQSelection) return null;
            return $(".layer").index(jQSelection);
        },
        toHex:function(c) {
            var hex = Math.round(c).toString(16).toUpperCase();
            return hex.length == 1 ? "0" + hex :hex;
        },
        rgbToHex:function(r, g, b, a) {
            if (a === undefined) {
                return "#" + this.toHex(r) + this.toHex(g) + this.toHex(b);
            } else {
                return "#" + this.toHex(a * 255) + this.toHex(r) + this.toHex(g) + this.toHex(b);
            }
        },
        updateColor:function(color) {
            var alpha = Math.round(color.a * 100) / 100,
                hex = this.rgbToHex(color.r, color.g, color.b),
                argbhex = this.rgbToHex(color.r, color.g, color.b, alpha),
                name = this.colorNames? this.colorNames[argbhex]: undefined;

            return {
                r: color.r,
                g: color.g,
                b: color.b,
                a: alpha,
                hex: hex,
                argb: argbhex,
                alpha: Math.round(100 * alpha) + "%",
                name: name? name: undefined
            }
        },
        resolutionSize:function(size, sp) {
            var size = Math.round(size / ResolutionType[this.resolution] * 10) / 10;
            var unit = this.resolution > 3 ? "dp" :"px";
            unit = this.resolution > 0 && this.resolution < 4 ? "pt" : unit;
            unit = this.resolution > 3 && sp ? "sp" : unit;
            unit = this.resolution === 10? "gu" : unit;
            unit = this.resolution === 11? "rem" : unit;
            return size + unit;
        },
        zoomSize:function(size) {
            return Math.round(size * this.zoom);
        },
        isIntersected:function(minAx, maxAx, minAy, maxAy, minBx, maxBx, minBy, maxBy) {
            return !(maxAx <= minBx || minAx >= maxBx || minAy >= maxBy || maxAy <= minBy);
        },
        toggleSidebar:function() {
            jQSidebar.toggleClass("sideoff");
        },
        togglePins:function() {
            var self = this, className = "toggle_show";
            if (!self.visible) {
                className = "toggle_hide";
                self.visible = true;
            } else {
                self.visible = false;
            }
            jQToggle.find("span").attr("class", className);
            $(".pin").toggle();
        },
        toggleResolutionList:function() {
            var self = this;
            if (jQResolutionList.hasClass("hide")) {
                jQResolutionList.removeClass("hide");
            } else {
                jQResolutionList.addClass("hide");
            }
        },
        toggleAboutList:function() {
            var self = this;
            if (jQAboutList.hasClass("hide")) {
                jQAboutList.removeClass("hide");
            } else {
                jQAboutList.addClass("hide");
            }
        },
        toggleNavbar:function() {
            var self = this;
            if (jQNavbar.hasClass("navoff")) {
                jQNavbar.removeClass("navoff");
                jQZoom.addClass("navon");

            } else {
                jQNavbar.addClass("navoff");
                jQZoom.removeClass("navon")
            }
        },
        toggleTabs:function() {
            var self = this;

            jQTabs.find("div").removeClass("current");

            if (jQArtboardList.css("display") == "none") {
                jQArtboardList.show();
                jQAllSliceList.hide();
                jQTabs.find(".a-tab").addClass("current");
            } else {
                jQArtboardList.hide();
                jQAllSliceList.show();
                jQTabs.find(".s-tab").addClass("current");
            }
        },
        showGuideline:function() {
            jQGuideHorizontal.show();
            jQGuideVertical.show();
        },
        hideGuideline:function() {
            jQGuideHorizontal.hide();
            jQGuideVertical.hide();
        },
        hideDistance:function() {
            jQGuideTop.hide();
            jQGuideRight.hide();
            jQGuideBottom.hide();
            jQGuideLeft.hide();
        },
        hideSize:function() {
            jQGuideSizeWidth.hide();
            jQGuideSizeHeight.hide();
        },
        showSize:function() {
            jQGuideSizeWidth.show();
            jQGuideSizeHeight.show();
        },
        alignLabelCenter:function(jQTarget) {
            var jQTarget = jQTarget.find(".label");
            jQTarget.css({
                "margin-top":parseInt(-jQTarget.outerHeight() - 4),
                "margin-left":parseInt(-jQTarget.outerWidth() / 2)
            });
        },
        alignLabelMiddle:function(jQTarget) {
            var jQTarget = jQTarget.find(".label");
            jQTarget.css({
                "margin-top":parseInt(-jQTarget.outerHeight() / 2),
                "margin-left":4
            });
        },
        positive:function(number) {
            return number < 0 ? -number :number;
        },
        template:function(template, model) {
            var templateData = template.html();
            templateData = templateData.replace(new RegExp("\\$\\{([^\\}]+)\\}", "gi"), function($0, $1) {
                if ($1 in model) {
                    return model[$1];
                } else {
                    return $0;
                }
            });
            return $(templateData).data("model", model);
        },
        screen:function() {
            var self = this;
            jQScreen.css({
                width:self.zoomSize(self.data.width) + "px",
                height:self.zoomSize(self.data.height) + "px",
                background:'#FFF url("data:image/png;base64,' + self.data.imageBase64 + '") no-repeat',
                "background-size":self.zoomSize(self.data.width) + "px " + self.zoomSize(self.data.height) + "px "
            });

            if(!self.firstScreen){
                setTimeout(function(){
                    jQScreen.css({
                        transition: "width .3s, height .3s, background-size .3s"
                    });
                }, .2)
                
                self.firstScreen = true;
            }
        },
        layer:function(model) {
            var self = this, model = $.extend(model, {
                x:self.zoomSize(model.rect.x),
                y:self.zoomSize(model.rect.y),
                width:self.zoomSize(model.rect.width),
                height:self.zoomSize(model.rect.height)
            }), jQTemplate = $("#layer-item-template"), jQLayer = self.template(jQTemplate, model);
            return jQLayer;
        },
        edge:function(model) {
            var self = this, jQTemplate = $("#edge-item-template"), jQLayer = self.template(jQTemplate, model);
            return jQLayer;
        },
        note:function(model, index) {
            var self = this, model = $.extend(model, {
                index:index + 1,
                x:self.zoomSize(model.rect.x),
                y:self.zoomSize(model.rect.y)
            }), jQTemplate = $("#note-item-template"), jQLayer = self.template(jQTemplate, model);
            return jQLayer;
        },
        layers:function(selection_index, delay) {
            var self = this, edges = [ {
                position:"top",
                x:0,
                y:-50,
                width:self.zoomSize(self.data.width),
                height:50
            }, {
                position:"right",
                x:self.zoomSize(self.data.width),
                y:0,
                width:100,
                height:self.zoomSize(self.data.height)
            }, {
                position:"bottom",
                x:0,
                y:self.zoomSize(self.data.height),
                width:self.zoomSize(self.data.width),
                height:50
            }, {
                position:"left",
                x:-100,
                y:0,
                width:100,
                height:self.zoomSize(self.data.height)
            } ],
            delay = delay || 0;
            jQLayers.empty();
            self.hideSize();
            setTimeout(function(){
                $.each(self.data.layers, function(index, data) {
                    var jQLayer = self.layer(data);
                    if (selection_index === index) self.select(jQLayer);
                    jQLayers.append(jQLayer);
                });
                $.each(edges, function(index, data) {
                    var jQEdge = self.edge(data);
                    jQLayers.append(jQEdge);
                });
                $.each(self.notes, function(index, data) {
                    var jQNote = self.note(data, index);
                    if (!self.visible) jQNote.hide();
                    jQLayers.append(jQNote);
                });
            }, delay);
        },
        resolutionList:function() {
            var self = this, jQTemplate = $("#list-item-template");
            jQResolutionList.empty();
            $.each(ResolutionName, function(index, name) {
                var jQResolutionItem = self.template(jQTemplate, {
                    index:index,
                    name:name
                });
                if (self.resolution == index) {
                    jQResolutionItem.addClass("current");
                    jQResolution.find("span").html(name);
                }
                jQResolutionList.append(jQResolutionItem);
            });
        },
        artboardList:function(artboards) {
            if(!artboards) return this;
            var self = this, jQTemplate = $("#artboard-item-template");
            jQArtboard.addClass("m");
            jQArtboardList.show();

            $.each(artboards, function(index, artboard) {
                var p = artboard.width / artboard.height,
                    width = (p < 1)? Math.round(44 * p): 44,
                    height = (p < 1)? 44: Math.round(44 / p); 

                var jQArtboardItem = self.template(jQTemplate, {
                    index:index,
                    name: artboard.name,
                    width: width + "px",
                    height: height + "px",
                    base64: artboard.imageBase64
                });

                if (self.data.objectID == artboard.objectID) {
                    jQArtboardItem.addClass("current");
                }
                jQArtboardList.append(jQArtboardItem);
            });

            return this;
        },
        sliceList:function(slices) {
            if(!slices) return this;
            var self = this, jQTemplate = $("#slice-item-template");
            jQArtboard.addClass("m");

            if(jQArtboardList.css("display") != "none"){
                jQTabs.show();
                jQArtboardList.addClass("has-tab");
                jQAllSliceList.addClass("has-tab");
            }
            else{
                jQAllSliceList.show();
            }

            $.each(slices, function(index, slice) {
                var preview = {};
                var jQDownloads = [];
                preview.objectID = slice.objectID;
                preview.name = slice.name;
                preview.scale = 0;
                preview.sliceName = "";
                preview.width = "auto";
                preview.height = "auto";

                $.each(slice.exportSizes, function(index, exportSize) {
                    if(preview.scale < exportSize.scale){
                        preview.scale = exportSize.scale;
                        preview.sliceName = exportSize.sliceName;
                    }
                    jQDownloads.push(self.template($("#slice-template"), { scale: exportSize.scale + "x", sliceName: exportSize.sliceName, fileName: exportSize.sliceName.replace("slices/", "") }) );
                });

                var width = Math.round(slice.rect.width / preview.scale);
                var height = Math.round(slice.rect.height / preview.scale);
                var p = width / height;

                if(p < 1){
                    preview.height = (height > 38)? "38px": height + "px";
                }
                else{
                    preview.width = (width > 38)? "38px": width + "px";
                }

                var jQSliceItem = self.template(jQTemplate, preview);
                var jQSliceDownload = jQSliceItem.find(".s-name");
                jQSliceDownload.append(jQDownloads);
                jQAllSliceList.append(jQSliceItem);
            });
            return this;
        },
        colorList:function(colors) {
            this.colorNames = colors;
        },
        hasColorName:function(jQTarget, colorJSON){
            if (!colorJSON.name){
                jQTarget.find(".color-name").hide();
            }
            else{
                jQTarget.find(".color-info").hide();
            }
        },
        color:function(fill, jQTarget, index, max) {
            var self = this, jQColorTemplate = $("#color-template"), jQFill;
            if (fill.fillType == "color") {
                var colorJSON = self.updateColor(fill.color),
                    jQFill = self.template(jQColorTemplate, colorJSON);
                if (max != index + 1) {
                    jQFill.addClass("mb10");
                }
                jQTarget.append(jQFill);
                self.hasColorName(jQFill, colorJSON);
            } else {
                $.each(fill.gradient.colorStops, function(i, f) {
                    var colorJSON = self.updateColor(f.color),
                        jQFill = self.template(jQColorTemplate, colorJSON);
                    if (fill.gradient.colorStops.length != i + 1) {
                        jQFill.addClass("link");
                    }
                    if (max != index + 1 && fill.gradient.colorStops.length == i + 1) {
                        jQFill.addClass("mb10");
                    }
                    jQTarget.append(jQFill);
                    self.hasColorName(jQFill, colorJSON);
                });
            }

            // console.log(this.colorNames[colorJSON])
        },
        colorFormatShow:function() {
            var self = this,
                jQColorText = $(".color-text").hide(),
                jQColorNormal = $(".normal"),
                jQColorRGBA = $(".rgba"),
                jQColorARGB = $(".argb");
            if (self.colorFormat === 0) jQColorNormal.show();
            if (self.colorFormat == 1) jQColorRGBA.show();
            if (self.colorFormat == 2) jQColorARGB.show();
            jQColorFormat.find("span").text(ColorFormat[self.colorFormat]);
        },
        inspector:function() {
            var self = this, jQColorTemplate = $("#color-template"), model = jQSelection.data("model");
            jQLayerName.text(model.name);
            jQSlices.hide().find("li").empty();
            jQProperties.hide().find("ul").empty();
            jQTypeface.hide().find("ul").empty();
            jQContent.hide().find("ul").empty();
            jQFills.hide().find("ul").empty();
            jQBorders.hide().find("ul").empty();
            jQShadows.hide().find("ul").empty();
            jQProperties.show().find("ul").append(self.template($("#property-template"), {
                x:self.resolutionSize(model.rect.x),
                y:self.resolutionSize(model.rect.y),
                width:self.resolutionSize(model.rect.width),
                height:self.resolutionSize(model.rect.height),
                opacity: Math.round(model.opacity * 100) + "%",
                radius:self.resolutionSize(model.radius)
            }));
            if (!model.radius) $(".radius").hide();
            if (!model.opacity) $(".opacity").hide();
            if (model.type == "text") {
                jQTypeface.show().find("ul").append(
                    self.template($("#type-template"), {
                        size:self.resolutionSize(model.fontSize, true),
                        line:self.resolutionSize(model.lineHeight, true),
                        character:self.resolutionSize(model.letterSpacing, true),
                        face:model.fontFace
                    })
                )

                self.color({fillType: 'color',color: model.color}, jQTypeface.find("ul"));
                jQContent.show().find("ul").append(self.template($("#content-template"), {content: model.content}));
            }
            if (model.fills && model.fills.length > 0) {
                var jQFillList = jQFills.show().find("ul");
                $.each(model.fills, function(index, fill) {
                    self.color(fill, jQFillList, index, model.fills.length);
                });
            }
            if (model.borders && model.borders.length > 0) {
                var jQBorderList = jQBorders.show().find("ul");
                $.each(model.borders, function(index, border) {
                    var jQBorder = self.template($("#border-template"), $.extend({}, border, {
                        thickness:self.resolutionSize(border.thickness)
                    }));
                    jQBorderList.append(jQBorder);
                    self.color(border, jQBorderList, index, model.borders.length);
                });
            }
            if (model.shadows && model.shadows.length > 0) {
                var jQShadowList = jQShadows.show().find("ul");
                $.each(model.shadows, function(index, shadow) {
                    if (model.shadows.length != index + 1) {
                        jQFill.addClass("mb10");
                    }
                    jQShadowList.append(self.template($("#shadow-template"), {
                        type:shadow.type,
                        offsetX:self.resolutionSize(shadow.offsetX),
                        offsetY:self.resolutionSize(shadow.offsetY),
                        blurRadius:self.resolutionSize(shadow.blurRadius),
                        spread:self.resolutionSize(shadow.spread)
                    }));
                    self.color({fillType: 'color',color: shadow.color}, jQShadowList);
                });
            }

            if (model.exportSizes.length > 0){
                var jQSliceList = jQSlices.show().find("li");
                $.each(model.exportSizes, function(index, exportSize) {
                    jQSliceList.append(self.template($("#slice-template"), { scale: exportSize.scale + "x", sliceName: exportSize.sliceName, fileName: exportSize.sliceName.replace("slices/", "") }));
                });
            }

            self.colorFormatShow();
        },
        distance:function(sMinX, sMaxX, sMinY, sMaxY, oMinX, oMaxX, oMinY, oMaxY) {
            var self = this, sSize = {
                w:sMaxX - sMinX,
                h:sMaxY - sMinY
            }, oSize = {
                w:oMaxX - oMinX,
                h:oMaxY - oMinY
            }, topOffset, rightOffset, bottomOffset, leftOffset;
            if (!self.isIntersected(sMinX, sMaxX, sMinY, sMaxY, oMinX, oMaxX, oMinY, oMaxY)) {
                var topDistance = sMinY - oMaxY, bottomDistance = oMinY - sMaxY, leftDistance = sMinX - oMaxX, rightDistance = oMinX - sMaxX;
                if (sMinY > oMinY && topDistance >= 0) {
                    topOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(oMaxY),
                        h:self.zoomSize(self.positive(topDistance))
                    };
                }
                if (sMinY < oMinY && bottomDistance >= 0) {
                    bottomOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(sMaxY),
                        h:self.zoomSize(self.positive(bottomDistance))
                    };
                }
                if (sMinX > oMinX && leftDistance >= 0) {
                    leftOffset = {
                        x:self.zoomSize(oMaxX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(leftDistance))
                    };
                }
                if (sMinX < oMinX && rightDistance >= 0) {
                    rightOffset = {
                        x:self.zoomSize(sMaxX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(rightDistance))
                    };
                }
            } else {
                var topDistance = sMinY - oMinY, bottomDistance = sMaxY - oMaxY, leftDistance = sMinX - oMinX, rightDistance = sMaxX - oMaxX;
                if (topDistance > 0) {
                    topOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(oMinY),
                        h:self.zoomSize(self.positive(topDistance))
                    };
                } else if (topDistance < 0) {
                    topOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(sMinY),
                        h:self.zoomSize(self.positive(topDistance))
                    };
                }
                if (rightDistance > 0) {
                    rightOffset = {
                        x:self.zoomSize(oMaxX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(rightDistance))
                    };
                } else if (rightDistance < 0) {
                    rightOffset = {
                        x:self.zoomSize(sMaxX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(rightDistance))
                    };
                }
                if (bottomDistance > 0) {
                    bottomOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(oMaxY),
                        h:self.zoomSize(self.positive(bottomDistance))
                    };
                } else if (bottomDistance < 0) {
                    bottomOffset = {
                        x:self.zoomSize(sMinX + sSize.w / 2),
                        y:self.zoomSize(sMaxY),
                        h:self.zoomSize(self.positive(bottomDistance))
                    };
                }
                if (leftDistance > 0) {
                    leftOffset = {
                        x:self.zoomSize(oMinX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(leftDistance))
                    };
                } else if (leftDistance < 0) {
                    leftOffset = {
                        x:self.zoomSize(sMinX),
                        y:self.zoomSize(sMinY + sSize.h / 2),
                        w:self.zoomSize(self.positive(leftDistance))
                    };
                }
            }
            if (topOffset) {
                jQGuideTop.find(".label").text(self.resolutionSize(self.positive(topDistance)));
                jQGuideTop.css({
                    left:topOffset.x,
                    top:topOffset.y,
                    height:topOffset.h
                }).show();
                self.alignLabelMiddle(jQGuideTop);
            }
            if (rightOffset) {
                jQGuideRight.find(".label").text(self.resolutionSize(self.positive(rightDistance)));
                jQGuideRight.css({
                    left:rightOffset.x,
                    top:rightOffset.y,
                    width:rightOffset.w
                }).show();
                self.alignLabelCenter(jQGuideRight);
            }
            if (bottomOffset) {
                jQGuideBottom.find(".label").text(self.resolutionSize(self.positive(bottomDistance)));
                jQGuideBottom.css({
                    left:bottomOffset.x,
                    top:bottomOffset.y,
                    height:bottomOffset.h
                }).show();
                self.alignLabelMiddle(jQGuideBottom);
            }
            if (leftOffset) {
                jQGuideLeft.find(".label").text(self.resolutionSize(self.positive(leftDistance)));
                jQGuideLeft.css({
                    left:leftOffset.x,
                    top:leftOffset.y,
                    width:leftOffset.w
                }).show();
                self.alignLabelCenter(jQGuideLeft);
            }
        },
        select: function(jQThis) {
            var self = this, model = jQThis.data("model");
            $(".selected").removeClass("selected");

            jQThis.addClass("selected");
            jQGuideSizeWidth.find(".label").text(self.resolutionSize(model.rect.width));
            jQGuideSizeWidth.css({
                left:model.x,
                top:model.y,
                width:model.width
            }).show();
            self.alignLabelCenter(jQGuideSizeWidth);
            jQGuideSizeHeight.find(".label").text(self.resolutionSize(model.rect.height));
            jQGuideSizeHeight.css({
                left:model.x + model.width,
                top:model.y,
                height:model.height
            }).show();
            self.alignLabelMiddle(jQGuideSizeHeight);
            jQSelection = jQThis;
            self.hideGuideline();
            self.hideDistance();
        },
        render:function(index, delay) {
            var self = this,
                delay = delay || 0;
            jQZoom.find(".zoom-text").text(self.zoom * 100 + "%");
            jQZoom.find(".disable").removeClass("disable");
            if (self.zoom <= .5) jQZoom.find(".zoom-out").addClass("disable");
            if (self.zoom >= 1) jQZoom.find(".zoom-in").addClass("disable");
            self.screen();
            self.layers(index, delay);
            self.resolutionList();
        },
        events:function() {
            var self = this;
            jQLayers
                .on("click", ".layer", function(event) {
                    event.stopPropagation();
                    var jQThis = $(this);                
                    if (!jQSelection) self.toggleSidebar();
                    self.select(jQThis);
                    self.inspector();
                    $(".dropdown").addClass("hide");
                })
                .on("mouseover", ".layer", function(event) {
                    var jQOver = $(this);
                    if (jQOver.hasClass("selected")) return false;
                    if (jQSelection) {
                        var sModel = jQSelection.data("model"), oModel = jQOver.data("model");
                        var sMinX = sModel.rect.x, sMaxX = sModel.rect.x + sModel.rect.width, sMinY = sModel.rect.y, sMaxY = sModel.rect.y + sModel.rect.height, oMinX = oModel.rect.x, oMaxX = oModel.rect.x + oModel.rect.width, oMinY = oModel.rect.y, oMaxY = oModel.rect.y + oModel.rect.height;
                        jQGuideHorizontal.css({
                            top:oModel.y,
                            height:oModel.height
                        }).show();
                        jQGuideVertical.css({
                            left:oModel.x,
                            width:oModel.width
                        }).show();
                        self.distance(sMinX, sMaxX, sMinY, sMaxY, oMinX, oMaxX, oMinY, oMaxY);
                        self.hideSize();
                    }
                    jQOver.addClass("hover");
                })
                .on("mouseover", ".edge", function(event) {
                    var jQOver = $(this), distance;
                    if (jQOver.hasClass("selected")) return false;
                    if (jQSelection) {
                        var sModel = jQSelection.data("model"), topDistance = sModel.rect.y - 0, rightDistance = self.data.width - (sModel.rect.x + sModel.rect.width), bottomDistance = self.data.height - (sModel.rect.y + sModel.rect.height), leftDistance = sModel.rect.x - 0, distance;
                        if (jQOver.hasClass("top") && topDistance > 0) {
                            distance = topDistance;
                            jQGuideTop.find(".label").text(self.resolutionSize(distance));
                            jQGuideTop.css({
                                top:0,
                                left:parseInt(sModel.x + sModel.width / 2),
                                height:self.zoomSize(self.positive(distance))
                            }).show();
                            self.alignLabelMiddle(jQGuideTop);
                        }
                        if (jQOver.hasClass("right") && rightDistance > 0) {
                            distance = rightDistance;
                            jQGuideRight.find(".label").text(self.resolutionSize(distance));
                            jQGuideRight.css({
                                top:parseInt(sModel.y + sModel.height / 2),
                                left:sModel.x + sModel.width,
                                width:self.zoomSize(self.positive(distance))
                            }).show();
                            self.alignLabelCenter(jQGuideRight);
                        }
                        if (jQOver.hasClass("bottom") && bottomDistance > 0) {
                            distance = bottomDistance;
                            jQGuideBottom.find(".label").text(self.resolutionSize(distance));
                            jQGuideBottom.css({
                                top:parseInt(sModel.y + sModel.height),
                                left:parseInt(sModel.x + sModel.width / 2),
                                height:self.zoomSize(self.positive(distance))
                            }).show();
                            self.alignLabelMiddle(jQGuideBottom);
                        }
                        if (jQOver.hasClass("left") && leftDistance > 0) {
                            distance = leftDistance;
                            jQGuideLeft.find(".label").text(self.resolutionSize(distance));
                            jQGuideLeft.css({
                                top:parseInt(sModel.y + sModel.height / 2),
                                left:0,
                                width:self.zoomSize(self.positive(distance))
                            }).show();
                            self.alignLabelCenter(jQGuideLeft);
                        }
                    }
                    self.hideGuideline();
                    self.hideSize();
                })
                .on("mouseover", ".pin", function(event) {
                    var jQNote = $(this), model = jQNote.data("model");
                    jQNote.addClass("pin-hover");
                    jQNoteTip.empty().show();
                    jQNoteTip.append("<p>" + model.note + "</p>");
                    jQNoteTip.css({
                        left:0,
                        top:0,
                        width: "auto"
                    });
                    var width = jQNoteTip.outerWidth();
                    jQNoteTip.css({
                        width: (width > 200)? 200: width,
                        left:model.x + jQNote.outerWidth() + 4,
                        top:parseInt(model.y - jQNoteTip.outerHeight() / 2)
                    });
                })
                .on("mouseout", ".layer", function(event) {
                    $(this).removeClass("hover");
                    if (jQSelection) {
                        self.showSize();
                        self.hideDistance();
                    }
                })
                .on("mouseout", ".edge", function(event) {
                    $(this).removeClass("hover");
                    if (jQSelection) {
                        self.showSize();
                        self.hideDistance();
                    }
                })
                .on("mouseout", ".pin", function(event) {
                    var jQNote = $(this);
                    jQNote.removeClass("pin-hover");
                    jQNoteTip.hide();
                });

            jQZoom
                .click(function( event ){
                    event.stopPropagation();
                    $(".dropdown").addClass("hide");
                })
                .on("click", ".zoom-out", function(event) {
                    self.zoom -= .25;
                    if (self.zoom <= .25) {
                        self.zoom = .5;
                    }
                    self.render(self.index(), 300);
                })
                .on("click", ".zoom-in", function(event) {
                    self.zoom += .25;
                    if (self.zoom >= 1) {
                        self.zoom = 1;
                    }
                    self.render(self.index(), 300);
                });

            jQResolution
                .click(function(event) {
                    event.stopPropagation();
                    self.toggleResolutionList();
                    $(".dropdown:not(.resolution_list)").addClass("hide");
                });

            jQAbout
                .click(function(event) {
                    event.stopPropagation();
                    self.toggleAboutList();
                    $(".dropdown:not(.about_list)").addClass("hide");
                });

            jQColorFormat
                .on("click", function(event) {
                    event.stopPropagation();
                    var colorFormat = self.colorFormat;
                    colorFormat += 1;
                    self.colorFormat = colorFormat > 2 ? 0 :colorFormat;
                    self.colorFormatShow();
                    $(".dropdown").addClass("hide");
                });

            jQToggle
                .on("click", function(event) {
                    event.stopPropagation();
                    self.togglePins();
                    $(".dropdown").addClass("hide");
                });

            jQResolutionList
                .on("click", "div", function(event) {
                    var jQThis = $(this), model = jQThis.data("model");
                    self.resolution = model.index;
                    if (jQSelection) self.inspector();
                    self.render(self.index());
                    $(".dropdown").addClass("hide");
                })
                .on("mouseover", "div", function() {
                    var jQResolutionItem = $(this), model = jQResolutionItem.data("model");
                    jQResolutionItem.addClass("resolution-hover");
                })
                .on("mouseout", "div", function() {
                    var jQResolutionItem = $(this), model = jQResolutionItem.data("model");
                    jQResolutionItem.removeClass("resolution-hover");
                });

            jQArtboardList
                .on("click", ".a-item", function(event){
                    var jQThis = $(this), model = jQThis.data("model");
                    if(jQThis.hasClass("current")) return false;

                    window.location.href = model.name + ".html";
                });

            jQAllSliceList
                .on("click", ".s-item", function(event){
                    var jQThis = $(this), model = jQThis.data("model");
                    jQThis = $("#ID-" + model.objectID);
                    if(jQThis.length <= 0) return;
                    if (!jQSelection) self.toggleSidebar();
                    self.select(jQThis);
                    self.inspector();
                })
                .on("mouseover", ".s-item", function(event) {
                    var jQSlice = $(this), model = jQSlice.data("model");
                    $("#ID-" + model.objectID).addClass("is-slice");
                })
                .on("mouseout", ".s-item", function(event) {
                    var jQSlice = $(this), model = jQSlice.data("model");
                    $("#ID-" + model.objectID).removeClass("is-slice");
                });
            
            jQArtboard
                .on("click", function(event) {
                    event.stopPropagation();
                    var jQThis = $(this);
                    if(!jQArtboard.hasClass("m")) return false;
                    self.toggleNavbar();
                    $(".dropdown").addClass("hide");
                });

            jQNavbar
                .click(function(event){
                    $(".dropdown").addClass("hide");
                })
                .on("click", ".a-tab", function(event){
                    var jQThis = $(this);

                    if( jQThis.hasClass("current") ) return false;

                    self.toggleTabs();
                })
                .on("click", ".s-tab", function(event){
                    var jQThis = $(this);

                    if( jQThis.hasClass("current") ) return false;

                    self.toggleTabs();
                });

            jQSidebar
                .click(function(event){
                    $(".dropdown").addClass("hide");
                });

            $(".main")
                .click(function() {
                    $(".selected").removeClass("selected");
                    self.hideSize();
                    self.hideGuideline();
                    self.hideDistance();
                    $(".dropdown").addClass("hide");
                    if (jQSelection) self.toggleSidebar();
                    jQSelection = null;
                });

            $("body")
                .on("dragstart", ".download img", function(event){
                    var jQThis = $(this),
                        offset = jQThis.offset();

                    jQThis.css({width: "auto", height: "auto"});

                    var left = event.originalEvent.pageX - offset.left - jQThis.width() / 2,
                        top = event.originalEvent.pageY - offset.top - jQThis.height() / 2;

                    jQThis.css({left: left, top: top});
                })
                .on("dragend", ".download img", function(event){
                    var jQThis = $(this);

                    jQThis.css({left: 0, top: 0, width: "100%", height: "100%"});
                });
            
        },
    };
    var init = Spec.fn.init = function(options) {
        var self = this;
        jQScreen = $("#screen");
        jQLayers = $("#layers");
        jQGuideSizeWidth = $("#guide_size_width").hide();
        jQGuideSizeHeight = $("#guide_size_height").hide();
        jQGuideHorizontal = $("#guide_horizontal").hide();
        jQGuideVertical = $("#guide_vertical").hide();
        jQGuideTop = $("#guide_top").hide();
        jQGuideRight = $("#guide_right").hide();
        jQGuideBottom = $("#guide_bottom").hide();
        jQGuideLeft = $("#guide_left").hide();
        jQZoom = $("#zoom");
        jQToggle = $("#toggle");
        jQNoteTip = $("#note_tip").hide();
        jQResolution = $("#resolution");
        jQResolutionList = $("#resolution_list");
        jQArtboard = $("#artboard");
        jQNavbar = $("#navbar").addClass("navoff");
        jQSidebar = $("#sidebar").addClass("sideoff");
        jQTabs = $("#tabs").hide();
        jQArtboardList = $("#artboard_list").hide().empty();
        jQAllSliceList = $("#slice_list").hide().empty();
        jQAbout = $("#about");
        jQAboutList = $("#about_list");
        jQColorFormat = $("#color_format");
        jQSlices = $("#exportable").hide();
        jQLayerName = $("#layer_name");
        jQProperties = $("#properties").hide();
        jQTypeface = $("#typeface").hide();
        jQContent = $("#content").hide();
        jQFills = $("#fills").hide();
        jQBorders = $("#borders").hide();
        jQShadows = $("#shadows").hide();
        this.resolution = options.resolution;
        this.data = options;
        this.notes = options.notes;
        this.visible = true;
        if(!this.colorFormat){
            if(this.resolution > 3){
                this.colorFormat = 2;
            }
            else if(this.resolution > 0){
                this.colorFormat = 1;
            }
            else{
                this.colorFormat = 0;
            }
            this.colorFormatShow();
        }
        var proportion = $(document).height() / options.height;
        if (proportion >= .8) {
            this.zoom = 1;
        } else if (proportion >= .6) {
            this.zoom = .75;
        } else {
            this.zoom = .5;
        }
        $(".artboard-name span:first-child ").text(this.data.name);
        this.render();
        this.events();

        return self;
    };
    init.prototype = Spec.fn;
    window.Spec = Spec;
})(window);