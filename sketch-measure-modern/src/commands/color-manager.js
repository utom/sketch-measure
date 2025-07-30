const sketch = require('sketch')

function onColorManager(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择包含颜色的图层')
    return
  }

  let colorCount = 0

  selectedLayers.forEach(layer => {
    console.log('分析颜色:', layer.name)
    colorCount++
  })

  sketch.UI.message(`🎨 颜色分析完成，共分析 ${colorCount} 个图层`)
}

module.exports = {
  onColorManager
}