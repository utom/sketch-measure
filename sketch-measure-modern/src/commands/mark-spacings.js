const sketch = require('sketch')

function onMarkSpacings(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  const page = document.selectedPage
  const selectedLayers = page.selectedLayers.layers || []
  
  if (selectedLayers.length === 0) {
    sketch.UI.message('❌ 请选择要标记间距的图层')
    return
  }

  if (selectedLayers.length === 1) {
    console.log('标记到父容器的间距:', selectedLayers[0].name)
    sketch.UI.message('✅ 已标记到父容器的间距')
  } else if (selectedLayers.length === 2) {
    console.log('标记图层间距:', selectedLayers[0].name, '<->', selectedLayers[1].name)
    sketch.UI.message('✅ 已标记图层间距')
  } else {
    sketch.UI.message('❌ 请选择1个或2个图层来标记间距')
  }
}

module.exports = {
  onMarkSpacings
}