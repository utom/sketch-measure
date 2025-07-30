import { Document, Layer, Frame, Group, Text, Shape } from 'sketch/dom'
import { 
  MeasureConfig, 
  Annotation, 
  SizeAnnotation, 
  SpacingAnnotation, 
  PropertyAnnotation,
  NoteAnnotation,
  OverlayAnnotation,
  MeasureLayer,
  MeasureRect
} from '../types'
import { 
  getLayerBounds, 
  calculateDistance, 
  generateId, 
  formatValue, 
  getSelectedLayers,
  findParentFrame,
  getLayerStyles,
  showMessage,
  showError,
  showSuccess,
  isFrame,
  isText,
  isShape
} from '../utils'

export class MeasureCore {
  private document: Document
  private config: MeasureConfig
  private annotations: Map<string, Annotation> = new Map()

  constructor(document: Document, config: Partial<MeasureConfig> = {}) {
    this.document = document
    this.config = {
      scale: 1,
      units: 'px',
      format: 'png',
      colorFormat: 'hex',
      exportPath: '',
      includeShadows: true,
      includeBlurs: true,
      byInfluence: false,
      isAdvancedMode: false,
      ...config
    }
  }

  /**
   * 标记覆盖层
   */
  markOverlay(layers?: Layer[]): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      showError('请选择要标记的图层')
      return
    }

    selectedLayers.forEach(layer => {
      const annotation: OverlayAnnotation = {
        id: generateId(),
        type: 'overlay',
        layerId: layer.id,
        position: { x: layer.frame.x, y: layer.frame.y },
        content: 'overlay',
        visible: true,
        locked: false,
        color: '#FF0000',
        opacity: 0.3
      }

      this.annotations.set(annotation.id, annotation)
      this.createOverlayMark(layer, annotation)
    })

    showSuccess(`已标记 ${selectedLayers.length} 个覆盖层`)
  }

  /**
   * 标记尺寸
   */
  markSizes(layers?: Layer[], dimension: 'width' | 'height' | 'both' = 'both'): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      showError('请选择要标记尺寸的图层')
      return
    }

    selectedLayers.forEach(layer => {
      const bounds = getLayerBounds(layer, this.config.byInfluence)
      
      if (dimension === 'width' || dimension === 'both') {
        const annotation: SizeAnnotation = {
          id: generateId(),
          type: 'size',
          layerId: layer.id,
          position: { 
            x: bounds.x + bounds.width / 2, 
            y: bounds.y + bounds.height + 20 
          },
          content: bounds.width,
          visible: true,
          locked: false,
          dimension: 'width',
          value: bounds.width
        }

        this.annotations.set(annotation.id, annotation)
        this.createSizeMark(layer, annotation)
      }

      if (dimension === 'height' || dimension === 'both') {
        const annotation: SizeAnnotation = {
          id: generateId(),
          type: 'size',
          layerId: layer.id,
          position: { 
            x: bounds.x + bounds.width + 20, 
            y: bounds.y + bounds.height / 2 
          },
          content: bounds.height,
          visible: true,
          locked: false,
          dimension: 'height',
          value: bounds.height
        }

        this.annotations.set(annotation.id, annotation)
        this.createSizeMark(layer, annotation)
      }
    })

    showSuccess(`已标记 ${selectedLayers.length} 个图层的尺寸`)
  }

  /**
   * 标记间距
   */
  markSpacings(layers?: Layer[]): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      showError('请选择要标记间距的图层')
      return
    }

    if (selectedLayers.length === 1) {
      // 单个图层：标记到父容器的距离
      const layer = selectedLayers[0]
      const parentFrame = findParentFrame(layer)
      
      if (parentFrame) {
        this.markSpacingToParent(layer, parentFrame)
      } else {
        showError('未找到父级Frame')
      }
    } else if (selectedLayers.length === 2) {
      // 两个图层：标记它们之间的距离
      this.markSpacingBetweenLayers(selectedLayers[0], selectedLayers[1])
    } else {
      showError('请选择1个或2个图层来标记间距')
    }
  }

  /**
   * 标记属性
   */
  markProperties(layers?: Layer[]): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      showError('请选择要标记属性的图层')
      return
    }

    selectedLayers.forEach(layer => {
      const styles = getLayerStyles(layer)
      const properties: string[] = []
      
      // 收集图层属性
      if (isText(layer)) {
        properties.push(`Font: ${layer.style?.fontFamily || 'Unknown'}`)
        properties.push(`Size: ${layer.style?.fontSize || 12}px`)
        properties.push(`Color: ${layer.style?.textColor || '#000000'}`)
      }
      
      if (styles.fills && styles.fills.length > 0) {
        styles.fills.forEach((fill, index) => {
          if (fill.enabled && fill.color) {
            properties.push(`Fill ${index + 1}: ${fill.color}`)
          }
        })
      }
      
      if (styles.borders && styles.borders.length > 0) {
        styles.borders.forEach((border, index) => {
          if (border.enabled) {
            properties.push(`Border ${index + 1}: ${border.thickness}px ${border.color}`)
          }
        })
      }
      
      if (styles.shadows && styles.shadows.length > 0) {
        styles.shadows.forEach((shadow, index) => {
          if (shadow.enabled) {
            properties.push(`Shadow ${index + 1}: ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}`)
          }
        })
      }

      if (styles.borderRadius !== undefined) {
        properties.push(`Border Radius: ${styles.borderRadius}px`)
      }

      properties.push(`Opacity: ${Math.round(styles.opacity * 100)}%`)

      const annotation: PropertyAnnotation = {
        id: generateId(),
        type: 'property',
        layerId: layer.id,
        position: { 
          x: layer.frame.x + layer.frame.width + 20, 
          y: layer.frame.y 
        },
        content: properties.join('\n'),
        visible: true,
        locked: false,
        properties,
        styles
      }

      this.annotations.set(annotation.id, annotation)
      this.createPropertyMark(layer, annotation)
    })

    showSuccess(`已标记 ${selectedLayers.length} 个图层的属性`)
  }

  /**
   * 标记注释
   */
  markNote(layers?: Layer[], noteText?: string): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      showError('请选择要添加注释的图层')
      return
    }

    const content = noteText || 'Note'

    selectedLayers.forEach(layer => {
      const annotation: NoteAnnotation = {
        id: generateId(),
        type: 'note',
        layerId: layer.id,
        position: { 
          x: layer.frame.x, 
          y: layer.frame.y - 30 
        },
        content,
        visible: true,
        locked: false,
        fontSize: 12,
        backgroundColor: '#FFEB3B',
        textColor: '#000000'
      }

      this.annotations.set(annotation.id, annotation)
      this.createNoteMark(layer, annotation)
    })

    showSuccess(`已为 ${selectedLayers.length} 个图层添加注释`)
  }

  /**
   * 清除标记
   */
  clearMarks(layers?: Layer[]): void {
    const selectedLayers = layers || getSelectedLayers(this.document)
    
    if (selectedLayers.length === 0) {
      // 清除所有标记
      this.annotations.clear()
      this.removeAllMeasureMarks()
      showSuccess('已清除所有标记')
    } else {
      // 清除选中图层的标记
      let clearedCount = 0
      selectedLayers.forEach(layer => {
        this.annotations.forEach((annotation, id) => {
          if (annotation.layerId === layer.id) {
            this.annotations.delete(id)
            clearedCount++
          }
        })
        this.removeMeasureMarksForLayer(layer)
      })
      showSuccess(`已清除 ${clearedCount} 个标记`)
    }
  }

  /**
   * 获取所有标记
   */
  getAllAnnotations(): Annotation[] {
    return Array.from(this.annotations.values())
  }

  /**
   * 获取配置
   */
  getConfig(): MeasureConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<MeasureConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // 私有方法：创建各种标记

  private createOverlayMark(layer: Layer, annotation: OverlayAnnotation): void {
    // 创建覆盖层标记的视觉表示
    // 这里可以创建一个半透明的矩形覆盖在图层上
    console.log('Creating overlay mark for layer:', layer.name)
  }

  private createSizeMark(layer: Layer, annotation: SizeAnnotation): void {
    // 创建尺寸标记的视觉表示
    // 包括标注线和数值文本
    console.log('Creating size mark for layer:', layer.name, annotation.dimension, annotation.value)
  }

  private createPropertyMark(layer: Layer, annotation: PropertyAnnotation): void {
    // 创建属性标记的视觉表示
    // 显示图层的样式属性信息
    console.log('Creating property mark for layer:', layer.name, annotation.properties)
  }

  private createNoteMark(layer: Layer, annotation: NoteAnnotation): void {
    // 创建注释标记的视觉表示
    // 显示便签样式的注释
    console.log('Creating note mark for layer:', layer.name, annotation.content)
  }

  private markSpacingToParent(layer: Layer, parentFrame: Frame): void {
    const layerBounds = getLayerBounds(layer, this.config.byInfluence)
    const parentBounds = getLayerBounds(parentFrame)
    
    // 计算到父容器各边的距离
    const topDistance = layerBounds.y - parentBounds.y
    const leftDistance = layerBounds.x - parentBounds.x
    const rightDistance = (parentBounds.x + parentBounds.width) - (layerBounds.x + layerBounds.width)
    const bottomDistance = (parentBounds.y + parentBounds.height) - (layerBounds.y + layerBounds.height)

    // 创建间距标记
    if (topDistance > 0) {
      const annotation: SpacingAnnotation = {
        id: generateId(),
        type: 'spacing',
        layerId: layer.id,
        position: { x: layerBounds.x + layerBounds.width / 2, y: layerBounds.y - topDistance / 2 },
        content: topDistance,
        visible: true,
        locked: false,
        direction: 'vertical',
        targetLayerId: parentFrame.id,
        value: topDistance
      }
      this.annotations.set(annotation.id, annotation)
    }

    if (leftDistance > 0) {
      const annotation: SpacingAnnotation = {
        id: generateId(),
        type: 'spacing',
        layerId: layer.id,
        position: { x: layerBounds.x - leftDistance / 2, y: layerBounds.y + layerBounds.height / 2 },
        content: leftDistance,
        visible: true,
        locked: false,
        direction: 'horizontal',
        targetLayerId: parentFrame.id,
        value: leftDistance
      }
      this.annotations.set(annotation.id, annotation)
    }

    showSuccess(`已标记到父容器的间距`)
  }

  private markSpacingBetweenLayers(layer1: Layer, layer2: Layer): void {
    const distance = calculateDistance(layer1, layer2)
    
    if (distance.horizontal > 0) {
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      const midY = Math.min(bounds1.y, bounds2.y) + Math.abs(bounds1.y - bounds2.y) / 2
      
      const annotation: SpacingAnnotation = {
        id: generateId(),
        type: 'spacing',
        layerId: layer1.id,
        position: { 
          x: Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width) - distance.horizontal / 2, 
          y: midY 
        },
        content: distance.horizontal,
        visible: true,
        locked: false,
        direction: 'horizontal',
        targetLayerId: layer2.id,
        value: distance.horizontal
      }
      this.annotations.set(annotation.id, annotation)
    }

    if (distance.vertical > 0) {
      const bounds1 = getLayerBounds(layer1)
      const bounds2 = getLayerBounds(layer2)
      const midX = Math.min(bounds1.x, bounds2.x) + Math.abs(bounds1.x - bounds2.x) / 2
      
      const annotation: SpacingAnnotation = {
        id: generateId(),
        type: 'spacing',
        layerId: layer1.id,
        position: { 
          x: midX,
          y: Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height) - distance.vertical / 2
        },
        content: distance.vertical,
        visible: true,
        locked: false,
        direction: 'vertical',
        targetLayerId: layer2.id,
        value: distance.vertical
      }
      this.annotations.set(annotation.id, annotation)
    }

    showSuccess('已标记图层间距')
  }

  private removeAllMeasureMarks(): void {
    // 遍历文档，移除所有测量标记
    console.log('Removing all measure marks')
  }

  private removeMeasureMarksForLayer(layer: Layer): void {
    // 移除特定图层的测量标记
    console.log('Removing measure marks for layer:', layer.name)
  }
}