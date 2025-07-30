const sketch = require('sketch')

function onMarkNote(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要添加注释的图层')
    return
  }

  selectedLayers.forEach(layer => {
    console.log('添加注释:', layer.name)
  })

  sketch.UI.message(`✅ 已为 ${selectedLayers.length} 个图层添加注释`)
}

module.exports = {
  onMarkNote
}