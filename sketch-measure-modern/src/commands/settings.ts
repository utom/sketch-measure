import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage } from '../utils'

export function onSettings(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  const measureCore = new MeasureCore(document)
  const currentConfig = measureCore.getConfig()

  // 创建设置对话框
  const alert = NSAlert.alloc().init()
  alert.setMessageText('Sketch Measure Modern - 设置')
  alert.setInformativeText('配置测量插件的默认设置')

  // 创建设置面板
  const view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 400, 200))
  
  let yPos = 160

  // 单位设置
  const unitsLabel = NSTextField.alloc().initWithFrame(NSMakeRect(20, yPos, 100, 20))
  unitsLabel.setStringValue('单位:')
  unitsLabel.setBezeled(false)
  unitsLabel.setDrawsBackground(false)
  unitsLabel.setEditable(false)
  unitsLabel.setSelectable(false)
  view.addSubview(unitsLabel)

  const unitsPopup = NSPopUpButton.alloc().initWithFrame(NSMakeRect(130, yPos, 100, 20))
  unitsPopup.addItemWithTitle('px')
  unitsPopup.addItemWithTitle('pt')
  unitsPopup.addItemWithTitle('dp')
  unitsPopup.selectItemWithTitle(currentConfig.units)
  view.addSubview(unitsPopup)

  yPos -= 30

  // 颜色格式设置
  const colorLabel = NSTextField.alloc().initWithFrame(NSMakeRect(20, yPos, 100, 20))
  colorLabel.setStringValue('颜色格式:')
  colorLabel.setBezeled(false)
  colorLabel.setDrawsBackground(false)
  colorLabel.setEditable(false)
  colorLabel.setSelectable(false)
  view.addSubview(colorLabel)

  const colorPopup = NSPopUpButton.alloc().initWithFrame(NSMakeRect(130, yPos, 100, 20))
  colorPopup.addItemWithTitle('hex')
  colorPopup.addItemWithTitle('rgb')
  colorPopup.addItemWithTitle('hsl')
  colorPopup.selectItemWithTitle(currentConfig.colorFormat)
  view.addSubview(colorPopup)

  yPos -= 30

  // 影响矩形设置
  const influenceCheck = NSButton.alloc().initWithFrame(NSMakeRect(20, yPos, 200, 20))
  influenceCheck.setButtonType(NSButtonTypeSwitch)
  influenceCheck.setTitle('使用影响矩形 (包含阴影、边框)')
  influenceCheck.setState(currentConfig.byInfluence ? NSControlStateValueOn : NSControlStateValueOff)
  view.addSubview(influenceCheck)

  yPos -= 30

  // 包含阴影设置
  const shadowsCheck = NSButton.alloc().initWithFrame(NSMakeRect(20, yPos, 150, 20))
  shadowsCheck.setButtonType(NSButtonTypeSwitch)
  shadowsCheck.setTitle('导出时包含阴影')
  shadowsCheck.setState(currentConfig.includeShadows ? NSControlStateValueOn : NSControlStateValueOff)
  view.addSubview(shadowsCheck)

  yPos -= 30

  // 包含模糊设置
  const blursCheck = NSButton.alloc().initWithFrame(NSMakeRect(20, yPos, 150, 20))
  blursCheck.setButtonType(NSButtonTypeSwitch)
  blursCheck.setTitle('导出时包含模糊')
  blursCheck.setState(currentConfig.includeBlurs ? NSControlStateValueOn : NSControlStateValueOff)
  view.addSubview(blursCheck)

  alert.setAccessoryView(view)
  alert.addButtonWithTitle('保存')
  alert.addButtonWithTitle('取消')

  const response = alert.runModal()

  if (response === NSAlertFirstButtonReturn) {
    // 保存设置
    const newConfig = {
      units: unitsPopup.titleOfSelectedItem().toString() as 'px' | 'pt' | 'dp',
      colorFormat: colorPopup.titleOfSelectedItem().toString() as 'hex' | 'rgb' | 'hsl',
      byInfluence: influenceCheck.state() === NSControlStateValueOn,
      includeShadows: shadowsCheck.state() === NSControlStateValueOn,
      includeBlurs: blursCheck.state() === NSControlStateValueOn
    }

    measureCore.updateConfig(newConfig)
    showMessage('✅ 设置已保存')
  }
}