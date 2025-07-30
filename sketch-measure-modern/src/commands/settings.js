const sketch = require('sketch')

function onSettings(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  // 显示设置对话框
  const alert = NSAlert.alloc().init()
  alert.setMessageText('Sketch Measure Modern - 设置')
  alert.setInformativeText('现代化的 Sketch 测量插件设置')
  alert.addButtonWithTitle('确定')
  alert.runModal()

  sketch.UI.message('⚙️ 设置页面已显示')
}

module.exports = {
  onSettings
}