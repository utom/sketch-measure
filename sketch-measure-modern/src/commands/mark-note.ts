import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage } from '../utils'

export function onMarkNote(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  // 询问用户输入注释内容
  const alert = NSAlert.alloc().init()
  alert.setMessageText('添加注释')
  alert.setInformativeText('请输入注释内容：')
  
  const input = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 300, 24))
  input.setStringValue('Note')
  alert.setAccessoryView(input)
  
  alert.addButtonWithTitle('确定')
  alert.addButtonWithTitle('取消')
  
  const response = alert.runModal()
  
  if (response === NSAlertFirstButtonReturn) {
    const noteText = input.stringValue().toString()
    const measureCore = new MeasureCore(document)
    measureCore.markNote(undefined, noteText)
  }
}