const sketch = require('sketch')

function onMarkSizes(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要标记尺寸的图层')
    return
  }

  selectedLayers.forEach(layer => {
    const frame = layer.frame
    console.log(`标记尺寸: ${layer.name} - ${frame.width}x${frame.height}`)
  })

  sketch.UI.message(`✅ 已标记 ${selectedLayers.length} 个图层的尺寸`)
}

module.exports = {
  onMarkSizes
}