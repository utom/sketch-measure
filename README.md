
# 2.7.9 Fork (2.7.7 SMFramework + 2.7.7 Fixes)
This is a fork I've created some time ago to fix Measure for Sketch v52+.

It includes a lot of changes, fixes and aditions, the latest being the addition of the SMFramework from the v2.7.7 released by @utom recently, allowing for the `Toolbar 2.0` to work to certain extent.

Remember to **uninstall current plugin version**, **restart sketch** then, install the new version. 

[Download the latest zip file from the fork](https://github.com/ellunium/sketch-measure/archive/master.zip)

#### Check the version of the installed plugin:

Inside Sketch, Go to the menu:
- Plugins > Manage Plugins...
- Scroll down to "Sketch Measure"
    - It should say 2.7.9

# Changelog:

### **FIXED**
- support Sketch v53
- fixed bug to show radius when rectangle fill is an image when exporting
- fixed bug where styles would not show when exporting
- fixed radius support when exporting and marking
- fixed crash when marking overlays
- baseline fixes for Sketch v52+

### **CHANGED**
- changed version to 2.7.8 for all languages
- updated SMFramework to latest version by @utom
- changed version to 2.7.6 for all languages
- changed radius validation to array, making it less prone to erros

### **ADDED**
- added a check in case CSSAtributes() gets fixed and they add back radius-border property
- added fix to show **Library and Local styles**, also added a check for sharedStyleID
- added **backward compatibility for notes** marked with older versions of the plugin
- added support to **show radius** even on masked items
- expanded **radius support to handle multiple radius** values on mark and export
- added support for oval, path, triangle, star and polygon shapes

# A note on Toolbar 2.0 (_beta_)

Some functions won't work as proper with the `Toolbar 2.0` (e.g.: `Text Styles` will not output).
Although I've added the SMFramework from the latest v2.7.7 released by @utom, it uses a compiled codebase done in XCode that I don't have access to make changes.

# Still not working?
Follow the steps below:

- [ ] Uninstall the plugin
- [ ] Quit Sketch
- [ ] Follow the steps bellow to remove the `PluginsWarehouse` folder
- [ ] [Download the latest zip file from the fork](https://github.com/ellunium/sketch-measure/archive/master.zip)
- [ ] Reinstall the plugin
- [ ] Test the `Mark Properties / Spec Export` again

> Remove the `PluginsWarehouse` folder that lives in `~/Library/Application Support/com.bohemiancoding.sketch3/`. This is where we cache plugin downloads, and if you’ve been testing different versions of your appcast, you probably have some old stuff there that’s worth cleaning.
> - Go to the Finder of Mac OS
> - From the “Go” menu navigate down to “Go to Folder” or...
> - Hit Command+Shift+G from the Mac OS X desktop or a Finder window
> - Paste the folder location `~/Library/Application Support/com.bohemiancoding.sketch3/`
> - Remove/Delete the `PluginsWarehouse` folder

I hope it helps  :) 




# A new feature for Sketch Measure: Export Layer's influence Rect to Spec.

Layer's influence rect includes the area of shadows and outside borders, it's exactly the same size with the exported image.

                                       Regular rect                                                           Influence rect
​              
![regular-rect](https://pic4.zhimg.com/v2-c1792b8300fca0cdc90b564a27b8da8b_b.png)
![influence-rect](https://pic3.zhimg.com/v2-a639e906f8fea576da8d9a8cc1cc752a_b.png)

Sometime, shadows will not implement by engineers, it should be a part of image. Designer need to show the influence rect to engineers, not the regular rect. This is the feature using for.

Just select the option in Export UI

![export-ui](https://i1.hoopchina.com.cn/blogfile/201702/20/BbsImg148759897429137_471x602big.png)

# Sketch Measure

Make it fun to create specs for developers and teammates. **Sketch 49.* support**.

- [How to](http://utom.design/measure/how-to.html)
- [中文说明](http://sketch.im/plugins/1)

![Logo](http://utom.design/logo@2x.png)

## Installing Plugins

### Install from download
1. [Download the ZIP file](https://github.com/utom/sketch-measure/archive/master.zip) and unzip
2. Open `Sketch Measure.sketchplugin`

### Install with Sketch Plugin Manager
1. With [Sketch Plugin Manager](https://mludowise.github.io/Sketch-Plugin-Manager/), just search `Sketch Measure`
2. Will see the `Sketch Measure` plugin listed at the top, Click the `Install` inside it
#[!Install with Sketch Plugin Manager](https://github.com/mludowise/Sketch-Plugin-Manager/raw/master/img/catalog-view.png)

### Install with Sketchpacks
1. With [Sketchpacks](https://sketchpacks.com), search for `Sketch Measure`
2. Click `Install`
3. Get automatic updates for `Sketch Measure`

**Already have Sketchpacks?**

[![Install Sketch Measure with Sketchpacks](http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png "Install Sketch Measure with Sketchpacks")](https://sketchpacks.com/utom/sketch-measure/install)

### Install with Sketch Runner
With Sketch Runner, just go to the `install` command and search for `Sketch Measure`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).
![Install with Sketch Runner](sketch-measure-runner.png)

## New UI
Friendly user interface offers you a more intuitive way of making marks.

### How to
* Hold down the `Option` key on keyboard and click icons on the toolbar to show panels.

![SPEC EXPORT](http://utom.design/ui.png)

## Spec Export
Automatically generate a html page with one click, and inspect all the design details including CSS Styles on it offline.

**If you want to create one artboard by one HTML file, please uncheck "Advanced mode".**

Demo: http://utom.design/news/

![SPEC EXPORT](http://utom.design/export@2x.png)

## Custom Shortcuts
To create your own custom shortcuts, go to Keyboard in your System Preferences and click the Shortcuts tab. Select App Shortcuts and click ‘+’ to create a new shortcut. Choose Sketch from the Application list, then enter the exact name of the menu item you want to create the shortcut for. Finally choose your own shortcut combination and you’re all set.

![Settings](http://sketchshortcuts.com/images/mac@2x.png)

## Contributors
* Author [@utom](http://utom.design)
* [@cute](http://liguangming.com) ([SketchI18N](https://github.com/cute/SketchI18N))
* [@forestlin1212](https://github.com/forestlin1212)
* [@ashung](https://github.com/Ashung) ([Automate-Sketch](https://github.com/Ashung/Automate-Sketch))
* [@mkl87](https://github.com/mkl87), [@Skykai521](https://github.com/Skykai521), [@whyfind](https://github.com/whyfind) and [@Nora](https://www.behance.net/liyinuo)
* @Kai and [@Zih-Hong](http://zihhonglin.com)
* And [Other](https://github.com/utom/sketch-measure/contributors)

## Contact

* Follow [@utom](http://twitter.com/utom) on Twitter
* Email <utombox@gmail.com>
