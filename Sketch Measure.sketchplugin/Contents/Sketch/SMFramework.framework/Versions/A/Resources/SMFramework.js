/*
// To load this framework, replace the onRun method in your script.cocoscript

@import 'SMFramework.framework/SMFramework.js'

var onRun = function(context) {
   var obj = SMFramework.alloc().init()
   var uppercase = obj.uppercaseString("hello world")

   log(uppercase);
   context.document.showMessage(uppercase);
}
*/

var SMFramework_FrameworkPath = SMFramework_FrameworkPath || COScript.currentCOScript().env().scriptURL.path().stringByDeletingLastPathComponent();
var SMFramework_Log = SMFramework_Log || log;
(function() {
 var mocha = Mocha.sharedRuntime();
 var frameworkName = "SMFramework";
 var directory = SMFramework_FrameworkPath;
 if (mocha.valueForKey(frameworkName)) {
SMFramework_Log("😎 loadFramework: `" + frameworkName + "` already loaded.");
 return true;
 } else if ([mocha loadFrameworkWithName:frameworkName inDirectory:directory]) {
 SMFramework_Log("✅ loadFramework: `" + frameworkName + "` success!");
 mocha.setValue_forKey_(true, frameworkName);
 return true;
 } else {
 SMFramework_Log("❌ loadFramework: `" + frameworkName + "` failed!: " + directory + ". Please define SMFramework_FrameworkPath if you're trying to @import in a custom plugin");
 return false;
 }
 })();
