import sketch from 'sketch'
import { showMessage, showError, getSelectedLayers, formatColor } from '../utils'

export function onColorManager(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  const selectedLayers = getSelectedLayers(document)
  
  if (selectedLayers.length === 0) {
    showError('请选择包含颜色的图层')
    return
  }

  const colors: { [key: string]: { color: string, count: number, layers: string[] } } = {}

  // 收集所有颜色
  selectedLayers.forEach(layer => {
    if ('style' in layer && layer.style) {
      const style = layer.style as any
      
      // 收集填充色
      if (style.fills) {
        style.fills.forEach((fill: any) => {
          if (fill.enabled && fill.color) {
            const colorHex = formatColor(fill.color, 'hex')
            if (!colors[colorHex]) {
              colors[colorHex] = { color: colorHex, count: 0, layers: [] }
            }
            colors[colorHex].count++
            if (!colors[colorHex].layers.includes(layer.name)) {
              colors[colorHex].layers.push(layer.name)
            }
          }
        })
      }
      
      // 收集边框色
      if (style.borders) {
        style.borders.forEach((border: any) => {
          if (border.enabled && border.color) {
            const colorHex = formatColor(border.color, 'hex')
            if (!colors[colorHex]) {
              colors[colorHex] = { color: colorHex, count: 0, layers: [] }
            }
            colors[colorHex].count++
            if (!colors[colorHex].layers.includes(layer.name)) {
              colors[colorHex].layers.push(layer.name)
            }
          }
        })
      }
      
      // 收集阴影色
      if (style.shadows) {
        style.shadows.forEach((shadow: any) => {
          if (shadow.enabled && shadow.color) {
            const colorHex = formatColor(shadow.color, 'hex')
            if (!colors[colorHex]) {
              colors[colorHex] = { color: colorHex, count: 0, layers: [] }
            }
            colors[colorHex].count++
            if (!colors[colorHex].layers.includes(layer.name)) {
              colors[colorHex].layers.push(layer.name)
            }
          }
        })
      }
    }
  })

  const colorList = Object.values(colors)
  
  if (colorList.length === 0) {
    showError('未找到任何颜色')
    return
  }

  // 显示颜色信息
  const colorSummary = colorList
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 只显示前10个最常用的颜色
    .map(colorInfo => `${colorInfo.color} (${colorInfo.count}次)`)
    .join('\n')

  const alert = NSAlert.alloc().init()
  alert.setMessageText(`发现 ${colorList.length} 种颜色`)
  alert.setInformativeText(`最常用的颜色：\n\n${colorSummary}`)
  alert.addButtonWithTitle('确定')
  alert.runModal()

  showMessage(`🎨 颜色分析完成，共发现 ${colorList.length} 种颜色`)
}