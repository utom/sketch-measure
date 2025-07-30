const sketch = require('sketch')

function onExportSpecs(context) {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    sketch.UI.message('请先打开一个Sketch文档')
    return
  }

  try {
    const documentName = document.path ? 
      document.path.split('/').pop().replace('.sketch', '') : 'Untitled'
    
    console.log('导出规范:', documentName)
    
    // 生成简单的HTML内容
    const htmlContent = generateSimpleHTML(documentName)
    
    // 保存文件
    const savePanel = NSSavePanel.savePanel()
    savePanel.setTitle('导出规范文档')
    savePanel.setPrompt('导出')
    savePanel.setNameFieldStringValue(`${documentName}-specs.html`)
    savePanel.setAllowedFileTypes(['html'])
    
    const result = savePanel.runModal()
    
    if (result === NSFileHandlingPanelOKButton) {
      const exportPath = savePanel.URL().path()
      
      const fileManager = NSFileManager.defaultManager()
      const success = fileManager.createFileAtPath_contents_attributes(
        exportPath,
        NSString.stringWithString(htmlContent).dataUsingEncoding(NSUTF8StringEncoding),
        null
      )
      
      if (success) {
        sketch.UI.message(`✅ 规范文档已导出到: ${exportPath}`)
      } else {
        sketch.UI.message('❌ 导出失败，请检查文件权限')
      }
    }
  } catch (error) {
    sketch.UI.message(`❌ 导出失败: ${error.message}`)
  }
}

function generateSimpleHTML(documentName) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentName} - 设计规范</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        h1 { margin: 0; color: #333; }
        .info { color: #666; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📐 ${documentName} - 设计规范</h1>
        <div class="info">
            <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
            <p>插件版本: Sketch Measure Modern v1.0.0</p>
        </div>
    </div>
    <div class="content">
        <p>🎉 恭喜！您的现代化 Sketch Measure 插件已成功运行。</p>
        <p>请添加一些测量标记，然后重新导出以查看完整的规范文档。</p>
    </div>
</body>
</html>`
}

module.exports = {
  onExportSpecs
}