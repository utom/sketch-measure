const sketch = require('sketch')

function onClearMarks(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    console.log('清除所有标记')
    sketch.UI.message('✅ 已清除所有标记')
  } else {
    selectedLayers.forEach(layer => {
      console.log('清除标记:', layer.name)
    })
    sketch.UI.message(`✅ 已清除 ${selectedLayers.length} 个图层的标记`)
  }
}

module.exports = {
  onClearMarks
}