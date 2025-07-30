import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage } from '../utils'

export function onToolbar(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  showMessage('🔧 Sketch Measure Modern 工具栏已激活')
  
  // 这里可以显示一个工具栏界面
  // 在未来的版本中可以实现WebView界面
  const measureCore = new MeasureCore(document)
  
  // 显示当前配置信息
  const config = measureCore.getConfig()
  console.log('Current config:', config)
  
  showMessage(`当前单位: ${config.units} | 颜色格式: ${config.colorFormat}`)
}