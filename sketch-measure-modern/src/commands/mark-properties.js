const sketch = require('sketch')

function onMarkProperties(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要标记属性的图层')
    return
  }

  selectedLayers.forEach(layer => {
    console.log('标记属性:', layer.name, '类型:', layer.type)
    // 这里可以添加获取和显示图层属性的逻辑
  })

  sketch.UI.message(`✅ 已标记 ${selectedLayers.length} 个图层的属性`)
}

module.exports = {
  onMarkProperties
}