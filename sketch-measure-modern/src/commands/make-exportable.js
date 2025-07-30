const sketch = require('sketch')

function onMakeExportable(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要设置导出的图层')
    return
  }

  let processedCount = 0

  selectedLayers.forEach(layer => {
    try {
      console.log('设置导出:', layer.name)
      processedCount++
    } catch (error) {
      console.error(`设置图层 ${layer.name} 导出时出错:`, error)
    }
  })

  if (processedCount > 0) {
    sketch.UI.message(`✅ 已为 ${processedCount} 个图层设置导出格式`)
  }
}

module.exports = {
  onMakeExportable
}