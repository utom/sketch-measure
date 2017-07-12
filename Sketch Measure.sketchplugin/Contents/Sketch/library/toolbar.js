class ToolBar {
  getImage(size, name) {
    var isRetinaDisplay = NSScreen.mainScreen().backingScaleFactor() > 1? true: false;
    var suffix = isRetinaDisplay? '@2x': '';
    var imageURL = NSURL.fileURLWithPath(this.pluginSketch + "/toolbar/" + name + suffix + ".png");
    var image = NSImage.alloc().initWithContentsOfURL(imageURL);
    return image;
  }

  addImage(rect, name){
      var view = NSImageView.alloc().initWithFrame(rect)
      var image = this.getImage(rect.size, name)
      view.setImage(image);
      return view;
  }

  addButton(rect, name, callAction){
      var button = NSButton.alloc().initWithFrame(rect)
      var image = this.getImage(rect.size, name)
      button.setImage(image);
      button.setBordered(false);
      button.sizeToFit();
      button.setButtonType(NSMomentaryChangeButton)
      button.setCOSJSTargetFunction(callAction);
      button.setAction("callAction:");
      return button;
  }

  render(){
    var identifier = 'design.utom.SpecPicker';
    var threadDictionary = NSThread.mainThread().threadDictionary();

    if (threadDictionary[identifier]) {
        return;
    }

    var panel = NSPanel.alloc().init();
    // panel.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
    panel.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1));
    panel.setTitleVisibility(NSWindowTitleHidden);
    panel.setTitlebarAppearsTransparent(true);

    panel.setFrame_display(NSMakeRect(0, 0, 160, 582), false);
    panel.setMovableByWindowBackground(true);
    panel.becomeKeyWindow();
    panel.setLevel(NSFloatingWindowLevel);

    threadDictionary[identifier] = panel;

    panel.center();
    panel.makeKeyAndOrderFront(nil);
  }
}

toolbar = new ToolBar();
toolbar.render();
