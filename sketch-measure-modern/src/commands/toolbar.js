const sketch = require('sketch')

function onToolbar(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  sketch.UI.message('🔧 Sketch Measure Modern 工具栏已激活')
  
  // 显示当前配置信息
  console.log('Sketch Measure Modern - 工具栏激活')
  sketch.UI.message('当前单位: px | 颜色格式: hex')
}

module.exports = {
  onToolbar
}