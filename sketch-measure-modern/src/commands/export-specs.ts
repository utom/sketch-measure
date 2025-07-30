import sketch from 'sketch'
import { MeasureCore } from '../core/measure'
import { showMessage, showError } from '../utils'

export function onExportSpecs(context: any): void {
  const document = sketch.getSelectedDocument()
  
  if (!document) {
    showMessage('请先打开一个Sketch文档')
    return
  }

  try {
    const measureCore = new MeasureCore(document)
    const annotations = measureCore.getAllAnnotations()
    
    if (annotations.length === 0) {
      showError('没有找到任何标记，请先添加一些测量标记')
      return
    }

    // 选择导出路径
    const savePanel = NSSavePanel.savePanel()
    savePanel.setTitle('导出规范文档')
    savePanel.setPrompt('导出')
    savePanel.setNameFieldStringValue(`${document.path ? document.path.split('/').pop().replace('.sketch', '') : 'Untitled'}-specs.html`)
    savePanel.setAllowedFileTypes(['html'])
    
    const result = savePanel.runModal()
    
    if (result === NSFileHandlingPanelOKButton) {
      const exportPath = savePanel.URL().path()
      
      // 生成HTML规范文档
      const htmlContent = generateSpecsHTML(document, annotations, measureCore.getConfig())
      
      // 写入文件
      const fileManager = NSFileManager.defaultManager()
      const success = fileManager.createFileAtPath_contents_attributes(
        exportPath,
        NSString.stringWithString(htmlContent).dataUsingEncoding(NSUTF8StringEncoding),
        null
      )
      
      if (success) {
        showMessage(`✅ 规范文档已导出到: ${exportPath}`)
        
        // 询问是否打开文件
        const alert = NSAlert.alloc().init()
        alert.setMessageText('导出成功')
        alert.setInformativeText('是否在浏览器中打开规范文档？')
        alert.addButtonWithTitle('打开')
        alert.addButtonWithTitle('取消')
        
        if (alert.runModal() === NSAlertFirstButtonReturn) {
          NSWorkspace.sharedWorkspace().openFile(exportPath)
        }
      } else {
        showError('导出失败，请检查文件权限')
      }
    }
  } catch (error) {
    showError(`导出失败: ${error.message}`)
  }
}

function generateSpecsHTML(document: any, annotations: any[], config: any): string {
  const documentName = document.path ? document.path.split('/').pop().replace('.sketch', '') : 'Untitled'
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentName} - 设计规范</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .header {
            background: #fff;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .spec-card {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .spec-type {
            font-size: 14px;
            font-weight: 600;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .spec-content {
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .spec-details {
            font-size: 14px;
            color: #666;
        }
        
        .overlay { background: #FF5722; color: white; }
        .size { background: #2196F3; color: white; }
        .spacing { background: #4CAF50; color: white; }
        .property { background: #FF9800; color: white; }
        .note { background: #FFEB3B; color: #333; }
        
        .config-info {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .config-info h3 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .config-item {
            display: inline-block;
            margin-right: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>📐 ${documentName} - 设计规范</h1>
            <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
    </div>
    
    <div class="container">
        <div class="config-info">
            <h3>配置信息</h3>
            <div class="config-item"><strong>单位:</strong> ${config.units}</div>
            <div class="config-item"><strong>颜色格式:</strong> ${config.colorFormat}</div>
            <div class="config-item"><strong>影响矩形:</strong> ${config.byInfluence ? '是' : '否'}</div>
            <div class="config-item"><strong>包含阴影:</strong> ${config.includeShadows ? '是' : '否'}</div>
        </div>
        
        <h2>测量标记 (${annotations.length})</h2>
        
        <div class="specs-grid">
            ${annotations.map(annotation => `
                <div class="spec-card ${annotation.type}">
                    <div class="spec-type">${getTypeLabel(annotation.type)}</div>
                    <div class="spec-content">${formatAnnotationContent(annotation)}</div>
                    <div class="spec-details">
                        位置: (${annotation.position.x}, ${annotation.position.y})<br>
                        图层ID: ${annotation.layerId}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    
    <script>
        // 添加一些交互功能
        console.log('Sketch Measure Modern - 设计规范文档');
        console.log('标记数量:', ${annotations.length});
    </script>
</body>
</html>`
}

function getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    overlay: '覆盖层',
    size: '尺寸',
    spacing: '间距',
    property: '属性',
    note: '注释'
  }
  return labels[type] || type
}

function formatAnnotationContent(annotation: any): string {
  switch (annotation.type) {
    case 'size':
      return `${annotation.dimension}: ${annotation.value}px`
    case 'spacing':
      return `${annotation.direction === 'horizontal' ? '水平' : '垂直'}间距: ${annotation.value}px`
    case 'property':
      return annotation.properties ? annotation.properties.join('<br>') : annotation.content
    default:
      return annotation.content.toString()
  }
}