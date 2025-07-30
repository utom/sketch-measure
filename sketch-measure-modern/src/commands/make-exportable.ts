import sketch from 'sketch'
import { showMessage, showError, getSelectedLayers } from '../utils'

export function onMakeExportable(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  const selectedLayers = getSelectedLayers(document)
  
  if (selectedLayers.length === 0) {
    showError('请选择要设置导出的图层')
    return
  }

  let processedCount = 0

  selectedLayers.forEach(layer => {
    try {
      // 检查图层是否已有导出设置
      if (!layer.exportFormats || layer.exportFormats.length === 0) {
        // 添加默认导出格式
        layer.exportFormats = [
          {
            size: '1x',
            suffix: '',
            fileFormat: 'png'
          },
          {
            size: '2x',
            suffix: '@2x',
            fileFormat: 'png'
          },
          {
            size: '3x',
            suffix: '@3x',
            fileFormat: 'png'
          }
        ]
        processedCount++
      } else {
        showMessage(`图层 "${layer.name}" 已有导出设置`)
      }
    } catch (error) {
      console.error(`设置图层 ${layer.name} 导出时出错:`, error)
    }
  })

  if (processedCount > 0) {
    showMessage(`✅ 已为 ${processedCount} 个图层设置导出格式`)
  }
}