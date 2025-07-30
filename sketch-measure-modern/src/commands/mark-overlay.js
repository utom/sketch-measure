const sketch = require('sketch')

function onMarkOverlay(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要标记的图层')
    return
  }

  selectedLayers.forEach(layer => {
    console.log('标记覆盖层:', layer.name)
    // 这里可以添加创建覆盖层标记的逻辑
  })

  sketch.UI.message(`✅ 已标记 ${selectedLayers.length} 个覆盖层`)
}

module.exports = {
  onMarkOverlay
}