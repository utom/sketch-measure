import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage } from '../utils'

export function onMarkProperties(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  const measureCore = new MeasureCore(document)
  measureCore.markProperties()
}