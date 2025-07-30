import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage } from '../utils'

export function onMarkSizes(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  const measureCore = new MeasureCore(document)
  
  // 检查是否按下了Option键来显示高级选项
  const modifierFlags = NSEvent.modifierFlags()
  const isOptionPressed = (modifierFlags & NSEventModifierFlagOption) !== 0
  
  if (isOptionPressed) {
    // 显示选择对话框：宽度、高度或两者
    const alert = NSAlert.alloc().init()
    alert.setMessageText('选择要标记的尺寸')
    alert.setInformativeText('请选择要标记的尺寸类型：')
    alert.addButtonWithTitle('宽度')
    alert.addButtonWithTitle('高度')
    alert.addButtonWithTitle('宽度和高度')
    alert.addButtonWithTitle('取消')
    
    const response = alert.runModal()
    
    switch (response) {
      case NSAlertFirstButtonReturn: // 宽度
        measureCore.markSizes(undefined, 'width')
        break
      case NSAlertSecondButtonReturn: // 高度
        measureCore.markSizes(undefined, 'height')
        break
      case NSAlertThirdButtonReturn: // 宽度和高度
        measureCore.markSizes(undefined, 'both')
        break
      default: // 取消
        return
    }
  } else {
    // 默认标记宽度和高度
    measureCore.markSizes()
  }
}